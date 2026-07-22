export interface CommodityInfo {
  key: string;
  /** Display name used in copy. */
  name: string;
  /** Regexes matched against the raw query (case-insensitive). */
  patterns: RegExp[];
  hts: string | null;
  htsCitation: string | null;
  /** General (column 1) ad-valorem duty, percent. */
  dutyPct: number | null;
  /** Additional Section 301 duty for China origin, percent. */
  section301Pct: number | null;
  /** UN number when the commodity is regulated dangerous goods. */
  un: "UN3480" | "UN3481" | "UN3171" | null;
  /** UFLPA high-priority sector (cotton, polysilicon...). */
  uflpa: boolean;
  /** Frequently-stolen commodity per CargoNet categories. */
  theftHot: boolean;
  /** FDA-regulated food/beverage. */
  fda: boolean;
}

export const COMMODITIES: CommodityInfo[] = [
  {
    key: "lithium-batteries",
    name: "lithium-ion batteries",
    patterns: [
      /lithium[- ]?(ion)?\s*(battery|batteries|cells?|packs?)/i,
      /\bbattery packs?\b/i,
      /\bpower ?banks?\b/i,
      /\bdrone batteries\b/i,
      /\bli-?ion\b/i,
    ],
    hts: "8507.60.00",
    htsCitation: "hts-8507-60",
    dutyPct: 3.4,
    section301Pct: 25,
    un: "UN3480",
    uflpa: false,
    theftHot: true,
    fda: false,
  },
  {
    key: "e-bikes",
    name: "e-bikes",
    patterns: [/e-?bikes?/i, /electric (bicycles?|bikes?|scooters?)/i],
    hts: "8711.60.00",
    htsCitation: "hts-8711-60",
    dutyPct: 0,
    section301Pct: 25,
    un: "UN3171",
    uflpa: false,
    theftHot: true,
    fda: false,
  },
  {
    key: "electronics",
    name: "consumer electronics",
    patterns: [
      /\blaptops?\b/i,
      /\bsmart ?phones?\b/i,
      /\btablets?\b/i,
      /\bgpus?\b/i,
      /\bservers?\b/i,
      /\bconsumer electronics\b/i,
      /\brobots?\b/i,
      /\bdrones?\b/i,
      /\bwearables?\b/i,
    ],
    hts: null,
    htsCitation: "cbp-cross",
    dutyPct: null,
    section301Pct: 25,
    un: "UN3481",
    uflpa: false,
    theftHot: true,
    fda: false,
  },
  {
    key: "cotton-apparel",
    name: "cotton apparel",
    patterns: [
      /\bhoodies?\b/i,
      /\bsweatshirts?\b/i,
      /\bt-?shirts?\b/i,
      /\bapparel\b/i,
      /cotton (garments?|clothing|tees?)/i,
    ],
    hts: "6110.20.20",
    htsCitation: "hts-6110-20",
    dutyPct: 16.5,
    section301Pct: 7.5,
    un: null,
    uflpa: true,
    theftHot: true,
    fda: false,
  },
  {
    key: "solar",
    name: "solar panels",
    patterns: [/solar (panels?|modules?|cells?)/i, /\bphotovoltaic\b/i],
    hts: "8541.43.00",
    htsCitation: "hts-8541-43",
    dutyPct: 0,
    section301Pct: 50,
    un: null,
    uflpa: true,
    theftHot: false,
    fda: false,
  },
  {
    key: "food-beverage",
    name: "food & beverage",
    patterns: [
      /\boat[- ]?milk\b/i,
      /\bcoffee\b/i,
      /\bsnacks?\b/i,
      /\bbeverages?\b/i,
      /\benergy drinks?\b/i,
      /\bolive oil\b/i,
      /\bwine\b/i,
      /\bfood\b/i,
      /\bcartons? of\b/i,
      /\bprotein (bars?|powder)\b/i,
    ],
    hts: null,
    htsCitation: "cbp-cross",
    dutyPct: null,
    section301Pct: null,
    un: null,
    uflpa: false,
    theftHot: true,
    fda: true,
  },
  {
    key: "furniture",
    name: "furniture",
    patterns: [/\bfurniture\b/i, /\bchairs?\b/i, /\bdesks?\b/i, /\bsofas?\b/i],
    hts: null,
    htsCitation: "cbp-cross",
    dutyPct: 0,
    section301Pct: 25,
    un: null,
    uflpa: false,
    theftHot: false,
    fda: false,
  },
  {
    key: "machinery",
    name: "machinery",
    patterns: [
      /\bmachin(e|ery|es)\b/i,
      /\bespresso machines?\b/i,
      /\bcnc\b/i,
      /\bpumps?\b/i,
      /\bmarine parts?\b/i,
      /\bspare parts?\b/i,
    ],
    hts: null,
    htsCitation: "cbp-cross",
    dutyPct: null,
    section301Pct: 25,
    un: null,
    uflpa: false,
    theftHot: false,
    fda: false,
  },
];

