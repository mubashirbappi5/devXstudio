"use client";

import React from "react";
import { Check, FileText, FileCheck, FileQuestion } from "lucide-react";
import type { ContentReadiness, PageCountOption } from "@/lib/calculator/types";

interface StepPagesProps {
  pageCount: PageCountOption;
  contentReadiness: ContentReadiness;
  onPageCountChange: (count: PageCountOption) => void;
  onContentReadinessChange: (readiness: ContentReadiness) => void;
}

const pageOptions: {
  id: PageCountOption;
  label: string;
  scope: string;
}[] = [
  { id: "1-5", label: "1 – 5 Pages", scope: "Single landing page or compact brochure website" },
  { id: "6-10", label: "6 – 10 Pages", scope: "Standard business site with services & case studies" },
  { id: "11-20", label: "11 – 20 Pages", scope: "Growing business, detailed offerings & resource library" },
  { id: "21-30", label: "21 – 30 Pages", scope: "Large multi-department or catalog website" },
  { id: "30+", label: "30+ Pages", scope: "Enterprise portal with extensive architecture & collections" },
];

const contentOptions: {
  id: ContentReadiness;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  {
    id: "ready",
    title: "All Content is Ready",
    desc: "Text copy, images, and structure are prepared and ready for upload.",
    icon: FileCheck,
  },
  {
    id: "partial",
    title: "Some Content is Ready",
    desc: "Draft copy or outline available; needs refining and final structuring.",
    icon: FileText,
  },
  {
    id: "need-help",
    title: "Need Content Help",
    desc: "Require copywriting assistance, content planning, and asset sourcing.",
    icon: FileQuestion,
  },
];

export function StepPages({
  pageCount,
  contentReadiness,
  onPageCountChange,
  onContentReadinessChange,
}: StepPagesProps) {
  return (
    <div className="calc-step-container">
      <div className="calc-step-header">
        <h2>Website Size & Content Readiness</h2>
        <p>Estimate the number of pages and your copy preparation level.</p>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: "0 0 12px" }}>
          How many pages or screens does your project require?
        </h4>
        <div className="options-grid" role="radiogroup" aria-label="Page Count Selection">
          {pageOptions.map((opt) => {
            const isSelected = pageCount === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`option-select-btn ${isSelected ? "selected" : ""}`}
                onClick={() => onPageCountChange(opt.id)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <strong style={{ fontSize: "15px" }}>{opt.label}</strong>
                  <div className="service-check-indicator" aria-hidden="true">
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <span>{opt.scope}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: "0 0 12px" }}>
          Do you already have website content and copy?
        </h4>
        <div className="options-grid" role="radiogroup" aria-label="Content Readiness">
          {contentOptions.map((opt) => {
            const isSelected = contentReadiness === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`option-select-btn ${isSelected ? "selected" : ""}`}
                onClick={() => onContentReadinessChange(opt.id)}
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
                    <Icon size={16} />
                    <strong style={{ fontSize: "14px", color: isSelected ? "#07291b" : "#1e293b" }}>
                      {opt.title}
                    </strong>
                  </div>
                  <div className="service-check-indicator" aria-hidden="true">
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <span>{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
