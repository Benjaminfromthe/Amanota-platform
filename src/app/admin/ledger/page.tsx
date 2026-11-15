"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, RefreshCw, AlertCircle, Loader2, Banknote, Heart, Receipt, BarChart3, Layers } from "lucide-react";

// ─── Types matching get_ledger_summary RPC output ────────────────────────────

interface FacultyRow {
  faculty:           string;
  transaction_count: number;
  gross_rwf:         number;
  tutor_rwf:         number;
  platform_rwf:      number;
}

interface TierRow {
  tier_type:         string;
  transaction_count: number;
  gross_rwf:         number;
  tutor_rwf:         number;
  platform_rwf:      number;
}

interface RecentRow {
  id:            string;
  faculty:       string;
  tier_type:     string;
  gross_amount:  number;
  tutor_payout:  number;
  platform_fee:  number;
  created_at:    string;
  student_name:  string | null;
  tutor_name:    string | null;
  lesson_title:  string | null;
  course_code:   string | null;
}

interface LedgerSummary {
  total_gross:    number;
  total_tutor:    number;
  total_platform: number;
  net_margin_pct: number;
  by_faculty:     FacultyRow[];
  by_tier:        TierRow[];
  recent:         RecentRow[];
}

function fmt(n: number) { return (n ?? 0).toLocaleString(); }

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-RW", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso?.slice(0, 16) ?? "—"; }
}

const TIER_LABELS: Record<string, string> = {
  recorded:        "Recorded Video",
  online:          "Online Live 1-on-1",
  campus:          "In-Person AUCA",
  custom_location: "Custom Location",
};

