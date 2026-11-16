"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import type { AdditionalFeature } from "@/lib/calculator/types";

interface StepFeaturesProps {
  features: AdditionalFeature[];
  selectedFeatures: string[];
  onToggleFeature: (featureId: string) => void;
}

export function StepFeatures({
  features,
  selectedFeatures,
  onToggleFeature,
}: StepFeaturesProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Features" },
    { id: "functionality", label: "Functionality" },
    { id: "integration", label: "Integrations & APIs" },
    { id: "advanced", label: "Advanced Code & Motion" },
  ];

  const filteredFeatures =
    filterCategory === "all"
      ? features
      : features.filter((f) => f.category === filterCategory);

  return (
    <div className="calc-step-container">
      <div className="calc-step-header">
        <h2>Features & Integrations</h2>
        <p>Select all additional tools, modules, and integrations required for your build.</p>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              border:
                filterCategory === cat.id
                  ? "1px solid #166534"
                  : "1px solid #e2ece5",
              background: filterCategory === cat.id ? "#166534" : "#ffffff",
              color: filterCategory === cat.id ? "#ffffff" : "#4b5563",
            }}
            onClick={() => setFilterCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        {filteredFeatures.map((feat) => {
          const isSelected = selectedFeatures.includes(feat.id);
          const isCustom = feat.requiresCustomQuote || feat.pricingType === "custom_quote";

          return (
            <div
              key={feat.id}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              className={`feature-toggle-card ${isSelected ? "selected" : ""}`}
              onClick={() => onToggleFeature(feat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleFeature(feat.id);
                }
              }}
            >
              <div className="feature-checkbox" aria-hidden="true">
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>

              <div className="feature-info">
                <div className="feature-title-row">
                  <strong>{feat.name}</strong>
                  {isCustom ? (
                    <span className="feature-custom-badge">Custom Quote</span>
                  ) : (
                    <span className="feature-price-badge">+${feat.price}</span>
                  )}
                </div>
                <p>{feat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
