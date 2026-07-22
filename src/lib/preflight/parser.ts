import { findPlace, matchCommodity, PLACES } from "./knowledge";
import type { ShipmentFacts, TransportMode } from "./types";

function parseValueUsd(text: string): number | null {
  // "$180k", "$180,000", "180k usd", "$1.2m", "worth 60000 dollars"
  const m = text.match(
    /\$?\s*([\d][\d,.]*)\s*(k|m|mm|million|thousand)?\s*(usd|dollars?|\$)?/gi,
  );
  if (!m) return null;
  let best: number | null = null;
  const re =
    /(\$\s*|worth\s+|value[d]?\s*(?:at|of)?\s*)([\d][\d,.]*)\s*(k|m|mm|million|thousand)?|([\d][\d,.]*)\s*(k|m|mm|million|thousand)?\s*(usd|dollars)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const numRaw = match[2] ?? match[4];
    const suffix = (match[3] ?? match[5] ?? "").toLowerCase();
    if (!numRaw) continue;
    let value = parseFloat(numRaw.replace(/,/g, ""));
    if (Number.isNaN(value)) continue;
    if (suffix === "k" || suffix === "thousand") value *= 1_000;
    if (suffix === "m" || suffix === "mm" || suffix === "million") value *= 1_000_000;
    // Ignore obviously-not-a-cargo-value numbers (e.g. "$5")
    if (value < 500) continue;
    best = Math.max(best ?? 0, value);
  }
  return best;
}

function parseQuantity(text: string): string | null {
  const m = text.match(
    /([\d,]+)\s*(?:x\s*)?(pallets?|cartons?|boxes|crates?|units?|pcs|pieces|bikes?|batteries|drums?|bags?|(?:20|40|45)\s*(?:ft|')?\s*(?:hc|hq|gp|std)?\s*containers?|containers?|teu|feu|trucks?|truckloads?)/i,
  );
  if (!m) return null;
  return `${m[1].replace(/,/g, ",")} ${m[2].toLowerCase()}`.trim();
}

function parseMode(text: string): TransportMode {
  if (/\bair\s?(freight|cargo)?\b|\bfly\b|\bflight\b|\bby air\b/i.test(text)) return "air";
  if (/\bocean\b|\bsea\s?freight\b|\bfcl\b|\blcl\b|\bcontainer\b|\bvessel\b|\bby sea\b/i.test(text))
    return "ocean";
  if (/\btruck(load)?\b|\bftl\b|\bltl\b|\bdray\b|\bvan\b|\breefer\b/i.test(text)) return "truck";
  return "unknown";
}

function parseTiming(text: string): { pickup: string | null; deadline: string | null } {
  let pickup: string | null = null;
  let deadline: string | null = null;

  const deadlineMatch = text.match(
    /\b(?:before|by|no later than|in time for|landed before|deliver(?:ed)? (?:by|before))\s+([a-z0-9 ,'’-]{3,40}?)(?=[.,;]|$)/i,
  );
  if (deadlineMatch) deadline = deadlineMatch[1].trim();

  const pickupMatch = text.match(
    /\b(?:pickup|pick up|ship(?:s|ping)?|leaves?|ready|collect(?:ion)?|departing|cargo ready)\s*(?:on|by|date)?\s*(tomorrow|today|tonight|next \w+|this \w+|mon(?:day)?|tue(?:s(?:day)?)?|wed(?:nesday)?|thu(?:rs(?:day)?)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2})/i,
  );
  if (pickupMatch) pickup = pickupMatch[1].trim();
  if (!pickup) {
    const bare = text.match(/\b(tomorrow|asap|next week|this week)\b/i);
    if (bare) pickup = bare[1].toLowerCase();
  }
  return { pickup, deadline };
}

function parsePlaces(text: string): { origin: string | null; destination: string | null } {
  // Prefer explicit "X to Y" / "X → Y" / "from X to Y" structure.
  const arrow = text.match(/([a-z .,'-]{2,30})\s*(?:->|→|—>|to)\s+([a-z .,'-]{2,30})/i);
  const lower = text.toLowerCase();

  const found: { name: string; index: number }[] = [];
  for (const p of PLACES) {
    for (const alias of p.aliases) {
      const idx = lower.indexOf(alias);
      if (idx >= 0) {
        // Whole-word-ish guard for short aliases like "la" / "sf".
        const before = idx === 0 ? " " : lower[idx - 1];
        const after = idx + alias.length >= lower.length ? " " : lower[idx + alias.length];
        const boundary = /[^a-z]/.test(before) && /[^a-z]/.test(after);
        if (alias.length <= 3 && !boundary) continue;
        if (!boundary) continue;
        found.push({ name: p.name, index: idx });
        break;
      }
    }
  }
  found.sort((a, b) => a.index - b.index);
  const unique = found.filter((f, i) => found.findIndex((g) => g.name === f.name) === i);

  if (unique.length >= 2) return { origin: unique[0].name, destination: unique[1].name };
  if (unique.length === 1) {
    // Use the arrow structure to decide which side the known place is on.
    if (arrow) {
      const fromSide = arrow[1].toLowerCase();
      const knownAlias = unique[0].name.toLowerCase().split(",")[0];
      if (fromSide.includes(knownAlias)) return { origin: unique[0].name, destination: null };
      return { origin: null, destination: unique[0].name };
    }
    return { origin: unique[0].name, destination: null };
  }
  return { origin: null, destination: null };
}

/**
 * Deterministic freeform parser. Used directly in the browser fallback and as
 * the server fallback when the Claude extraction is unavailable or slow.
 */
export function parseShipment(query: string): ShipmentFacts {
  const commodity = matchCommodity(query);
  const { origin, destination } = parsePlaces(query);
  const { pickup, deadline } = parseTiming(query);

  const originPlace = origin ? findPlace(origin.toLowerCase().split(",")[0]) : null;
  const destPlace = destination ? findPlace(destination.toLowerCase().split(",")[0]) : null;

  let mode = parseMode(query);
  if (mode === "unknown" && originPlace && destPlace) {
    // Infer: cross-ocean → ocean; domestic/continental → truck.
    if (originPlace.country !== destPlace.country) {
      const nafta = new Set(["US", "CA", "MX"]);
      mode = nafta.has(originPlace.country) && nafta.has(destPlace.country) ? "truck" : "ocean";
    } else {
      mode = "truck";
    }
  }

  // Keep the visitor's own phrase for display; the knowledge-base name is the fallback.
  const rawPhrase = (() => {
    const m = query.match(
      /(?:of|pallets? of|cartons? of|units? of)\s+([a-z0-9 -]{3,40}?)(?=[.,;]|\s+(?:from|to|moved|moving|ship|going|headed)\b|$)/i,
    );
    return m ? m[1].trim() : null;
  })();
  const commodityText = rawPhrase ?? commodity?.name ?? null;

  return {
    query,
    commodity: commodityText,
    commodityKey: commodity?.key ?? null,
    originCity: origin,
    originCountry: originPlace?.country ?? null,
    destinationCity: destination,
    destinationCountry: destPlace?.country ?? null,
    mode,
    valueUsd: parseValueUsd(query),
    quantity: parseQuantity(query),
    pickup,
    deadline,
    mentionsInsured: /\binsured?\b|\binsurance\b/i.test(query),
    mentionsHazmat: /\bhazmat\b|\bdangerous goods\b|\bdg\b|\bun\d{4}\b|\bclass 9\b/i.test(query),
  };
}
