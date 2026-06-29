/* eslint-disable @next/next/no-img-element */
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

export interface FeedItem {
  name: string;
  role: string;
  quote: React.ReactNode;
  noQuote?: boolean;
  bold?: boolean;
  badge: { kind: string; src: string };
}

function Badge({ badge, name }: { badge: FeedItem["badge"]; name: string }) {
  if (badge.kind === "logo") {
    return (
      <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-background p-1">
        <img
          src={badge.src}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }
  return (
    <img
      src={badge.src}
      alt={name}
      className={cn(
        "size-12 shrink-0 rounded-full",
        badge.kind === "portrait"
          ? "object-cover"
          : "border border-border bg-background object-contain p-1",
      )}
    />
  );
}

export const TestimonialCard = ({
  quote,
  name,
  role,
  badge,
  noQuote,
  bold,
}: FeedItem) => (
  <div
    className={cn(
      "flex w-full cursor-default break-inside-avoid flex-col items-start justify-between gap-8 rounded-xl p-5",
      "bg-accent",
      "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_8px_12px_-4px_rgba(15,12,12,0.08),0px_1px_2px_0px_rgba(15,12,12,0.10)] dark:shadow-[0px_0px_0px_1px_rgba(250,250,250,0.1),0px_0px_0px_1px_#18181B,0px_8px_12px_-4px_rgba(15,12,12,0.3),0px_1px_2px_0px_rgba(15,12,12,0.3)]",
    )}
  >
    <p
      className={cn(
        "select-none text-[15px] leading-relaxed text-primary/90",
        bold ? "font-semibold" : "font-normal",
      )}
    >
      {noQuote ? quote : <>&ldquo;{quote}&rdquo;</>}
    </p>

    <div className="flex w-full select-none items-center justify-start gap-3">
      <Badge badge={badge} name={name} />
      <div>
        <p className="text-sm font-medium text-primary/90">{name}</p>
        <p className="text-xs font-normal text-primary/50">{role}</p>
      </div>
    </div>
  </div>
);

export function SocialProofTestimonials({
  columns,
}: {
  columns: FeedItem[][];
}) {
  const durations = ["[--duration:55s]", "[--duration:70s]", "[--duration:48s]"];
  return (
    <div className="h-full">
      <div className="px-10">
        <div className="relative max-h-[750px] overflow-hidden">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {columns.map((col, i) => (
              <div
                key={i}
                className={cn("min-w-0", {
                  "hidden md:block": i === 1,
                  "hidden xl:block": i === 2,
                })}
              >
                <Marquee
                  vertical
                  className={cn("[--gap:1rem]", durations[i % durations.length])}
                >
                  {col.map((card, idx) => (
                    <TestimonialCard {...card} key={idx} />
                  ))}
                </Marquee>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/6 md:h-1/5 w-full bg-gradient-to-t from-background from-20%"></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 md:h-10 w-full bg-gradient-to-b from-background from-20%"></div>
        </div>
      </div>
    </div>
  );
}
