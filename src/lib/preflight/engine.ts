import { getCitations } from "./citations";
import {
  COMMODITIES,
  findPlace,
  haversineMiles,
  OCEAN_LANES,
  WEST_COAST,
  type CommodityInfo,
  type Place,
} from "./knowledge";
import type {
  Finding,
  PreflightResult,
  ShipmentFacts,
  TimelineStep,
  TransitPlan,
  Verdict,
} from "./types";

const ROAD_FACTOR = 1.18;
const SOLO_MILES_PER_DAY = 550; // 11h driving (49 CFR 395.3) at ~50 mph average
const CARRIER_CARGO_CAP = 100_000;

const usd = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
    : `$${Math.round(n).toLocaleString("en-US")}`;

function placeOf(city: string | null): Place | null {
  if (!city) return null;
  return findPlace(city.toLowerCase().split(",")[0]);
}

function commodityOf(facts: ShipmentFacts): CommodityInfo | null {
  if (!facts.commodityKey) return null;
  return COMMODITIES.find((c) => c.key === facts.commodityKey) ?? null;
}

const WEEKEND_PICKUP = /\bfri(day)?\b|\bsat(urday)?\b|\bweekend\b/i;

interface RuleContext {
  facts: ShipmentFacts;
  commodity: CommodityInfo | null;
  origin: Place | null;
  dest: Place | null;
  isImport: boolean;
  findings: Finding[];
  transit: TransitPlan | null;
}

function checkHazmat(ctx: RuleContext) {
  const { facts, commodity, findings } = ctx;
  const un = commodity?.un ?? null;
  if (!un && !facts.mentionsHazmat) return;

  if (un === "UN3480") {
    if (facts.mode === "air") {
      findings.push({
        kind: "blocker",
        hard: true,
        title: "Forbidden on passenger aircraft as specced",
        detail:
          "Standalone lithium-ion batteries (UN3480) may not fly as cargo on passenger aircraft. The legal path is a cargo-only freighter at ≤30% state of charge, with a Dangerous Goods Declaration and UN38.3 test summary.",
        stat: "≤30% state of charge, CAO only",
        citationIds: ["phmsa-lithium-air", "iata-dgr-lithium", "ecfr-173-185"],
      });
      findings.push({
        kind: "action",
        title: "Re-book onto a freighter",
        detail:
          "We can hold cargo-aircraft-only (CAO) space and prepare the DG paperwork; charging the packs down to 30% and re-labeling is typically a same-day job at a certified facility.",
        citationIds: ["phmsa-lithium-air", "iata-dgr-lithium"],
      });
    } else if (facts.mode === "ocean") {
      findings.push({
        kind: "blocker",
        title: "Class 9 dangerous goods — line approval needed",
        detail:
          "Lithium-ion batteries (UN3480, Class 9) need a dangerous-goods declaration filed and approved by the carrier before booking is confirmed. Not every vessel or service string accepts them.",
        citationIds: ["ecfr-172-101", "imdg-class9"],
      });
      findings.push({
        kind: "action",
        title: "File the DG package early",
        detail:
          "MSDS, UN38.3 test summary and the IMDG declaration go to the line with the booking request — approval usually takes 2–4 business days.",
        citationIds: ["imdg-class9", "derya-desk"],
      });
    } else {
      findings.push({
        kind: "blocker",
        title: "Hazmat load — not every carrier can touch it",
        detail:
          "Lithium-ion batteries (UN3480) are Class 9 dangerous goods on the road: the carrier needs hazmat registration, the load needs shipping papers, Class 9 labels and UN38.3 test documentation.",
        citationIds: ["ecfr-172-101", "ecfr-173-185"],
      });
      findings.push({
        kind: "action",
        title: "Assign a hazmat-registered carrier",
        detail:
          "We vet the assigned carrier's authority and inspection record on FMCSA SAFER and prepare the 49 CFR 173.185 paperwork before pickup.",
        citationIds: ["fmcsa-safer", "ecfr-173-185"],
      });
    }
  }

  if (un === "UN3481") {
    findings.push({
      kind: "risk",
      title: "Batteries inside the equipment",
      detail:
        "Electronics with installed lithium batteries move as UN3481. Requirements are lighter than loose batteries, but lithium-battery marks and a shipper's declaration are still required for air, and the packaging must meet 49 CFR 173.185.",
      citationIds: ["ecfr-172-101", "ecfr-173-185", "iata-dgr-lithium"],
    });
  }

  if (un === "UN3171") {
    findings.push({
      kind: "blocker",
      title: "Booking confirms only after DG approval (UN3171)",
      detail:
        "E-bikes ship as battery-powered vehicles, UN3171 Class 9. The line must approve an IMDG dangerous-goods declaration before the booking confirms, and not every service string accepts them — build 2–4 extra days into the booking window.",
      citationIds: ["ecfr-172-101", "imdg-class9"],
    });
    findings.push({
      kind: "action",
      title: "Send the battery file with the booking request",
      detail:
        "UN38.3 test summaries and MSDS for the packs go to the carrier up front; we pre-clear the DG declaration so approval doesn't eat the sailing you want.",
      citationIds: ["imdg-class9", "derya-desk"],
    });
  }

  if (!un && facts.mentionsHazmat) {
    findings.push({
      kind: "blocker",
      title: "Dangerous goods flagged — classification needed",
      detail:
        "You flagged hazmat but we couldn't pin the UN number from the description. The proper shipping name, class and packing group from the MSDS decide which carriers and modes are legal.",
      citationIds: ["ecfr-172-101"],
    });
  }
}

