/**
 * Screen for shipments this demo must refuse outright: narcotics and other
 * prohibited cargo, customs-evasion phrasing, weapons, counterfeits,
 * wildlife and human trafficking. Legitimate-but-regulated wordings
 * ("prescription drugs", "pharmaceuticals") are let through to the normal
 * rules engine instead.
 */

const LEGIT_OVERRIDES = [
  /\b(prescription|pharmaceutical|pharma|otc|generic|veterinary)\s+(drugs?|medications?)\b/i,
  /\bmedical (supplies|devices?)\b/i,
];

const PROHIBITED_PATTERNS: RegExp[] = [
  // Narcotics & controlled substances
  /\b(heroin|cocaine|fentanyl|meth(amphetamine)?|mdma|ecstasy|lsd|opium|opioids?|ketamine|cannabis|marijuana|weed|psilocybin|steroids)\b/i,
  /\b(illegal|illicit|street)\s+drugs?\b/i,
  /\bdrugs?\b/i,
  // Smuggling / customs evasion, regardless of the goods
  /\bsmuggl\w*/i,
  /\btraffick\w*/i,
  /\b(avoid|dodge|skip|bypass|evade)\s+(customs|inspection|duties|tariffs|cbp)\b/i,
  /\bwithout\s+(declaring|customs|paperwork|documents)\b/i,
  /\bunder the radar\b/i,
  /\bhide\b[^.]{0,30}\b(from\s+)?(customs|cbp|inspection|x-?ray)\b/i,
  /\b(undeclared|off the books|no questions asked|don'?t declare)\b/i,
  // Weapons & explosives
  /\b(guns?|firearms?|pistols?|rifles?|handguns?|ammunition|ammo|explosives?|grenades?|weapons?|silencers?)\b/i,
  // Counterfeits, wildlife, human trafficking
  /\b(counterfeits?|knock-?offs?|fake\s+(designer|branded|luxury))\b/i,
  /\b(ivory|rhino horn|endangered species|exotic animals?)\b/i,
  /\b(human organs?|people|humans?|migrants?)\s+(smuggl|traffick|across the border|in (a|the) (container|truck))/i,
];

export function isProhibitedQuery(query: string): boolean {
  if (LEGIT_OVERRIDES.some((p) => p.test(query))) return false;
  return PROHIBITED_PATTERNS.some((p) => p.test(query));
}
