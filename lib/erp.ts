export interface ErpLeadPayload {
  full_name: string;
  email: string;
  phone?: string;
  country: string;
  company_name?: string;
  website_url?: string;
  source: string;
  cta_type?: string;
  service_name?: string;
  platform?: string;
  page_count?: string;
  design_preference?: string;
  project_complexity?: string;
  timeline?: string;
  selected_features?: string[];
  estimated_min?: number;
  estimated_max?: number;
  currency?: string;
  pricing_breakdown?: Array<{
    label: string;
    amountMin: number;
    amountMax: number;
    isCustomQuote?: boolean;
  }>;
  additional_details?: string;
}

export async function sendLeadToErp(payload: ErpLeadPayload): Promise<{
  success: boolean;
  leadId?: string;
  error?: string;
}> {
  const webhookUrl =
    process.env.ERP_WEBHOOK_URL || "https://devx-erp.vercel.app/api/leads";
  const apiKey =
    process.env.ERP_WEBHOOK_KEY || "devx_lead_secret_key_2026_webhook";

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`ERP webhook returned error ${res.status}:`, errText);
      return { success: false, error: `HTTP ${res.status}: ${errText}` };
    }

    const data = await res.json().catch(() => null);
    return { success: true, leadId: data?.lead_id };
  } catch (error) {
    console.error("Failed to forward lead to ERP webhook:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
