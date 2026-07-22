"use client";

import { FileCheck2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PreflightResult } from "@/lib/preflight/types";
import { cn } from "@/lib/utils";

function StepDot({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
        done ? "bg-secondary" : "bg-secondary/15",
      )}
    >
      {done ? (
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="text-white">
          <path
            d="M13.5 4.5L6 12L2.5 8.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="size-1.5 rounded-full bg-secondary/50" />
      )}
    </span>
  );
}

interface PreflightRunProps {
  result: PreflightResult;
  revealed: number;
  ready: boolean;
  onView: () => void;
}

export function PreflightRun({ result, revealed, ready, onView }: PreflightRunProps) {
  const steps = result.timeline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-7 grow"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-secondary">2 / 3</p>
        <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-primary">
          The pre-flight check.
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="steps"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col gap-0 grow"
          >
            <div className="absolute left-3 top-3 bottom-6 w-px bg-secondary/20" />
            {steps.map((step, i) => {
              const done = i < revealed;
              const isNext = i === revealed;
              return (
                <div key={step.label} className="flex items-center gap-4 py-2.5">
                  <StepDot done={done} />
                  {done ? (
                    <motion.p
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm md:text-[15px] font-medium text-secondary"
                    >
                      {step.label}
                    </motion.p>
                  ) : (
                    <span
                      className={cn(
                        "h-3 rounded-full bg-secondary/10",
                        isNext && "animate-pulse",
                        i % 3 === 0 ? "w-56" : i % 3 === 1 ? "w-40" : "w-64",
                        "max-w-full",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-8 grow py-6"
          >
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-b from-secondary/[0.07] to-secondary/[0.02] border border-secondary/10 px-16 py-12 sm:px-24">
              <span className="flex size-14 items-center justify-center rounded-xl bg-white shadow-[0_8px_24px_-8px_rgba(43,127,255,0.35)]">
                <FileCheck2 className="size-7 text-secondary" />
              </span>
              <p className="text-base font-medium text-secondary">
                Verdict ready
                {result.engine === "live" ? ", checked against live sources" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onView}
              className="bg-secondary h-10 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground px-7 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
            >
              View verdict
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
