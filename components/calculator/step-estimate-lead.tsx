"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Loader2,
} from "lucide-react";
import type {
  CalculationInput,
  CalculationResult,
} from "@/lib/calculator/types";

interface StepEstimateLeadProps {
  calculation: CalculationInput;
  estimate: CalculationResult;
  selectedServiceName: string;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  submittedLeadId?: string;
  onSubmitLead: (
    leadData: {
      fullName: string;
      email: string;
      country: string;
      companyName?: string;
      phone?: string;
      websiteUrl?: string;
      additionalDetails?: string;
      ctaType: "detailed-quote" | "free-consultation";
    }
  ) => void;
  onReset: () => void;
}

export function StepEstimateLead({
  calculation,
  estimate,
  selectedServiceName,
  isSubmitting,
  submitError,
  submitSuccess,
  submittedLeadId,
  onSubmitLead,
  onReset,
}: StepEstimateLeadProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState(calculation.existingWebsiteUrl || "");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (ctaType: "detailed-quote" | "free-consultation") => {
    setValidationError(null);

    if (!fullName.trim()) {
      setValidationError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (!country.trim()) {
      setValidationError("Please enter your country.");
      return;
    }

    onSubmitLead({
      fullName: fullName.trim(),
      email: email.trim(),
      country: country.trim(),
      companyName: companyName.trim() || undefined,
      phone: phone.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      additionalDetails: additionalDetails.trim() || undefined,
      ctaType,
    });
  };

  if (submitSuccess) {
    return (
      <div className="calc-success-card">
        <div className="calc-success-icon">
          <CheckCircle2 size={36} />
        </div>
        <h2>Project Estimate Request Received!</h2>
        <p>
          Thank you, <strong>{fullName || "valued client"}</strong>. Our senior Wix Studio architects are reviewing your specifications and will prepare a tailored proposal within 24 business hours.
        </p>
        {submittedLeadId && (
          <div className="calc-reference-box">
            Project Reference ID: <strong>{submittedLeadId}</strong>
          </div>
        )}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "540px",
            margin: "0 auto 28px",
            textAlign: "left",
            fontSize: "13.5px",
            color: "#166534",
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "6px" }}>What happens next?</div>
          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            <li>We verify technical feasibility and app integrations.</li>
            <li>We prepare a detailed scope document with fixed milestones.</li>
            <li>A confirmation email has been routed to our development team.</li>
          </ul>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-cta-primary"
            style={{ width: "auto", padding: "12px 24px" }}
            onClick={onReset}
          >
            Calculate Another Project
          </button>
          <a
            href="mailto:contact@devxstudio.agency"
            className="btn-cta-secondary"
            style={{ width: "auto", padding: "12px 24px", textDecoration: "none" }}
          >
            Email Us Directly
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="calc-step-container">
      {/* Estimated Price Banner */}
      <div className="results-card-banner">
        <span className="results-banner-label">Your Estimated Website Development Cost</span>
        <div className="results-price-range">
          ${estimate.estimatedMin.toLocaleString()} – ${estimate.estimatedMax.toLocaleString()}
          <span style={{ fontSize: "16px", fontWeight: 500, color: "#a7f3d0", marginLeft: "6px" }}>
            USD
          </span>
        </div>
        <div style={{ fontSize: "14px", color: "#d1fae5", fontWeight: 500 }}>
          Based on your selected project requirements
        </div>

        {estimate.isCustomQuoteRequired && (
          <div className="results-custom-note">
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, marginBottom: "4px" }}>
              <AlertCircle size={16} /> Custom Quote Required for Selected Modules
            </div>
            <div>
              {estimate.customQuoteReasons.length > 0
                ? estimate.customQuoteReasons.join(" • ")
                : "Advanced integrations require specific architectural review."}
            </div>
          </div>
        )}

        <p className="results-disclaimer">
          This is an estimated project budget based on internal base rates, not a final binding quotation. Final pricing may vary depending on project scope, custom logic, animations, and asset readiness.
        </p>
      </div>

      {/* Scope Breakdown Summary */}
      <div
        style={{
          background: "#ffffff",
          border: "1.5px solid #e2ece5",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "28px",
        }}
      >
        <h3 style={{ fontSize: "16px", color: "#07291b", margin: "0 0 16px" }}>
          Project Scope Summary
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          <div style={{ background: "#f8faf9", padding: "10px 14px", borderRadius: "8px" }}>
            <span style={{ color: "#64748b", display: "block", fontSize: "11px", textTransform: "uppercase" }}>
              Service
            </span>
            <strong style={{ color: "#07291b" }}>{selectedServiceName}</strong>
          </div>
          {calculation.platform && (
            <div style={{ background: "#f8faf9", padding: "10px 14px", borderRadius: "8px" }}>
              <span style={{ color: "#64748b", display: "block", fontSize: "11px", textTransform: "uppercase" }}>
                Platform
              </span>
              <strong style={{ color: "#07291b" }}>
                {calculation.platform === "wix-studio"
                  ? "Wix Studio"
                  : calculation.platform === "wix-editor"
                  ? "Wix Editor"
                  : "Platform Recommendation"}
              </strong>
            </div>
          )}
          <div style={{ background: "#f8faf9", padding: "10px 14px", borderRadius: "8px" }}>
            <span style={{ color: "#64748b", display: "block", fontSize: "11px", textTransform: "uppercase" }}>
              Scope & Size
            </span>
            <strong style={{ color: "#07291b" }}>{calculation.pageCount} Pages</strong>
          </div>
          <div style={{ background: "#f8faf9", padding: "10px 14px", borderRadius: "8px" }}>
            <span style={{ color: "#64748b", display: "block", fontSize: "11px", textTransform: "uppercase" }}>
              Design Level
            </span>
            <strong style={{ color: "#07291b" }}>
              {calculation.designPreference === "premium-ui-ux"
                ? "Premium UI/UX Design"
                : calculation.designPreference === "custom-design"
                ? "Custom Bespoke Design"
                : "Template-Based Layout"}
            </strong>
          </div>
          <div style={{ background: "#f8faf9", padding: "10px 14px", borderRadius: "8px" }}>
            <span style={{ color: "#64748b", display: "block", fontSize: "11px", textTransform: "uppercase" }}>
              Complexity
            </span>
            <strong style={{ color: "#07291b", textTransform: "capitalize" }}>
              {calculation.projectComplexity}
            </strong>
          </div>
          <div style={{ background: "#f8faf9", padding: "10px 14px", borderRadius: "8px" }}>
            <span style={{ color: "#64748b", display: "block", fontSize: "11px", textTransform: "uppercase" }}>
              Timeline
            </span>
            <strong style={{ color: "#07291b" }}>
              {calculation.timeline.replace(/-/g, " ")}
            </strong>
          </div>
        </div>

        {/* Pricing Component Breakdown */}
        <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "#374151", margin: "0 0 10px" }}>
          Calculation Breakdown (USD)
        </h4>
        <div style={{ border: "1px solid #edf2ee", borderRadius: "10px", overflow: "hidden" }}>
          {estimate.breakdown.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderBottom: idx === estimate.breakdown.length - 1 ? "none" : "1px solid #f1f5f9",
                background: idx % 2 === 0 ? "#ffffff" : "#fbfdfc",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "#374151" }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: "#07291b" }}>
                {item.isCustomQuote
                  ? "Custom Quote"
                  : `$${item.amountMin.toLocaleString()} – $${item.amountMax.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Generation Form */}
      <div className="lead-form-box">
        <h3>Lock in Your Estimate & Receive a Tailored Proposal</h3>
        <p>
          Submit your contact details below to receive an itemized proposal breakdown, milestone schedule, and project consultation from DevXStudio.
        </p>

        {validationError && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {validationError}
          </div>
        )}

        {submitError && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {submitError}
          </div>
        )}

        <div className="calc-form-grid-2">
          <div className="calc-form-group">
            <label htmlFor="fullName">
              Full Name <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="fullName"
              type="text"
              className="calc-input"
              placeholder="e.g. Alexander Wright"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="calc-form-group">
            <label htmlFor="email">
              Work / Business Email <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              className="calc-input"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="calc-form-grid-2">
          <div className="calc-form-group">
            <label htmlFor="country">
              Country / Location <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="country"
              type="text"
              className="calc-input"
              placeholder="e.g. United States, United Kingdom, Canada"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="calc-form-group">
            <label htmlFor="companyName">Company / Organization (optional)</label>
            <input
              id="companyName"
              type="text"
              className="calc-input"
              placeholder="Company or Brand Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="calc-form-grid-2">
          <div className="calc-form-group">
            <label htmlFor="phone">Phone / WhatsApp (optional)</label>
            <input
              id="phone"
              type="tel"
              className="calc-input"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="calc-form-group">
            <label htmlFor="leadWebsiteUrl">Current Website URL (optional)</label>
            <input
              id="leadWebsiteUrl"
              type="url"
              className="calc-input"
              placeholder="https://..."
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="calc-form-group">
          <label htmlFor="additionalDetails">Additional Project Notes / Special Requests (optional)</label>
          <textarea
            id="additionalDetails"
            className="calc-input"
            rows={3}
            placeholder="Tell us any specific requirements, third-party software to connect, or preferred inspirations..."
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            disabled={isSubmitting}
            style={{ resize: "vertical" }}
          />
        </div>

        {/* 2 CTA Buttons */}
        <div className="lead-cta-buttons">
          <button
            type="button"
            className="btn-cta-primary"
            onClick={() => handleSubmit("detailed-quote")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting Request...
              </>
            ) : (
              <>
                <FileCheck2 size={18} /> Request a Detailed Quote <ArrowRight size={16} />
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-cta-secondary"
            onClick={() => handleSubmit("free-consultation")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting Request...
              </>
            ) : (
              <>
                <Calendar size={18} /> Book a Free Consultation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