const TIER_PRICES: Record<string, number> = {
  recorded: 1000, online: 2000, campus: 3000, custom_location: 5000,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLedgerPage() {
  const [summary, setSummary]   = useState<LedgerSummary | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState("");
  const [tab,     setTab]       = useState<"faculty" | "tier" | "recent">("faculty");

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Call the get_ledger_summary RPC via the service-role client
      // We use a server-side fetch to avoid exposing the service key in the browser
      const res = await fetch("/api/admin/ledger");
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as LedgerSummary;
      setSummary(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ledger data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const maxFaculty = Math.max(...(summary?.by_faculty ?? []).map(f => f.gross_rwf), 1);

  return (
    <>
      <Header />
      <main style={{ width: "100%", paddingTop: "5rem", minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>

          {/* ── Page header ────────────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>
                  <ArrowLeft size={16} />
                  Admin
                </Link>
                <span style={{ color: "var(--color-outline)" }}>/</span>
                <span style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)" }}>Platform Ledger</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.25rem", letterSpacing: "-0.01em" }}>
                AMANOTA Commission Ledger
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-on-surface-variant)", margin: 0 }}>
                Real-time 80/20 revenue split across all AUCA faculties and booking tiers.
              </p>
            </div>
            <button
              onClick={fetchSummary}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-surface-container-lowest)", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {/* ── Error ──────────────────────────────────────────────────── */}
          {error && (
            <div style={{ padding: "1rem 1.25rem", borderRadius: "0.75rem", backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)", fontFamily: "var(--font-body)", fontSize: "0.9rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertCircle size={20} />
              {error}
              {error.includes("does not exist") && (
                <span style={{ marginLeft: "0.5rem" }}>— Run <strong>run_step5_commission.sql</strong> in your Supabase SQL Editor first.</span>
              )}
            </div>
          )}

          {/* ── Loading ────────────────────────────────────────────────── */}
          {loading && (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
              <Loader2 size={40} color="var(--color-primary)" style={{ display: "block", marginBottom: "0.75rem" }} />
              Loading ledger data…
            </div>
          )}

          {summary && !loading && (
            <>
              {/* ── KPI strip ──────────────────────────────────────────── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  {
                    label: "Gross Platform Revenue",
                    value: `${fmt(summary.total_gross)} RWF`,
                    sub: "Total student payments",
                    iconNode: <Banknote size={22} color="var(--color-primary)" />, iconBg: "var(--color-primary-fixed)",
                    highlight: false,
                  },
                  {
                    label: "AMANOTA Net Revenue (20%)",
                    value: `${fmt(summary.total_platform)} RWF`,
                    sub: `${summary.net_margin_pct}% net margin`,
                    iconNode: <Banknote size={22} color="white" />, iconBg: "var(--color-primary)",
                    highlight: true,
                  },
                  {
                    label: "Total Tutor Payouts (80%)",
                    value: `${fmt(summary.total_tutor)} RWF`,
                    sub: "Credited to instructor wallets",
                    iconNode: <Heart size={22} color="var(--color-secondary)" />, iconBg: "var(--color-secondary-container)",
                    highlight: false,
                  },
                  {
                    label: "Total Transactions",
                    value: String(summary.recent.length > 0 ? summary.by_faculty.reduce((s, f) => s + f.transaction_count, 0) : 0),
                    sub: "Across all faculties & tiers",
                    iconNode: <Receipt size={22} color="var(--color-on-surface-variant)" />, iconBg: "var(--color-surface-container-highest)",
                    highlight: false,
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    style={{ backgroundColor: kpi.highlight ? "var(--color-primary)" : "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1.125rem", boxShadow: kpi.highlight ? "0 4px 20px rgba(53,37,205,0.25)" : "0 1px 4px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                  >
                    <div>
                      <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: kpi.highlight ? "rgba(255,255,255,0.75)" : "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.3rem" }}>{kpi.label}</p>
                      <p style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 700, color: kpi.highlight ? "white" : "var(--color-on-surface)", margin: "0 0 0.25rem" }}>{kpi.value}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: kpi.highlight ? "rgba(255,255,255,0.65)" : "var(--color-on-surface-variant)", margin: 0 }}>{kpi.sub}</p>
                    </div>
                    <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", backgroundColor: kpi.highlight ? "rgba(255,255,255,0.2)" : kpi.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {kpi.iconNode}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Tier price reference ───────────────────────────────── */}
              <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1rem 1.25rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-on-surface-variant)", marginRight: "0.5rem" }}>BOOKING TIERS:</span>
                {Object.entries(TIER_PRICES).map(([tier, price]) => (
                  <span key={tier} style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.25rem 0.75rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface)" }}>
                    <span style={{ color: "var(--color-primary)" }}>{TIER_LABELS[tier]}</span>
                    <span style={{ color: "var(--color-secondary)", fontWeight: 700 }}>{fmt(price)} RWF</span>
                    <span style={{ color: "var(--color-on-surface-variant)", fontSize: "0.65rem" }}>→ tutor {fmt(Math.round(price * 0.8))} / platform {fmt(price - Math.round(price * 0.8))}</span>
                  </span>
                ))}
              </div>

              {/* ── Tab switcher ───────────────────────────────────────── */}
              <div style={{ display: "flex", gap: "0.375rem", backgroundColor: "var(--color-surface-container-lowest)", padding: "0.375rem", borderRadius: "0.875rem", marginBottom: "1.5rem", width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                {(["faculty", "tier", "recent"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ padding: "0.5rem 1.25rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", backgroundColor: tab === t ? "var(--color-primary)" : "transparent", color: tab === t ? "var(--color-on-primary)" : "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize", transition: "all 0.15s" }}>
                    {t === "faculty" ? "By Faculty" : t === "tier" ? "By Tier" : "Recent Transactions"}
                  </button>
                ))}
              </div>

              {/* ── By Faculty ─────────────────────────────────────────── */}
              {tab === "faculty" && (
                <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-outline-variant)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <BarChart3 size={20} color="var(--color-primary)" />
                    <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>Revenue by AUCA Faculty</h2>
                  </div>
                  {summary.by_faculty.length === 0 ? (
                    <EmptyState msg="No transactions yet. Make a booking to see faculty revenue data." />
                  ) : (
                    <div style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {summary.by_faculty.map((f) => (
                          <div key={f.faculty}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                              <div>
                                <span style={{ fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-on-surface)" }}>{f.faculty}</span>
                                <span style={{ marginLeft: "0.75rem", fontFamily: "var(--font-label)", fontSize: "0.7rem", color: "var(--color-on-surface-variant)" }}>{f.transaction_count} transaction{f.transaction_count !== 1 ? "s" : ""}</span>
                              </div>
                              <div style={{ display: "flex", gap: "1rem", fontFamily: "var(--font-label)", fontSize: "0.8rem" }}>
                                <span style={{ color: "var(--color-on-surface)", fontWeight: 700 }}>Gross: {fmt(f.gross_rwf)} RWF</span>
                                <span style={{ color: "var(--color-secondary)" }}>Tutor: {fmt(f.tutor_rwf)}</span>
                                <span style={{ color: "var(--color-primary)" }}>Platform: {fmt(f.platform_rwf)}</span>
                              </div>
                            </div>
                            {/* Stacked bar */}
                            <div style={{ height: "0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", overflow: "hidden", display: "flex" }}>
                              <div style={{ height: "100%", backgroundColor: "var(--color-secondary)", width: `${(f.tutor_rwf / maxFaculty) * 100}%`, transition: "width 0.4s ease" }} />
                              <div style={{ height: "100%", backgroundColor: "var(--color-primary)", width: `${(f.platform_rwf / maxFaculty) * 100}%`, transition: "width 0.4s ease" }} />
                            </div>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "0.3rem" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-label)", fontSize: "0.65rem", color: "var(--color-secondary)" }}>
                                <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary)", display: "inline-block" }} />
                                Tutor 80%
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-label)", fontSize: "0.65rem", color: "var(--color-primary)" }}>
                                <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", backgroundColor: "var(--color-primary)", display: "inline-block" }} />
                                Platform 20%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Faculty totals table */}
                      <div style={{ marginTop: "2rem", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>
                          <thead>
                            <tr style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                              {["Faculty", "Transactions", "Gross (RWF)", "Tutor 80% (RWF)", "Platform 20% (RWF)", "Margin"].map((h) => (
                                <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {summary.by_faculty.map((f) => (
                              <tr key={f.faculty} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "var(--color-on-surface)" }}>{f.faculty}</td>
                                <td style={{ padding: "0.75rem 1rem", color: "var(--color-on-surface-variant)" }}>{f.transaction_count}</td>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{fmt(f.gross_rwf)}</td>
                                <td style={{ padding: "0.75rem 1rem", color: "var(--color-secondary)", fontWeight: 700 }}>{fmt(f.tutor_rwf)}</td>
                                <td style={{ padding: "0.75rem 1rem", color: "var(--color-primary)", fontWeight: 700 }}>{fmt(f.platform_rwf)}</td>
                                <td style={{ padding: "0.75rem 1rem", color: "var(--color-on-surface-variant)" }}>
                                  {f.gross_rwf > 0 ? `${Math.round((f.platform_rwf / f.gross_rwf) * 100)}%` : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr style={{ backgroundColor: "var(--color-surface-container-low)", borderTop: "2px solid var(--color-outline-variant)" }}>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 700, fontFamily: "var(--font-label)", color: "var(--color-on-surface)" }}>TOTAL</td>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{summary.by_faculty.reduce((s, f) => s + f.transaction_count, 0)}</td>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{fmt(summary.total_gross)}</td>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--color-secondary)" }}>{fmt(summary.total_tutor)}</td>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>{fmt(summary.total_platform)}</td>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>{summary.net_margin_pct}%</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── By Tier ────────────────────────────────────────────── */}
              {tab === "tier" && (
                <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-outline-variant)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Layers size={20} color="var(--color-secondary)" />
                    <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>Revenue by Booking Tier</h2>
                  </div>
                  {summary.by_tier.length === 0 ? (
                    <EmptyState msg="No transactions yet." />
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                            {["Tier", "Price", "Transactions", "Gross (RWF)", "Tutor 80%", "Platform 20%"].map((h) => (
                              <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {summary.by_tier.map((t) => (
                            <tr key={t.tier_type} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                              <td style={{ padding: "0.75rem 1rem" }}>
                                <span style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700 }}>
                                  {TIER_LABELS[t.tier_type] ?? t.tier_type}
                                </span>
                              </td>
                              <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-label)", fontWeight: 700, color: "var(--color-on-surface)" }}>
                                {TIER_PRICES[t.tier_type] ? `${fmt(TIER_PRICES[t.tier_type])} RWF` : "—"}
                              </td>
                              <td style={{ padding: "0.75rem 1rem", color: "var(--color-on-surface-variant)" }}>{t.transaction_count}</td>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{fmt(t.gross_rwf)}</td>
                              <td style={{ padding: "0.75rem 1rem", color: "var(--color-secondary)", fontWeight: 700 }}>{fmt(t.tutor_rwf)}</td>
                              <td style={{ padding: "0.75rem 1rem", color: "var(--color-primary)", fontWeight: 700 }}>{fmt(t.platform_rwf)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ backgroundColor: "var(--color-surface-container-low)", borderTop: "2px solid var(--color-outline-variant)" }}>
                            <td colSpan={2} style={{ padding: "0.75rem 1rem", fontWeight: 700, fontFamily: "var(--font-label)", color: "var(--color-on-surface)" }}>TOTAL</td>
                            <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{summary.by_tier.reduce((s, t) => s + t.transaction_count, 0)}</td>
                            <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{fmt(summary.total_gross)}</td>
                            <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--color-secondary)" }}>{fmt(summary.total_tutor)}</td>
                            <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>{fmt(summary.total_platform)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Recent transactions ────────────────────────────────── */}
              {tab === "recent" && (
                <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-outline-variant)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Receipt size={20} color="var(--color-primary)" />
                      <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>Recent Transactions</h2>
                    </div>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>Last {summary.recent.length} records</span>
                  </div>
                  {summary.recent.length === 0 ? (
                    <EmptyState msg="No transactions yet. Complete a booking to see real-time commission data here." />
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.825rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                            {["Date", "Lesson", "Faculty", "Tier", "Student", "Tutor", "Gross", "Tutor 80%", "Platform 20%"].map((h) => (
                              <th key={h} style={{ padding: "0.625rem 0.875rem", textAlign: "left", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {summary.recent.map((r) => (
                            <tr key={r.id} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                              <td style={{ padding: "0.625rem 0.875rem", color: "var(--color-on-surface-variant)", whiteSpace: "nowrap", fontSize: "0.775rem" }}>{formatDate(r.created_at)}</td>
                              <td style={{ padding: "0.625rem 0.875rem", maxWidth: "12rem" }}>
                                <span className="line-clamp-1" style={{ display: "block", fontWeight: 500, color: "var(--color-on-surface)" }}>{r.lesson_title ?? "—"}</span>
                                {r.course_code && <span style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", padding: "0.0625rem 0.375rem", borderRadius: "0.25rem", fontWeight: 700 }}>{r.course_code}</span>}
                              </td>
                              <td style={{ padding: "0.625rem 0.875rem", color: "var(--color-on-surface-variant)", whiteSpace: "nowrap", fontSize: "0.775rem" }}>{r.faculty}</td>
                              <td style={{ padding: "0.625rem 0.875rem" }}>
                                <span style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", padding: "0.125rem 0.5rem", borderRadius: "0.25rem" }}>
                                  {TIER_LABELS[r.tier_type] ?? r.tier_type}
                                </span>
                              </td>
                              <td style={{ padding: "0.625rem 0.875rem", color: "var(--color-on-surface-variant)", fontSize: "0.775rem" }}>{r.student_name ?? "—"}</td>
                              <td style={{ padding: "0.625rem 0.875rem", color: "var(--color-on-surface-variant)", fontSize: "0.775rem" }}>{r.tutor_name ?? "—"}</td>
                              <td style={{ padding: "0.625rem 0.875rem", fontWeight: 600, color: "var(--color-on-surface)" }}>{fmt(r.gross_amount)}</td>
                              <td style={{ padding: "0.625rem 0.875rem", fontWeight: 700, color: "var(--color-secondary)" }}>{fmt(r.tutor_payout)}</td>
                              <td style={{ padding: "0.625rem 0.875rem", fontWeight: 700, color: "var(--color-primary)" }}>{fmt(r.platform_fee)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
      <Receipt size={40} color="var(--color-outline)" style={{ display: "block", marginBottom: "0.75rem" }} />
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-on-surface-variant)", maxWidth: "28rem", margin: "0 auto" }}>{msg}</p>
    </div>
  );
}
