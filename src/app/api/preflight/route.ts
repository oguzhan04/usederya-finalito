import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { CITATIONS } from "@/lib/preflight/citations";
import { analyzeShipment } from "@/lib/preflight/engine";
import { COMMODITIES } from "@/lib/preflight/knowledge";
import { parseShipment } from "@/lib/preflight/parser";
import type { PreflightResult, ShipmentFacts } from "@/lib/preflight/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUERY_CHARS = 600;

/* ---------------------------------------------------------------------------
 * Rate limiting — in-memory sliding windows, per IP + a global guard.
 * No persistence by design: nothing a visitor types is stored anywhere.
 * ------------------------------------------------------------------------- */

const hits = new Map<string, number[]>();
const WINDOWS = [
  { ms: 30_000, max: 4 },
  { ms: 10 * 60_000, max: 20 },
];
const GLOBAL_WINDOW = { ms: 60_000, max: 60 };

function rateLimited(ip: string): number | null {
  const now = Date.now();
  const maxAge = Math.max(...WINDOWS.map((w) => w.ms), GLOBAL_WINDOW.ms);

  if (hits.size > 5_000) hits.clear();

  for (const key of [ip, "__global__"]) {
    const list = (hits.get(key) ?? []).filter((t) => now - t < maxAge);
    hits.set(key, list);
  }

  const mine = hits.get(ip)!;
  for (const w of WINDOWS) {
    const inWindow = mine.filter((t) => now - t < w.ms);
    if (inWindow.length >= w.max) {
      return Math.ceil((w.ms - (now - inWindow[0])) / 1000);
    }
  }
  const global = hits.get("__global__")!;
  const globalInWindow = global.filter((t) => now - t < GLOBAL_WINDOW.ms);
  if (globalInWindow.length >= GLOBAL_WINDOW.max) {
    return Math.ceil((GLOBAL_WINDOW.ms - (now - globalInWindow[0])) / 1000);
  }

  mine.push(now);
  global.push(now);
  return null;
}

/* ---------------------------------------------------------------------------
 * Claude fact extraction (optional). The model only pulls structured facts out
 * of the visitor's text — the verdict and every number come from the
 * deterministic rules engine, so nothing numeric can be hallucinated.
 * ------------------------------------------------------------------------- */

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ maxRetries: 0 })
  : null;

const nullable = (type: "string" | "number") => ({
  anyOf: [{ type }, { type: "null" as const }],
});

const FACTS_SCHEMA = {
  type: "object" as const,
  properties: {
    commodity: nullable("string"),
    commodityKey: {
      anyOf: [
        { type: "string" as const, enum: COMMODITIES.map((c) => c.key) },
        { type: "null" as const },
      ],
    },
    originCity: nullable("string"),
    originCountry: nullable("string"),
    destinationCity: nullable("string"),
    destinationCountry: nullable("string"),
    mode: { type: "string" as const, enum: ["truck", "ocean", "air", "unknown"] },
    valueUsd: nullable("number"),
    quantity: nullable("string"),
    pickup: nullable("string"),
    deadline: nullable("string"),
    mentionsInsured: { type: "boolean" as const },
    mentionsHazmat: { type: "boolean" as const },
  },
  required: [
    "commodity",
    "commodityKey",
    "originCity",
    "originCountry",
    "destinationCity",
    "destinationCountry",
    "mode",
    "valueUsd",
    "quantity",
    "pickup",
    "deadline",
    "mentionsInsured",
    "mentionsHazmat",
  ],
  additionalProperties: false,
};

const EXTRACTION_SYSTEM = `You extract structured shipment facts from one plain-English sentence a website visitor typed. Rules:
- Copy places as short display names ("Fremont, CA", "Shenzhen"). Country as ISO-3166 alpha-2 ("US", "CN", "DE"). Infer the country from the city when obvious.
- commodityKey must be the single best match from the allowed list, or null if none fits. commodity is the visitor's own wording for the goods.
- mode: infer "ocean" for intercontinental unless air is implied; "truck" for domestic/continental ground; "air" only when flying is stated or clearly implied; otherwise "unknown".
- valueUsd: total cargo value in USD as a number (e.g. "$180k" → 180000). null if absent.
- pickup/deadline: keep the visitor's own words ("Friday", "before Black Friday"). null if absent.
- Never invent facts that are not in the text.`;

