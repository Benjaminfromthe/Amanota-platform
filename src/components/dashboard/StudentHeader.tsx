"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function StudentHeader() {
  const { currentUser } = useApp();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
      }}
    >
      {/* Identity */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "1rem",
              backgroundColor: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-on-primary)",
              fontFamily: "var(--font-headline)",
              fontSize: "1.25rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(53,37,205,0.2)",
            }}
          >
            {currentUser.initials}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "-0.25rem",
              right: "-0.25rem",
              width: "1.25rem",
              height: "1.25rem",
              borderRadius: "9999px",
              backgroundColor: "var(--color-secondary)",
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: "var(--color-on-secondary)",
                fontSize: "0.75rem",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              check
            </span>
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "var(--color-on-surface)",
                letterSpacing: "-0.01em",
              }}
            >
            {currentUser.name}
            </span>
            <span
              style={{
                padding: "0.125rem 0.625rem",
                borderRadius: "9999px",
                backgroundColor: "var(--color-primary-fixed)",
                color: "var(--color-on-primary-fixed-variant)",
                fontFamily: "var(--font-label)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
              }}
            >
              AUCA Active Learner
            </span>
            <span
              style={{
                padding: "0.125rem 0.625rem",
                borderRadius: "9999px",
                backgroundColor: "var(--color-secondary-container)",
                color: "var(--color-on-secondary-container)",
                fontFamily: "var(--font-label)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "0.8rem" }}>
                verified_user
              </span>
              AUCA Escrow Protected
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-on-surface-variant)",
              marginTop: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              flexWrap: "wrap",
            }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--color-outline)", fontSize: "1.1rem" }}>
              school
            </span>
            <span>AUCA Faculty of Information Technology • Software Engineering</span>
            <span style={{ color: "var(--color-outline)" }}>•</span>
            <span
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-label)",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              AUCA Student ID Verified: AUCA-CS-2022-894 (@auca.ac.rw)
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Link
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1rem",
            borderRadius: "0.5rem",
            backgroundColor: "var(--color-surface-container-lowest)",
            border: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            fontFamily: "var(--font-label)",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-on-surface)",
            textDecoration: "none",
            transition: "background 0.15s",
          }}
        >
          <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", fontSize: "1.2rem" }}>
            calendar_today
          </span>
          Sync Google Calendar
        </Link>
        <Link
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1rem",
            borderRadius: "0.5rem",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-on-primary)",
            fontFamily: "var(--font-label)",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(53,37,205,0.25)",
            transition: "background 0.15s",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
            add_circle
          </span>
          Book New Tutor
        </Link>
      </div>
    </div>
  );
}
