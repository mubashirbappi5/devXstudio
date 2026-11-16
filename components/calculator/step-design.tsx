"use client";

import React from "react";
import { Check, LayoutGrid, Paintbrush, Wand2 } from "lucide-react";
import type { DesignPreference } from "@/lib/calculator/types";

interface StepDesignProps {
  designPreference: DesignPreference;
  existingWebsiteUrl?: string;
  referenceUrls?: string;
  hasBrandGuidelines?: boolean;
  hasLogoAssets?: boolean;
  onDesignPreferenceChange: (pref: DesignPreference) => void;
  onExistingWebsiteChange: (url: string) => void;
  onReferenceUrlsChange: (urls: string) => void;
  onBrandGuidelinesToggle: (val: boolean) => void;
  onLogoAssetsToggle: (val: boolean) => void;
}

const designTiers: {
  id: DesignPreference;
  title: string;
  badge?: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  {
    id: "template-based",
    title: "Template-Based Layout",
    desc: "Clean setup adapted from modern Wix templates with your branding and content.",
    icon: LayoutGrid,
  },
  {
    id: "custom-design",
    title: "Professional Custom Design",
    badge: "Most Popular",
    desc: "Tailored wireframes and UI designed specifically for your brand identity and goals.",
    icon: Paintbrush,
  },
  {
    id: "premium-ui-ux",
    title: "Premium UI/UX & Motion",
    badge: "Bespoke",
    desc: "Signature custom design, micro-interactions, custom animations, and responsive perfection.",
    icon: Wand2,
  },
];

export function StepDesign({
  designPreference,
  existingWebsiteUrl = "",
  referenceUrls = "",
  hasBrandGuidelines = false,
  hasLogoAssets = false,
  onDesignPreferenceChange,
  onExistingWebsiteChange,
  onReferenceUrlsChange,
  onBrandGuidelinesToggle,
  onLogoAssetsToggle,
}: StepDesignProps) {
  return (
    <div className="calc-step-container">
      <div className="calc-step-header">
        <h2>Design Complexity & Brand Assets</h2>
        <p>Select your desired design standard and provide existing references.</p>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: "0 0 12px" }}>
          What level of visual design and customization do you need?
        </h4>
        <div className="options-grid" role="radiogroup" aria-label="Design Preference">
          {designTiers.map((tier) => {
            const isSelected = designPreference === tier.id;
            const Icon = tier.icon;
            return (
              <button
                key={tier.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`option-select-btn ${isSelected ? "selected" : ""}`}
                onClick={() => onDesignPreferenceChange(tier.id)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: isSelected ? "#166534" : "#64748b" }}>
                    <Icon size={18} />
                    {tier.badge && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          background: "#dcfce7",
                          color: "#166534",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <div className="service-check-indicator" aria-hidden="true">
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <strong>{tier.title}</strong>
                <span>{tier.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="calc-form-grid-2">
        <div className="calc-form-group">
          <label htmlFor="existingWebsite">Existing Website (optional)</label>
          <input
            id="existingWebsite"
            type="url"
            className="calc-input"
            placeholder="https://example.com"
            value={existingWebsiteUrl}
            onChange={(e) => onExistingWebsiteChange(e.target.value)}
          />
        </div>
        <div className="calc-form-group">
          <label htmlFor="referenceUrls">Reference / Inspiration Websites (optional)</label>
          <input
            id="referenceUrls"
            type="text"
            className="calc-input"
            placeholder="Links to websites whose look & feel you love"
            value={referenceUrls}
            onChange={(e) => onReferenceUrlsChange(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: "12px", borderTop: "1px dashed #e2ece5", paddingTop: "16px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: "0 0 10px" }}>
          Brand Assets Readiness
        </h4>
        <label className="calc-checkbox-label">
          <input
            type="checkbox"
            checked={hasBrandGuidelines}
            onChange={(e) => onBrandGuidelinesToggle(e.target.checked)}
          />
          <span>I already have a brand style guide (colors, typography, fonts)</span>
        </label>
        <label className="calc-checkbox-label">
          <input
            type="checkbox"
            checked={hasLogoAssets}
            onChange={(e) => onLogoAssetsToggle(e.target.checked)}
          />
          <span>I already have high-resolution logo files (SVG, vector, PNG)</span>
        </label>
      </div>
    </div>
  );
}
