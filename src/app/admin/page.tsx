"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import type { Faculty } from "@/context/AppContext";

const FACULTIES: Faculty[] = [
  "Software Engineering",
  "Networking",
  "Information Management",
  "Business",
  "Theology",
  "Nursing",
  "Education",
];

function fmt(n: number) {
  return n.toLocaleString();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-RW", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return iso.slice(0, 10); }
}

export default function AdminPage() {
  const {
    walletTransactions,
    lessons,
    purchases,
    bookings,
    creatorLessons,
    getPlatformRevenue,
  } = useApp();

  // ── Aggregate stats ────────────────────────────────────────────────────────
  const totalRevenue      = getPlatformRevenue();
  const totalTutorPayout  = walletTransactions.reduce((s, t) => s + t.tutorCut, 0);
  const totalGMV          = walletTransactions.reduce((s, t) => s + t.totalAmount, 0);
  const totalTransactions = walletTransactions.length;
  const totalPurchases    = purchases.length;
  const totalBookings     = bookings.length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;

  // ── Lessons by faculty ─────────────────────────────────────────────────────
  const byFaculty = FACULTIES.map((fk) => {
    const count = lessons.filter((l) => l.facultyKey === fk).length;
    const creatorCount = creatorLessons.filter((cl) => cl.faculty === fk).length;
    return { faculty: fk, lessons: count, creatorLessons: creatorCount, total: count + creatorCount };
  }).sort((a, b) => b.total - a.total);

  const maxFacultyTotal = Math.max(...byFaculty.map((f) => f.total), 1);

  // ── Unique tutors ──────────────────────────────────────────────────────────
  const uniqueTutors = [...new Set(walletTransactions.map((t) => t.tutorId))];
  const tutorRows = uniqueTutors.map((tutorId) => {
    const txns = walletTransactions.filter((t) => t.tutorId === tutorId);
    const lesson = lessons.find((l) => l.tutorId === tutorId);
    return {
      tutorId,
      name: lesson?.instructor.name ?? tutorId,
      sessions: txns.length,
      earned: txns.reduce((s, t) => s + t.tutorCut, 0),
      platformFees: txns.reduce((s, t) => s + t.platformCut, 0),
    };
  }).sort((a, b) => b.earned - a.earned);

  return (
    <>
      <Header />
      <main style={{ width: "100%", paddingTop: "5rem", minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>

          {/* ── Page header ────────────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ color: "white", fontSize: "1.4rem" }}>admin_panel_settings</span>
                </div>
                <div>
                  <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0, letterSpacing: "-0.01em" }}>Platform Ledger</h1>
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>AMANOTA Admin · Commission & Revenue</p>
                </div>
              </div>
            </div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "0.625rem", backgroundColor: "var(--color-surface-container-lowest)", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_back</span>
              Back to Explore
            </Link>
          </div>

          {/* ── KPI bento ──────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Platform Revenue (20%)", value: `${fmt(totalRevenue)} RWF`, icon: "account_balance", iconBg: "var(--color-primary-fixed)", iconColor: "var(--color-primary)", highlight: true },
              { label: "Total Tutor Payouts (80%)", value: `${fmt(totalTutorPayout)} RWF`, icon: "payments", iconBg: "var(--color-secondary-container)", iconColor: "var(--color-secondary)", highlight: false },
              { label: "Gross Merchandise Value", value: `${fmt(totalGMV)} RWF`, icon: "receipt_long", iconBg: "var(--color-surface-container-highest)", iconColor: "var(--color-on-surface-variant)", highlight: false },
              { label: "Transactions", value: String(totalTransactions), icon: "swap_horiz", iconBg: "var(--color-surface-container-high)", iconColor: "var(--color-on-surface-variant)", highlight: false },
              { label: "Total Purchases", value: String(totalPurchases), icon: "shopping_bag", iconBg: "var(--color-surface-container-high)", iconColor: "var(--color-on-surface-variant)", highlight: false },
              { label: "Sessions Completed", value: `${completedBookings} / ${totalBookings}`, icon: "event_available", iconBg: "var(--color-secondary-container)", iconColor: "var(--color-secondary)", highlight: false },
            ].map((kpi) => (
              <div
                key={kpi.label}
                style={{ backgroundColor: kpi.highlight ? "var(--color-primary)" : "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1rem", boxShadow: kpi.highlight ? "0 4px 16px rgba(53,37,205,0.2)" : "0 1px 4px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: kpi.highlight ? "rgba(255,255,255,0.75)" : "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.3rem" }}>{kpi.label}</p>
                  <p style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 700, color: kpi.highlight ? "white" : "var(--color-on-surface)", margin: 0, lineHeight: 1.2 }}>{kpi.value}</p>
                </div>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.625rem", backgroundColor: kpi.highlight ? "rgba(255,255,255,0.2)" : kpi.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1.375rem", color: kpi.highlight ? "white" : kpi.iconColor }}>{kpi.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Two-column section ─────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>

            {/* Faculty breakdown */}
            <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.25rem", color: "var(--color-primary)" }}>bar_chart</span>
                Active Lessons by AUCA Faculty
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {byFaculty.map(({ faculty: fk, lessons: lc, creatorLessons: cc, total }) => (
                  <div key={fk}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-surface)" }}>{fk}</span>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)" }}>
                        {total} lesson{total !== 1 ? "s" : ""} <span style={{ opacity: 0.6 }}>({lc} seeded · {cc} uploaded)</span>
                      </span>
                    </div>
                    <div style={{ height: "0.5rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "9999px", backgroundColor: total > 0 ? "var(--color-primary)" : "transparent", width: `${(total / maxFacultyTotal) * 100}%`, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutor earnings table */}
            <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-outline-variant)" }}>
                <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1.25rem", color: "var(--color-secondary)" }}>people</span>
                  Tutor Earnings Breakdown
                </h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                      {["Tutor", "Sessions", "Earned (80%)", "Platform (20%)"].map((h) => (
                        <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tutorRows.length === 0 && (
                      <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--color-on-surface-variant)" }}>No transactions yet.</td></tr>
                    )}
                    {tutorRows.map((r) => (
                      <tr key={r.tutorId} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 600, color: "var(--color-on-surface)" }}>{r.name}</td>
                        <td style={{ padding: "0.625rem 1rem", color: "var(--color-on-surface-variant)" }}>{r.sessions}</td>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 700, color: "var(--color-secondary)" }}>{fmt(r.earned)} RWF</td>
                        <td style={{ padding: "0.625rem 1rem", color: "var(--color-on-surface-variant)" }}>{fmt(r.platformFees)} RWF</td>
                      </tr>
                    ))}
                  </tbody>
                  {tutorRows.length > 0 && (
                    <tfoot>
                      <tr style={{ backgroundColor: "var(--color-surface-container-low)", borderTop: "2px solid var(--color-outline-variant)" }}>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 700, color: "var(--color-on-surface)" }}>Total</td>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 700 }}>{tutorRows.reduce((s, r) => s + r.sessions, 0)}</td>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 700, color: "var(--color-secondary)" }}>{fmt(totalTutorPayout)} RWF</td>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 700 }}>{fmt(totalRevenue)} RWF</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>

          {/* ── Full transaction ledger ────────────────────────────────── */}
          <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-outline-variant)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.25rem", color: "var(--color-primary)" }}>receipt_long</span>
                Full Transaction Ledger
              </h2>
              <span style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>{walletTransactions.length} record{walletTransactions.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                    {["Date", "Transaction ID", "Lesson", "Tutor", "Total Paid", "Tutor (80%)", "Platform (20%)"].map((h) => (
                      <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {walletTransactions.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: "2.5rem", textAlign: "center", color: "var(--color-on-surface-variant)" }}>No transactions yet.</td></tr>
                  )}
                  {[...walletTransactions].reverse().map((t) => {
                    const lesson = lessons.find((l) => l.id === t.lessonId);
                    const tutor = lessons.find((l) => l.tutorId === t.tutorId);
                    return (
                      <tr key={t.id} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                        <td style={{ padding: "0.625rem 1rem", color: "var(--color-on-surface-variant)", whiteSpace: "nowrap" }}>{formatDate(t.createdAt)}</td>
                        <td style={{ padding: "0.625rem 1rem" }}>
                          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", padding: "0.125rem 0.5rem", borderRadius: "0.25rem" }}>{t.id}</span>
                        </td>
                        <td style={{ padding: "0.625rem 1rem", maxWidth: "14rem" }}>
                          <span className="line-clamp-1" style={{ display: "block", color: "var(--color-on-surface)", fontWeight: 500 }}>{lesson?.title ?? t.lessonId}</span>
                        </td>
                        <td style={{ padding: "0.625rem 1rem", color: "var(--color-on-surface-variant)" }}>{tutor?.instructor.name ?? t.tutorId}</td>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 600, color: "var(--color-on-surface)" }}>{fmt(t.totalAmount)} RWF</td>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 700, color: "var(--color-secondary)" }}>{fmt(t.tutorCut)} RWF</td>
                        <td style={{ padding: "0.625rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>{fmt(t.platformCut)} RWF</td>
                      </tr>
                    );
                  })}
                </tbody>
                {walletTransactions.length > 0 && (
                  <tfoot>
                    <tr style={{ backgroundColor: "var(--color-surface-container-low)", borderTop: "2px solid var(--color-outline-variant)" }}>
                      <td colSpan={4} style={{ padding: "0.625rem 1rem", fontWeight: 700, color: "var(--color-on-surface)", fontFamily: "var(--font-label)" }}>Grand Total</td>
                      <td style={{ padding: "0.625rem 1rem", fontWeight: 700, fontFamily: "var(--font-label)" }}>{fmt(totalGMV)} RWF</td>
                      <td style={{ padding: "0.625rem 1rem", fontWeight: 700, color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}>{fmt(totalTutorPayout)} RWF</td>
                      <td style={{ padding: "0.625rem 1rem", fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-label)" }}>{fmt(totalRevenue)} RWF</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
