import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getText = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

const boolText = (formData: FormData, name: string) =>
  formData.get(name) === "on" ? "Yes" : "No";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatRows = (rows: Array<[string, string]>) =>
  rows
    .map(
      ([label, value]) =>
        `<tr><th style="text-align:left;padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f8fafc;">${escapeHtml(
          label,
        )}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(
          value || "-",
        )}</td></tr>`,
    )
    .join("");

export async function POST(request: Request) {
  const formData = await request.formData();

  if (getText(formData, "_honey")) {
    return NextResponse.json({ ok: true });
  }

  const email = getText(formData, "Email");
  const companyName = getText(formData, "Company name");
  const phoneCode = getText(formData, "Phone code");
  const phoneNumber = getText(formData, "Phone number");
  const origin = getText(formData, "Origin");
  const destination = getText(formData, "Destination");
  const serviceNeeded = getText(formData, "Service needed");
  const customs = getText(formData, "Customs handling");
  const incoterms = getText(formData, "Incoterms");
  const loadType = getText(formData, "Load type");
  const containerType = getText(formData, "Container type");
  const containerQuantity = getText(formData, "Container quantity");
  const totalWeight = getText(formData, "Total weight");
  const dimensions = getText(formData, "Dimensions");
  const notes = getText(formData, "Notes");
  const dangerousGoods = boolText(formData, "Dangerous goods");
  const declareMsdsLater = boolText(formData, "Declare MSDS later");

  const missing: string[] = [];
  if (!email || !email.includes("@")) missing.push("Email");
  if (!serviceNeeded) missing.push("Service needed");
  if (!origin) missing.push("Origin");
  if (!destination) missing.push("Destination");
  if (!customs) missing.push("Customs handling");
  if (!incoterms) missing.push("Incoterms");
  if (!loadType) missing.push("Load type");
  if (!totalWeight) missing.push("Total weight");
  if (loadType === "FCL" && !containerType) missing.push("Container type");
  if (loadType === "FCL" && !containerQuantity) {
    missing.push("Container quantity");
  }
  if (loadType === "LCL" && !dimensions) missing.push("Dimensions");

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const to = process.env.QUOTE_TO_EMAIL || "oguzhan@usederya.com";
  const from = process.env.QUOTE_FROM_EMAIL || smtpUser;
  const cc = process.env.QUOTE_CC_EMAIL;

  if (!smtpUser || !smtpPass || !from) {
    return NextResponse.json(
      { error: "Quote email service is not configured." },
      { status: 500 },
    );
  }

  const msds = formData.get("MSDS attachment");
  const attachments =
    msds instanceof File && msds.size > 0
      ? [
          {
            filename: msds.name || "msds-attachment",
            content: Buffer.from(await msds.arrayBuffer()),
            contentType: msds.type || undefined,
          },
        ]
      : [];

  const rows: Array<[string, string]> = [
    ["Email", email],
    ["Company name", companyName],
    ["Phone", phoneNumber ? `${phoneCode} ${phoneNumber}`.trim() : ""],
    ["Service needed", serviceNeeded],
    ["Origin", origin],
    ["Destination", destination],
    ["Customs handling", customs],
    ["Incoterms", incoterms],
    ["Load type", loadType],
    ["Container type", loadType === "FCL" ? containerType : ""],
    ["Container quantity", loadType === "FCL" ? containerQuantity : ""],
    ["Total weight", totalWeight],
    ["Dimensions", loadType === "LCL" ? dimensions : ""],
    ["Dangerous goods", dangerousGoods],
    ["Declare MSDS later", declareMsdsLater],
    ["Notes", notes],
  ];

  const subject = `New shipment inquiry - Derya: ${origin} to ${destination}`;
  const text = rows
    .map(([label, value]) => `${label}: ${value || "-"}`)
    .join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0f172a;">
      <h2 style="margin:0 0 16px;">New shipment inquiry - Derya</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
        ${formatRows(rows)}
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    cc,
    replyTo: email,
    subject,
    text,
    html,
    attachments,
  });

  return NextResponse.json({ ok: true });
}
