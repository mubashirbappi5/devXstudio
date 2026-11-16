"use client";

import React from "react";
import { Check, Layers, Layout, HelpCircle, Smartphone } from "lucide-react";
import type { PlatformOption, ServiceId } from "@/lib/calculator/types";

interface StepPlatformProps {
  serviceId: ServiceId;
  selectedPlatform: PlatformOption;
  onSelect: (platform: PlatformOption) => void;
}

export function StepPlatform({
  serviceId,
  selectedPlatform,
  onSelect,
}: StepPlatformProps) {
  const isMobileApp = serviceId === "mobile-app";

  if (isMobileApp) {
    return (
      <div className="calc-step-container">
        <div className="calc-step-header">
          <h2>Mobile App Platform</h2>
          <p>Native mobile application connected directly with Wix ecosystem.</p>
        </div>
        <div
          style={{
            background: "#f0fdf4",
            border: "1.5px solid #86efac",
            borderRadius: "14px",
            padding: "24px",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "#166534",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Smartphone size={22} />
          </div>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#07291b" }}>
              Wix Branded Mobile App Architecture
            </h3>
            <p style={{ margin: 0, fontSize: "13.5px", color: "#374151", lineHeight: 1.5 }}>
              Your mobile app will be built using Wix Branded App technology, synchronized seamlessly with your Wix store, bookings, CMS, and members database. You can proceed directly to scoping page screens and features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const platforms: {
    id: PlatformOption;
    title: string;
    badge?: string;
    description: string;
    icon: React.ComponentType<{ size?: number }>;
  }[] = [
    {
      id: "wix-studio",
      title: "Wix Studio",
      badge: "Recommended",
      description:
        "The modern agency platform with fluid responsiveness, full CSS control, custom breakpoints, and bespoke animations.",
      icon: Layers,
    },
    {
      id: "wix-editor",
      title: "Wix Editor",
      description:
        "Classic pixel-precision drag-and-drop editor ideal for straightforward business sites and rapid deployment.",
      icon: Layout,
    },
    {
      id: "not-sure",
      title: "Not Sure – Recommend for Me",
      description:
        "Our senior technical team will assess your design goals, animations, and integrations to select the best platform.",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="calc-step-container">
      <div className="calc-step-header">
        <h2>Website Platform</h2>
        <p>Which Wix development environment do you prefer for your project?</p>
      </div>

      <div className="options-grid" role="radiogroup" aria-label="Platform Preference">
        {platforms.map((plat) => {
          const isSelected = selectedPlatform === plat.id;
          const Icon = plat.icon;

          return (
            <button
              key={plat.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`option-select-btn ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(plat.id)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: isSelected ? "#166534" : "#4b5563",
                  }}
                >
                  <Icon size={18} />
                  {plat.badge && (
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
                      {plat.badge}
                    </span>
                  )}
                </div>
                <div className="service-check-indicator" aria-hidden="true">
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>
              </div>

              <strong>{plat.title}</strong>
              <span>{plat.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