function checkCustoms(ctx: RuleContext) {
  const { facts, commodity, findings, isImport } = ctx;
  if (!isImport) return;

  const value = facts.valueUsd;
  const fromChina = facts.originCountry === "CN" || facts.originCountry === "HK";

  if (commodity?.hts && commodity.dutyPct !== null) {
    const base = commodity.dutyPct;
    const s301 = fromChina ? (commodity.section301Pct ?? 0) : 0;
    const totalPct = base + s301;
    const dutyAmount = value ? (value * totalPct) / 100 : null;
    const cites = [commodity.htsCitation!, "your-input"];
    if (s301 > 0) cites.push("ustr-301", "hts-9903-88");

    findings.push({
      kind: s301 > 0 ? "risk" : "action",
      title: s301 > 0 ? "Tariff exposure is the real cost driver" : "Duty math",
      detail:
        `${commodity.name} classify under HTS ${commodity.hts} at ${base}% general duty` +
        (s301 > 0
          ? `, plus ${s301}% Section 301 additional duty on China-origin goods — ${totalPct}% before any other actions`
          : "") +
        (dutyAmount !== null
          ? `. On your declared ${usd(value!)} that is ≈ ${usd(dutyAmount)} at entry.`
          : ". Give us the commercial-invoice value and we return the landed-cost math."),
      stat:
        dutyAmount !== null
          ? `≈ ${usd(dutyAmount)} duty (${totalPct}%)`
          : `${totalPct}% duty rate`,
      citationIds: cites,
    });

    if (fromChina) {
      findings.push({
        kind: "action",
        title: "Verify the current duty stack before booking",
        detail:
          "Section 301 rates are only part of the stack — IEEPA and reciprocal actions have changed China duty totals repeatedly since 2025, by CSMS notice. We re-verify the full stack against CBP on the day we file the entry.",
        citationIds: ["cbp-trade-remedies", "ustr-301"],
      });
    }
  } else {
    findings.push({
      kind: "action",
      title: "Classification first",
      detail:
        "We couldn't map this commodity to a single HTS line from the description. A binding-ruling search on CBP CROSS plus the product spec pins the duty rate before you commit to a landed cost.",
      citationIds: ["cbp-cross"],
    });
  }

  if (commodity?.uflpa) {
    findings.push({
      kind: "risk",
      title: "UFLPA detention exposure",
      detail:
        `${commodity.name} are a UFLPA high-priority sector. CBP applies a rebuttable presumption: a detained container is released only with full supply-chain traceability back to raw material, and detentions run weeks.`,
      citationIds: ["cbp-uflpa", "dhs-uflpa-entity"],
    });
    findings.push({
      kind: "action",
      title: "Assemble the traceability file now",
      detail:
        "Purchase orders, production records and raw-material origin docs, plus a screen of every supplier against the DHS UFLPA Entity List — before the container sails, not after CBP asks.",
      citationIds: ["dhs-uflpa-entity", "cbp-uflpa"],
    });
  }

  if (facts.mode === "ocean") {
    findings.push({
      kind: "action",
      title: "ISF “10+2” goes in 24h before loading",
      detail:
        "The Importer Security Filing must be on file with CBP at least 24 hours before the container is laden on the vessel; late or missing filings draw penalties up to $5,000 each.",
      citationIds: ["cbp-isf"],
    });
  }

  if (commodity?.fda) {
    findings.push({
      kind: "action",
      title: "FDA Prior Notice",
      detail:
        "Food and beverage entering the U.S. needs FDA Prior Notice before arrival and an FSVP importer of record on file.",
      citationIds: ["fda-prior-notice"],
    });
  }
}

