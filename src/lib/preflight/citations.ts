import type { Citation } from "./types";

const CACHED_AS_OF = "Jul 2026";

/**
 * Curated registry of public sources. Every number the engine emits is bound
 * to one or more of these ids. URLs point at stable public pages (statutes,
 * agency databases, tariff schedule search) rather than deep links that rot.
 */
export const CITATIONS: Record<string, Citation> = {
  "hts-8507-60": {
    id: "hts-8507-60",
    label: "USITC HTS 8507.60.00",
    publisher: "U.S. International Trade Commission",
    title:
      "Harmonized Tariff Schedule — 8507.60.00 Lithium-ion batteries (General rate 3.4%)",
    url: "https://hts.usitc.gov/search?query=8507.60.00",
    backs: "Base duty rate for lithium-ion batteries",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "hts-8711-60": {
    id: "hts-8711-60",
    label: "USITC HTS 8711.60.00",
    publisher: "U.S. International Trade Commission",
    title:
      "Harmonized Tariff Schedule — 8711.60.00 Electric bicycles (General rate: Free)",
    url: "https://hts.usitc.gov/search?query=8711.60.00",
    backs: "Base duty rate for e-bikes",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "hts-6110-20": {
    id: "hts-6110-20",
    label: "USITC HTS 6110.20.20",
    publisher: "U.S. International Trade Commission",
    title:
      "Harmonized Tariff Schedule — 6110.20.20 Sweatshirts/pullovers of cotton (General rate 16.5%)",
    url: "https://hts.usitc.gov/search?query=6110.20.20",
    backs: "Base duty rate for cotton hoodies/sweatshirts",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "hts-8541-43": {
    id: "hts-8541-43",
    label: "USITC HTS 8541.43.00",
    publisher: "U.S. International Trade Commission",
    title:
      "Harmonized Tariff Schedule — 8541.43.00 Photovoltaic cells assembled in modules (General rate: Free)",
    url: "https://hts.usitc.gov/search?query=8541.43.00",
    backs: "Base duty rate for solar panels",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "ecfr-172-101": {
    id: "ecfr-172-101",
    label: "49 CFR §172.101",
    publisher: "eCFR (U.S. Code of Federal Regulations)",
    title:
      "Hazardous Materials Table — UN3480/UN3481 lithium batteries, UN3171 battery-powered vehicles (Class 9)",
    url: "https://www.ecfr.gov/current/title-49/section-172.101",
    backs: "Hazard class and UN number assignment",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "ecfr-173-185": {
    id: "ecfr-173-185",
    label: "49 CFR §173.185",
    publisher: "eCFR (U.S. Code of Federal Regulations)",
    title:
      "Lithium cells and batteries — packaging, testing (UN38.3) and hazmat paperwork requirements",
    url: "https://www.ecfr.gov/current/title-49/section-173.185",
    backs: "Ground-transport requirements for lithium batteries",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "phmsa-lithium-air": {
    id: "phmsa-lithium-air",
    label: "PHMSA lithium-battery air rule",
    publisher: "U.S. DOT PHMSA",
    title:
      "HM-224F: UN3480 lithium-ion batteries are forbidden as cargo on passenger aircraft; cargo-aircraft-only at ≤30% state of charge",
    url: "https://www.phmsa.dot.gov/lithiumbatteries",
    backs: "Passenger-aircraft prohibition and 30% state-of-charge limit",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "iata-dgr-lithium": {
    id: "iata-dgr-lithium",
    label: "IATA DGR lithium guidance",
    publisher: "IATA",
    title:
      "Lithium Battery Shipping Guidelines — Dangerous Goods Declaration and packing instructions PI 965–970",
    url: "https://www.iata.org/en/programs/cargo/dgr/lithium-batteries/",
    backs: "Air packing instructions and shipper's declaration",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "imdg-class9": {
    id: "imdg-class9",
    label: "IMO IMDG Code",
    publisher: "International Maritime Organization",
    title:
      "International Maritime Dangerous Goods Code — Class 9 declaration required for ocean carriage",
    url: "https://www.imo.org/en/OurWork/Safety/Pages/DangerousGoods-default.aspx",
    backs: "Ocean dangerous-goods declaration requirement",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "ecfr-395-3": {
    id: "ecfr-395-3",
    label: "49 CFR §395.3 (FMCSA HOS)",
    publisher: "eCFR / FMCSA",
    title:
      "Hours of Service — 11-hour driving limit within a 14-hour window after 10 consecutive hours off duty",
    url: "https://www.ecfr.gov/current/title-49/section-395.3",
    backs: "The ~550 miles/day solo-driver ceiling used in transit math",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "usc-14706": {
    id: "usc-14706",
    label: "49 U.S.C. §14706 (Carmack)",
    publisher: "U.S. Code",
    title:
      "Carmack Amendment — motor-carrier liability may be limited to declared released rates far below cargo value",
    url: "https://www.law.cornell.edu/uscode/text/49/14706",
    backs: "Why carrier liability does not equal cargo value",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "fmcsa-li": {
    id: "fmcsa-li",
    label: "FMCSA L&I insurance filings",
    publisher: "FMCSA",
    title:
      "Licensing & Insurance public register — cargo policies on file for most dry-van carriers cap at $100,000",
    url: "https://li-public.fmcsa.dot.gov/",
    backs: "The typical $100k carrier cargo-insurance cap",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "fmcsa-safer": {
    id: "fmcsa-safer",
    label: "FMCSA SAFER",
    publisher: "FMCSA",
    title:
      "SAFER company snapshot — authority, inspection and crash records for any carrier we assign",
    url: "https://safer.fmcsa.dot.gov/",
    backs: "Carrier vetting record",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "cargonet-2024": {
    id: "cargonet-2024",
    label: "CargoNet 2024 theft analysis",
    publisher: "CargoNet (Verisk)",
    title:
      "2024 supply-chain theft trends — reported cargo theft up 27% year over year; California and Texas lead; activity concentrates on weekends and holidays",
    url: "https://www.cargonet.com/news-and-events/",
    backs: "Theft-risk figures and weekend-dwell warning",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "ustr-301": {
    id: "ustr-301",
    label: "USTR Section 301 actions",
    publisher: "Office of the U.S. Trade Representative",
    title:
      "Section 301 China tariff actions and May 2024 four-year review — list coverage and additional duty rates",
    url: "https://ustr.gov/issue-areas/enforcement/section-301-investigations/tariff-actions",
    backs: "Section 301 additional duty rate applied to China-origin goods",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "hts-9903-88": {
    id: "hts-9903-88",
    label: "HTS Ch. 99 (9903.88)",
    publisher: "U.S. International Trade Commission",
    title:
      "HTS Chapter 99, Subchapter III — 9903.88 tariff lines implementing the Section 301 China duties",
    url: "https://hts.usitc.gov/search?query=9903.88",
    backs: "Legal tariff lines under which 301 duties are collected",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "cbp-trade-remedies": {
    id: "cbp-trade-remedies",
    label: "CBP trade remedies",
    publisher: "U.S. Customs & Border Protection",
    title:
      "Trade remedies in effect (Section 301, IEEPA and reciprocal actions) — duty stacking changes by CSMS notice",
    url: "https://www.cbp.gov/trade/programs-administration/trade-remedies",
    backs: "Why the additional-duty stack must be re-verified at booking",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "cbp-uflpa": {
    id: "cbp-uflpa",
    label: "CBP UFLPA enforcement",
    publisher: "U.S. Customs & Border Protection",
    title:
      "Uyghur Forced Labor Prevention Act — rebuttable presumption; detained shipments require full supply-chain traceability to release",
    url: "https://www.cbp.gov/trade/forced-labor/UFLPA",
    backs: "UFLPA detention exposure for cotton and polysilicon supply chains",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "dhs-uflpa-entity": {
    id: "dhs-uflpa-entity",
    label: "DHS UFLPA Entity List",
    publisher: "U.S. Department of Homeland Security",
    title: "UFLPA Entity List — suppliers whose goods are presumptively barred",
    url: "https://www.dhs.gov/uflpa-entity-list",
    backs: "Supplier screening list",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "cbp-cross": {
    id: "cbp-cross",
    label: "CBP CROSS rulings",
    publisher: "U.S. Customs & Border Protection",
    title:
      "Customs Rulings Online Search System — binding classification rulings for comparable products",
    url: "https://rulings.cbp.gov/",
    backs: "Classification precedent",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "cbp-isf": {
    id: "cbp-isf",
    label: "CBP ISF “10+2”",
    publisher: "U.S. Customs & Border Protection",
    title:
      "Importer Security Filing — must be on file 24 hours before vessel loading; violations up to $5,000 per filing",
    url: "https://www.cbp.gov/trade/basic-import-export/importer-security-filing-102",
    backs: "ISF deadline and penalty amount",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "fda-prior-notice": {
    id: "fda-prior-notice",
    label: "FDA Prior Notice",
    publisher: "U.S. Food & Drug Administration",
    title:
      "Prior Notice of imported food — required before arrival for all food shipments into the U.S.",
    url: "https://www.fda.gov/food/importing-food-products-united-states/prior-notice-imported-foods",
    backs: "FDA filing requirement for food imports",
    freshness: "cached",
    asOf: CACHED_AS_OF,
  },
  "derya-desk": {
    id: "derya-desk",
    label: "Derya operating data",
    publisher: "Derya forwarding desk",
    title:
      "Lane transit times, booking cutoffs and port dwell from shipments Derya and its partner network have moved",
    url: null,
    backs: "Ocean/air lane transit windows and booking-cutoff math",
    freshness: "derived",
    asOf: CACHED_AS_OF,
  },
  "your-input": {
    id: "your-input",
    label: "Your shipment description",
    publisher: "Provided by you",
    title:
      "Cargo value, quantities, places and dates parsed from the text you typed",
    url: null,
    backs: "Inputs to the duty, insurance-gap and transit math",
    freshness: "input",
    asOf: "this session",
  },
};

export function getCitations(ids: string[]): Citation[] {
  const seen = new Set<string>();
  const out: Citation[] = [];
  for (const id of ids) {
    if (!seen.has(id) && CITATIONS[id]) {
      seen.add(id);
      out.push(CITATIONS[id]);
    }
  }
  return out;
}
