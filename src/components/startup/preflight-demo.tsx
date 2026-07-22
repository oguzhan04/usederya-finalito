"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { PreflightRun } from "@/components/startup/preflight-run";
import { PreflightVerdict } from "@/components/startup/preflight-verdict";
import { analyzeShipment } from "@/lib/preflight/engine";
import { CANNED_EXAMPLES } from "@/lib/preflight/examples";
import { parseShipment } from "@/lib/preflight/parser";
import type { PreflightResult } from "@/lib/preflight/types";
import { cn } from "@/lib/utils";

type Stage = "input" | "running" | "ready" | "verdict";

const MAX_CHARS = 600;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPreflight(query: string): Promise<PreflightResult | null> {
  try {
    const res = await fetch("/api/preflight", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as PreflightResult;
  } catch {
    // Slow or unavailable live feed — the caller falls back to the local engine.
    return null;
  }
}

export function PreflightDemo() {
  const [stage, setStage] = useState<Stage>("input");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PreflightResult | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [crossChecking, setCrossChecking] = useState(false);
  const runIdRef = useRef(0);

  const trimmed = query.trim();
  const canRun = trimmed.length >= 8;

  async function run() {
    if (!canRun) return;
    const myRun = ++runIdRef.current;

    const canned = CANNED_EXAMPLES.find((e) => e.query === trimmed);
    // Local result computes instantly: it drives the check animation and is
    // the precomputed fallback if the live route is slow or rate-limited.
    const localResult = analyzeShipment(
      canned ? canned.facts : parseShipment(trimmed),
      "local",
    );
    const apiPromise = canned ? null : fetchPreflight(trimmed);

    setResult(localResult);
    setRevealed(0);
    setCrossChecking(false);
    setStage("running");

    await sleep(300);
    for (let i = 0; i < localResult.timeline.length; i++) {
      if (runIdRef.current !== myRun) return;
      setRevealed(i + 1);
      await sleep(i === 0 ? 320 : 380 + Math.random() * 220);
    }
    if (runIdRef.current !== myRun) return;

    let finalResult = localResult;
    if (apiPromise) {
      setCrossChecking(true);
      const apiResult = await apiPromise;
      if (runIdRef.current !== myRun) return;
      if (apiResult) finalResult = apiResult;
      setCrossChecking(false);
    }

    setResult(finalResult);
    await sleep(450);
    if (runIdRef.current !== myRun) return;
    setStage("ready");
  }

  function restart() {
    runIdRef.current++;
    setStage("input");
    setResult(null);
    setRevealed(0);
  }

  function pickExample(exampleQuery: string) {
    setQuery(exampleQuery);
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl border border-border bg-accent shadow-[0_18px_50px_-24px_rgba(16,24,40,0.18),0_4px_12px_-6px_rgba(16,24,40,0.08)] overflow-hidden">
      {/* Brand chip, like the reference demo's customer chip */}
      <div className="absolute right-5 top-5 z-10 hidden sm:flex items-center rounded-full border border-border bg-white px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        Derya
      </div>

      <div className="p-6 sm:p-10 md:p-12 min-h-[520px] flex flex-col">
        <AnimatePresence mode="wait">
          {stage === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-7"
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-secondary">1 / 3</p>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-primary">
                  Describe a shipment in plain English.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Commodity, lane, value, dates — however you&apos;d say it to a
                  colleague.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run();
                  }}
                  rows={3}
                  placeholder="e.g. 8 pallets of lithium batteries, Fremont to Austin, $180k, pickup Friday"
                  className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3.5 text-[15px] text-primary shadow-[0_1px_1px_rgba(16,24,40,0.02)] outline-none transition placeholder:text-muted-foreground/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
                <p className="text-xs text-muted-foreground/70 text-right">
                  {trimmed.length}/{MAX_CHARS}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Or start from a real one
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CANNED_EXAMPLES.map((example) => {
                    const active = trimmed === example.query;
                    return (
                      <button
                        key={example.id}
                        type="button"
                        onClick={() => pickExample(example.query)}
                        className={cn(
                          "group flex items-start gap-3 rounded-xl border bg-white p-4 text-left transition-all",
                          active
                            ? "border-secondary ring-1 ring-secondary"
                            : "border-border hover:border-secondary/50",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                            active
                              ? "border-secondary bg-secondary"
                              : "border-border bg-white group-hover:border-secondary/50",
                          )}
                        >
                          {active && <span className="size-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-primary">
                            {example.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {example.hint}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={run}
                  disabled={!canRun}
                  className="bg-secondary h-10 flex items-center justify-center gap-2 text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground px-7 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Run Pre-Flight
                  <ArrowRight className="size-4" />
                </button>
                <p className="text-xs text-muted-foreground/70">
                  No login. Nothing you type is stored.
                </p>
              </div>
            </motion.div>
          )}

          {(stage === "running" || stage === "ready") && result && (
            <PreflightRun
              key="running"
              result={result}
              revealed={revealed}
              crossChecking={crossChecking}
              ready={stage === "ready"}
              onView={() => setStage("verdict")}
            />
          )}

          {stage === "verdict" && result && (
            <PreflightVerdict key="verdict" result={result} onRestart={restart} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
