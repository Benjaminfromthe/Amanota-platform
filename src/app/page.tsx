"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExploreLessonCard from "@/components/explore/ExploreLessonCard";
import { useApp } from "@/context/AppContext";
import type { Campus, Faculty } from "@/context/AppContext";

const FACULTIES: Faculty[] = [
  "Software Engineering",
  "Networking",
  "Information Management",
  "Business",
  "Theology",
  "Nursing",
  "Education",
];

const CAMPUSES: { id: "all" | Campus; label: string }[] = [
  { id: "all", label: "All Campuses" },
  { id: "masoro", label: "Masoro Campus" },
  { id: "gishushu", label: "Gishushu Campus" },
];

export default function ExplorePage() {
  const { lessons } = useApp();
  const [search, setSearch] = useState("");
  const [campusFilter, setCampusFilter] = useState<"all" | Campus>("all");
  const [facultyFilter, setFacultyFilter] = useState<"all" | Faculty>("all");

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const matchCampus =
        campusFilter === "all" || l.campus === campusFilter || l.campus === "both";
      const matchFaculty =
        facultyFilter === "all" || l.facultyKey === facultyFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.courseCode.toLowerCase().includes(q) ||
        l.instructor.name.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q));
      return matchCampus && matchFaculty && matchSearch;
    });
  }, [lessons, search, campusFilter, facultyFilter]);

  return (
    <>
      <Header />
      <main style={{ width: "100%", paddingTop: "5rem", minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>

        {/* ── Hero band ───────────────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(to bottom, rgba(222,232,255,0.5) 0%, var(--color-surface) 70%)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem 2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700 }}>
                AUCA Peer Academic Network
              </span>
              <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>verified_user</span>
                Escrow Protected
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, color: "var(--color-on-surface)", letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 0.75rem" }}>
              AUCA&apos;s Peer Academic Marketplace
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.0625rem", color: "var(--color-on-surface-variant)", maxWidth: "36rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
              Learn from verified AUCA students — Masoro &amp; Gishushu campuses. 1,000 RWF per recorded lesson. Book live or in-person sessions too.
            </p>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "0.75rem 1rem", maxWidth: "36rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--color-outline)", fontSize: "1.4rem", flexShrink: 0 }}>search</span>
              <input
                type="text"
                placeholder="Search course codes, topics, or tutor names…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-on-surface)" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-outline)", display: "flex", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Filter bar ──────────────────────────────────────────────────── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem 2rem 0.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Campus pills */}
          <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
            {CAMPUSES.map((c) => {
              const active = campusFilter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCampusFilter(c.id)}
                  style={{ padding: "0.375rem 0.875rem", borderRadius: "9999px", border: active ? "none" : "1.5px solid var(--color-outline-variant)", backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "var(--color-on-primary)" : "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "1.5rem", backgroundColor: "var(--color-outline-variant)", flexShrink: 0 }} />

          {/* Faculty chips */}
          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {(["all", ...FACULTIES] as ("all" | Faculty)[]).map((f) => {
              const active = facultyFilter === f;
              const label = f === "all" ? "All Faculties" : f;
              return (
                <button
                  key={f}
                  onClick={() => setFacultyFilter(f)}
                  style={{ padding: "0.375rem 0.875rem", borderRadius: "9999px", border: active ? "none" : "1.5px solid var(--color-outline-variant)", backgroundColor: active ? "var(--color-secondary)" : "transparent", color: active ? "var(--color-on-secondary)" : "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 2rem 4rem" }}>
          <p style={{ fontFamily: "var(--font-label)", fontSize: "0.8125rem", color: "var(--color-on-surface-variant)", marginBottom: "1.25rem" }}>
            <strong style={{ color: "var(--color-on-surface)" }}>{filtered.length}</strong> lesson{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {filtered.map((lesson) => (
                <ExploreLessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "5rem 2rem", backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "var(--color-outline)", display: "block", marginBottom: "1rem" }}>search_off</span>
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", color: "var(--color-on-surface)", marginBottom: "0.5rem" }}>No lessons found</h3>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)", fontSize: "0.9rem" }}>
                Try a different search term or clear the filters.
              </p>
              <button
                onClick={() => { setSearch(""); setCampusFilter("all"); setFacultyFilter("all"); }}
                style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontWeight: 600, cursor: "pointer" }}
              >
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
