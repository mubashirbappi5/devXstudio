"use client";

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type {
  CalculationInput,
  CalculationResult,
  ServiceItem,
  AdditionalFeature,
} from "@/lib/calculator/types";

interface CalculatorSummaryProps {
  calculation: CalculationInput;
  estimate: CalculationResult;
  services: ServiceItem[];
  features: AdditionalFeature[];
  currentStep: number;
}

export function CalculatorSummary({
  calculation,
  estimate,
  services,
  features,
  currentStep,
}: CalculatorSummaryProps) {
  const currentService = services.find((s) => s.id === calculation.serviceId);
  const selectedFeatureObjects = features.filter((f) =>
    calculation.selectedFeatures.includes(f.id)
  );

  const designLabels: Record<string, string> = {
    "template-based": "Template-Based",
    "custom-design": "Custom Design",
    "premium-ui-ux": "Premium UI/UX",
  };

  const platformLabels: Record<string, string> = {
    "wix-studio": "Wix Studio",
    "wix-editor": "Wix Editor",
    "not-sure": "Recommend Best",
  };

  return (
    <aside className="calc-sidebar" aria-label="Live Project Estimate Summary">
      <div className="sidebar-title">
        <span>Live Estimate (Step {currentStep}/7)</span>
        <span
          style={{
            fontSize: "11px",
            background: "#edf7f0",
            color: "#166534",
            padding: "3px 8px",
            borderRadius: "6px",
            fontWeight: 700,
          }}
        >
          USD ($)
        </span>
      </div>

      <div className="sidebar-estimate-hero">
        <small>Estimated Price Range</small>
        <div className="sidebar-estimate-price">
          ${estimate.estimatedMin.toLocaleString()} – ${estimate.estimatedMax.toLocaleString()}
        </div>
        <p className="sidebar-estimate-disclaimer">
          Real-time dynamic estimate based on selected scope.
        </p>
      </div>

      {estimate.isCustomQuoteRequired && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "11.5px",
            color: "#92400e",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "16px",
            lineHeight: 1.4,
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>
            Advanced modules selected require dedicated technical review for final pricing.
          </span>
        </div>
      )}

      <ul className="sidebar-summary-list">
        <li>
          <span>Service</span>
          <span>{currentService?.name || "Selected Service"}</span>
        </li>
        {calculation.serviceId !== "mobile-app" && calculation.platform && (
          <li>
            <span>Platform</span>
            <span>{platformLabels[calculation.platform] || calculation.platform}</span>
          </li>
        )}
        <li>
          <span>Pages / Screens</span>
          <span>{calculation.pageCount} Pages</span>
        </li>
        <li>
          <span>Design Standard</span>
          <span>{designLabels[calculation.designPreference] || "Custom"}</span>
        </li>
        <li>
          <span>Complexity</span>
          <span style={{ textTransform: "capitalize" }}>{calculation.projectComplexity}</span>
        </li>
        <li>
          <span>Timeline</span>
          <span>{calculation.timeline.replace(/-/g, " ")}</span>
        </li>
      </ul>

      {selectedFeatureObjects.length > 0 && (
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            Selected Modules ({selectedFeatureObjects.length})
          </div>
          <div className="sidebar-features-tags">
            {selectedFeatureObjects.map((f) => (
              <span key={f.id} className="sidebar-feature-tag">
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          borderTop: "1px dashed #e5e7eb",
          paddingTop: "14px",
          marginTop: "14px",
          fontSize: "11.5px",
          color: "#6b7280",
          lineHeight: 1.5,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#166534", fontWeight: 600, marginBottom: "4px" }}>
          <CheckCircle2 size={13} /> Official Wix Partner Agency
        </div>
        No hidden fees. Full ownership transferred on delivery.
      </div>
    </aside>
  );
}