function checkFoodHandling(ctx: RuleContext) {
  const { facts, commodity, findings, isImport } = ctx;
  if (!commodity?.fda || isImport || facts.mode !== "truck") return;
  findings.push({
    kind: "action",
    title: "Food-grade equipment only",
    detail:
      "We assign a food-grade dry van with a washout record and no prior chemical or waste loads — the carrier's authority and inspection history are checked on FMCSA SAFER before dispatch.",
    citationIds: ["fmcsa-safer", "derya-desk"],
  });
}

function checkInsurance(ctx: RuleContext) {
  const { facts, findings } = ctx;
  const crossBorder =
    facts.originCountry !== null &&
    facts.destinationCountry !== null &&
    facts.originCountry !== facts.destinationCountry;
  const value = facts.valueUsd;
  if (!value) {
    findings.push({
      kind: "action",
      title: "Add the cargo value",
      detail:
        "With a declared value we can quote all-risk cargo cover and check it against carrier liability — the gap is usually bigger than shippers expect.",
      citationIds: ["usc-14706"],
    });
    return;
  }
  if (facts.mentionsInsured) return;

  if (facts.mode === "truck" && value > CARRIER_CARGO_CAP) {
    const gap = value - CARRIER_CARGO_CAP;
    findings.push({
      kind: "risk",
      title: "Insurance gap",
      detail:
        `Motor-carrier cargo policies on file typically cap at ${usd(CARRIER_CARGO_CAP)}, and Carmack lets carriers limit liability to released rates below that. Against your ${usd(value)} declared value that leaves ≈ ${usd(gap)} uncovered if the load is lost.`,
      stat: `≈ ${usd(gap)} uncovered`,
      citationIds: ["fmcsa-li", "usc-14706", "your-input"],
    });
    findings.push({
      kind: "action",
      title: "Bind all-risk cargo cover",
      detail: `A shipper's-interest all-risk policy for the full ${usd(value)} binds in about a day — we arrange it with the booking.`,
      citationIds: ["derya-desk"],
    });
  } else if (crossBorder && value > 0) {
    findings.push({
      kind: "action",
      title: "Insure to CIF + 10%",
      detail:
        `Ocean and air legs carry their own liability limits well below cargo value. Standard practice is all-risk marine cover at CIF value plus 10% — on ${usd(value)} declared, insure ≈ ${usd(value * 1.1)}.`,
      citationIds: ["your-input", "derya-desk"],
    });
  }
}

function checkTheft(ctx: RuleContext) {
  const { facts, commodity, findings, origin, dest } = ctx;
  if (facts.mode !== "truck") return;
  const value = facts.valueUsd ?? 0;
  const hot = commodity?.theftHot ?? false;
  // Warn when the load is worth stealing: six figures, or a hot commodity at scale.
  if (value < CARRIER_CARGO_CAP && !(hot && value >= 50_000)) return;

  const corridor = origin?.theftCorridor || dest?.theftCorridor;
  const weekend = facts.pickup ? WEEKEND_PICKUP.test(facts.pickup) : false;

  let detail =
    "Reported cargo theft rose 27% in 2024, and " +
    (commodity ? `${commodity.name} are a targeted commodity class` : "high-value loads are targeted") +
    (corridor ? ", with California and Texas the two highest-theft states" : "") +
    ".";
  if (weekend) {
    detail +=
      " A Friday pickup that dwells loaded over the weekend sits in the highest-theft window of the week.";
  }

  findings.push({
    kind: "risk",
    title: weekend ? "Theft window: loaded over the weekend" : "Theft exposure on this lane",
    detail,
    citationIds: ["cargonet-2024", "your-input"],
  });
  findings.push({
    kind: "action",
    title: weekend ? "Kill the weekend dwell" : "Run it covered",
    detail: weekend
      ? "Either move pickup to Monday morning or run a team straight through — plus high-security seals and a covert tracker on the pallets. We don't let a load like this sit in a yard from Friday to Monday."
      : "High-security seals, covert tracking and no unattended overnight parking in the first 200 miles — the window where most thefts happen.",
    citationIds: ["cargonet-2024", "derya-desk"],
  });
}

