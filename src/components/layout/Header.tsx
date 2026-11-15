"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap, Building2, ChevronDown, Search,
  Bell, User, LogIn, PlusCircle,
} from "lucide-react";
import OnboardingModal from "@/components/auth/OnboardingModal";
import { useApp } from "@/context/AppContext";

const CAMPUSES = [
  { id: "masoro",   label: "Masoro Campus" },
  { id: "gishushu", label: "Gishushu Campus" },
];

const NAV_LINKS = [
  { label: "Explore",          href: "/" },
  { label: "Study Hub",        href: "/my-learning" },
  { label: "Creator Studio",   href: "/creator" },
];

export default function Header() {
  const { currentUser } = useApp();
  const [campusOpen,    setCampusOpen]    = useState(false);
  const [activeCampus,  setActiveCampus]  = useState(CAMPUSES[0]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchVal,     setSearchVal]     = useState("");

  return (
    <>
      <header style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50, height: "64px",
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-outline-variant)",
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          width: "100%", maxWidth: "1280px", margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex", alignItems: "center", gap: "1rem",
        }}>

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "0.5rem",
              backgroundColor: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <GraduationCap size={18} color="white" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-headline)", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-primary)", letterSpacing: "-0.02em" }}>AMANOTA</span>
              <span style={{ fontFamily: "var(--font-label)", fontSize: "0.6rem", fontWeight: 600, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Peer Academic Network</span>
            </div>
          </Link>

          {/* ── Campus switcher ───────────────────────────────────────── */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setCampusOpen(!campusOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.375rem 0.75rem", borderRadius: "9999px",
                border: "1.5px solid var(--color-outline-variant)",
                backgroundColor: "transparent", cursor: "pointer",
                fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600,
                color: "var(--color-on-surface)", whiteSpace: "nowrap",
              }}
            >
              <Building2 size={14} color="var(--color-secondary)" />
              <span>AUCA · {activeCampus.label}</span>
              <ChevronDown size={13} color="var(--color-outline)" />
            </button>

            {campusOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0,
                backgroundColor: "white", borderRadius: "0.75rem",
                border: "1px solid var(--color-outline-variant)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                padding: "0.375rem", minWidth: "200px", zIndex: 100,
              }}>
                {CAMPUSES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setActiveCampus(c); setCampusOpen(false); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                      border: "none", cursor: "pointer", textAlign: "left",
                      backgroundColor: activeCampus.id === c.id ? "var(--color-primary-fixed)" : "transparent",
                      color: activeCampus.id === c.id ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                      fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600,
                    }}
                  >
                    {c.label}
                    {activeCampus.id === c.id && <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "inline-block" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Search (single instance — the only search bar in the app) */}
          <div style={{
            flex: 1, maxWidth: "24rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: "var(--color-surface-container-low)",
            borderRadius: "0.75rem", padding: "0.5rem 0.875rem",
          }}>
            <Search size={15} color="var(--color-outline)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search courses, tutors, topics…"
              style={{
                flex: 1, border: "none", background: "transparent", outline: "none",
                fontFamily: "var(--font-body)", fontSize: "0.875rem",
                color: "var(--color-on-surface)",
              }}
            />
          </div>

          {/* ── Nav links ─────────────────────────────────────────────── */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.125rem", flexShrink: 0 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.4375rem 0.75rem", borderRadius: "0.5rem",
                  fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600,
                  color: "var(--color-on-surface-variant)", textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-surface-container)"; e.currentTarget.style.color = "var(--color-on-surface)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--color-on-surface-variant)"; }}
              >
                {link.label}
              </Link>
            ))}

            {/* Become a Tutor CTA */}
            <Link
              href="/creator"
              style={{
                marginLeft: "0.25rem",
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.4375rem 0.875rem", borderRadius: "0.5rem",
                backgroundColor: "var(--color-secondary)", color: "var(--color-on-secondary)",
                fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700,
                textDecoration: "none", whiteSpace: "nowrap",
                boxShadow: "0 1px 4px rgba(0,108,73,0.25)",
              }}
            >
              <PlusCircle size={14} />
              Become a Tutor
            </Link>

            {/* Bell */}
            <button style={{
              marginLeft: "0.25rem",
              width: "36px", height: "36px", borderRadius: "0.5rem",
              border: "none", background: "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--color-on-surface-variant)", position: "relative",
            }}>
              <Bell size={18} />
              <span style={{
                position: "absolute", top: "6px", right: "6px",
                width: "7px", height: "7px", borderRadius: "50%",
                backgroundColor: "var(--color-error)", border: "1.5px solid white",
              }} />
            </button>

            {/* User / Sign-in */}
            {currentUser.isOnboarded ? (
              <Link href="/my-learning" style={{ marginLeft: "0.25rem" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700,
                  color: "white", cursor: "pointer",
                }}>
                  {currentUser.initials || <User size={15} color="white" />}
                </div>
              </Link>
            ) : (
              <button
                onClick={() => setShowOnboarding(true)}
                style={{
                  marginLeft: "0.25rem",
                  display: "flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.4375rem 0.875rem", borderRadius: "0.5rem",
                  border: "1.5px solid var(--color-primary)",
                  backgroundColor: "transparent", cursor: "pointer",
                  fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700,
                  color: "var(--color-primary)", whiteSpace: "nowrap",
                }}
              >
                <LogIn size={14} />
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
