"use client";

import { useState } from "react";
import LessonCard from "./LessonCard";
import SessionCard from "./SessionCard";
import EscrowBanner from "./EscrowBanner";
import { lessons, sessions } from "@/lib/data";

type Tab = "lessons" | "sessions" | "history";

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("lessons");

  const tabs: { id: Tab; label: string; icon: string; badge: React.ReactNode }[] = [
    {
      id: "lessons",
      label: "Unlocked Recorded Lessons",
      icon: "play_lesson",
      badge: (
        <span
          style={{
            padding: "0.125rem 0.5rem",
            borderRadius: "9999px",
            backgroundColor: "white",
            color: "var(--color-primary)",
            fontSize: "0.7rem",
            fontWeight: 700,
          }}
        >
          6
        </span>
      ),
    },
    {
      id: "sessions",
      label: "Upcoming Tutoring Sessions",
      icon: "event_upcoming",
      badge: (
        <span
          style={{
            padding: "0.125rem 0.5rem",
            borderRadius: "9999px",
            backgroundColor: "var(--color-secondary-container)",
            color: "var(--color-on-secondary-container)",
            fontSize: "0.7rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.125rem",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "0.8rem" }}>
            verified_user
          </span>
          AUCA Escrow Protected
        </span>
      ),
    },
    {
      id: "history",
      label: "Past Sessions & Notes",
      icon: "history_edu",
      badge: (
        <span
          style={{
            padding: "0.125rem 0.5rem",
            borderRadius: "9999px",
            backgroundColor: "var(--color-surface-container)",
            color: "var(--color-on-surface-variant)",
            fontSize: "0.7rem",
            fontWeight: 700,
          }}
        >
          12
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          backgroundColor: "var(--color-surface-container-lowest)",
          padding: "0.5rem",
          borderRadius: "1rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", overflowX: "auto" }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                  fontFamily: "var(--font-label)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  boxShadow: isActive ? "0 1px 4px rgba(53,37,205,0.2)" : "none",
                  transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--color-surface-container)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-on-surface)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-on-surface-variant)";
                  }
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge}
              </button>
            );
          })}
        </div>

        {/* Filter (desktop only) */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Filter my courses..."
            style={{
              paddingLeft: "2.25rem",
              paddingRight: "0.75rem",
              paddingTop: "0.375rem",
              paddingBottom: "0.375rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              backgroundColor: "var(--color-surface-container-low)",
              border: "none",
              borderRadius: "0.5rem",
              outline: "none",
              width: "13rem",
              color: "var(--color-on-surface)",
            }}
          />
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: "0.625rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-outline)",
              fontSize: "1.1rem",
              pointerEvents: "none",
            }}
          >
            filter_list
          </span>
        </div>
      </div>

      {/* TAB 1: Lessons */}
      {activeTab === "lessons" && (
        <div>
          {/* Info bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              backgroundColor: "rgba(226,223,255,0.35)",
              borderRadius: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "var(--color-on-primary)", fontSize: "1.375rem" }}
                >
                  verified
                </span>
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--color-on-surface)",
                    margin: 0,
                  }}
                >
                  1,000 RWF Micro-Course Purchases
                </h4>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "var(--color-on-surface-variant)",
                    margin: 0,
                  }}
                >
                  Permanent lecture playback with complete localized code examples and printable AUCA/UR-CST summaries.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "0.75rem",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Storage: 1.8 GB Offline Cached
              </span>
              <button
                style={{
                  padding: "0.375rem 0.875rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "var(--color-surface-container-lowest)",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-label)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  transition: "background 0.15s",
                }}
              >
                Manage Downloads
              </button>
            </div>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Sessions */}
      {activeTab === "sessions" && (
        <div>
          <EscrowBanner />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1.5rem",
            }}
          >
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: History (placeholder) */}
      {activeTab === "history" && (
        <div
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderRadius: "1rem",
            padding: "3rem",
            textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "3rem",
              color: "var(--color-outline)",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            history_edu
          </span>
          <h3
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-on-surface)",
              marginBottom: "0.5rem",
            }}
          >
            12 Past Sessions
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>
            Your session history, notes, and downloadable transcripts will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
