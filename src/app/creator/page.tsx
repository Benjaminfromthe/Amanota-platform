"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import type { Campus, Faculty, Tier } from "@/context/AppContext";

const FACULTIES: Faculty[] = [
  "Software Engineering", "Networking", "Information Management",
  "Business", "Theology", "Nursing", "Education",
];

const TIERS: { id: Tier; label: string; price: string }[] = [
  { id: "recorded", label: "Recorded Video (1,000 RWF)", price: "1,000" },
  { id: "online",   label: "Online Live 1-on-1 (2,000 RWF)", price: "2,000" },
  { id: "campus",   label: "In-Person at AUCA Campus (3,000 RWF)", price: "3,000" },
  { id: "custom",   label: "In-Person Custom Location (5,000 RWF)", price: "5,000" },
];

const MOCK_TUTOR_ID = "tutor-001";

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-RW", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return iso.slice(0, 10); }
}

export default function CreatorPage() {
  const { walletTransactions, creatorLessons, uploadLesson, getTutorWalletBalance, getPlatformRevenue, lessons } = useApp();

  // ── Form state
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [faculty, setFaculty] = useState<Faculty>("Software Engineering");
  const [campus, setCampus] = useState<Campus>("masoro");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<Tier[]>(["recorded"]);
  const [toast, setToast] = useState("");

  const walletBalance = getTutorWalletBalance(MOCK_TUTOR_ID);
  const platformRevenue = getPlatformRevenue();

  const myTransactions = walletTransactions.filter((t) => t.tutorId === MOCK_TUTOR_ID);

  const toggleTier = (t: Tier) => {
    setSelectedTiers((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseCode.trim() || !videoUrl.trim()) {
      setToast("Please fill in all required fields.");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    uploadLesson({ title, courseCode, faculty, campus, videoUrl, description, tiers: selectedTiers, tutorId: MOCK_TUTOR_ID });
    setTitle(""); setCourseCode(""); setVideoUrl(""); setDescription(""); setSelectedTiers(["recorded"]);
    setToast("Lesson published successfully! 🎉");
    setTimeout(() => setToast(""), 4000);
  };

  const getLessonTitle = (lessonId: string) => {
    const found = lessons.find((l) => l.id === lessonId);
    return found ? found.title : lessonId;
  };

  return (
    <>
      <Header />
      <main style={{ width: "100%", paddingTop: "5rem", minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: "fixed", top: "6rem", right: "1.5rem", zIndex: 300, backgroundColor: toast.startsWith("Please") ? "var(--color-error-container)" : "var(--color-secondary-container)", color: toast.startsWith("Please") ? "var(--color-on-error-container)" : "var(--color-on-secondary-container)", padding: "0.75rem 1.25rem", borderRadius: "0.75rem", fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: "0.5rem", maxWidth: "24rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>{toast.startsWith("Please") ? "error" : "check_circle"}</span>
            {toast}
          </div>
        )}

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>

          {/* Page header */}
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.375rem", letterSpacing: "-0.01em" }}>Peer Tutor Studio</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-on-surface-variant)", margin: 0 }}>Upload lessons, manage your offerings, and track your 80/20 earnings in real time.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>

            {/* ── LEFT: Upload form ──────────────────────────────────────── */}
            <div>
              <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1.75rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1.375rem", color: "var(--color-primary)" }}>upload</span>
                  Upload a New Lesson
                </h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                  {/* Title */}
                  <label style={{ display: "block" }}>
                    <span style={labelStyle}>Lesson Title *</span>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Linked Lists in Java" style={inputStyle} required />
                  </label>

                  {/* Course code + faculty (2 cols) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <label style={{ display: "block" }}>
                      <span style={labelStyle}>Course Code *</span>
                      <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value.toUpperCase())} placeholder="e.g. COMP201" style={inputStyle} required />
                    </label>
                    <label style={{ display: "block" }}>
                      <span style={labelStyle}>Faculty</span>
                      <select value={faculty} onChange={(e) => setFaculty(e.target.value as Faculty)} style={inputStyle}>
                        {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </label>
                  </div>

                  {/* Campus */}
                  <label style={{ display: "block" }}>
                    <span style={labelStyle}>Campus</span>
                    <select value={campus} onChange={(e) => setCampus(e.target.value as Campus)} style={inputStyle}>
                      <option value="masoro">Masoro Campus</option>
                      <option value="gishushu">Gishushu Campus</option>
                      <option value="both">Both Campuses</option>
                    </select>
                  </label>

                  {/* Video URL */}
                  <label style={{ display: "block" }}>
                    <span style={labelStyle}>Video URL or File Path *</span>
                    <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://drive.google.com/… or /uploads/lesson.mp4" style={inputStyle} required />
                  </label>

                  {/* Description */}
                  <label style={{ display: "block" }}>
                    <span style={labelStyle}>Description</span>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will students learn? Cover key topics, prerequisites, and outcomes." rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                  </label>

                  {/* Available tiers */}
                  <div>
                    <span style={labelStyle}>Available Tutoring Tiers</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.375rem" }}>
                      {TIERS.map((t) => (
                        <label key={t.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: "0.625rem", border: `1.5px solid ${selectedTiers.includes(t.id) ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: selectedTiers.includes(t.id) ? "rgba(226,223,255,0.2)" : "transparent", cursor: "pointer", transition: "all 0.15s" }}>
                          <input type="checkbox" checked={selectedTiers.includes(t.id)} onChange={() => toggleTier(t.id)} style={{ accentColor: "var(--color-primary)", width: "1rem", height: "1rem" }} />
                          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 600, color: selectedTiers.includes(t.id) ? "var(--color-primary)" : "var(--color-on-surface-variant)" }}>{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" style={{ padding: "0.875rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 16px rgba(53,37,205,0.25)", marginTop: "0.25rem" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-on-primary-fixed-variant)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-primary)"; }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>publish</span>
                    Publish Lesson
                  </button>
                </form>
              </div>

              {/* Uploaded lessons table */}
              {creatorLessons.length > 0 && (
                <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.25rem", color: "var(--color-secondary)" }}>library_books</span>
                    My Uploaded Lessons ({creatorLessons.length})
                  </h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid var(--color-outline-variant)" }}>
                          {["Title", "Code", "Faculty", "Campus", "Tiers", "Uploaded"].map((h) => (
                            <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {creatorLessons.map((cl) => (
                          <tr key={cl.id} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                            <td style={tdStyle}><span className="line-clamp-1" style={{ display: "block", maxWidth: "14rem" }}>{cl.title}</span></td>
                            <td style={tdStyle}><span style={{ padding: "0.125rem 0.5rem", borderRadius: "0.25rem", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700 }}>{cl.courseCode}</span></td>
                            <td style={tdStyle}>{cl.faculty}</td>
                            <td style={{ ...tdStyle, textTransform: "capitalize" }}>{cl.campus}</td>
                            <td style={tdStyle}>{cl.tiers.join(", ")}</td>
                            <td style={tdStyle}>{formatDate(cl.uploadedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Wallet dashboard ────────────────────────────────── */}
            <div style={{ position: "sticky", top: "6rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Balance cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.25rem" }}>Your Balance (80%)</p>
                  <p style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: "var(--color-primary)", margin: "0 0 0.25rem" }}>{walletBalance.toLocaleString()} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--color-on-surface-variant)" }}>RWF</span></p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-secondary)", margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>account_balance_wallet</span>
                    MTN MoMo / Airtel
                  </p>
                </div>
                <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.25rem" }}>Platform Fee (20%)</p>
                  <p style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.25rem" }}>{platformRevenue.toLocaleString()} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--color-on-surface-variant)" }}>RWF</span></p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)", margin: 0 }}>AMANOTA Commission</p>
                </div>
              </div>

              {/* Info box */}
              <div style={{ backgroundColor: "rgba(226,223,255,0.3)", borderRadius: "0.875rem", padding: "0.875rem 1rem", display: "flex", gap: "0.75rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.375rem", color: "var(--color-primary)", flexShrink: 0 }}>info</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)", margin: 0, lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--color-primary)" }}>80/20 Revenue Split:</strong> Every purchase credits 80% directly to your MTN MoMo or Airtel Money wallet within 24 hours of session completion. AMANOTA retains 20% as a platform guarantee fee.
                </p>
              </div>

              {/* Transaction table */}
              <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--color-outline-variant)" }}>
                  <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem", color: "var(--color-secondary)" }}>receipt_long</span>
                    Transaction Ledger
                  </h3>
                </div>
                {myTransactions.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>No transactions yet.</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                          {["Date", "Lesson", "Total", "You (80%)", "Platform (20%)"].map((h) => (
                            <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {myTransactions.map((t) => (
                          <tr key={t.id} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                            <td style={tdStyle}>{formatDate(t.createdAt)}</td>
                            <td style={tdStyle}><span className="line-clamp-1" style={{ display: "block", maxWidth: "8rem", fontSize: "0.775rem" }}>{getLessonTitle(t.lessonId)}</span></td>
                            <td style={tdStyle}>{t.totalAmount.toLocaleString()}</td>
                            <td style={{ ...tdStyle, color: "var(--color-secondary)", fontWeight: 700 }}>{t.tutorCut.toLocaleString()}</td>
                            <td style={{ ...tdStyle, color: "var(--color-on-surface-variant)" }}>{t.platformCut.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ backgroundColor: "var(--color-surface-container-low)", borderTop: "2px solid var(--color-outline-variant)" }}>
                          <td colSpan={2} style={{ ...tdStyle, fontWeight: 700, color: "var(--color-on-surface)" }}>Total</td>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{myTransactions.reduce((s, t) => s + t.totalAmount, 0).toLocaleString()}</td>
                          <td style={{ ...tdStyle, fontWeight: 700, color: "var(--color-secondary)" }}>{myTransactions.reduce((s, t) => s + t.tutorCut, 0).toLocaleString()}</td>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{myTransactions.reduce((s, t) => s + t.platformCut, 0).toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-label)",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "var(--color-on-surface-variant)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "0.375rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  borderRadius: "0.5rem",
  border: "1.5px solid var(--color-outline-variant)",
  backgroundColor: "var(--color-surface-container-lowest)",
  fontFamily: "var(--font-body)",
  fontSize: "0.9rem",
  color: "var(--color-on-surface)",
  outline: "none",
  boxSizing: "border-box",
};

const tdStyle: React.CSSProperties = {
  padding: "0.625rem 0.75rem",
  color: "var(--color-on-surface)",
  verticalAlign: "middle",
};
