import Link from "next/link";
import { GraduationCap, Settings } from "lucide-react";

const LINKS = {
  Academics: ["Verified Course Modules", "Interactive Video Lectures", "1-on-1 Peer Mentors"],
  Campuses:  ["UR - College of Science & Tech", "AUCA Campuses", "Submit University Program"],
  Tutors:    ["Apply as Peer Tutor", "Tutoring Guidelines", "Earnings & Payouts"],
};

const LS: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "0.8375rem",
  color: "var(--color-on-surface-variant)", textDecoration: "none",
};

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "white",
      borderTop: "1px solid var(--color-outline-variant)",
      padding: "3rem 2rem 1.5rem",
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)",
        gap: "2.5rem", alignItems: "start",
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "0.375rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={16} color="white" />
            </div>
            <span style={{ fontFamily: "var(--font-headline)", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-primary)" }}>AMANOTA</span>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.825rem", color: "var(--color-on-surface-variant)", maxWidth: "16rem", lineHeight: 1.65, margin: 0 }}>
            The high-trust academic video learning library and verified peer tutoring marketplace for AUCA campus excellence.
          </p>
        </div>

        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-on-surface)", marginBottom: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {heading}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {links.map((l) => (
                <li key={l}><Link href="#" style={LS}>{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: "1280px", margin: "2rem auto 0",
        paddingTop: "1rem", borderTop: "1px solid var(--color-outline-variant)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "0.75rem",
      }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)" }}>
          © 2025 AMANOTA Academic Technologies. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {["Privacy Policy", "Honor Code", "Terms of Service"].map((item) => (
            <Link key={item} href="#" style={{ ...LS, fontSize: "0.775rem" }}>{item}</Link>
          ))}
          <Link href="/admin/ledger" style={{
            display: "flex", alignItems: "center", gap: "0.25rem",
            fontFamily: "var(--font-label)", fontSize: "0.725rem", fontWeight: 600,
            color: "var(--color-outline)", textDecoration: "none", opacity: 0.75,
          }}>
            <Settings size={12} />
            Platform Ledger
          </Link>
        </div>
      </div>
    </footer>
  );
}