export function matchCommodity(text: string): CommodityInfo | null {
  for (const c of COMMODITIES) {
    if (c.patterns.some((p) => p.test(text))) return c;
  }
  return null;
}

export interface Place {
  /** Canonical display name. */
  name: string;
  /** Match tokens, lower case. */
  aliases: string[];
  country: string;
  lat: number;
  lng: number;
  /** Has a container port / airport we quote from. */
  gateway: boolean;
  /** High cargo-theft state per CargoNet (CA, TX, GA, IL, FL). */
  theftCorridor?: boolean;
}

export const PLACES: Place[] = [
  { name: "Fremont, CA", aliases: ["fremont"], country: "US", lat: 37.55, lng: -121.99, gateway: false, theftCorridor: true },
  { name: "San Francisco, CA", aliases: ["san francisco", "sfo", "sf"], country: "US", lat: 37.77, lng: -122.42, gateway: true, theftCorridor: true },
  { name: "Oakland, CA", aliases: ["oakland"], country: "US", lat: 37.8, lng: -122.27, gateway: true, theftCorridor: true },
  { name: "Los Angeles, CA", aliases: ["los angeles", "la", "lax"], country: "US", lat: 34.05, lng: -118.24, gateway: true, theftCorridor: true },
  { name: "Long Beach, CA", aliases: ["long beach"], country: "US", lat: 33.77, lng: -118.19, gateway: true, theftCorridor: true },
  { name: "San Diego, CA", aliases: ["san diego"], country: "US", lat: 32.72, lng: -117.16, gateway: false, theftCorridor: true },
  { name: "Seattle, WA", aliases: ["seattle"], country: "US", lat: 47.61, lng: -122.33, gateway: true },
  { name: "Portland, OR", aliases: ["portland"], country: "US", lat: 45.52, lng: -122.68, gateway: true },
  { name: "Austin, TX", aliases: ["austin"], country: "US", lat: 30.27, lng: -97.74, gateway: false, theftCorridor: true },
  { name: "Dallas, TX", aliases: ["dallas"], country: "US", lat: 32.78, lng: -96.8, gateway: true, theftCorridor: true },
  { name: "Houston, TX", aliases: ["houston"], country: "US", lat: 29.76, lng: -95.37, gateway: true, theftCorridor: true },
  { name: "El Paso, TX", aliases: ["el paso"], country: "US", lat: 31.76, lng: -106.49, gateway: false, theftCorridor: true },
  { name: "Laredo, TX", aliases: ["laredo"], country: "US", lat: 27.5, lng: -99.5, gateway: true, theftCorridor: true },
  { name: "Phoenix, AZ", aliases: ["phoenix"], country: "US", lat: 33.45, lng: -112.07, gateway: false },
  { name: "Denver, CO", aliases: ["denver"], country: "US", lat: 39.74, lng: -104.99, gateway: false },
  { name: "Chicago, IL", aliases: ["chicago"], country: "US", lat: 41.88, lng: -87.63, gateway: true, theftCorridor: true },
  { name: "Detroit, MI", aliases: ["detroit"], country: "US", lat: 42.33, lng: -83.05, gateway: true },
  { name: "Memphis, TN", aliases: ["memphis"], country: "US", lat: 35.15, lng: -90.05, gateway: true },
  { name: "Atlanta, GA", aliases: ["atlanta"], country: "US", lat: 33.75, lng: -84.39, gateway: true, theftCorridor: true },
  { name: "Savannah, GA", aliases: ["savannah"], country: "US", lat: 32.08, lng: -81.09, gateway: true, theftCorridor: true },
  { name: "Miami, FL", aliases: ["miami"], country: "US", lat: 25.76, lng: -80.19, gateway: true, theftCorridor: true },
  { name: "New York, NY", aliases: ["new york", "nyc", "brooklyn"], country: "US", lat: 40.71, lng: -74.01, gateway: true },
  { name: "Newark, NJ", aliases: ["newark", "new jersey", "nj"], country: "US", lat: 40.74, lng: -74.17, gateway: true },
  { name: "Boston, MA", aliases: ["boston"], country: "US", lat: 42.36, lng: -71.06, gateway: true },
  { name: "Shenzhen", aliases: ["shenzhen"], country: "CN", lat: 22.54, lng: 114.06, gateway: true },
  { name: "Shanghai", aliases: ["shanghai"], country: "CN", lat: 31.23, lng: 121.47, gateway: true },
  { name: "Ningbo", aliases: ["ningbo"], country: "CN", lat: 29.87, lng: 121.54, gateway: true },
  { name: "Hong Kong", aliases: ["hong kong", "hk"], country: "HK", lat: 22.32, lng: 114.17, gateway: true },
  { name: "Taipei", aliases: ["taipei", "taiwan"], country: "TW", lat: 25.03, lng: 121.57, gateway: true },
  { name: "Busan", aliases: ["busan"], country: "KR", lat: 35.18, lng: 129.08, gateway: true },
  { name: "Tokyo", aliases: ["tokyo", "yokohama"], country: "JP", lat: 35.68, lng: 139.69, gateway: true },
  { name: "Ho Chi Minh City", aliases: ["ho chi minh", "saigon", "hcmc"], country: "VN", lat: 10.82, lng: 106.63, gateway: true },
  { name: "Hanoi", aliases: ["hanoi", "haiphong"], country: "VN", lat: 21.03, lng: 105.85, gateway: true },
  { name: "Mumbai", aliases: ["mumbai", "nhava sheva"], country: "IN", lat: 19.08, lng: 72.88, gateway: true },
  { name: "Istanbul", aliases: ["istanbul", "ambarli"], country: "TR", lat: 41.01, lng: 28.98, gateway: true },
  { name: "Izmir", aliases: ["izmir"], country: "TR", lat: 38.42, lng: 27.14, gateway: true },
  { name: "Mersin", aliases: ["mersin"], country: "TR", lat: 36.8, lng: 34.63, gateway: true },
  { name: "Rotterdam", aliases: ["rotterdam"], country: "NL", lat: 51.92, lng: 4.48, gateway: true },
  { name: "Amsterdam", aliases: ["amsterdam"], country: "NL", lat: 52.37, lng: 4.9, gateway: true },
  { name: "Hamburg", aliases: ["hamburg"], country: "DE", lat: 53.55, lng: 9.99, gateway: true },
  { name: "Berlin", aliases: ["berlin"], country: "DE", lat: 52.52, lng: 13.41, gateway: true },
  { name: "Frankfurt", aliases: ["frankfurt"], country: "DE", lat: 50.11, lng: 8.68, gateway: true },
  { name: "Milan", aliases: ["milan"], country: "IT", lat: 45.46, lng: 9.19, gateway: true },
  { name: "London", aliases: ["london", "felixstowe"], country: "GB", lat: 51.51, lng: -0.13, gateway: true },
  { name: "Toronto", aliases: ["toronto"], country: "CA", lat: 43.65, lng: -79.38, gateway: true },
  { name: "Vancouver", aliases: ["vancouver"], country: "CA", lat: 49.28, lng: -123.12, gateway: true },
  { name: "Monterrey", aliases: ["monterrey"], country: "MX", lat: 25.69, lng: -100.32, gateway: true },
  { name: "Guadalajara", aliases: ["guadalajara"], country: "MX", lat: 20.66, lng: -103.35, gateway: true },
];

