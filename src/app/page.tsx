"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExploreLessonCard from "@/components/explore/ExploreLessonCard";
import { useLessons } from "@/hooks/useLessons";
import type { Campus, Faculty } from "@/context/AppContext";
import { Monitor, Video, Building2, MapPin, ShieldCheck, GraduationCap } from "lucide-react";

const FACULTIES: Faculty[] = [
  "Software Engineering", "Networking", "Information Management",
  "Business", "Theology", "Nursing", "Education",
];

const CAMPUSES: { id: "all" | Exclude<Campus, "both">; label: string }[] = [
  { id: "all",       label: "All Campuses" },
  { id: "masoro",    label: "Masoro" },
  { id: "gishushu",  label: "Gishushu" },
];

const TIERS = [
  { icon: <Monitor size={16} color="rgba(255,255,255,0.9)" />, label: "Recorded",        price: "1,000 RWF" },
  { icon: <Video   size={16} color="rgba(255,255,255,0.9)" />, label: "Online Live",     price: "2,000 RWF" },
  { icon: <Building2 size={16} color="rgba(255,255,255,0.9)" />, label: "AUCA Campus",  price: "3,000 RWF" },
  { icon: <MapPin  size={16} color="rgba(255,255,255,0.9)" />, label: "Custom Location", price: "5,000 RWF" },
];

export default function ExplorePage() {
  const { lessons, loading, fromDb } = useLessons();
  const [campusFilter, setCampusFilter]   = useState<"all" | Exclude<Campus, "both">>("all");
  const [facultyFilter, setFacultyFilter] = useState<"all" | Faculty>("all");

  const filtered = useMemo(() => lessons.filter((l) => {
    const mc = campusFilter === "all" || l.campus === campusFilter || l.campus === "both";
    const mf = facultyFilter === "all" || l.facultyKey === facultyFilter;
    return mc && mf;
  }), [lessons, campusFilter, facultyFilter]);

  return (
    <>
      <Header />
      <main style={{ width: "100%", minHeight: "100vh", backgroundColor: "var(--color-surface-container-low)" }}>

        {/* â”€â”€ Hero banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #3525cd 55%, #4f46e5 100%)",
          padding: "2.5rem 2rem",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>

            {/* Left copy */}
            <div style={{ maxWidth: "36rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "0.375rem", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={16} color="white" />
                </div>
                <span style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  AUCA Peer-to-Peer Learning
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 0.75rem" }}>
                AUCA&apos;s Peer Academic Marketplace
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.72)", margin: "0 0 1.25rem", lineHeight: 1.65 }}>
                Learn from verified AUCA students â€” Masoro &amp; Gishushu campuses. Book recorded lessons, live sessions, campus meetups, or custom locations across Kigali.
              </p>
              {/* Trust badges */}
              <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                {[
                  { icon: <ShieldCheck size={13} />, label: "Escrow Protected" },
                  { icon: <GraduationCap size={13} />, label: "AUCA Verified" },
                  { icon: <span style={{ fontSize: "0.8rem" }}>ðŸ“±</span>, label: "MTN MoMo & Airtel" },
                ].map((b) => (
                  <span key={b.label} style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.3125rem 0.75rem", borderRadius: "9999px",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.88)",
                    fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600,
                  }}>
                    {b.icon} {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right â€” 4 tier pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", flexShrink: 0 }}>
              {TIERS.map((t) => (
                <div key={t.label} style={{
                  display: "flex", alignItems: "center", gap: "0.625rem",
                  padding: "0.625rem 0.875rem", borderRadius: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  minWidth: "160px",
                }}>
                  {t.icon}
                  <div>
                    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700, color: "white", margin: 0 }}>{t.label}</p>
                    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: 0 }}>{t.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* â”€â”€ Sticky filter bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{
          position: "sticky", top: "64px", zIndex: 40,
          backgroundColor: "white",
          borderBottom: "1px solid var(--color-outline-variant)",
          padding: "0.75rem 2rem",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>

            {/* Campus pills */}
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {CAMPUSES.map((c) => {
                const active = campusFilter === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCampusFilter(c.id)}
                    style={{
                      padding: "0.375rem 0.875rem", borderRadius: "9999px",
                      border: active ? "none" : "1.5px solid var(--color-outline-variant)",
                      backgroundColor: active ? "var(--color-primary)" : "transparent",
                      color: active ? "white" : "var(--color-on-surface-variant)",
                      fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600,
                      cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                    }}
                  >{c.label}</button>
                );
              })}
            </div>

            <div style={{ width: "1px", height: "20px", backgroundColor: "var(--color-outline-variant)" }} />

            {/* Faculty chips */}
            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
              {(["all", ...FACULTIES] as ("all" | Faculty)[]).map((f) => {
                const active = facultyFilter === f;
                const label  = f === "all" ? "All Faculties" : f;
                return (
                  <button
                    key={f}
                    onClick={() => setFacultyFilter(f)}
                    style={{
                      padding: "0.3125rem 0.75rem", borderRadius: "9999px",
                      border: active ? "none" : "1.5px solid var(--color-outline-variant)",
                      backgroundColor: active ? "var(--color-secondary)" : "transparent",
                      color: active ? "var(--color-on-secondary)" : "var(--color-on-surface-variant)",
                      fontFamily: "var(--font-label)", fontSize: "0.775rem", fontWeight: 600,
                      cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                    }}
                  >{label}</button>
                );
              })}
            </div>

            <span style={{ marginLeft: "auto", fontFamily: "var(--font-label)", fontSize: "0.775rem", fontWeight: 600, color: "var(--color-on-surface-variant)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {loading && <span style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid var(--color-primary)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", display: "inline-block" }} />}
              {filtered.length} lesson{filtered.length !== 1 ? "s" : ""}
              {fromDb && <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", backgroundColor: "rgba(0,108,73,0.1)", color: "var(--color-secondary)", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700 }}>Live</span>}
            </span>
          </div>
        </div>

        {/* â”€â”€ Lessons grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.75rem 2rem 4rem" }}>
          {filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {filtered.map((lesson) => (
                <ExploreLessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "5rem 2rem", backgroundColor: "white", borderRadius: "1rem", border: "1px solid var(--color-outline-variant)" }}>
              <p style={{ fontFamily: "var(--font-headline)", fontSize: "1.125rem", color: "var(--color-on-surface)", marginBottom: "0.5rem" }}>No lessons found</p>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)", fontSize: "0.875rem" }}>Try clearing the filters.</p>
              <button onClick={() => { setCampusFilter("all"); setFacultyFilter("all"); }}
                style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontWeight: 600, cursor: "pointer" }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