async function extractFactsWithClaude(query: string): Promise<Partial<ShipmentFacts> | null> {
  if (!anthropic) return null;
  try {
    const response = await anthropic.messages.create(
      {
        model: "claude-opus-4-8",
        max_tokens: 1024,
        output_config: {
          effort: "low",
          format: {
            type: "json_schema",
            schema: FACTS_SCHEMA,
          },
        },
        system: EXTRACTION_SYSTEM,
        messages: [{ role: "user", content: query }],
      },
      { timeout: 9_000 },
    );
    if (response.stop_reason === "refusal") return null;
    const text = response.content.find((b) => b.type === "text")?.text;
    if (!text) return null;
    return JSON.parse(text) as Partial<ShipmentFacts>;
  } catch (error) {
    console.error("Pre-flight fact extraction unavailable, using local parser:", error);
    return null;
  }
}

/* ---------------------------------------------------------------------------
 * Live USITC duty-rate check. Confirms our cached duty rate against the
 * public HTS REST endpoint; on success the citation is flagged "live".
 * Never overrides the curated number — a mismatch keeps the cached value.
 * ------------------------------------------------------------------------- */

const liveHtsChecks = new Map<string, boolean>();

async function confirmDutyRateLive(hts: string, expectedPct: number): Promise<boolean> {
  const cached = liveHtsChecks.get(hts);
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(
      `https://hts.usitc.gov/reststop/search?keyword=${encodeURIComponent(hts)}`,
      { signal: AbortSignal.timeout(2_500), headers: { accept: "application/json" } },
    );
    if (!res.ok) throw new Error(`USITC ${res.status}`);
    const data = (await res.json()) as { results?: unknown[] } | unknown[];
    const rows = (Array.isArray(data) ? data : (data.results ?? [])) as Array<{
      htsno?: string;
      general?: string;
    }>;
    const row = rows.find((r) => r.htsno?.replace(/\s/g, "").startsWith(hts.replace(/\./g, "").slice(0, 8)) || r.htsno === hts);
    const general = row?.general?.trim().toLowerCase() ?? "";
    const parsed = general === "free" ? 0 : parseFloat(general.replace("%", ""));
    const ok = Number.isFinite(parsed) && Math.abs(parsed - expectedPct) < 0.01;
    liveHtsChecks.set(hts, ok);
    setTimeout(() => liveHtsChecks.delete(hts), 12 * 60 * 60_000).unref?.();
    return ok;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let query: string;
  try {
    const body = (await request.json()) as { query?: unknown };
    query = typeof body.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (query.length < 8 || query.length > MAX_QUERY_CHARS) {
    return NextResponse.json(
      { error: `Describe the shipment in 8–${MAX_QUERY_CHARS} characters.` },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";
  const retryAfter = rateLimited(ip);
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: "Rate limit reached — try one of the examples, or wait a moment.", retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const parsed = parseShipment(query);
  const extracted = await extractFactsWithClaude(query);

  const facts: ShipmentFacts = extracted
    ? {
        ...parsed,
        ...Object.fromEntries(
          Object.entries(extracted).filter(([, v]) => v !== null && v !== undefined && v !== ""),
        ),
        query,
      }
    : parsed;

  // Guard: only accept commodity keys the engine actually knows.
  if (facts.commodityKey && !COMMODITIES.some((c) => c.key === facts.commodityKey)) {
    facts.commodityKey = parsed.commodityKey;
  }

  const result: PreflightResult = analyzeShipment(facts, extracted ? "live" : "local");

  // Flag HTS citations as live-confirmed when the public endpoint agrees.
  const commodity = COMMODITIES.find((c) => c.key === facts.commodityKey);
  if (commodity?.hts && commodity.htsCitation && commodity.dutyPct !== null) {
    const confirmed = await confirmDutyRateLive(commodity.hts, commodity.dutyPct);
    if (confirmed) {
      result.citations = result.citations.map((c) =>
        c.id === commodity.htsCitation && CITATIONS[c.id]
          ? { ...c, freshness: "live", asOf: new Date().toISOString().slice(0, 10) }
          : c,
      );
    }
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
