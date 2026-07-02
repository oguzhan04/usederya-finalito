import Link from "next/link";
import type { Metadata } from "next";

const onboardingCalendarUrl = "https://calendar.google.com/";

export const metadata: Metadata = {
  title: "Join the Network",
  description: "Join Derya's freight network as a forwarder or carrier.",
};

export default function JoinPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start px-6 py-16 md:py-24">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="mb-10 flex flex-col items-center gap-5">
          <h1 className="max-w-3xl text-4xl font-medium tracking-tighter text-primary text-balance md:text-5xl lg:text-6xl">
            Join the Network to Receive Freight
          </h1>
          <p className="max-w-2xl text-base font-medium leading-relaxed tracking-tight text-muted-foreground text-balance md:text-lg">
            Derya works with reliable forwarders, carriers, brokers, and
            logistics partners across lanes where our customers need trusted
            execution. We&apos;ll onboard you with a short meeting, book below.
          </p>
        </div>

        <div className="w-full rounded-xl border border-border bg-accent p-6 text-left shadow-[0px_34px_20px_-8px_rgba(0,0,0,0.05),0px_15px_15px_-6px_rgba(0,0,0,0.09),0px_4px_8px_-2px_rgba(0,0,0,0.10),0px_0px_0px_1px_rgba(0,0,0,0.08)] md:p-8">
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            We are building an AI-native freight forwarding network that can
            route shipment demand to the right local operators, price lanes
            faster, and keep execution coordinated from booking through final
            delivery. Partners who work with Derya can receive qualified freight
            opportunities, collaborate on pricing and operations, and plug into
            a workflow built for speed, visibility, and long-term customer
            relationships.
          </p>

          <div className="mt-8 flex justify-center md:justify-start">
            <a
              href={onboardingCalendarUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/[0.12] bg-secondary px-6 text-sm font-medium tracking-wide text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] transition-all ease-out hover:bg-secondary/80 active:scale-95 dark:text-secondary-foreground"
            >
              Book Onboarding
            </a>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Back to Derya
        </Link>
      </section>
    </main>
  );
}
