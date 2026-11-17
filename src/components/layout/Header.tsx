"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap, Building2, ChevronDown, Search,
  Bell, User, LogIn, PlusCircle, LogOut, BookOpen,
  Settings, ChevronRight,
} from "lucide-react";
import OnboardingModal from "@/components/auth/OnboardingModal";
import { useAuth } from "@/context/AuthContext";

const CAMPUSES = [
  { id: "masoro",   label: "Masoro Campus" },
  { id: "gishushu", label: "Gishushu Campus" },
];

const NAV_LINKS = [
  { label: "Explore",        href: "/" },
  { label: "Study Hub",      href: "/my-learning" },
  { label: "Creator Studio", href: "/creator" },
];

export default function Header() {
  const router                             = useRouter();
  const { user, profile, signOut, loading } = useAuth();
  const [campusOpen,     setCampusOpen]     = useState(false);
  const [activeCampus,   setActiveCampus]   = useState(CAMPUSES[0]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userMenuOpen,   setUserMenuOpen]   = useState(false);

  const isLoggedIn = !!user && !loading;

  const displayName    = profile?.full_name   || user?.email?.split("@")[0] || "User";
  const displayInitials = displayName.trim().split(/\s+/).map((w: string) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("") || "AU";
  const campusBadge    = profile?.campus === "gishushu" ? "Gishushu Campus" : "Masoro Campus";

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50, height: "64px",
        backgroundColor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-outline-variant)",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "0.5rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={18} color="white" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-headline)", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-primary)", letterSpacing: "-0.02em" }}>AMANOTA</span>
              <span style={{ fontFamily: "var(--font-label)", fontSize: "0.6rem", fontWeight: 600, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Peer Academic Network</span>
            </div>
          </Link>

          {/* Campus switcher */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={() => setCampusOpen(!campusOpen)}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", borderRadius: "9999px", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-surface)", whiteSpace: "nowrap" }}>
              <Building2 size={14} color="var(--color-secondary)" />
              <span>AUCA · {activeCampus.label}</span>
              <ChevronDown size={13} color="var(--color-outline)" />
            </button>
            {campusOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid var(--color-outline-variant)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: "0.375rem", minWidth: "200px", zIndex: 100 }}>
                {CAMPUSES.map((c) => (
                  <button key={c.id} onClick={() => { setActiveCampus(c); setCampusOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", textAlign: "left", backgroundColor: activeCampus.id === c.id ? "var(--color-primary-fixed)" : "transparent", color: activeCampus.id === c.id ? "var(--color-primary)" : "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600 }}>
                    {c.label}
                    {activeCampus.id === c.id && <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "inline-block" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: "24rem", display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--color-surface-container-low)", borderRadius: "0.75rem", padding: "0.5rem 0.875rem" }}>
            <Search size={15} color="var(--color-outline)" style={{ flexShrink: 0 }} />
            <input type="text" placeholder="Search courses, tutors, topics…"
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface)" }} />
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.125rem", flexShrink: 0 }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                style={{ padding: "0.4375rem 0.75rem", borderRadius: "0.5rem", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-surface-variant)", textDecoration: "none", transition: "background 0.15s, color 0.15s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-surface-container)"; e.currentTarget.style.color = "var(--color-on-surface)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--color-on-surface-variant)"; }}
              >
                {link.label}
              </Link>
            ))}

            {/* Become a Tutor CTA */}
            <Link href="/creator" style={{ marginLeft: "0.25rem", display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.4375rem 0.875rem", borderRadius: "0.5rem", backgroundColor: "var(--color-secondary)", color: "var(--color-on-secondary)", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 1px 4px rgba(0,108,73,0.25)" }}>
              <PlusCircle size={14} /> Become a Tutor
            </Link>

            {/* Bell */}
            <button style={{ marginLeft: "0.25rem", width: "36px", height: "36px", borderRadius: "0.5rem", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "var(--color-on-surface-variant)" }}>
              <Bell size={18} />
              {isLoggedIn && <span style={{ position: "absolute", top: "6px", right: "6px", width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--color-error)", border: "1.5px solid white" }} />}
            </button>

            {/* ── Auth zone ──────────────────────────────────────────── */}
            {loading ? (
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--color-surface-container)", marginLeft: "0.25rem" }} />
            ) : isLoggedIn ? (
              /* Logged-in: avatar + name + campus badge + dropdown */
              <div style={{ position: "relative", marginLeft: "0.25rem" }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3125rem 0.5rem 0.3125rem 0.3125rem", borderRadius: "9999px", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "white", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-primary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-outline-variant)"; }}
                >
                  {/* Avatar */}
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {displayInitials}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.1 }}>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: "0.775rem", fontWeight: 700, color: "var(--color-on-surface)", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {displayName.split(" ")[0]}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.1875rem", fontFamily: "var(--font-label)", fontSize: "0.6rem", fontWeight: 600, color: "var(--color-secondary)" }}>
                      <Building2 size={9} /> {campusBadge}
                    </span>
                  </div>
                  <ChevronDown size={12} color="var(--color-outline)" />
                </button>

                {/* User dropdown */}
                {userMenuOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, backgroundColor: "white", borderRadius: "0.875rem", border: "1px solid var(--color-outline-variant)", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", padding: "0.5rem", minWidth: "220px", zIndex: 100 }}
                    onMouseLeave={() => setUserMenuOpen(false)}>
                    {/* User info */}
                    <div style={{ padding: "0.75rem 0.875rem", borderBottom: "1px solid var(--color-outline-variant)", marginBottom: "0.375rem" }}>
                      <p style={{ fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.125rem" }}>{displayName}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)", margin: "0 0 0.25rem" }}>{user?.email}</p>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.1875rem", padding: "0.125rem 0.5rem", borderRadius: "9999px", backgroundColor: profile?.role === "tutor" ? "var(--color-secondary-container)" : "var(--color-primary-fixed)", color: profile?.role === "tutor" ? "var(--color-on-secondary-container)" : "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, textTransform: "capitalize" }}>
                        {profile?.role === "tutor" ? "Peer Tutor" : "Student"} · {campusBadge}
                      </span>
                    </div>

                    {[
                      { icon: <BookOpen size={15} />, label: "My Learning", href: "/my-learning" },
                      { icon: <Settings size={15} />,  label: "Creator Studio", href: "/creator" },
                    ].map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5625rem 0.875rem", borderRadius: "0.5rem", textDecoration: "none", color: "var(--color-on-surface)", fontFamily: "var(--font-label)", fontSize: "0.825rem", fontWeight: 600, transition: "background 0.1s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-surface-container-low)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
                      >
                        <span style={{ color: "var(--color-on-surface-variant)" }}>{item.icon}</span>
                        {item.label}
                        <ChevronRight size={13} style={{ marginLeft: "auto", color: "var(--color-outline)" }} />
                      </Link>
                    ))}

                    <div style={{ borderTop: "1px solid var(--color-outline-variant)", marginTop: "0.375rem", paddingTop: "0.375rem" }}>
                      <button onClick={handleSignOut}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5625rem 0.875rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", backgroundColor: "transparent", color: "var(--color-error)", fontFamily: "var(--font-label)", fontSize: "0.825rem", fontWeight: 600, transition: "background 0.1s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-error-container)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged-out: Sign In + Sign Up */
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "0.25rem" }}>
                <Link href="/login"
                  style={{ display: "flex", alignItems: "center", gap: "0.3125rem", padding: "0.4375rem 0.875rem", borderRadius: "0.5rem", border: "1.5px solid var(--color-primary)", backgroundColor: "transparent", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                  <LogIn size={14} /> Sign In
                </Link>
                <Link href="/signup"
                  style={{ display: "flex", alignItems: "center", gap: "0.3125rem", padding: "0.4375rem 0.875rem", borderRadius: "0.5rem", border: "none", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 1px 4px rgba(53,37,205,0.25)" }}>
                  <User size={14} /> Sign Up
                </Link>
              </div>
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
