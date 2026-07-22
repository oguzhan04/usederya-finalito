"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { PreflightRun } from "@/components/startup/preflight-run";
import { PreflightVerdict } from "@/components/startup/preflight-verdict";
import { analyzeShipment } from "@/lib/preflight/engine";
import { CANNED_EXAMPLES } from "@/lib/preflight/examples";
import type { PreflightResult } from "@/lib/preflight/types";
import { cn } from "@/lib/utils";

type Stage = "input" | "running" | "ready" | "verdict";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function PreflightDemo() {
  const [stage, setStage] = useState<Stage>("input");
  const [selectedId, setSelectedId] = useState(CANNED_EXAMPLES[0].id);
  const [result, setResult] = useState<PreflightResult | null>(null);
  const [revealed, setRevealed] = useState(0);
  const runIdRef = useRef(0);

  const selected = CANNED_EXAMPLES.find((e) => e.id === selectedId) ?? CANNED_EXAMPLES[0];

  async function run() {
    const myRun = ++runIdRef.current;

    // Results are precomputed from hand-checked facts — instant, no network.
    const nextResult = analyzeShipment(selected.facts, "local");

    setResult(nextResult);
    setRevealed(0);
    setStage("running");

    await sleep(300);
    for (let i = 0; i < nextResult.timeline.length; i++) {
      if (runIdRef.current !== myRun) return;
      setRevealed(i + 1);
      await sleep(i === 0 ? 320 : 380 + Math.random() * 220);
    }
    if (runIdRef.current !== myRun) return;

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
                  Pick a shipment.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Four real startup loads, written the way you&apos;d actually
                  brief them.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CANNED_EXAMPLES.map((example) => {
                  const active = selectedId === example.id;
                  return (
                    <button
                      key={example.id}
                      type="button"
                      onClick={() => setSelectedId(example.id)}
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

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  The plain-English brief
                </p>
                <div className="rounded-xl border border-border bg-white px-4 py-3.5">
                  <p className="text-[15px] leading-relaxed text-primary">
                    “{selected.query}”
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={run}
                  className="bg-secondary h-10 flex items-center justify-center gap-2 text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground px-7 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
                >
                  Run Pre-Flight
                  <ArrowRight className="size-4" />
                </button>
                <p className="text-xs text-muted-foreground/70">
                  No login. Nothing is stored.
                </p>
              </div>
            </motion.div>
          )}

          {(stage === "running" || stage === "ready") && result && (
            <PreflightRun
              key="running"
              result={result}
              revealed={revealed}
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
