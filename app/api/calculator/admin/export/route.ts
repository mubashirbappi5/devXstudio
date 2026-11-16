import { cookies } from "next/headers";
import { getAllLeads } from "@/lib/calculator/storage";
import { ADMIN_AUTH_COOKIE, ADMIN_AUTH_TOKEN } from "../login/route";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  if (token !== ADMIN_AUTH_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const leads = await getAllLeads();

  const headers = [
    "Lead ID",
    "Date",
    "Full Name",
    "Email",
    "Country",
    "Company",
    "Phone",
    "Service",
    "Platform",
    "Pages",
    "Design Level",
    "Complexity",
    "Timeline",
    "Min Price (USD)",
    "Max Price (USD)",
    "Custom Quote Required",
    "Selected Features",
    "Status",
    "Internal Notes",
  ];

  const rows = leads.map((l) => [
    l.id,
    new Date(l.createdAt).toLocaleDateString(),
    `"${(l.fullName || "").replace(/"/g, '""')}"`,
    `"${(l.email || "").replace(/"/g, '""')}"`,
    `"${(l.country || "").replace(/"/g, '""')}"`,
    `"${(l.companyName || "").replace(/"/g, '""')}"`,
    `"${(l.phone || "").replace(/"/g, '""')}"`,
    `"${(l.serviceName || "").replace(/"/g, '""')}"`,
    l.selectedPlatform || "N/A",
    l.pageCount,
    l.designPreference,
    l.projectComplexity,
    l.timeline,
    l.estimatedMin,
    l.estimatedMax,
    l.isCustomQuoteRequired ? "YES" : "NO",
    `"${(l.selectedFeatureNames || []).join(", ").replace(/"/g, '""')}"`,
    l.status,
    `"${(l.internalNotes || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\r\n"
  );

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="devx-calculator-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
