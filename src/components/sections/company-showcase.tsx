import { siteConfig } from "@/lib/config";
import { Marquee } from "@/components/ui/marquee";

export function CompanyShowcase() {
  const { companyShowcase } = siteConfig;
  return (
    <section
      id="company"
      className="flex flex-col items-center justify-center gap-10 py-10 pt-20 w-full relative z-10 bg-background px-6"
    >
      <p className="text-muted-foreground font-medium">
        Trusted by importers/exporters, freight forwarders, and carriers.
      </p>
      <div className="relative w-full max-w-7xl [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <Marquee className="[--duration:60s] [--gap:4rem]" repeat={4}>
          {companyShowcase.companyLogos.map((logo) => (
            <div
              key={logo.id}
              className="flex h-28 w-52 flex-shrink-0 items-center justify-center"
            >
              {logo.logo}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