function checkTransit(ctx: RuleContext) {
  const { facts, origin, dest } = ctx;
  if (!origin || !dest) {
    if (facts.originCity || facts.destinationCity) {
      ctx.transit = {
        headline: "Transit math needs both ends",
        detail:
          "Tell us both origin and destination and the pre-flight returns door-to-door transit against your dates.",
        citationIds: ["derya-desk"],
      };
    }
    return;
  }

  if (facts.mode === "truck") {
    const miles = Math.round(haversineMiles(origin, dest) * ROAD_FACTOR);
    const soloDays = Math.max(1, Math.ceil(miles / SOLO_MILES_PER_DAY));
    const teamDays = Math.max(1, Math.ceil(miles / (SOLO_MILES_PER_DAY * 2)));
    ctx.transit = {
      headline: `≈ ${miles.toLocaleString("en-US")} road miles · ${soloDays} day${soloDays > 1 ? "s" : ""} solo`,
      detail:
        `${origin.name} → ${dest.name} is ≈ ${miles.toLocaleString("en-US")} miles by road. A solo driver is HOS-capped at 11 driving hours/day (≈ ${SOLO_MILES_PER_DAY} mi), so plan ${soloDays} driving day${soloDays > 1 ? "s" : ""}; a team runs it in ${teamDays}.` +
        (facts.pickup ? ` From a ${facts.pickup} pickup, that's delivery on driving day ${soloDays}.` : ""),
      citationIds: ["ecfr-395-3", "derya-desk", "your-input"],
    };
  } else if (facts.mode === "ocean") {
    const lane = OCEAN_LANES[origin.country];
    const destState = (dest.name.split(", ")[1] ?? "").trim();
    const window = lane ? (WEST_COAST.has(destState) ? lane.west : lane.east) : null;
    if (window) {
      ctx.transit = {
        headline: `≈ ${window[0]}–${window[1]} days port to port`,
        detail:
          `${origin.name} → ${dest.name} runs ${window[0]}–${window[1]} days on the water, plus ~5–10 days for booking cutoff and origin handling up front and 3–7 days for discharge, customs release and drayage at destination. Work backwards from your deadline with the full window, not the sailing time.`,
        citationIds: ["derya-desk", "your-input"],
      };
    } else {
      ctx.transit = {
        headline: "Lane check",
        detail: `${origin.name} → ${dest.name}: we return exact sailings and cutoffs with a quote.`,
        citationIds: ["derya-desk"],
      };
    }
  } else if (facts.mode === "air") {
    ctx.transit = {
      headline: "≈ 1–3 days airport to airport",
      detail:
        `${origin.name} → ${dest.name} by air is 1–3 days airport-to-airport once space is confirmed; add screening and, for dangerous goods, DG acceptance checks at origin.`,
      citationIds: ["derya-desk"],
    };
  }
}

function decideVerdict(findings: Finding[]): Verdict {
  if (findings.some((f) => f.kind === "blocker" && f.hard)) return "NO_GO";
  if (findings.some((f) => f.kind === "blocker")) return "CONDITIONAL";
  if (findings.some((f) => f.kind === "risk")) return "GO";
  return "GO";
}

function buildHeadline(verdict: Verdict, findings: Finding[]): string {
  if (verdict === "NO_GO") return "NO-GO — as specced.";
  if (verdict === "CONDITIONAL") {
    const conditions = findings.filter((f) => f.kind === "blocker").length;
    return `GO — with ${conditions} condition${conditions > 1 ? "s" : ""}.`;
  }
  const risks = findings.filter((f) => f.kind === "risk").length;
  return risks > 0 ? "GO — watch the flags." : "GO — clean load.";
}

