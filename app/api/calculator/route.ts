import { NextResponse } from "next/server";
import { calculateProjectEstimate } from "@/lib/calculator/pricing-engine";
import { getCalculatorConfig, saveLead } from "@/lib/calculator/storage";
import type { CalculationInput, CalculatorLead } from "@/lib/calculator/types";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET() {
  try {
    const { services, features } = await getCalculatorConfig();
    return NextResponse.json({
      services: services.filter((s) => s.isActive),
      features: features.filter((f) => f.isActive),
    });
  } catch (error) {
    console.error("Failed to load calculator configuration:", error);
    return NextResponse.json(
      { error: "Failed to load calculator services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lead: leadInput, calculation } = body as {
      lead: {
        fullName: string;
        email: string;
        country: string;
        companyName?: string;
        phone?: string;
        websiteUrl?: string;
        additionalDetails?: string;
        ctaType: "detailed-quote" | "free-consultation";
      };
      calculation: CalculationInput;
    };

    if (!leadInput || !leadInput.fullName || !leadInput.email || !leadInput.country) {
      return NextResponse.json(
        { error: "Full name, email address, and country are required." },
        { status: 400 }
      );
    }

    if (!calculation || !calculation.serviceId) {
      return NextResponse.json(
        { error: "Invalid calculation selection." },
        { status: 400 }
      );
    }

    // 1. Calculate estimate securely on the server
    const { services, features, settings } = await getCalculatorConfig();
    const estimate = calculateProjectEstimate(
      calculation,
      services,
      features,
      settings
    );

    const featureNames = calculation.selectedFeatures
      .map((id) => features.find((f) => f.id === id)?.name)
      .filter(Boolean) as string[];

    // 2. Prepare Lead Record
    const leadRecord: CalculatorLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: leadInput.fullName.trim(),
      email: leadInput.email.trim(),
      country: leadInput.country.trim(),
      companyName: leadInput.companyName?.trim() || undefined,
      phone: leadInput.phone?.trim() || undefined,
      websiteUrl: leadInput.websiteUrl?.trim() || undefined,
      additionalDetails: leadInput.additionalDetails?.trim() || undefined,
      ctaType: leadInput.ctaType || "detailed-quote",
      serviceId: calculation.serviceId,
      serviceName: estimate.serviceName,
      selectedPlatform: calculation.platform,
      pageCount: calculation.pageCount,
      contentReadiness: calculation.contentReadiness,
      designPreference: calculation.designPreference,
      referenceUrls: calculation.referenceUrls,
      hasBrandGuidelines: calculation.hasBrandGuidelines,
      hasLogoAssets: calculation.hasLogoAssets,
      selectedFeatures: calculation.selectedFeatures,
      selectedFeatureNames: featureNames,
      projectComplexity: calculation.projectComplexity,
      timeline: calculation.timeline,
      estimatedMin: estimate.estimatedMin,
      estimatedMax: estimate.estimatedMax,
      isCustomQuoteRequired: estimate.isCustomQuoteRequired,
      currency: estimate.currency,
      pricingBreakdown: estimate.breakdown,
      status: "New",
      internalNotes: "",
      createdAt: new Date().toISOString(),
    };

    // 3. Save Lead in persistent storage
    await saveLead(leadRecord);

    // 4. Send Email Notification via Resend (if configured)
    if (RESEND_API_KEY) {
      const recipientEmail =
        process.env.CONTACT_RECEIVER_EMAIL || "smt.tools24@gmail.com";

      const costDisplay = estimate.isCustomQuoteRequired
        ? `$${estimate.estimatedMin.toLocaleString()} – $${estimate.estimatedMax.toLocaleString()} (Custom Quote Required)`
        : `$${estimate.estimatedMin.toLocaleString()} – $${estimate.estimatedMax.toLocaleString()}`;

      const breakdownRows = estimate.breakdown
        .map(
          (b) => `<tr>
            <td style="padding: 6px 12px; border-bottom: 1px solid #eee;">${escapeHtml(b.label)}</td>
            <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: right;">
              ${b.isCustomQuote ? "Custom Quote" : `$${b.amountMin} – $${b.amountMax}`}
            </td>
          </tr>`
        )
        .join("");

      const agencyEmailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #073321; margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">
            New Calculator Lead: ${escapeHtml(leadRecord.fullName)}
          </h2>
          <div style="background: #edf7f0; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #166534;">
              Estimated Budget: ${costDisplay}
            </p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #374151;">
              Request Type: ${leadRecord.ctaType === "free-consultation" ? "Free Consultation" : "Detailed Project Quotation"}
            </p>
          </div>
          <h3 style="margin-top: 20px; font-size: 15px; text-transform: uppercase; color: #6b7280;">Client Information</h3>
          <p style="margin: 6px 0;"><strong>Name:</strong> ${escapeHtml(leadRecord.fullName)}</p>
          <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(leadRecord.email)}">${escapeHtml(leadRecord.email)}</a></p>
          <p style="margin: 6px 0;"><strong>Country:</strong> ${escapeHtml(leadRecord.country)}</p>
          ${leadRecord.companyName ? `<p style="margin: 6px 0;"><strong>Company:</strong> ${escapeHtml(leadRecord.companyName)}</p>` : ""}
          ${leadRecord.phone ? `<p style="margin: 6px 0;"><strong>Phone:</strong> ${escapeHtml(leadRecord.phone)}</p>` : ""}
          ${leadRecord.websiteUrl ? `<p style="margin: 6px 0;"><strong>Website:</strong> <a href="${escapeHtml(leadRecord.websiteUrl)}">${escapeHtml(leadRecord.websiteUrl)}</a></p>` : ""}
          ${leadRecord.additionalDetails ? `<p style="margin: 12px 0 6px;"><strong>Additional Details:</strong></p><div style="background: #f9fafb; padding: 12px; border-radius: 4px;">${escapeHtml(leadRecord.additionalDetails)}</div>` : ""}

          <h3 style="margin-top: 24px; font-size: 15px; text-transform: uppercase; color: #6b7280;">Project Requirements</h3>
          <p style="margin: 6px 0;"><strong>Service:</strong> ${escapeHtml(leadRecord.serviceName)}</p>
          <p style="margin: 6px 0;"><strong>Platform:</strong> ${leadRecord.selectedPlatform || "N/A"}</p>
          <p style="margin: 6px 0;"><strong>Page Scope:</strong> ${leadRecord.pageCount} Pages</p>
          <p style="margin: 6px 0;"><strong>Design Level:</strong> ${leadRecord.designPreference}</p>
          <p style="margin: 6px 0;"><strong>Complexity:</strong> ${leadRecord.projectComplexity}</p>
          <p style="margin: 6px 0;"><strong>Timeline:</strong> ${leadRecord.timeline}</p>
          <p style="margin: 6px 0;"><strong>Selected Features:</strong> ${featureNames.length ? featureNames.join(", ") : "None"}</p>

          <h3 style="margin-top: 24px; font-size: 15px; text-transform: uppercase; color: #6b7280;">Pricing Breakdown</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background: #f3f4f6; text-align: left;">
                <th style="padding: 8px 12px;">Component</th>
                <th style="padding: 8px 12px; text-align: right;">Est. Range (USD)</th>
              </tr>
            </thead>
            <tbody>
              ${breakdownRows}
            </tbody>
          </table>
          <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px;">
            Generated by DevXStudio Website Cost Calculator (https://devxstudio.agency/website-cost-calculator)
          </p>
        </div>
      `;

      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DevX Calculator <onboarding@resend.dev>",
          to: [recipientEmail],
          reply_to: leadRecord.email,
          subject: `🎯 New Calculator Lead: ${leadRecord.fullName} (${costDisplay})`,
          html: agencyEmailHtml,
        }),
      }).catch((err) => console.error("Resend notification error:", err));
    }

    return NextResponse.json({
      success: true,
      leadId: leadRecord.id,
      estimate,
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit calculator lead." },
      { status: 500 }
    );
  }
}
