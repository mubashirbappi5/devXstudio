import { promises as fs } from "node:fs";
import path from "node:path";
import {
  DEFAULT_FEATURES,
  DEFAULT_PRICING_SETTINGS,
  DEFAULT_SERVICES,
} from "./defaults";
import type {
  AdditionalFeature,
  CalculatorLead,
  LeadStatus,
  PricingAuditLog,
  PricingSettings,
  ServiceItem,
} from "./types";

interface StorageData {
  services: ServiceItem[];
  features: AdditionalFeature[];
  settings: PricingSettings;
  leads: CalculatorLead[];
  auditLogs: PricingAuditLog[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "calculator-data.json");

// In-memory cache for fast read/writes across serverless invocations
let memoryCache: StorageData | null = null;

async function ensureDataFile(): Promise<StorageData> {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as StorageData;
    memoryCache = {
      services: parsed.services?.length ? parsed.services : DEFAULT_SERVICES,
      features: parsed.features?.length ? parsed.features : DEFAULT_FEATURES,
      settings: parsed.settings ? parsed.settings : DEFAULT_PRICING_SETTINGS,
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
    };
    return memoryCache;
  } catch {
    // If file doesn't exist or is invalid, initialize with defaults
    const initial: StorageData = {
      services: DEFAULT_SERVICES,
      features: DEFAULT_FEATURES,
      settings: DEFAULT_PRICING_SETTINGS,
      leads: [],
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          adminId: "system",
          action: "initialize",
          summary: "Initialized default calculator pricing configuration.",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
    } catch (writeErr) {
      console.warn("Storage filesystem write warning (using memory store):", writeErr);
    }
    memoryCache = initial;
    return initial;
  }
}

async function persist(data: StorageData): Promise<void> {
  memoryCache = data;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to persistent calculator store:", err);
  }
}

// ----------------- Public API ----------------- //

export async function getCalculatorConfig(): Promise<{
  services: ServiceItem[];
  features: AdditionalFeature[];
  settings: PricingSettings;
}> {
  const data = await ensureDataFile();
  return {
    services: data.services,
    features: data.features,
    settings: data.settings,
  };
}

export async function updatePricingSettings(
  updatedSettings: Partial<PricingSettings>,
  adminId: string
): Promise<PricingSettings> {
  const data = await ensureDataFile();
  const newSettings: PricingSettings = {
    ...data.settings,
    ...updatedSettings,
    updatedAt: new Date().toISOString(),
    updatedBy: adminId,
  };

  data.settings = newSettings;
  data.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId,
    action: "update_pricing_settings",
    summary: `Updated pricing settings by ${adminId}`,
    timestamp: new Date().toISOString(),
  });

  await persist(data);
  return newSettings;
}

export async function updateServices(
  services: ServiceItem[],
  adminId: string
): Promise<ServiceItem[]> {
  const data = await ensureDataFile();
  data.services = services;
  data.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId,
    action: "update_services",
    summary: `Updated service catalog by ${adminId}`,
    timestamp: new Date().toISOString(),
  });

  await persist(data);
  return services;
}

export async function updateFeatures(
  features: AdditionalFeature[],
  adminId: string
): Promise<AdditionalFeature[]> {
  const data = await ensureDataFile();
  data.features = features;
  data.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId,
    action: "update_features",
    summary: `Updated additional features by ${adminId}`,
    timestamp: new Date().toISOString(),
  });

  await persist(data);
  return features;
}

export async function resetToOfficialDefaults(adminId: string): Promise<void> {
  const data = await ensureDataFile();
  data.services = DEFAULT_SERVICES;
  data.features = DEFAULT_FEATURES;
  data.settings = DEFAULT_PRICING_SETTINGS;
  data.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId,
    action: "reset_defaults",
    summary: `Reset services and pricing to official starting defaults by ${adminId}`,
    timestamp: new Date().toISOString(),
  });

  await persist(data);
}

// ----------------- Leads Management ----------------- //

export async function saveLead(lead: CalculatorLead): Promise<CalculatorLead> {
  const data = await ensureDataFile();

  // Prevent duplicate submissions within short interval from same email
  const existing = data.leads.find(
    (l) =>
      l.email.toLowerCase() === lead.email.toLowerCase() &&
      Math.abs(
        new Date(lead.createdAt).getTime() - new Date(l.createdAt).getTime()
      ) < 60000
  );

  if (existing) {
    return existing;
  }

  data.leads.unshift(lead);
  await persist(data);
  return lead;
}

export async function getAllLeads(): Promise<CalculatorLead[]> {
  const data = await ensureDataFile();
  return data.leads;
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  internalNotes?: string,
  adminId = "admin"
): Promise<CalculatorLead | null> {
  const data = await ensureDataFile();
  const lead = data.leads.find((l) => l.id === leadId);
  if (!lead) return null;

  lead.status = status;
  if (typeof internalNotes === "string") {
    lead.internalNotes = internalNotes;
  }

  data.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId,
    action: "update_lead_status",
    summary: `Lead #${lead.id.slice(0, 8)} status set to "${status}"`,
    timestamp: new Date().toISOString(),
  });

  await persist(data);
  return lead;
}

export async function getAuditLogs(): Promise<PricingAuditLog[]> {
  const data = await ensureDataFile();
  return data.auditLogs.slice(0, 50);
}

