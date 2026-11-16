import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_FEATURES,
  DEFAULT_PRICING_SETTINGS,
  DEFAULT_SERVICES,
} from "../lib/calculator/defaults.ts";
import { calculateProjectEstimate } from "../lib/calculator/pricing-engine.ts";

test("Wix Partner official starting prices are accurately configured in USD", () => {
  const serviceMap = Object.fromEntries(
    DEFAULT_SERVICES.map((s) => [s.id, s.startingPrice])
  );

  assert.equal(serviceMap["classic-website"], 450);
  assert.equal(serviceMap["advanced-website"], 550);
  assert.equal(serviceMap["redesign-website"], 400);
  assert.equal(serviceMap["migrate-website"], 150);
  assert.equal(serviceMap["mobile-app"], 950);

  // All must be USD
  for (const s of DEFAULT_SERVICES) {
    assert.equal(s.currency, "USD");
  }
});

test("Features list contains all required 12 modules with official categorization", () => {
  assert.equal(DEFAULT_FEATURES.length, 12);

  const featureIds = DEFAULT_FEATURES.map((f) => f.id);
  assert.ok(featureIds.includes("wix-cms"));
  assert.ok(featureIds.includes("ecommerce"));
  assert.ok(featureIds.includes("payment-gateway"));
  assert.ok(featureIds.includes("bookings"));
  assert.ok(featureIds.includes("membership"));
  assert.ok(featureIds.includes("user-dashboard"));
  assert.ok(featureIds.includes("custom-velo"));
  assert.ok(featureIds.includes("third-party-api"));
  assert.ok(featureIds.includes("multilingual"));
  assert.ok(featureIds.includes("advanced-animations"));
  assert.ok(featureIds.includes("forms-automation"));
  assert.ok(featureIds.includes("crm-integration"));

  // Check custom quote flags for advanced technical items
  const velo = DEFAULT_FEATURES.find((f) => f.id === "custom-velo");
  const api = DEFAULT_FEATURES.find((f) => f.id === "third-party-api");
  assert.equal(velo.requiresCustomQuote, true);
  assert.equal(api.requiresCustomQuote, true);
});

test("Standard project calculation produces dynamic realistic price range", () => {
  const input = {
    serviceId: "classic-website",
    platform: "wix-studio",
    pageCount: "1-5",
    contentReadiness: "ready",
    designPreference: "template-based",
    selectedFeatures: [],
    projectComplexity: "basic",
    timeline: "standard-1-month",
  };

  const estimate = calculateProjectEstimate(
    input,
    DEFAULT_SERVICES,
    DEFAULT_FEATURES,
    DEFAULT_PRICING_SETTINGS
  );

  assert.equal(estimate.serviceName, "Classic Website Design");
  assert.equal(estimate.basePrice, 450);
  assert.equal(estimate.currency, "USD");
  assert.equal(estimate.isCustomQuoteRequired, false);
  assert.ok(estimate.estimatedMin >= 450);
  assert.ok(estimate.estimatedMax > estimate.estimatedMin);
  assert.ok(estimate.breakdown.length > 0);
});

test("Custom Velo, Third-party API, or 30+ pages triggers Custom Quote Required", () => {
  // Case A: Custom Velo feature selected
  const inputWithVelo = {
    serviceId: "advanced-website",
    platform: "wix-studio",
    pageCount: "6-10",
    contentReadiness: "ready",
    designPreference: "custom-design",
    selectedFeatures: ["custom-velo"],
    projectComplexity: "intermediate",
    timeline: "standard-1-month",
  };

  const estimateVelo = calculateProjectEstimate(
    inputWithVelo,
    DEFAULT_SERVICES,
    DEFAULT_FEATURES,
    DEFAULT_PRICING_SETTINGS
  );

  assert.equal(estimateVelo.isCustomQuoteRequired, true);
  assert.ok(estimateVelo.customQuoteReasons.some((r) => r.includes("Custom Velo")));

  // Case B: 30+ Pages selected
  const input30Plus = {
    serviceId: "classic-website",
    platform: "wix-studio",
    pageCount: "30+",
    contentReadiness: "ready",
    designPreference: "custom-design",
    selectedFeatures: [],
    projectComplexity: "basic",
    timeline: "standard-1-month",
  };

  const estimate30Plus = calculateProjectEstimate(
    input30Plus,
    DEFAULT_SERVICES,
    DEFAULT_FEATURES,
    DEFAULT_PRICING_SETTINGS
  );

  assert.equal(estimate30Plus.isCustomQuoteRequired, true);
  assert.ok(estimate30Plus.customQuoteReasons.some((r) => r.includes("30+ pages")));
});

test("Urgency rush fees apply percentage calculation correctly", () => {
  const baseInput = {
    serviceId: "classic-website",
    platform: "wix-studio",
    pageCount: "1-5",
    contentReadiness: "ready",
    designPreference: "template-based",
    selectedFeatures: [],
    projectComplexity: "basic",
    timeline: "standard-1-month",
  };

  const urgentInput = {
    ...baseInput,
    timeline: "urgent-1-week",
  };

  const estimateStandard = calculateProjectEstimate(
    baseInput,
    DEFAULT_SERVICES,
    DEFAULT_FEATURES,
    DEFAULT_PRICING_SETTINGS
  );

  const estimateUrgent = calculateProjectEstimate(
    urgentInput,
    DEFAULT_SERVICES,
    DEFAULT_FEATURES,
    DEFAULT_PRICING_SETTINGS
  );

  assert.equal(estimateUrgent.appliedTimelineAdjustmentPercent, 25);
  assert.ok(estimateUrgent.estimatedMin > estimateStandard.estimatedMin);
});

