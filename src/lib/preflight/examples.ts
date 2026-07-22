import type { ShipmentFacts } from "./types";

export interface CannedExample {
  id: string;
  /** Short label on the chip. */
  label: string;
  /** One-line descriptor under the label. */
  hint: string;
  /** The text dropped into the input box. */
  query: string;
  /** Hand-authored facts — precomputed, no parsing or network needed. */
  facts: ShipmentFacts;
}

export const CANNED_EXAMPLES: CannedExample[] = [
  {
    id: "battery-packs",
    label: "Hardware startup",
    hint: "Lithium packs, Fremont → Austin",
    query:
      "8 pallets of lithium-ion battery packs, Fremont CA to Austin TX, $180k value, pickup Friday",
    facts: {
      query:
        "8 pallets of lithium-ion battery packs, Fremont CA to Austin TX, $180k value, pickup Friday",
      commodity: "lithium-ion battery packs",
      commodityKey: "lithium-batteries",
      originCity: "Fremont, CA",
      originCountry: "US",
      destinationCity: "Austin, TX",
      destinationCountry: "US",
      mode: "truck",
      valueUsd: 180_000,
      quantity: "8 pallets",
      pickup: "Friday",
      deadline: null,
      mentionsInsured: false,
      mentionsHazmat: false,
    },
  },
  {
    id: "drone-batteries-air",
    label: "Drone company",
    hint: "Spare batteries by air, SFO → Berlin",
    query:
      "500 standalone lithium-ion drone batteries, air freight San Francisco to Berlin, $95k, ship tomorrow",
    facts: {
      query:
        "500 standalone lithium-ion drone batteries, air freight San Francisco to Berlin, $95k, ship tomorrow",
      commodity: "lithium-ion drone batteries",
      commodityKey: "lithium-batteries",
      originCity: "San Francisco, CA",
      originCountry: "US",
      destinationCity: "Berlin",
      destinationCountry: "DE",
      mode: "air",
      valueUsd: 95_000,
      quantity: "500 batteries",
      pickup: "tomorrow",
      deadline: null,
      mentionsInsured: false,
      mentionsHazmat: false,
    },
  },
  {
    id: "ebikes-import",
    label: "DTC brand",
    hint: "E-bikes, Shenzhen → Long Beach",
    query:
      "1,200 e-bikes from Shenzhen to Long Beach, FOB, worth $540k, need them landed before Black Friday",
    facts: {
      query:
        "1,200 e-bikes from Shenzhen to Long Beach, FOB, worth $540k, need them landed before Black Friday",
      commodity: "e-bikes",
      commodityKey: "e-bikes",
      originCity: "Shenzhen",
      originCountry: "CN",
      destinationCity: "Long Beach, CA",
      destinationCountry: "US",
      mode: "ocean",
      valueUsd: 540_000,
      quantity: "1,200 bikes",
      pickup: null,
      deadline: "Black Friday",
      mentionsInsured: false,
      mentionsHazmat: false,
    },
  },
  {
    id: "oat-milk",
    label: "CPG startup",
    hint: "Oat milk, Portland → Seattle",
    query:
      "6 pallets of oat-milk cartons, Portland OR to Seattle, $18k, deliver next Tuesday",
    facts: {
      query:
        "6 pallets of oat-milk cartons, Portland OR to Seattle, $18k, deliver next Tuesday",
      commodity: "oat-milk cartons",
      commodityKey: "food-beverage",
      originCity: "Portland, OR",
      originCountry: "US",
      destinationCity: "Seattle, WA",
      destinationCountry: "US",
      mode: "truck",
      valueUsd: 18_000,
      quantity: "6 pallets",
      pickup: null,
      deadline: "next Tuesday",
      mentionsInsured: false,
      mentionsHazmat: false,
    },
  },
];
