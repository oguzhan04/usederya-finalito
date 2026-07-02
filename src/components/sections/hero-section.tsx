import { siteConfig } from "@/lib/config";
import Link from "next/link";

export function HeroSection() {
  const { hero } = siteConfig;

  return (
    <section id="hero" className="w-full relative">
      <div className="relative flex flex-col items-center w-full px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 -z-10 h-[600px] md:h-[800px] w-full [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--secondary)_100%)] rounded-b-xl"></div>
        </div>
        <div className="relative z-10 pt-32 pb-28 max-w-3xl mx-auto h-full w-full flex flex-col gap-10 items-center justify-center">
          <p className="border border-border bg-accent rounded-full text-sm h-8 px-3 flex items-center gap-2">
            {hero.badgeIcon}
            {hero.badge}
          </p>
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center text-primary whitespace-pre-line">
              {hero.title}
            </h1>
            <p className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight">
              {hero.description}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2.5 justify-center">
            <Link
              href={hero.cta.primary.href}
              className="bg-secondary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground w-72 sm:w-80 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
            >
              {hero.cta.primary.text}
            </Link>
            <Link
              href={hero.cta.secondary.href}
              className="h-10 flex items-center justify-center w-72 sm:w-80 px-5 text-sm font-normal tracking-wide text-primary text-center rounded-full transition-all ease-out active:scale-95 bg-white dark:bg-background border border-[#E5E7EB] dark:border-[#27272A] hover:bg-white/80 dark:hover:bg-background/80 sm:whitespace-nowrap"
            >
              {hero.cta.secondary.text}
            </Link>
          </div>
          <div className="flex flex-col items-center gap-3 text-center mt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              We guarantee
            </p>
            <div className="flex flex-col items-center gap-2.5">
              {[
                ["Quote within the day*", "Customs included"],
                ["Financing for bookings over $20k"],
              ].map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex flex-wrap items-center justify-center gap-2.5"
                >
                  {row.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-2 rounded-full border border-border bg-accent/60 px-3.5 py-1.5 text-sm font-medium text-primary"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="shrink-0 text-secondary"
                      >
                        <path
                          d="M13.5 4.5L6 12L2.5 8.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/70">
              *For RFQs received before 12:00 PM (PST) on a business day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
