/* eslint-disable @next/next/no-img-element */
import { OrbitingCircles } from "@/components/ui/orbiting-circle";
import {
  FilePen,
  HandCoins,
  Plane,
  Ship,
  TrainFront,
  Truck,
  Wheat,
} from "lucide-react";

function OilBarrels({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* back barrel peeking between the front two */}
      <path d="M9 5.2 V3.8 a3 1.1 0 0 1 6 0 V5.2" />
      {/* left barrel */}
      <ellipse cx="7" cy="7" rx="3.4" ry="1.3" />
      <path d="M3.6 7 V18 a3.4 1.3 0 0 0 6.8 0 V7" />
      <path d="M3.7 11 h6.6" />
      <path d="M3.7 15 h6.6" />
      {/* right barrel */}
      <ellipse cx="17" cy="7" rx="3.4" ry="1.3" />
      <path d="M13.6 7 V18 a3.4 1.3 0 0 0 6.8 0 V7" />
      <path d="M13.7 11 h6.6" />
      <path d="M13.7 15 h6.6" />
    </svg>
  );
}

function FreightBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-black/5 bg-white text-secondary shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  );
}

const ICON = "size-[38px]";

export function SecondBentoAnimation() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-background to-transparent z-20"></div>
      <div className="pointer-events-none absolute top-0 left-0 h-20 w-full bg-gradient-to-b from-background to-transparent z-20"></div>

      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center size-16 z-30 md:bottom-0 md:top-auto">
        <img
          src="/team/derya-assistant.png"
          alt="Derya"
          className="size-full object-contain"
        />
      </div>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="relative flex h-full w-full items-center justify-center translate-y-0 md:translate-y-32">
          <OrbitingCircles index={0} iconSize={60} radius={100} reverse speed={1}>
            <FreightBadge>
              <Truck className={ICON} />
            </FreightBadge>
            <FreightBadge>
              <Ship className={ICON} />
            </FreightBadge>
          </OrbitingCircles>

          <OrbitingCircles index={1} iconSize={60} speed={0.5}>
            <FreightBadge>
              <Plane className={ICON} />
            </FreightBadge>
            <FreightBadge>
              <Wheat className={ICON} />
            </FreightBadge>
            <FreightBadge>
              <HandCoins className={ICON} />
            </FreightBadge>
          </OrbitingCircles>

          <OrbitingCircles
            index={2}
            iconSize={60}
            radius={230}
            reverse
            speed={0.5}
          >
            <FreightBadge>
              <OilBarrels className={ICON} />
            </FreightBadge>
            <FreightBadge>
              <TrainFront className={ICON} />
            </FreightBadge>
            <FreightBadge>
              <FilePen className={ICON} />
            </FreightBadge>
          </OrbitingCircles>
        </div>
      </div>
    </div>
  );
}
