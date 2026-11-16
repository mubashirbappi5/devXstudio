export type ServiceId =
  | "classic-website"
  | "advanced-website"
  | "redesign-website"
  | "migrate-website"
  | "mobile-app";

export interface ServiceItem {
  id: ServiceId;
  name: string;
  description: string;
  startingPrice: number; // Official reference starting price (USD)
  currency: string;
  isActive: boolean;
}

export type PlatformOption = "wix-studio" | "wix-editor" | "not-sure";

export type PageCountOption =
  | "1-5"
  | "6-10"
  | "11-20"
  | "21-30"
  | "30+";

export type ContentReadiness = "ready" | "partial" | "need-help";

export type DesignPreference =
  | "template-based"
  | "custom-design"
  | "premium-ui-ux";

export type ProjectComplexity =
  | "basic"
  | "intermediate"
  | "advanced"
  | "enterprise";

export type ProjectTimeline =
  | "urgent-1-week"
  | "urgent-2-weeks"
  | "standard-1-month"
  | "flexible";

export interface AdditionalFeature {
  id: string;
  name: string;
  category: "functionality" | "integration" | "advanced";
  description: string;
  price: number; // Base addition
  pricingType: "fixed" | "percentage" | "custom_quote";
  isActive: boolean;
  requiresCustomQuote: boolean;
}

export interface PricingSettings {
  currency: string;
  basePrices: Record<ServiceId, number>;
  pagePricing: Record<PageCountOption, { min: number; max: number; customQuote?: boolean }>;
  designPricing: Record<DesignPreference, { min: number; max: number }>;
  complexityPricing: Record<ProjectComplexity, { multiplier: number; customQuote?: boolean }>;
  timelinePricing: Record<ProjectTimeline, { percentage: number }>;
  uncertaintyMarginPercent: number; // default e.g. 20%
  updatedAt: string;
  updatedBy: string;
}

export interface CalculationInput {
  serviceId: ServiceId;
  platform?: PlatformOption;
  pageCount: PageCountOption;
  contentReadiness: ContentReadiness;
  designPreference: DesignPreference;
  existingWebsiteUrl?: string;
  referenceUrls?: string;
  hasBrandGuidelines?: boolean;
  hasLogoAssets?: boolean;
  selectedFeatures: string[];
  projectComplexity: ProjectComplexity;
  timeline: ProjectTimeline;
}

export interface PricingBreakdownItem {
  label: string;
  amountMin: number;
  amountMax: number;
  isCustomQuote?: boolean;
}

export interface CalculationResult {
  serviceName: string;
  basePrice: number;
  estimatedMin: number;
  estimatedMax: number;
  isCustomQuoteRequired: boolean;
  customQuoteReasons: string[];
  currency: string;
  breakdown: PricingBreakdownItem[];
  appliedTimelineAdjustmentPercent: number;
}

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Quotation Sent"
  | "Negotiation"
  | "Converted"
  | "Lost";

export interface CalculatorLead {
  id: string;
  fullName: string;
  email: string;
  country: string;
  companyName?: string;
  phone?: string;
  websiteUrl?: string;
  additionalDetails?: string;
  ctaType: "detailed-quote" | "free-consultation";
  // Calculator selections
  serviceId: ServiceId;
  serviceName: string;
  selectedPlatform?: PlatformOption;
  pageCount: PageCountOption;
  contentReadiness: ContentReadiness;
  designPreference: DesignPreference;
  referenceUrls?: string;
  hasBrandGuidelines?: boolean;
  hasLogoAssets?: boolean;
  selectedFeatures: string[];
  selectedFeatureNames: string[];
  projectComplexity: ProjectComplexity;
  timeline: ProjectTimeline;
  // Calculation results
  estimatedMin: number;
  estimatedMax: number;
  isCustomQuoteRequired: boolean;
  currency: string;
  pricingBreakdown: PricingBreakdownItem[];
  // Meta
  status: LeadStatus;
  internalNotes: string;
  createdAt: string;
}

export interface PricingAuditLog {
  id: string;
  adminId: string;
  action: string;
  summary: string;
  timestamp: string;
}
