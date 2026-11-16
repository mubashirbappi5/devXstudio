import type {
  AdditionalFeature,
  CalculationInput,
  CalculationResult,
  PricingBreakdownItem,
  PricingSettings,
  ServiceItem,
} from "./types";

export function calculateProjectEstimate(
  input: CalculationInput,
  services: ServiceItem[],
  features: AdditionalFeature[],
  settings: PricingSettings
): CalculationResult {
  const service =
    services.find((s) => s.id === input.serviceId && s.isActive) ||
    services[0];

  const basePrice =
    settings.basePrices[service.id] ?? service.startingPrice ?? 450;

  const breakdown: PricingBreakdownItem[] = [];
  const customQuoteReasons: string[] = [];

  // 1. Base Service Price
  breakdown.push({
    label: `${service.name} (Base Scope)`,
    amountMin: basePrice,
    amountMax: basePrice,
  });

  // 2. Page Count Pricing
  const pageRule = settings.pagePricing[input.pageCount] || { min: 0, max: 0 };
  if (pageRule.min > 0 || pageRule.max > 0 || pageRule.customQuote) {
    breakdown.push({
      label: `Page Scope (${input.pageCount} Pages)`,
      amountMin: pageRule.min,
      amountMax: pageRule.max,
      isCustomQuote: pageRule.customQuote,
    });
    if (pageRule.customQuote) {
      customQuoteReasons.push(`Large page scope (${input.pageCount} pages) requires structural assessment.`);
    }
  }

  // 3. Design Complexity
  const designRule = settings.designPricing[input.designPreference] || {
    min: 0,
    max: 0,
  };
  if (designRule.min > 0 || designRule.max > 0) {
    const label =
      input.designPreference === "premium-ui-ux"
        ? "Premium UI/UX Bespoke Design"
        : input.designPreference === "custom-design"
        ? "Tailored Custom Design"
        : "Standard Layout";
    breakdown.push({
      label,
      amountMin: designRule.min,
      amountMax: designRule.max,
    });
  }

  // 4. Content Assistance if needed
  if (input.contentReadiness === "need-help") {
    breakdown.push({
      label: "Copywriting & Content Assistance",
      amountMin: 120,
      amountMax: 200,
    });
  }

  // 5. Additional Features
  let featureSumMin = 0;
  let featureSumMax = 0;

  for (const featureId of input.selectedFeatures) {
    const feat = features.find((f) => f.id === featureId && f.isActive);
    if (!feat) continue;

    if (feat.requiresCustomQuote || feat.pricingType === "custom_quote") {
      customQuoteReasons.push(`${feat.name} requires custom technical review.`);
      breakdown.push({
        label: feat.name,
        amountMin: feat.price,
        amountMax: Math.round(feat.price * 1.3),
        isCustomQuote: true,
      });
      featureSumMin += feat.price;
      featureSumMax += Math.round(feat.price * 1.3);
    } else {
      const maxFeat = Math.round(feat.price * 1.2);
      breakdown.push({
        label: feat.name,
        amountMin: feat.price,
        amountMax: maxFeat,
      });
      featureSumMin += feat.price;
      featureSumMax += maxFeat;
    }
  }

  // Subtotal before complexity & urgency
  let subtotalMin =
    basePrice +
    pageRule.min +
    designRule.min +
    (input.contentReadiness === "need-help" ? 120 : 0) +
    featureSumMin;

  let subtotalMax =
    basePrice +
    pageRule.max +
    designRule.max +
    (input.contentReadiness === "need-help" ? 200 : 0) +
    featureSumMax;

  // 6. Project Complexity Multiplier
  const complexityRule = settings.complexityPricing[input.projectComplexity] || {
    multiplier: 1.0,
  };
  if (complexityRule.multiplier > 1.0) {
    const addedMin = Math.round(subtotalMin * (complexityRule.multiplier - 1));
    const addedMax = Math.round(subtotalMax * (complexityRule.multiplier - 1));
    breakdown.push({
      label: `Complexity Adjustment (${input.projectComplexity.toUpperCase()})`,
      amountMin: addedMin,
      amountMax: addedMax,
      isCustomQuote: complexityRule.customQuote,
    });
    subtotalMin += addedMin;
    subtotalMax += addedMax;

    if (complexityRule.customQuote) {
      customQuoteReasons.push("Enterprise-level architecture requires custom scope scoping.");
    }
  }

  // 7. Timeline / Urgency Adjustment
  const timelineRule = settings.timelinePricing[input.timeline] || {
    percentage: 0,
  };
  const urgencyPercent = timelineRule.percentage || 0;
  if (urgencyPercent > 0) {
    const urgencyMin = Math.round((subtotalMin * urgencyPercent) / 100);
    const urgencyMax = Math.round((subtotalMax * urgencyPercent) / 100);
    breakdown.push({
      label: `Expedited Timeline Fee (+${urgencyPercent}%)`,
      amountMin: urgencyMin,
      amountMax: urgencyMax,
    });
    subtotalMin += urgencyMin;
    subtotalMax += urgencyMax;
  }

  // 8. General uncertainty buffer for upper range
  const marginPercent = settings.uncertaintyMarginPercent || 15;
  const finalMaxWithMargin = Math.max(
    subtotalMax,
    Math.round(subtotalMin * (1 + marginPercent / 100))
  );

  const isCustomQuoteRequired = customQuoteReasons.length > 0;

  return {
    serviceName: service.name,
    basePrice,
    estimatedMin: roundToTens(subtotalMin),
    estimatedMax: roundToTens(finalMaxWithMargin),
    isCustomQuoteRequired,
    customQuoteReasons,
    currency: settings.currency || "USD",
    breakdown,
    appliedTimelineAdjustmentPercent: urgencyPercent,
  };
}

function roundToTens(val: number): number {
  return Math.round(val / 10) * 10;
}
