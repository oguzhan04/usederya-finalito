export type TransportMode = "truck" | "ocean" | "air" | "unknown";

export type Verdict = "GO" | "CONDITIONAL" | "NO_GO";

export type FindingKind = "blocker" | "risk" | "action";

export interface ShipmentFacts {
  /** Raw text the visitor typed. */
  query: string;
  commodity: string | null;
  /** Key into the commodity knowledge base, when matched. */
  commodityKey: string | null;
  originCity: string | null;
  originCountry: string | null;
  destinationCity: string | null;
  destinationCountry: string | null;
  mode: TransportMode;
  /** Declared cargo value in USD, if stated. */
  valueUsd: number | null;
  /** e.g. "8 pallets", "1,200 units", "3x 40HC" */
  quantity: string | null;
  /** Pickup / ship timing as stated ("Friday", "tomorrow", "Oct 3"). */
  pickup: string | null;
  /** Hard deadline as stated ("before Black Friday", "by Nov 1"). */
  deadline: string | null;
  /** Explicit hints from the text. */
  mentionsInsured: boolean;
  mentionsHazmat: boolean;
}

export interface Citation {
  id: string;
  /** Short label shown on the chip, e.g. "USITC HTS 8507.60.00". */
  label: string;
  publisher: string;
  title: string;
  url: string | null;
  /** What this source backs in the result. */
  backs: string;
  /** "live" = fetched at request time; "cached" = curated snapshot; "derived" = math on cited inputs; "input" = from visitor's text. */
  freshness: "live" | "cached" | "derived" | "input";
  /** e.g. "Jul 2026" for cached snapshots, or ISO timestamp for live. */
  asOf: string;
}

export interface Finding {
  kind: FindingKind;
  /** True for blockers with no legal/physical resolution as specced (forces NO_GO). */
  hard?: boolean;
  title: string;
  detail: string;
  /** Optional highlighted figure, e.g. "≈ $9,900 duty" */
  stat?: string;
  citationIds: string[];
}

export interface TransitPlan {
  headline: string;
  detail: string;
  citationIds: string[];
}

export interface TimelineStep {
  label: string;
  detail?: string;
}

export interface PreflightResult {
  verdict: Verdict;
  /** e.g. "NO-GO as specced." / "GO, with 3 conditions." */
  headline: string;
  summary: string;
  findings: Finding[];
  transit: TransitPlan | null;
  citations: Citation[];
  facts: ShipmentFacts;
  timeline: TimelineStep[];
  /** Which path produced the result. */
  engine: "live" | "local";
}
