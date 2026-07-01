import { PricingSection } from "@/components/sections/pricing-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
  description: "Request a freight quote from Derya.",
};

export default function BookingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start pt-2">
      <PricingSection title="Request a quote for free" compactHeader />
    </main>
  );
}
