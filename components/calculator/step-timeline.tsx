"use client";

import React from "react";
import { Check, Clock, Zap, ShieldCheck, Flame } from "lucide-react";
import type { ProjectComplexity, ProjectTimeline } from "@/lib/calculator/types";

interface StepTimelineProps {
  projectComplexity: ProjectComplexity;
  timeline: ProjectTimeline;
  onComplexityChange: (complexity: ProjectComplexity) => void;
  onTimelineChange: (timeline: ProjectTimeline) => void;
}

const complexityOptions: {
  id: ProjectComplexity;
  title: string;
  badge?: string;
  desc: string;
}[] = [
  {
    id: "basic",
    title: "Basic / Standard",
    desc: "Standard layouts, standard Wix elements, straightforward informational flow.",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    badge: "Most Common",
    desc: "Dynamic CMS databases, customized forms, responsive styling, and basic app connections.",
  },
  {
    id: "advanced",
    title: "Advanced",
    badge: "Velo / Multi-App",
    desc: "Custom JavaScript logic, deep Wix app configurations, conditional displays, and API calls.",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    badge: "Custom Quote",
    desc: "Multi-system synchronization, large volume datasets, custom backend, and high security standards.",
  },
];

const timelineOptions: {
  id: ProjectTimeline;
  title: string;
  rate: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  {
    id: "urgent-1-week",
    title: "Urgent (1 Week)",
    rate: "+25% Rush Fee",
    desc: "Dedicated senior sprint team prioritized around the clock.",
    icon: Flame,
  },
  {
    id: "urgent-2-weeks",
    title: "Fast Track (2 Weeks)",
    rate: "+15% Expedited",
    desc: "Accelerated timeline with daily reviews and focused development.",
    icon: Zap,
  },
  {
    id: "standard-1-month",
    title: "Standard (3 – 4 Weeks)",
    rate: "Standard Rate",
    desc: "Optimal balance of design iteration, development, and QA testing.",
    icon: Clock,
  },
  {
    id: "flexible",
    title: "Flexible / Phased",
    rate: "Standard Rate",
    desc: "Iterative roll-out or relaxed development schedule according to your plan.",
    icon: ShieldCheck,
  },
];

export function StepTimeline({
  projectComplexity,
  timeline,
  onComplexityChange,
  onTimelineChange,
}: StepTimelineProps) {
  return (
    <div className="calc-step-container">
      <div className="calc-step-header">
        <h2>Project Complexity & Timeline</h2>
        <p>Define the engineering complexity level and target launch date.</p>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: "0 0 12px" }}>
          Technical Complexity Tier
        </h4>
        <div className="options-grid" role="radiogroup" aria-label="Complexity Level">
          {complexityOptions.map((opt) => {
            const isSelected = projectComplexity === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`option-select-btn ${isSelected ? "selected" : ""}`}
                onClick={() => onComplexityChange(opt.id)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <strong style={{ fontSize: "14.5px" }}>{opt.title}</strong>
                  <div className="service-check-indicator" aria-hidden="true">
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                {opt.badge && (
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#166534",
                      background: "#dcfce7",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      marginBottom: "6px",
                      width: "fit-content",
                    }}
                  >
                    {opt.badge}
                  </span>
                )}
                <span>{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: "0 0 12px" }}>
          Target Launch Schedule
        </h4>
        <div className="options-grid" role="radiogroup" aria-label="Timeline Selection">
          {timelineOptions.map((opt) => {
            const isSelected = timeline === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`option-select-btn ${isSelected ? "selected" : ""}`}
                onClick={() => onTimelineChange(opt.id)}
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
                    <Icon size={17} />
                    <strong style={{ fontSize: "14px" }}>{opt.title}</strong>
                  </div>
                  <div className="service-check-indicator" aria-hidden="true">
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: isSelected ? "#15803d" : "#475569",
                    marginBottom: "4px",
                  }}
                >
                  {opt.rate}
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
