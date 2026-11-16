"use client";

import React from "react";
import { Check, Globe, Sparkles, RefreshCw, MoveRight, Smartphone } from "lucide-react";
import type { ServiceId, ServiceItem } from "@/lib/calculator/types";

interface StepServiceProps {
  services: ServiceItem[];
  selectedServiceId: ServiceId;
  onSelect: (serviceId: ServiceId) => void;
}

const serviceIcons: Record<ServiceId, React.ComponentType<{ size?: number; className?: string }>> = {
  "classic-website": Globe,
  "advanced-website": Sparkles,
  "redesign-website": RefreshCw,
  "migrate-website": MoveRight,
  "mobile-app": Smartphone,
};

export function StepService({
  services,
  selectedServiceId,
  onSelect,
}: StepServiceProps) {
  return (
    <div className="calc-step-container">
      <div className="calc-step-header">
        <h2>Select Your Project Type</h2>
        <p>Choose the core service you need for your website or mobile project.</p>
      </div>

      <div className="service-cards-grid" role="radiogroup" aria-label="Project Type Selection">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;
          const Icon = serviceIcons[service.id] || Globe;

          return (
            <div
              key={service.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`service-select-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(service.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(service.id);
                }
              }}
            >
              <div className="service-card-top">
                <div className="service-icon-box">
                  <Icon size={20} />
                </div>
                <div className="service-check-indicator" aria-hidden="true">
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>
              </div>

              <div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>

              <div className="service-starting-badge">
                Starting from ${service.startingPrice}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

