"use client";

import React, { useState, useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type {
  AdditionalFeature,
  CalculationInput,
  PricingSettings,
  ServiceItem,
} from "@/lib/calculator/types";
import { calculateProjectEstimate } from "@/lib/calculator/pricing-engine";
import { StepService } from "./step-service";
import { StepPlatform } from "./step-platform";
import { StepPages } from "./step-pages";
import { StepDesign } from "./step-design";
import { StepFeatures } from "./step-features";
import { StepTimeline } from "./step-timeline";
import { StepEstimateLead } from "./step-estimate-lead";
import { CalculatorSummary } from "./calculator-summary";
import "./calculator.css";

interface CalculatorWizardProps {
  initialServices: ServiceItem[];
  initialFeatures: AdditionalFeature[];
  pricingSettings: PricingSettings;
}

const TOTAL_STEPS = 7;

export function CalculatorWizard({
  initialServices,
  initialFeatures,
  pricingSettings,
}: CalculatorWizardProps) {
  const wizardTopRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Core Calculation Input State
  const [calculation, setCalculation] = useState<CalculationInput>({
    serviceId: "classic-website",
    platform: "wix-studio",
    pageCount: "1-5",
    contentReadiness: "ready",
    designPreference: "custom-design",
    existingWebsiteUrl: "",
    referenceUrls: "",
    hasBrandGuidelines: false,
    hasLogoAssets: false,
    selectedFeatures: [],
    projectComplexity: "basic",
    timeline: "standard-1-month",
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | undefined>(undefined);

  // Compute estimate dynamically in real-time
  const estimate = useMemo(() => {
    return calculateProjectEstimate(
      calculation,
      initialServices,
      initialFeatures,
      pricingSettings
    );
  }, [calculation, initialServices, initialFeatures, pricingSettings]);

  const selectedService = useMemo(() => {
    return (
      initialServices.find((s) => s.id === calculation.serviceId) ||
      initialServices[0]
    );
  }, [calculation.serviceId, initialServices]);

  const scrollToWizardTop = () => {
    if (wizardTopRef.current) {
      wizardTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      scrollToWizardTop();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      scrollToWizardTop();
    }
  };

  const handleReset = () => {
    setCalculation({
      serviceId: "classic-website",
      platform: "wix-studio",
      pageCount: "1-5",
      contentReadiness: "ready",
      designPreference: "custom-design",
      existingWebsiteUrl: "",
      referenceUrls: "",
      hasBrandGuidelines: false,
      hasLogoAssets: false,
      selectedFeatures: [],
      projectComplexity: "basic",
      timeline: "standard-1-month",
    });
    setCurrentStep(1);
    setSubmitSuccess(false);
    setSubmitError(null);
    setSubmittedLeadId(undefined);
    scrollToWizardTop();
  };

  // Lead Submission
  const handleSubmitLead = async (leadData: {
    fullName: string;
    email: string;
    country: string;
    companyName?: string;
    phone?: string;
    websiteUrl?: string;
    additionalDetails?: string;
    ctaType: "detailed-quote" | "free-consultation";
  }) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: leadData,
          calculation,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit project inquiry.");
      }

      setSubmitSuccess(true);
      setSubmittedLeadId(resData.leadId);
      scrollToWizardTop();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="calc-container" ref={wizardTopRef}>
      {/* Main Form Box */}
      <div className="calc-main">
        {/* Progress Tracker */}
        <div className="calc-progress-wrap">
          <div className="calc-progress-head">
            <span>
              Step <strong>{currentStep}</strong> of {TOTAL_STEPS}
            </span>
            <span>{progressPercentage}% Completed</span>
          </div>
          <div className="calc-progress-track">
            <div
              className="calc-progress-bar"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Step Views */}
        {currentStep === 1 && (
          <StepService
            services={initialServices}
            selectedServiceId={calculation.serviceId}
            onSelect={(serviceId) => {
              setCalculation((prev) => ({ ...prev, serviceId }));
            }}
          />
        )}

        {currentStep === 2 && (
          <StepPlatform
            serviceId={calculation.serviceId}
            selectedPlatform={calculation.platform || "wix-studio"}
            onSelect={(platform) => {
              setCalculation((prev) => ({ ...prev, platform }));
            }}
          />
        )}

        {currentStep === 3 && (
          <StepPages
            pageCount={calculation.pageCount}
            contentReadiness={calculation.contentReadiness}
            onPageCountChange={(pageCount) => {
              setCalculation((prev) => ({ ...prev, pageCount }));
            }}
            onContentReadinessChange={(contentReadiness) => {
              setCalculation((prev) => ({ ...prev, contentReadiness }));
            }}
          />
        )}

        {currentStep === 4 && (
          <StepDesign
            designPreference={calculation.designPreference}
            existingWebsiteUrl={calculation.existingWebsiteUrl}
            referenceUrls={calculation.referenceUrls}
            hasBrandGuidelines={calculation.hasBrandGuidelines}
            hasLogoAssets={calculation.hasLogoAssets}
            onDesignPreferenceChange={(designPreference) => {
              setCalculation((prev) => ({ ...prev, designPreference }));
            }}
            onExistingWebsiteChange={(existingWebsiteUrl) => {
              setCalculation((prev) => ({ ...prev, existingWebsiteUrl }));
            }}
            onReferenceUrlsChange={(referenceUrls) => {
              setCalculation((prev) => ({ ...prev, referenceUrls }));
            }}
            onBrandGuidelinesToggle={(hasBrandGuidelines) => {
              setCalculation((prev) => ({ ...prev, hasBrandGuidelines }));
            }}
            onLogoAssetsToggle={(hasLogoAssets) => {
              setCalculation((prev) => ({ ...prev, hasLogoAssets }));
            }}
          />
        )}

        {currentStep === 5 && (
          <StepFeatures
            features={initialFeatures}
            selectedFeatures={calculation.selectedFeatures}
            onToggleFeature={(featureId) => {
              setCalculation((prev) => {
                const exists = prev.selectedFeatures.includes(featureId);
                return {
                  ...prev,
                  selectedFeatures: exists
                    ? prev.selectedFeatures.filter((id) => id !== featureId)
                    : [...prev.selectedFeatures, featureId],
                };
              });
            }}
          />
        )}

        {currentStep === 6 && (
          <StepTimeline
            projectComplexity={calculation.projectComplexity}
            timeline={calculation.timeline}
            onComplexityChange={(projectComplexity) => {
              setCalculation((prev) => ({ ...prev, projectComplexity }));
            }}
            onTimelineChange={(timeline) => {
              setCalculation((prev) => ({ ...prev, timeline }));
            }}
          />
        )}

        {currentStep === 7 && (
          <StepEstimateLead
            calculation={calculation}
            estimate={estimate}
            selectedServiceName={selectedService.name}
            isSubmitting={isSubmitting}
            submitError={submitError}
            submitSuccess={submitSuccess}
            submittedLeadId={submittedLeadId}
            onSubmitLead={handleSubmitLead}
            onReset={handleReset}
          />
        )}

        {/* Wizard Navigation Footer */}
        {!submitSuccess && (
          <div className="calc-nav-footer">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="calc-btn-back"
                  onClick={handlePrevStep}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <button
                  type="button"
                  className="calc-btn-back"
                  onClick={handleReset}
                  title="Reset selections"
                >
                  <RotateCcw size={15} /> Reset
                </button>
              )}
            </div>

            <div>
              {currentStep < TOTAL_STEPS && (
                <button
                  type="button"
                  className="calc-btn-next"
                  onClick={handleNextStep}
                >
                  Next Step <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Summary Sidebar */}
      <CalculatorSummary
        calculation={calculation}
        estimate={estimate}
        services={initialServices}
        features={initialFeatures}
        currentStep={currentStep}
      />
    </div>
  );
}