export function findPlace(token: string): Place | null {
  const t = token.toLowerCase().trim();
  for (const p of PLACES) {
    const nameFull = p.name.toLowerCase();
    const nameCity = nameFull.split(",")[0].trim();
    if (t === nameFull || t === nameCity) return p;
    if (p.aliases.some((a) => t === a || t.startsWith(`${a},`))) return p;
  }
  return null;
}

const EARTH_RADIUS_MI = 3958.8;

export function haversineMiles(a: Place, b: Place): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(s));
}

/** Typical port-to-port ocean transit (days) by origin country into US coasts. */
export const OCEAN_LANES: Record<string, { west: [number, number]; east: [number, number] }> = {
  CN: { west: [14, 18], east: [28, 34] },
  HK: { west: [14, 18], east: [28, 34] },
  TW: { west: [14, 18], east: [28, 34] },
  KR: { west: [12, 16], east: [26, 32] },
  JP: { west: [11, 15], east: [25, 30] },
  VN: { west: [18, 22], east: [30, 36] },
  IN: { west: [28, 34], east: [24, 30] },
  TR: { west: [30, 38], east: [18, 24] },
  NL: { west: [26, 32], east: [10, 14] },
  DE: { west: [26, 32], east: [11, 15] },
  IT: { west: [28, 36], east: [14, 20] },
  GB: { west: [24, 30], east: [9, 13] },
};

/** US West Coast states for picking the lane side. */
export const WEST_COAST = new Set(["CA", "WA", "OR"]);
