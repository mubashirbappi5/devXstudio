"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Layers,
  LogOut,
  RefreshCw,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import type {
  AdditionalFeature,
  CalculatorLead,
  LeadStatus,
  PricingAuditLog,
  PricingSettings,
  ServiceItem,
} from "@/lib/calculator/types";

const ALL_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Quotation Sent",
  "Negotiation",
  "Converted",
  "Lost",
];

const statusColors: Record<LeadStatus, { bg: string; text: string }> = {
  New: { bg: "#dbeafe", text: "#1e40af" },
  Contacted: { bg: "#fef3c7", text: "#92400e" },
  "Quotation Sent": { bg: "#e0e7ff", text: "#3730a3" },
  Negotiation: { bg: "#fce7f3", text: "#9d174d" },
  Converted: { bg: "#dcfce7", text: "#166534" },
  Lost: { bg: "#fee2e2", text: "#991b1b" },
};

export default function AdminCalculatorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<
    "leads" | "services" | "features" | "settings" | "audit"
  >("leads");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [leads, setLeads] = useState<CalculatorLead[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [features, setFeatures] = useState<AdditionalFeature[]>([]);
  const [settings, setSettings] = useState<PricingSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<PricingAuditLog[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Lead Detail Modal State
  const [selectedLead, setSelectedLead] = useState<CalculatorLead | null>(null);
  const [modalStatus, setModalStatus] = useState<LeadStatus>("New");
  const [modalNotes, setModalNotes] = useState<string>("");

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/calculator/admin");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setLeads(data.leads || []);
        setServices(data.services || []);
        setFeatures(data.features || []);
        setSettings(data.settings || null);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth and load data on initial mount
  useEffect(() => {
    queueMicrotask(() => {
      fetchAdminData();
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/calculator/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || "Incorrect admin password");
      } else {
        setIsAuthenticated(true);
        setPasswordInput("");
        fetchAdminData();
      }
    } catch {
      setLoginError("Login request failed. Please retry.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/calculator/admin/login", { method: "DELETE" });
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Update Lead Details
  const handleSaveLeadModal = async () => {
    if (!selectedLead) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/calculator/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_lead",
          payload: {
            leadId: selectedLead.id,
            status: modalStatus,
            internalNotes: modalNotes,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? data.lead : l))
        );
        setSelectedLead(data.lead);
        showNotification("success", "Lead status and notes saved successfully.");
      } else {
        showNotification("error", data.error || "Failed to update lead.");
      }
    } catch {
      showNotification("error", "Error saving lead updates.");
    } finally {
      setIsSaving(false);
    }
  };

  // Save Services
  const handleSaveServices = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/calculator/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_services",
          payload: services,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setServices(data.services);
        showNotification("success", "Services and starting prices updated.");
      } else {
        showNotification("error", data.error || "Failed to update services.");
      }
    } catch {
      showNotification("error", "Error updating services.");
    } finally {
      setIsSaving(false);
    }
  };

  // Save Features
  const handleSaveFeatures = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/calculator/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_features",
          payload: features,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeatures(data.features);
        showNotification("success", "Features configuration saved.");
      } else {
        showNotification("error", data.error || "Failed to update features.");
      }
    } catch {
      showNotification("error", "Error saving features.");
    } finally {
      setIsSaving(false);
    }
  };

  // Save Pricing Settings
  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/calculator/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_settings",
          payload: settings,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        showNotification("success", "Pricing calculation settings saved.");
      } else {
        showNotification("error", data.error || "Failed to update settings.");
      }
    } catch {
      showNotification("error", "Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all service rates, features, and calculation rules back to official DevX Partner defaults?"
    );
    if (!confirmReset) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/calculator/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_defaults", payload: {} }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setServices(data.services);
        setFeatures(data.features);
        setSettings(data.settings);
        showNotification("success", "Pricing reset to official defaults.");
      } else {
        showNotification("error", data.error || "Failed to reset defaults.");
      }
    } catch {
      showNotification("error", "Error resetting defaults.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.companyName &&
          lead.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lead.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  // Lead Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "New").length;
    const converted = leads.filter((l) => l.status === "Converted").length;
    const pipelineValue = leads.reduce((sum, l) => sum + (l.estimatedMin || 0), 0);
    return { total, newCount, converted, pipelineValue };
  }, [leads]);

  // Render Login Card if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#07291b",
          padding: "20px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "36px 32px",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Image
              src="/devx-symbol.png"
              alt="DevXStudio"
              width={160}
              height={120}
              style={{ height: "45px", width: "auto", margin: "0 auto 14px" }}
              unoptimized
            />
            <h1 style={{ fontSize: "20px", color: "#07291b", margin: 0, fontWeight: 700 }}>
              Calculator Admin
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "6px 0 0" }}>
              Sign in to manage pricing rules, features, and inquiries.
            </p>
          </div>

          {loginError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="adminPassword"
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Admin Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="adminPassword"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid #d1d5db",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                width: "100%",
                background: "#166534",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14.5px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {isLoggingIn ? "Verifying Credentials..." : "Sign In to Admin"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link
              href="/website-cost-calculator"
              style={{ fontSize: "13px", color: "#166534", textDecoration: "none" }}
            >
              ← Back to Cost Calculator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8faf9",
        color: "#1e293b",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          background: "#07291b",
          color: "#ffffff",
          padding: "14px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #0e4429",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Image
            src="/devx-symbol.png"
            alt="DevXStudio"
            width={120}
            height={90}
            style={{ height: "30px", width: "auto" }}
            unoptimized
          />
          <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Calculator Management Portal
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
            href="/api/calculator/admin/export"
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#166534",
              color: "#ffffff",
              padding: "7px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowDownToLine size={15} /> Export CSV
          </a>

          <Link
            href="/website-cost-calculator"
            target="_blank"
            style={{
              color: "#bbf7d0",
              fontSize: "13px",
              textDecoration: "none",
              padding: "7px 12px",
            }}
          >
            View Live Calculator ↗
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            style={{
              background: "transparent",
              border: "1px solid #166534",
              color: "#dcfce7",
              borderRadius: "6px",
              padding: "7px 12px",
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "28px 24px" }}>
        {/* Feedback Banner */}
        {feedbackMsg && (
          <div
            style={{
              background: feedbackMsg.type === "success" ? "#dcfce7" : "#fee2e2",
              border:
                feedbackMsg.type === "success"
                  ? "1px solid #86efac"
                  : "1px solid #fca5a5",
              color: feedbackMsg.type === "success" ? "#166534" : "#991b1b",
              borderRadius: "8px",
              padding: "12px 18px",
              fontSize: "14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1.5px solid #e2ece5",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            {[
              { id: "leads", label: "Calculator Leads", icon: Users },
              { id: "services", label: "Services & Base Prices", icon: DollarSign },
              { id: "features", label: "Features & Add-ons", icon: Layers },
              { id: "settings", label: "Pricing Rules", icon: Settings },
              { id: "audit", label: "Audit Logs", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 18px",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "none",
                    borderBottom: isActive ? "2.5px solid #166534" : "2.5px solid transparent",
                    background: "transparent",
                    color: isActive ? "#166534" : "#64748b",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                  {tab.id === "leads" && leads.length > 0 && (
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#166534",
                        fontSize: "11px",
                        padding: "2px 7px",
                        borderRadius: "999px",
                      }}
                    >
                      {leads.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              fontSize: "12.5px",
              fontWeight: 600,
              background: "#ffffff",
              border: "1px solid #d1d5db",
              color: "#475569",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={13} /> Reset to Official Defaults
          </button>
        </div>

        {/* TAB 1: LEADS MANAGEMENT */}
        {activeTab === "leads" && (
          <div>
            {/* KPI Metric Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e2ece5",
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                  Total Calculator Inquiries
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#07291b", marginTop: "4px" }}>
                  {metrics.total}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e2ece5",
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#1e40af", fontWeight: 700 }}>
                  New / Unhandled
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#1e40af", marginTop: "4px" }}>
                  {metrics.newCount}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e2ece5",
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#166534", fontWeight: 700 }}>
                  Converted Deals
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#166534", marginTop: "4px" }}>
                  {metrics.converted}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e2ece5",
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                  Est. Pipeline Value
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#07291b", marginTop: "4px" }}>
                  ${metrics.pipelineValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                marginBottom: "20px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative", flexGrow: 1, minWidth: "260px" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by client name, email, country, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 38px",
                    borderRadius: "8px",
                    border: "1.5px solid #d1d5db",
                    fontSize: "13.5px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Filter size={15} color="#64748b" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid #d1d5db",
                    fontSize: "13.5px",
                    background: "#ffffff",
                    outline: "none",
                  }}
                >
                  <option value="all">All Statuses ({leads.length})</option>
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st} ({leads.filter((l) => l.status === st).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                border: "1px solid #e2ece5",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#f8faf9", borderBottom: "1px solid #e2ece5", textAlign: "left" }}>
                    <th style={{ padding: "12px 18px", color: "#475569" }}>Client Name</th>
                    <th style={{ padding: "12px 18px", color: "#475569" }}>Contact</th>
                    <th style={{ padding: "12px 18px", color: "#475569" }}>Service Scope</th>
                    <th style={{ padding: "12px 18px", color: "#475569" }}>Est. Budget</th>
                    <th style={{ padding: "12px 18px", color: "#475569" }}>Date</th>
                    <th style={{ padding: "12px 18px", color: "#475569" }}>Status</th>
                    <th style={{ padding: "12px 18px", textAlign: "right", color: "#475569" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "36px", textAlign: "center", color: "#64748b" }}>
                        No calculator leads match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const color = statusColors[lead.status] || { bg: "#e2e8f0", text: "#334155" };
                      const formattedDate = new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <tr
                          key={lead.id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                            transition: "background 0.15s",
                          }}
                        >
                          <td style={{ padding: "14px 18px" }}>
                            <strong style={{ color: "#07291b", display: "block" }}>
                              {lead.fullName}
                            </strong>
                            {lead.companyName && (
                              <span style={{ fontSize: "12px", color: "#64748b" }}>
                                {lead.companyName}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ color: "#166534" }}>{lead.email}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>{lead.country}</div>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 600 }}>{lead.serviceName}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                              {lead.pageCount} Pages • {lead.designPreference}
                            </div>
                          </td>
                          <td style={{ padding: "14px 18px", fontWeight: 700, color: "#07291b" }}>
                            ${lead.estimatedMin.toLocaleString()} – ${lead.estimatedMax.toLocaleString()}
                          </td>
                          <td style={{ padding: "14px 18px", color: "#64748b", fontSize: "12.5px" }}>
                            {formattedDate}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: 600,
                                background: color.bg,
                                color: color.text,
                              }}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 18px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLead(lead);
                                setModalStatus(lead.status);
                                setModalNotes(lead.internalNotes || "");
                              }}
                              style={{
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                color: "#166534",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontSize: "12.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              View & Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & BASE PRICES */}
        {activeTab === "services" && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e2ece5",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", color: "#07291b", margin: "0 0 4px" }}>
                  Official Partner Services & Internal Base Prices
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  Starting prices used as internal reference base for dynamic estimates.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveServices}
                disabled={isSaving}
                style={{
                  background: "#166534",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  cursor: "pointer",
                }}
              >
                {isSaving ? "Saving..." : "Save Service Pricing"}
              </button>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {services.map((svc, idx) => (
                <div
                  key={svc.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 140px 100px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px 20px",
                    background: "#f8faf9",
                    borderRadius: "10px",
                    border: "1px solid #edf2ee",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "15px", color: "#07291b" }}>{svc.name}</strong>
                    <p style={{ fontSize: "12.5px", color: "#64748b", margin: "4px 0 0" }}>
                      {svc.description}
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
                      Base Price (USD)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "10px", top: "8px", color: "#64748b" }}>$</span>
                      <input
                        type="number"
                        value={svc.startingPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setServices((prev) =>
                            prev.map((s, i) => (i === idx ? { ...s, startingPrice: val } : s))
                          );
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 10px 8px 24px",
                          borderRadius: "6px",
                          border: "1.5px solid #d1d5db",
                          fontSize: "14px",
                          fontWeight: 700,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <label style={{ display: "block", fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
                      Active
                    </label>
                    <input
                      type="checkbox"
                      checked={svc.isActive}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setServices((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, isActive: checked } : s))
                        );
                      }}
                      style={{ width: "20px", height: "20px", accentColor: "#166534" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FEATURES & ADD-ONS */}
        {activeTab === "features" && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e2ece5",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", color: "#07291b", margin: "0 0 4px" }}>
                  Additional Features & Add-on Pricing
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  Manage fixed rate additions, categories, and custom quote flags.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveFeatures}
                disabled={isSaving}
                style={{
                  background: "#166534",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  cursor: "pointer",
                }}
              >
                {isSaving ? "Saving..." : "Save Features"}
              </button>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              {features.map((feat, idx) => (
                <div
                  key={feat.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 140px 160px 80px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "14px 18px",
                    background: "#f8faf9",
                    borderRadius: "10px",
                    border: "1px solid #edf2ee",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "14px", color: "#07291b" }}>{feat.name}</strong>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                      {feat.description}
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#64748b", marginBottom: "2px" }}>
                      Price (USD)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "10px", top: "7px", color: "#64748b" }}>$</span>
                      <input
                        type="number"
                        value={feat.price}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setFeatures((prev) =>
                            prev.map((f, i) => (i === idx ? { ...f, price: val } : f))
                          );
                        }}
                        style={{
                          width: "100%",
                          padding: "6px 8px 6px 22px",
                          borderRadius: "6px",
                          border: "1.5px solid #d1d5db",
                          fontSize: "13.5px",
                          fontWeight: 700,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#92400e", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={feat.requiresCustomQuote}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFeatures((prev) =>
                            prev.map((f, i) =>
                              i === idx
                                ? {
                                    ...f,
                                    requiresCustomQuote: checked,
                                    pricingType: checked ? "custom_quote" : "fixed",
                                  }
                                : f
                            )
                          );
                        }}
                        style={{ accentColor: "#b45309" }}
                      />
                      Requires Custom Quote
                    </label>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <input
                      type="checkbox"
                      checked={feat.isActive}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFeatures((prev) =>
                          prev.map((f, i) => (i === idx ? { ...f, isActive: checked } : f))
                        );
                      }}
                      style={{ width: "18px", height: "18px", accentColor: "#166534" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRICING RULES & SETTINGS */}
        {activeTab === "settings" && settings && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e2ece5",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", color: "#07291b", margin: "0 0 4px" }}>
                  Dynamic Calculation Rules & Multipliers
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  Adjust page bracket increments, design fees, complexity multipliers, and uncertainty buffers.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                style={{
                  background: "#166534",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  cursor: "pointer",
                }}
              >
                {isSaving ? "Saving..." : "Save Calculation Settings"}
              </button>
            </div>

            {/* Page Count Pricing */}
            <h4 style={{ fontSize: "15px", color: "#07291b", margin: "20px 0 12px" }}>
              Page Bracket Additions (USD Min / Max)
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
              {(["1-5", "6-10", "11-20", "21-30", "30+"] as const).map((bracket) => {
                const item = settings.pagePricing[bracket] || { min: 0, max: 0 };
                return (
                  <div key={bracket} style={{ background: "#f8faf9", padding: "14px", borderRadius: "8px", border: "1px solid #e2ece5" }}>
                    <strong style={{ fontSize: "13.5px" }}>{bracket} Pages</strong>
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <div>
                        <label style={{ fontSize: "10px", color: "#64748b" }}>Min ($)</label>
                        <input
                          type="number"
                          value={item.min}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    pagePricing: {
                                      ...prev.pagePricing,
                                      [bracket]: { ...item, min: val },
                                    },
                                  }
                                : null
                            );
                          }}
                          style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "10px", color: "#64748b" }}>Max ($)</label>
                        <input
                          type="number"
                          value={item.max}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    pagePricing: {
                                      ...prev.pagePricing,
                                      [bracket]: { ...item, max: val },
                                    },
                                  }
                                : null
                            );
                          }}
                          style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Design Pricing */}
            <h4 style={{ fontSize: "15px", color: "#07291b", margin: "20px 0 12px" }}>
              Design Level Additions (USD Min / Max)
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "24px" }}>
              {(["template-based", "custom-design", "premium-ui-ux"] as const).map((des) => {
                const item = settings.designPricing[des] || { min: 0, max: 0 };
                return (
                  <div key={des} style={{ background: "#f8faf9", padding: "14px", borderRadius: "8px", border: "1px solid #e2ece5" }}>
                    <strong style={{ fontSize: "13px", textTransform: "capitalize" }}>{des.replace(/-/g, " ")}</strong>
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <div>
                        <label style={{ fontSize: "10px", color: "#64748b" }}>Min ($)</label>
                        <input
                          type="number"
                          value={item.min}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    designPricing: {
                                      ...prev.designPricing,
                                      [des]: { ...item, min: val },
                                    },
                                  }
                                : null
                            );
                          }}
                          style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "10px", color: "#64748b" }}>Max ($)</label>
                        <input
                          type="number"
                          value={item.max}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    designPricing: {
                                      ...prev.designPricing,
                                      [des]: { ...item, max: val },
                                    },
                                  }
                                : null
                            );
                          }}
                          style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complexity Multipliers & Timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <h4 style={{ fontSize: "14px", color: "#07291b", margin: "0 0 10px" }}>
                  Complexity Multipliers
                </h4>
                {(["basic", "intermediate", "advanced", "enterprise"] as const).map((comp) => (
                  <div key={comp} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ textTransform: "capitalize" }}>{comp}:</span>
                    <input
                      type="number"
                      step="0.05"
                      value={settings.complexityPricing[comp]?.multiplier || 1.0}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 1.0;
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                complexityPricing: {
                                  ...prev.complexityPricing,
                                  [comp]: {
                                    ...prev.complexityPricing[comp],
                                    multiplier: val,
                                  },
                                },
                              }
                            : null
                        );
                      }}
                      style={{ width: "90px", padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ fontSize: "14px", color: "#07291b", margin: "0 0 10px" }}>
                  Timeline Rush Fees (%)
                </h4>
                {(["urgent-1-week", "urgent-2-weeks"] as const).map((time) => (
                  <div key={time} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ textTransform: "capitalize" }}>{time.replace(/-/g, " ")}:</span>
                    <input
                      type="number"
                      value={settings.timelinePricing[time]?.percentage || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setSettings((prev) =>
                          prev
                            ? {
                                ...prev,
                                timelinePricing: {
                                  ...prev.timelinePricing,
                                  [time]: { percentage: val },
                                },
                              }
                            : null
                        );
                      }}
                      style={{ width: "90px", padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    />
                  </div>
                ))}
                <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px dashed #e2ece5" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#07291b", marginBottom: "6px" }}>
                    Uncertainty Margin Buffer (%):
                  </label>
                  <input
                    type="number"
                    value={settings.uncertaintyMarginPercent}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 15;
                      setSettings((prev) =>
                        prev ? { ...prev, uncertaintyMarginPercent: val } : null
                      );
                    }}
                    style={{ width: "90px", padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e2ece5",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "18px", color: "#07291b", margin: "0 0 16px" }}>
              Pricing & Management Audit Trail
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8faf9", borderBottom: "1px solid #e2ece5", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", color: "#475569" }}>Timestamp</th>
                  <th style={{ padding: "10px 14px", color: "#475569" }}>Admin User</th>
                  <th style={{ padding: "10px 14px", color: "#475569" }}>Action</th>
                  <th style={{ padding: "10px 14px", color: "#475569" }}>Summary</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 14px", color: "#64748b" }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 600 }}>{log.adminId}</td>
                      <td style={{ padding: "10px 14px", color: "#166534" }}>{log.action}</td>
                      <td style={{ padding: "10px 14px" }}>{log.summary}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LEAD DETAIL MODAL */}
      {selectedLead && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", color: "#07291b", margin: "0 0 4px" }}>
                  Lead Details: {selectedLead.fullName}
                </h2>
                <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                  ID: {selectedLead.id} • Created {new Date(selectedLead.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Estimated Price Banner */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                padding: "16px 20px",
                borderRadius: "10px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#166534" }}>
                  Estimated Project Budget
                </div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#07291b" }}>
                  ${selectedLead.estimatedMin.toLocaleString()} – ${selectedLead.estimatedMax.toLocaleString()} USD
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    background: "#ffffff",
                    border: "1px solid #86efac",
                    color: "#166534",
                    padding: "4px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {selectedLead.ctaType === "free-consultation"
                    ? "Free Consultation"
                    : "Detailed Quote"}
                </span>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              <div><strong>Email:</strong> <a href={`mailto:${selectedLead.email}`} style={{ color: "#166534" }}>{selectedLead.email}</a></div>
              <div><strong>Country:</strong> {selectedLead.country}</div>
              {selectedLead.phone && <div><strong>Phone:</strong> {selectedLead.phone}</div>}
              {selectedLead.companyName && <div><strong>Company:</strong> {selectedLead.companyName}</div>}
              {selectedLead.websiteUrl && <div><strong>Website:</strong> <a href={selectedLead.websiteUrl} target="_blank" rel="noreferrer" style={{ color: "#166534" }}>{selectedLead.websiteUrl}</a></div>}
              <div><strong>Service:</strong> {selectedLead.serviceName}</div>
              <div><strong>Platform:</strong> {selectedLead.selectedPlatform || "N/A"}</div>
              <div><strong>Pages:</strong> {selectedLead.pageCount} Pages</div>
              <div><strong>Design:</strong> {selectedLead.designPreference}</div>
              <div><strong>Complexity:</strong> {selectedLead.projectComplexity}</div>
              <div><strong>Timeline:</strong> {selectedLead.timeline}</div>
            </div>

            {/* Selected Features */}
            {selectedLead.selectedFeatureNames?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Selected Modules:
                </strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selectedLead.selectedFeatureNames.map((name, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#f1f5f9",
                        color: "#334155",
                        fontSize: "11.5px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {selectedLead.additionalDetails && (
              <div style={{ marginBottom: "20px", background: "#f8faf9", padding: "12px", borderRadius: "8px", fontSize: "13px" }}>
                <strong>Client&apos;s Request Note:</strong>
                <p style={{ margin: "4px 0 0", color: "#475569" }}>{selectedLead.additionalDetails}</p>
              </div>
            )}

            {/* Status & Internal Notes Form */}
            <div style={{ borderTop: "1px solid #e2ece5", paddingTop: "18px", marginTop: "18px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Deal / Inquiry Status:
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as LeadStatus)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1.5px solid #d1d5db",
                    fontSize: "13.5px",
                    width: "100%",
                    background: "#ffffff",
                  }}
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Internal Notes & Communications:
                </label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Record quote sent dates, client feedback, or scope updates..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1.5px solid #d1d5db",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #d1d5db",
                    padding: "9px 18px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLeadModal}
                  disabled={isSaving}
                  style={{
                    background: "#166534",
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 20px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
