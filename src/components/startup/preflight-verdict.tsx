"use client";

import {
  ArrowRight,
  ExternalLink,
  OctagonAlert,
  RotateCcw,
  Route,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { Citation, Finding, PreflightResult } from "@/lib/preflight/types";
import { cn } from "@/lib/utils";

const VERDICT_STYLES = {
  GO: {
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
    dot: "bg-emerald-500",
    label: "GO",
  },
  CONDITIONAL: {
    badge: "bg-amber-500/10 text-amber-700 border-amber-500/25",
    dot: "bg-amber-500",
    label: "CONDITIONAL GO",
  },
  NO_GO: {
    badge: "bg-red-500/10 text-red-700 border-red-500/25",
    dot: "bg-red-500",
    label: "NO-GO",
  },
} as const;

const KIND_META = {
  blocker: {
    heading: "Blockers",
    icon: OctagonAlert,
    iconClass: "text-red-600",
    chipClass: "bg-red-500/10 text-red-700",
  },
  risk: {
    heading: "Risks",
    icon: TriangleAlert,
    iconClass: "text-amber-600",
    chipClass: "bg-amber-500/10 text-amber-700",
  },
  action: {
    heading: "Actions",
    icon: Wrench,
    iconClass: "text-secondary",
    chipClass: "bg-secondary/10 text-secondary",
  },
} as const;

function FreshnessBadge({ citation }: { citation: Citation }) {
  const styles: Record<Citation["freshness"], { dot: string; text: string; label: string }> = {
    live: { dot: "bg-emerald-500", text: "text-emerald-700", label: `Live · confirmed ${citation.asOf}` },
    cached: { dot: "bg-zinc-400", text: "text-muted-foreground", label: `Cached · ${citation.asOf}` },
    derived: { dot: "bg-secondary", text: "text-secondary", label: "Computed from cited inputs" },
    input: { dot: "bg-zinc-400", text: "text-muted-foreground", label: "From your description" },
  };
  const s = styles[citation.freshness];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium", s.text)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

interface PreflightVerdictProps {
  result: PreflightResult;
  onRestart: () => void;
}

export function PreflightVerdict({ result, onRestart }: PreflightVerdictProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);

  const verdict = VERDICT_STYLES[result.verdict];
  const citationIndex = useMemo(() => {
    const map = new Map<string, number>();
    result.citations.forEach((c, i) => map.set(c.id, i + 1));
    return map;
  }, [result.citations]);

  const grouped = useMemo(() => {
    const out: Record<Finding["kind"], Finding[]> = { blocker: [], risk: [], action: [] };
    for (const f of result.findings) out[f.kind].push(f);
    return out;
  }, [result.findings]);

  function jumpToSource(id: string) {
    setSourcesOpen(true);
    setHighlightId(id);
    setTimeout(() => {
      document
        .getElementById(`preflight-src-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);
    setTimeout(() => setHighlightId(null), 2400);
  }

  function CitationChips({ ids }: { ids: string[] }) {
    const unique = [...new Set(ids)];
    return (
      <span className="inline-flex flex-wrap gap-1 align-middle ml-1.5">
        {unique.map((id) => {
          const n = citationIndex.get(id);
          if (!n) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => jumpToSource(id)}
              title="View source"
              className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] bg-secondary/10 px-1 text-[10px] font-semibold text-secondary transition-colors hover:bg-secondary/20"
            >
              {n}
            </button>
          );
        })}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-7"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Pre-flight verdict
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
              verdict.badge,
            )}
          >
            <span className={cn("size-1.5 rounded-full", verdict.dot)} />
            {verdict.label}
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-white px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {result.engine === "live" ? "Live sources" : "Precomputed sources"}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-primary">
          {result.headline}
        </h3>
        <p className="text-sm md:text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
          {result.summary}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {(["blocker", "risk", "action"] as const).map((kind) => {
          const items = grouped[kind];
          if (!items.length) return null;
          const meta = KIND_META[kind];
          return (
            <div key={kind} className="flex flex-col gap-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {meta.heading}
              </p>
              <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-white">
                {items.map((finding) => (
                  <div key={finding.title} className="flex gap-3.5 p-4">
                    <meta.icon className={cn("mt-0.5 size-4.5 shrink-0", meta.iconClass)} />
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-primary">{finding.title}</p>
                        {finding.stat && (
                          <span
                            className={cn(
                              "rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                              meta.chipClass,
                            )}
                          >
                            {finding.stat}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">
                        {finding.detail}
                        <CitationChips ids={finding.citationIds} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {result.transit && (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Transit math
            </p>
            <div className="flex gap-3.5 rounded-xl border border-border bg-white p-4">
              <Route className="mt-0.5 size-4.5 shrink-0 text-secondary" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-primary">{result.transit.headline}</p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {result.transit.detail}
                  <CitationChips ids={result.transit.citationIds} />
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <button
            type="button"
            onClick={() => setSourcesOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium text-primary transition-colors hover:border-secondary/50"
          >
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors",
                sourcesOpen ? "bg-secondary" : "bg-muted-foreground/40",
              )}
            />
            Sources ({result.citations.length})
          </button>
        </div>

        {sourcesOpen && (
          <motion.div
            ref={sourcesRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-white max-h-80 overflow-y-auto">
              {result.citations.map((citation) => (
                <div
                  key={citation.id}
                  id={`preflight-src-${citation.id}`}
                  className={cn(
                    "flex gap-3 p-3.5 transition-colors",
                    highlightId === citation.id && "bg-secondary/[0.06]",
                  )}
                >
                  <span className="mt-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] bg-secondary/10 px-1 text-[10px] font-semibold text-secondary">
                    {citationIndex.get(citation.id)}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <p className="text-[13px] font-medium text-primary">{citation.label}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {citation.publisher}
                      </span>
                      <FreshnessBadge citation={citation} />
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {citation.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">
                      Backs: {citation.backs}
                    </p>
                    {citation.url && (
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:underline"
                      >
                        View source <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-secondary/15 bg-gradient-to-b from-secondary/[0.07] to-secondary/[0.02] p-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium tracking-tight text-primary">
            This is what every Derya quote comes with.
          </p>
          <p className="text-[13px] text-muted-foreground">
            Send us the same brief and a human-checked pre-flight, rates and
            booking come back, usually within the day.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/booking"
            className="bg-secondary h-9 inline-flex items-center justify-center gap-2 text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground px-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
          >
            Get this for your next shipment
            <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
          >
            <RotateCcw className="size-3.5" />
            Restart
          </button>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground/70">
        Demo output is informational, generated from the cited public sources and
        the shipment brief. It is not a rate quote or compliance ruling. Rules
        and duty stacks change; we re-verify everything at booking.
      </p>
    </motion.div>
  );
}
