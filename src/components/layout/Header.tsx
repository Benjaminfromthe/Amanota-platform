"use client";

import { useState } from "react";
import Link from "next/link";
import OnboardingModal from "@/components/auth/OnboardingModal";
import { useApp } from "@/context/AppContext";

const campuses = [
  { id: "masoro", label: "Masoro Campus (Main)", active: true },
  { id: "gishushu", label: "Gishushu Campus (Kigali Science & Tech)", active: false },
];

export default function Header() {
  const [campusOpen, setCampusOpen] = useState(false);
  const [activeCampus, setActiveCampus] = useState(campuses[0]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { currentUser } = useApp();

  return (
    <>
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          height: "5rem",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        {/* Left: Logo + Campus switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "0.75rem",
                backgroundColor: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-on-primary)", fontSize: "1.4rem" }}>
                school
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                AMANOTA
              </span>
              <span
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "var(--color-on-surface-variant)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Peer Academic Network
              </span>
            </div>
          </Link>

          {/* Campus Switcher */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCampusOpen(!campusOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.375rem 0.75rem",
                borderRadius: "9999px",
                backgroundColor: "var(--color-surface-container-low)",
                border: "none",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontFamily: "var(--font-label)",
                fontWeight: 600,
                color: "var(--color-on-surface)",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-secondary)", fontSize: "1rem" }}>
                domain
              </span>
              <span>AUCA — {activeCampus.id === "masoro" ? "Masoro" : "Gishushu"} Campus</span>
              <span className="material-symbols-outlined" style={{ color: "var(--color-outline)", fontSize: "1rem" }}>
                keyboard_arrow_down
              </span>
            </button>

            {campusOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.25rem)",
                  left: 0,
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 25px -5px rgba(30,41,59,0.12)",
                  padding: "0.5rem",
                  minWidth: "16rem",
                  zIndex: 100,
                }}
              >
                {campuses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setActiveCampus(c); setCampusOpen(false); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor:
                        activeCampus.id === c.id
                          ? "rgba(226,223,255,0.5)"
                          : "transparent",
                      color:
                        activeCampus.id === c.id
                          ? "var(--color-primary)"
                          : "var(--color-on-surface-variant)",
                      fontFamily: "var(--font-label)",
                      fontSize: "0.8rem",
                      fontWeight: activeCampus.id === c.id ? 700 : 400,
                      textAlign: "left",
                    }}
                  >
                    <span>{c.label}</span>
                    {activeCampus.id === c.id && (
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Centre: Search */}
        <div style={{ flex: 1, maxWidth: "30rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--color-surface-container-low)",
              borderRadius: "0.75rem",
              padding: "0.5rem 0.75rem",
            }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--color-outline)", fontSize: "1.2rem" }}>
              search
            </span>
            <input
              type="text"
              placeholder="Search course codes (e.g. MAT201, BIO105), topics, or tutors..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--color-on-surface)",
              }}
            />
            <kbd
              style={{
                padding: "0.125rem 0.375rem",
                borderRadius: "0.25rem",
                backgroundColor: "var(--color-surface-container-highest)",
                color: "var(--color-on-surface-variant)",
                fontSize: "0.65rem",
                fontFamily: "var(--font-label)",
                fontWeight: 700,
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Nav + CTA + icons */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {[
            { label: "Courses", href: "/" },
            { label: "Find Tutors", href: "/lesson/comp201" },
            { label: "Study Hub", href: "/my-learning" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                fontFamily: "var(--font-label)",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--color-on-surface-variant)",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.backgroundColor = "var(--color-surface-container)";
                e.currentTarget.style.color = "var(--color-on-surface)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-on-surface-variant)";
              }}
            >
              {label}
            </Link>
          ))}

          <Link
            href="/creator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.625rem 1rem",
              borderRadius: "0.5rem",
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-on-secondary)",
              fontFamily: "var(--font-label)",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              transition: "background 0.15s",
            }}
          >
            Become a Tutor
          </Link>

          {/* Notifications */}
          <button
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              color: "var(--color-on-surface-variant)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.375rem" }}>
              notifications
            </span>
            <span
              style={{
                position: "absolute",
                top: "0.625rem",
                right: "0.625rem",
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                backgroundColor: "var(--color-error)",
              }}
            />
          </button>

          {/* Avatar / Sign-in */}
          {currentUser.isOnboarded ? (
            <Link href="/my-learning" title={currentUser.name}>
              <div style={{ width: "2rem", height: "2rem", borderRadius: "9999px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700 }}>{currentUser.initials}</span>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setShowOnboarding(true)}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.875rem", borderRadius: "9999px", border: "1.5px solid var(--color-primary)", backgroundColor: "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>login</span>
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>

    {showOnboarding && (
      <OnboardingModal onClose={() => setShowOnboarding(false)} />
    )}
    </>
  );
}
