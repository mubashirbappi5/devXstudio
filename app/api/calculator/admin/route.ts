import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAllLeads,
  getAuditLogs,
  getCalculatorConfig,
  resetToOfficialDefaults,
  updateFeatures,
  updateLeadStatus,
  updatePricingSettings,
  updateServices,
} from "@/lib/calculator/storage";
import type {
  AdditionalFeature,
  LeadStatus,
  PricingSettings,
  ServiceItem,
} from "@/lib/calculator/types";
import { ADMIN_AUTH_COOKIE, ADMIN_AUTH_TOKEN } from "./login/route";

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  if (token === ADMIN_AUTH_TOKEN) return true;

  const reqHeaders = await headers();
  const authHeader = reqHeaders.get("authorization");
  if (
    authHeader === `Bearer ${ADMIN_AUTH_TOKEN}` ||
    authHeader === `Bearer ${process.env.ADMIN_PASSWORD || "devx@admin2026"}`
  ) {
    return true;
  }

  return false;
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const { services, features, settings } = await getCalculatorConfig();
    const leads = await getAllLeads();
    const auditLogs = await getAuditLogs();

    return NextResponse.json({
      success: true,
      services,
      features,
      settings,
      leads,
      auditLogs,
    });
  } catch (error) {
    console.error("Admin fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, payload, adminId = "admin" } = body as {
      action: string;
      payload: unknown;
      adminId?: string;
    };

    switch (action) {
      case "update_settings": {
        const settings = await updatePricingSettings(
          payload as Partial<PricingSettings>,
          adminId
        );
        return NextResponse.json({ success: true, settings });
      }

      case "update_services": {
        const services = await updateServices(
          payload as ServiceItem[],
          adminId
        );
        return NextResponse.json({ success: true, services });
      }

      case "update_features": {
        const features = await updateFeatures(
          payload as AdditionalFeature[],
          adminId
        );
        return NextResponse.json({ success: true, features });
      }

      case "update_lead": {
        const { leadId, status, internalNotes } = payload as {
          leadId: string;
          status: LeadStatus;
          internalNotes?: string;
        };
        const updated = await updateLeadStatus(
          leadId,
          status,
          internalNotes,
          adminId
        );
        return NextResponse.json({ success: true, lead: updated });
      }

      case "reset_defaults": {
        await resetToOfficialDefaults(adminId);
        const config = await getCalculatorConfig();
        return NextResponse.json({
          success: true,
          message: "Pricing and services restored to official defaults",
          ...config,
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json(
      { error: "Failed to execute admin action" },
      { status: 500 }
    );
  }
}
