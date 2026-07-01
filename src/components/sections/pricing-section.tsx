"use client";

import { SectionHeader } from "@/components/section-header";
import { cn } from "@/lib/utils";
import { CheckCircle2, Info } from "lucide-react";
import {
  FormEvent,
  FocusEvent,
  useMemo,
  useState,
} from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";
type LoadType = "" | "FCL" | "LCL";

const inputClass =
  "h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-primary shadow-[0_1px_1px_rgba(16,24,40,0.02)] outline-none transition placeholder:text-muted-foreground/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20 [&.was-touched:invalid]:border-destructive [&.was-touched:invalid]:ring-2 [&.was-touched:invalid]:ring-destructive/15";

const textareaClass =
  "min-h-24 w-full resize-y rounded-md border border-border bg-white px-3 py-3 text-sm text-primary shadow-[0_1px_1px_rgba(16,24,40,0.02)] outline-none transition placeholder:text-muted-foreground/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20 [&.was-touched:invalid]:border-destructive [&.was-touched:invalid]:ring-2 [&.was-touched:invalid]:ring-destructive/15";

const selectClass =
  "h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-primary shadow-[0_1px_1px_rgba(16,24,40,0.02)] outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 [&.was-touched:invalid]:border-destructive [&.was-touched:invalid]:ring-2 [&.was-touched:invalid]:ring-destructive/15";

const containerTypes = [
  "20' Standard",
  "40' Standard",
  "40' High Cube",
  "45' High Cube",
  "Special (reefer / open top / flat rack)",
];

const quantities = ["1", "2", "3", "4", "5", "6", "7", "8", "9+"];

const incoterms = [
  {
    code: "EXW",
    label: "EXW - Ex Works",
    info: "Buyer handles almost everything after pickup from seller.",
  },
  {
    code: "FCA",
    label: "FCA - Free Carrier",
    info: "Seller hands goods to carrier; buyer handles main freight.",
  },
  {
    code: "FAS",
    label: "FAS - Free Alongside Ship",
    info: "Seller places goods beside ship; buyer loads and ships.",
  },
  {
    code: "FOB",
    label: "FOB - Free On Board",
    info: "Seller loads goods onto ship; buyer takes over onboard.",
  },
  {
    code: "CFR",
    label: "CFR - Cost and Freight",
    info: "Seller pays ocean freight; buyer takes risk onboard.",
  },
  {
    code: "CIF",
    label: "CIF - Cost, Insurance and Freight",
    info: "Seller pays ocean freight and basic insurance.",
  },
  {
    code: "CPT",
    label: "CPT - Carriage Paid To",
    info: "Seller pays transport; buyer takes risk at first carrier.",
  },
  {
    code: "CIP",
    label: "CIP - Carriage and Insurance Paid To",
    info: "Seller pays transport and insurance.",
  },
  {
    code: "DAP",
    label: "DAP - Delivered at Place",
    info: "Seller delivers to destination; buyer handles import.",
  },
  {
    code: "DPU",
    label: "DPU - Delivered at Place Unloaded",
    info: "Seller delivers and unloads; buyer handles import.",
  },
  {
    code: "DDP",
    label: "DDP - Delivered Duty Paid",
    info: "Seller handles delivery, customs, duties, and taxes.",
  },
];

function markTouched<T extends HTMLElement>(
  event: FocusEvent<T> | FormEvent<T>,
) {
  event.currentTarget.classList.add("was-touched");
}