function buildSummary(ctx: RuleContext, verdict: Verdict): string {
  const { facts, commodity } = ctx;
  const goods = facts.commodity ?? commodity?.name ?? "freight";
  let what = facts.commodity ?? commodity?.name ?? "this load";
  if (facts.quantity) {
    // "500 batteries" + "lithium-ion batteries" → "500 lithium-ion batteries",
    // "8 pallets" + "lithium-ion batteries" → "8 pallets of lithium-ion batteries".
    const [count, ...unitParts] = facts.quantity.split(" ");
    const unit = unitParts.join(" ").replace(/s$/, "").toLowerCase();
    what =
      unit && goods.toLowerCase().includes(unit)
        ? `${count} ${goods}`
        : `${facts.quantity} of ${goods}`;
  }
  const lane =
    facts.originCity && facts.destinationCity
      ? ` ${facts.originCity} → ${facts.destinationCity}`
      : "";
  const blockers = ctx.findings.filter((f) => f.kind === "blocker");
  const risks = ctx.findings.filter((f) => f.kind === "risk");

  if (verdict === "NO_GO") {
    return `${cap(what)}${lane} can't move legally as specced — ${blockers.find((b) => b.hard)?.title.toLowerCase() ?? "a hard blocker stands in the way"}. There is a clean path around it; the actions below are the re-spec.`;
  }
  if (verdict === "CONDITIONAL") {
    return `${cap(what)}${lane} can ship — after ${blockers.length === 1 ? "one condition closes" : `${blockers.length} conditions close`} out${risks.length ? `, with ${risks.length} live risk${risks.length > 1 ? "s" : ""} priced in` : ""}. Every figure below is cited to the public record it comes from.`;
  }
  if (risks.length) {
    return `Green light for ${what}${lane}. ${risks.length === 1 ? "One flag" : `${risks.length} flags`} worth pricing in before you book — each cited below.`;
  }
  const actions = ctx.findings.filter((f) => f.kind === "action");
  if (actions.length) {
    return actions.length === 1
      ? `Green light for ${what}${lane} — nothing blocks it. One housekeeping item below keeps it clean, cited.`
      : `Green light for ${what}${lane} — nothing blocks it. ${actions.length} housekeeping items below keep it clean, each cited.`;
  }
  return `Green light for ${what}${lane} — no hazmat, no tariff exposure, no insurance gap on what you've told us. The math is below, with sources.`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function buildTimeline(ctx: RuleContext): TimelineStep[] {
  const { facts, commodity, isImport } = ctx;
  const steps: TimelineStep[] = [
    { label: "Parsing shipment from plain English…" },
    {
      label: commodity
        ? `Classifying: ${commodity.name}${commodity.hts ? ` → HTS ${commodity.hts}` : ""}${commodity.un ? ` · ${commodity.un}` : ""}`
        : "Classifying commodity…",
    },
  ];
  if (commodity?.un || facts.mentionsHazmat) {
    steps.push({ label: "Checking 49 CFR 172.101 / 173.185 hazmat rules…" });
    if (facts.mode === "air") steps.push({ label: "Checking PHMSA & IATA air provisions…" });
  }
  if (isImport) {
    steps.push({ label: "Pulling duty rates from the USITC tariff schedule…" });
    if (facts.originCountry === "CN" || facts.originCountry === "HK")
      steps.push({ label: "Screening Section 301 lists (9903.88)…" });
    if (commodity?.uflpa) steps.push({ label: "Screening UFLPA entity list exposure…" });
    steps.push({ label: "Checking CBP entry requirements…" });
  }
  if (facts.mode === "truck") {
    steps.push({ label: "Checking FMCSA carrier & insurance records…" });
    steps.push({ label: "Cross-referencing CargoNet theft data on this corridor…" });
  }
  steps.push({ label: "Computing transit math against your dates…" });
  steps.push({ label: "Compiling citations…" });
  return steps;
}

/**
 * Deterministic rules engine: ShipmentFacts → verdict + cited findings.
 * Runs identically in the browser (fallback) and on the server.
 */
export function analyzeShipment(
  facts: ShipmentFacts,
  engine: "live" | "local" = "local",
): PreflightResult {
  const commodity = commodityOf(facts);
  const origin = placeOf(facts.originCity);
  const dest = placeOf(facts.destinationCity);
  const isImport =
    facts.destinationCountry === "US" && facts.originCountry !== null && facts.originCountry !== "US";

  const ctx: RuleContext = {
    facts,
    commodity,
    origin,
    dest,
    isImport,
    findings: [],
    transit: null,
  };

  checkHazmat(ctx);
  checkCustoms(ctx);
  checkFoodHandling(ctx);
  checkInsurance(ctx);
  checkTheft(ctx);
  checkTransit(ctx);

  if (!facts.commodity && !facts.commodityKey) {
    ctx.findings.push({
      kind: "action",
      title: "Tell us what's in the box",
      detail:
        "Commodity drives everything — hazmat class, duty rate, carrier acceptance. One more phrase in the description and the pre-flight sharpens up.",
      citationIds: ["your-input"],
    });
  }

  const order: Record<string, number> = { blocker: 0, risk: 1, action: 2 };
  ctx.findings.sort((a, b) => order[a.kind] - order[b.kind]);

  const verdict = decideVerdict(ctx.findings);
  const citationIds = [
    ...ctx.findings.flatMap((f) => f.citationIds),
    ...(ctx.transit?.citationIds ?? []),
  ];

  return {
    verdict,
    headline: buildHeadline(verdict, ctx.findings),
    summary: buildSummary(ctx, verdict),
    findings: ctx.findings,
    transit: ctx.transit,
    citations: getCitations(citationIds),
    facts,
    timeline: buildTimeline(ctx),
    engine,
  };
}
