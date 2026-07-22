import { FileSearch2, Ship, UserRoundX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PreflightDemo } from "@/components/startup/preflight-demo";
import { FooterSection } from "@/components/sections/footer-section";

export const metadata: Metadata = {
  title: "Load Pre-Flight: Shipping Intelligence for Startups",
  description:
    "Run a pre-flight on a real startup shipment and get a GO / NO-GO verdict with cited blockers, risks and actions: duty rates from USITC, hazmat rules from 49 CFR, carrier records from FMCSA. No login.",
};

const PROOF_POINTS = [
  {
    icon: FileSearch2,
    title: "Cited, not vibes",
    description:
      "Every number traces to a public source: USITC duty rates, CBP rulings, FMCSA records, 49 CFR. Hit “Sources” on any verdict and check us.",
  },
  {
    icon: UserRoundX,
    title: "No login, no persistence",
    description:
      "Pick a load, get a verdict. Nothing is stored, and there's no gate between you and the answer.",
  },
  {
    icon: Ship,
    title: "A real desk behind it",
    description:
      "Derya is an AI-native freight forwarder. The same checks run on every live quote, with a human signing off before anything moves.",
  },
];

export default function StartupPage() {
  return (
    <main className="flex flex-col items-center justify-center divide-y divide-border min-h-screen w-full">
      <section id="preflight-hero" className="w-full relative">
        <div className="relative flex flex-col items-center w-full px-6">
          <div className="absolute inset-0">
            <div className="absolute inset-0 -z-10 h-[600px] md:h-[800px] w-full [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--secondary)_100%)] rounded-b-xl"></div>
          </div>

          <div className="relative z-10 pt-32 pb-20 max-w-4xl mx-auto w-full flex flex-col gap-10 items-center">
            <p className="border border-border bg-accent rounded-full text-xs font-medium uppercase tracking-[0.18em] h-8 px-4 flex items-center gap-2 text-secondary">
              Interactive product demo
            </p>
            <div className="flex flex-col items-center justify-center gap-5">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-balance text-center text-primary">
                Pre-flight your shipment before you book it.
              </h1>
              <p className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight max-w-2xl">
                Pick a real startup load and get a GO / NO-GO verdict with the
                specific blockers, risks and actions. Hazmat rules, tariff
                exposure, insurance gaps, theft windows, transit math. Every
                number cited to public data.
              </p>
            </div>

            <PreflightDemo />
          </div>
        </div>
      </section>

      <section id="preflight-proof" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {PROOF_POINTS.map((point) => (
            <div key={point.title} className="flex flex-col gap-3 p-8 md:p-10">
              <point.icon className="size-5 text-secondary" />
              <h3 className="text-base font-medium tracking-tight text-primary">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="preflight-cta" className="w-full">
        <div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-primary max-w-xl text-balance">
            Ship it for real. Same brief, real quote.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl text-balance">
            Send the same description to our desk and get a human-checked
            pre-flight with rates, usually within the day. Customs included.
          </p>
          <Link
            href="/booking"
            className="bg-secondary h-10 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground px-7 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
          >
            Get this for your next shipment
          </Link>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