function StepLegend({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex size-7 items-center justify-center rounded-full bg-secondary/15 text-sm font-semibold text-secondary">
        {number}
      </span>
      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        {title}
      </span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-primary">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function PricingSection() {
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [customs, setCustoms] = useState("");
  const [incoterm, setIncoterm] = useState("");
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [loadType, setLoadType] = useState<LoadType>("");
  const [dangerousGoods, setDangerousGoods] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const routeUnlocked = email.includes("@");
  const cargoUnlocked = useMemo(
    () =>
      routeUnlocked &&
      origin.trim().length > 0 &&
      destination.trim().length > 0 &&
      customs.length > 0 &&
      incoterm.length > 0 &&
      serviceNeeded.length > 0,
    [routeUnlocked, origin, destination, customs, incoterm, serviceNeeded],
  );

  const routeFields = useMemo(() => {
    switch (serviceNeeded) {
      case "Port to port":
        return {
          originLabel: "Origin port",
          originPlaceholder: "Origin port",
          destinationLabel: "Destination port",
          destinationPlaceholder: "Destination port",
        };
      case "Door to port":
        return {
          originLabel: "Pickup address",
          originPlaceholder: "Pickup address",
          destinationLabel: "Destination port",
          destinationPlaceholder: "Destination port",
        };
      case "Port to door":
        return {
          originLabel: "Origin port",
          originPlaceholder: "Origin port",
          destinationLabel: "Delivery address",
          destinationPlaceholder: "Delivery address",
        };
      case "Door to door":
        return {
          originLabel: "Pickup address",
          originPlaceholder: "Pickup address",
          destinationLabel: "Delivery address",
          destinationPlaceholder: "Delivery address",
        };
      default:
        return {
          originLabel: "Origin",
          originPlaceholder: "Origin",
          destinationLabel: "Destination",
          destinationPlaceholder: "Destination",
        };
    }
  }, [serviceNeeded]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubmitState("submitting");
    setStatusMessage("");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: new FormData(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Could not send inquiry.");
      }

      setSubmitState("success");
      setStatusMessage("Thanks. Your inquiry was sent to Derya's RFQ desk.");
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not send inquiry. Please try again.",
      );
    }
  }

  const isSubmitting = submitState === "submitting";
  const isSent = submitState === "success";

  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative"
    >
      <SectionHeader>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
          Request a quote from — free
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          Send one freight request and Derya routes it straight to the quoting
          desk.
          <br />
          For any queries:{" "}
          <a
            href="mailto:contact@usederya.com"
            className="text-secondary hover:underline"
          >
            contact@usederya.com
          </a>
        </p>
      </SectionHeader>

      <div className="w-full max-w-6xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-6xl rounded-xl border border-border bg-accent shadow-[0px_61px_24px_-10px_rgba(0,0,0,0.01),0px_34px_20px_-8px_rgba(0,0,0,0.05),0px_15px_15px_-6px_rgba(0,0,0,0.09),0px_4px_8px_-2px_rgba(0,0,0,0.10),0px_0px_0px_1px_rgba(0,0,0,0.08)]"
          encType="multipart/form-data"
          noValidate={false}
        >
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              <fieldset className="px-5 pb-5 pt-8 md:px-6 md:pb-6 md:pt-10">
                <StepLegend number="1" title="Contact" />
                <div className="grid gap-4">
                  <Field label="Work email">
                    <input
                      className={inputClass}
                      type="email"
                      name="Email"
                      required
                      autoComplete="email"
                      placeholder="Work email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (!event.target.value.includes("@")) {
                          setSubmitState("idle");
                        }
                      }}
                      onBlur={markTouched}
                      onInvalid={markTouched}
                    />
                  </Field>
                  <Field label="Company name (optional)">
                    <input
                      className={inputClass}
                      type="text"
                      name="Company name"
                      autoComplete="organization"
                      placeholder="Company name"
                      onBlur={markTouched}
                      onInvalid={markTouched}
                    />
                  </Field>
                  <div className="grid gap-2 text-sm font-medium text-primary">
                    <span>Phone number (optional)</span>
                    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-2">
                      <input
                        className={cn(inputClass, "px-2 text-center")}
                        type="tel"
                        name="Phone code"
                        defaultValue="+"
                        inputMode="tel"
                        autoComplete="tel-country-code"
                        aria-label="Phone country code"
                        onBlur={markTouched}
                        onInvalid={markTouched}
                      />
                      <input
                        className={inputClass}
                        type="tel"
                        name="Phone number"
                        autoComplete="tel-national"
                        placeholder="Phone number"
                        onBlur={markTouched}
                        onInvalid={markTouched}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset
                disabled={!routeUnlocked}
                className={cn(
                  "px-5 pb-5 pt-8 transition md:px-6 md:pb-6 md:pt-10",
                  !routeUnlocked && "is-locked opacity-45",
                )}
              >
                <StepLegend number="2" title="Route & Service" />
                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm font-medium text-primary">
                    <span>What service do you need?</span>
                    <select
                      className={selectClass}
                      name="Service needed"
                      required
                      value={serviceNeeded}
                      onChange={(event) => setServiceNeeded(event.target.value)}
                      onBlur={markTouched}
                      onInvalid={markTouched}
                    >
                      <option value="" disabled>
                        What service do you need?
                      </option>
                      <option value="Port to port">Port to port</option>
                      <option value="Door to port">Door to port</option>
                      <option value="Port to door">Port to door</option>
                      <option value="Door to door">Door to door</option>
                    </select>
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label={routeFields.originLabel}>
                      <input
                        className={inputClass}
                        type="text"
                        name="Origin"
                        required
                        placeholder={routeFields.originPlaceholder}
                        value={origin}
                        onChange={(event) => setOrigin(event.target.value)}
                        onBlur={markTouched}
                        onInvalid={markTouched}
                      />
                    </Field>
                    <Field label={routeFields.destinationLabel}>
                      <input
                        className={inputClass}
                        type="text"
                        name="Destination"
                        required
                        placeholder={routeFields.destinationPlaceholder}
                        value={destination}
                        onChange={(event) => setDestination(event.target.value)}
                        onBlur={markTouched}
                        onInvalid={markTouched}
                      />
                    </Field>
                  </div>
                  <label className="grid gap-2 text-sm font-medium text-primary">
                    <span className="flex items-center gap-2">
                      Incoterms
                      <span className="group relative inline-flex">
                        <button
                          type="button"
                          className="flex size-5 items-center justify-center rounded-full border border-secondary/30 bg-secondary/10 text-secondary"
                          aria-label="Show Incoterms guidance"
                        >
                          <Info className="size-3.5" />
                        </button>
                        <span className="pointer-events-none absolute left-1/2 top-7 z-30 hidden w-[min(22rem,80vw)] -translate-x-1/2 rounded-md border border-border bg-white p-3 text-xs font-normal leading-relaxed text-muted-foreground shadow-xl group-hover:block">
                          {incoterms.map((term) => (
                            <span key={term.code} className="block">
                              <strong className="text-primary">
                                {term.code}
                              </strong>{" "}
                              - {term.info}
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                    <select
                      className={selectClass}
                      name="Incoterms"
                      required
                      value={incoterm}
                      onChange={(event) => setIncoterm(event.target.value)}
                      onBlur={markTouched}
                      onInvalid={markTouched}
                    >
                      <option value="" disabled>
                        Select Incoterms
                      </option>
                      {incoterms.map((term) => (
                        <option key={term.code} value={term.code}>
                          {term.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-primary">
                    <span>Who handles customs clearance?</span>
                    <select
                      className={selectClass}
                      name="Customs handling"
                      required
                      value={customs}
                      onChange={(event) => setCustoms(event.target.value)}
                      onBlur={markTouched}
                      onInvalid={markTouched}
                    >
                      <option value="" disabled>
                        Who handles customs clearance?
                      </option>
                      <option value="derya-both">Derya — both ends</option>
                      <option value="derya-origin">
                        Derya — origin (export) only
                      </option>
                      <option value="derya-destination">
                        Derya — destination (import) only
                      </option>
                      <option value="own-broker">We use our own broker</option>
                      <option value="unsure">Not sure — advise me</option>
                    </select>
                  </label>
                  {serviceNeeded && serviceNeeded !== "Port to port" && (
                    <p className="rounded-md border border-secondary/20 bg-secondary/5 px-3 py-2 text-xs font-medium leading-relaxed text-muted-foreground">
                      NOTE: Detailed open address is essential for quick quoting.
                    </p>
                  )}
                </div>
              </fieldset>

              <fieldset
                disabled={!cargoUnlocked}
                className={cn(
                  "px-5 pb-5 pt-8 transition md:px-6 md:pb-6 md:pt-10",
                  !cargoUnlocked && "is-locked opacity-45",
                )}
              >
                <StepLegend number="3" title="Cargo" />
                <div className="grid gap-5">
                  <div className="grid gap-3">
                    <span className="text-sm font-medium text-primary">
                      Shipment type
                    </span>
                    <div className="grid gap-3 md:grid-cols-2">
                      {(["FCL", "LCL"] as const).map((type) => (
                        <label
                          key={type}
                          className={cn(
                            "flex h-11 cursor-pointer items-center justify-center rounded-md border bg-white px-3 text-sm font-medium text-primary transition",
                            loadType === type
                              ? "border-secondary bg-secondary/10 ring-2 ring-secondary/20"
                              : "border-border hover:border-secondary/40",
                          )}
                        >
                          <input
                            type="radio"
                            name="Load type"
                            value={type}
                            required={cargoUnlocked}
                            checked={loadType === type}
                            onChange={() => setLoadType(type)}
                            onBlur={markTouched}
                            onInvalid={markTouched}
                            className="sr-only"
                          />
                          {type === "FCL"
                            ? "FCL - Full container"
                            : "LCL - Less than container"}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div
                    hidden={loadType !== "FCL"}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    <Field label="Container type">
                      <select
                        className={selectClass}
                        name="Container type"
                        required={cargoUnlocked && loadType === "FCL"}
                        disabled={!cargoUnlocked || loadType !== "FCL"}
                        defaultValue=""
                        onBlur={markTouched}
                        onInvalid={markTouched}
                      >
                        <option value="" disabled>
                          Container type
                        </option>
                        {containerTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Containers quantity">
                      <select
                        className={selectClass}
                        name="Container quantity"
                        required={cargoUnlocked && loadType === "FCL"}
                        disabled={!cargoUnlocked || loadType !== "FCL"}
                        defaultValue=""
                        onBlur={markTouched}
                        onInvalid={markTouched}
                      >
                        <option value="" disabled>
                          Quantity
                        </option>
                        {quantities.map((quantity) => (
                          <option key={quantity} value={quantity}>
                            {quantity}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Total weight">
                    <div className="relative">
                      <input
                        className={cn(inputClass, "pr-12")}
                        type="text"
                        name="Total weight"
                        required={cargoUnlocked}
                        placeholder="Total weight"
                        onBlur={markTouched}
                        onInvalid={markTouched}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-muted-foreground">
                        kg
                      </span>
                    </div>
                    <span className="text-xs font-normal text-muted-foreground">
                      e.g. 12,000 kg
                    </span>
                  </Field>

                  <div hidden={loadType !== "LCL"}>
                    <Field label="Dimensions">
                      <textarea
                        className={textareaClass}
                        name="Dimensions"
                        required={cargoUnlocked && loadType === "LCL"}
                        disabled={!cargoUnlocked || loadType !== "LCL"}
                        placeholder="One line per piece — L×W×H and number of packages"
                        onBlur={markTouched}
                        onInvalid={markTouched}
                      />
                    </Field>
                  </div>

                  <label className="flex w-fit items-center gap-3 text-sm font-medium text-primary">
                    <input
                      type="checkbox"
                      name="Dangerous goods"
                      checked={dangerousGoods}
                      onChange={(event) =>
                        setDangerousGoods(event.target.checked)
                      }
                      className="size-4 rounded border-border"
                    />
                    Dangerous goods?
                  </label>

                  <div
                    hidden={!dangerousGoods}
                    className="grid gap-4 rounded-lg border border-border bg-white/70 p-4"
                  >
                    <Field label="Attach MSDS / safety data sheet (optional)">
                      <input
                        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-primary file:mr-3 file:rounded-md file:border-0 file:bg-secondary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary"
                        type="file"
                        name="MSDS attachment"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        disabled={!dangerousGoods}
                      />
                    </Field>
                    <div className="flex flex-col justify-end gap-2">
                      <label className="flex items-center gap-3 text-sm font-medium text-primary">
                        <input
                          type="checkbox"
                          name="Declare MSDS later"
                          disabled={!dangerousGoods}
                          className="size-4 rounded border-border"
                        />
                        Declare MSDS later*
                      </label>
                      <p className="text-xs text-muted-foreground">
                        *Declaring MSDS later may delay your quote.
                      </p>
                    </div>
                  </div>

                  <Field label="Notes">
                    <textarea
                      className={textareaClass}
                      name="Notes"
                      placeholder="Anything else? (optional)"
                      onBlur={markTouched}
                      onInvalid={markTouched}
                    />
                  </Field>
                </div>
              </fieldset>
            </div>

            <div className="border-t border-border bg-[#F3F4F6] p-5 md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3 md:flex md:gap-5">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-secondary" />
                    Required fields unlock step by step
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || isSent}
                  className="h-11 w-full shrink-0 rounded-full bg-secondary px-6 text-sm font-medium tracking-wide text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] transition active:scale-95 disabled:pointer-events-none disabled:opacity-70 md:w-auto md:min-w-[200px]"
                >
                  {isSent
                    ? "Thanks..."
                    : isSubmitting
                      ? "Sending..."
                      : "Submit inquiry"}
                </button>
              </div>
              {statusMessage && (
                <p
                  className={cn(
                    "mt-4 rounded-md border px-3 py-2 text-sm",
                    submitState === "error"
                      ? "border-destructive/30 bg-destructive/5 text-destructive"
                      : "border-secondary/20 bg-secondary/5 text-primary",
                  )}
                >
                  {statusMessage}
                </p>
              )}
            </div>
        </form>
      </div>
    </section>
  );
}
