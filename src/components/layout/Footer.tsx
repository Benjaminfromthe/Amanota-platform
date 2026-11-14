import Link from "next/link";

const footerLinks = {
  Academics: ["Verified Course Modules", "Interactive Video Lectures", "1-on-1 Peer Mentors"],
  Campuses: [
    "UR - College of Science & Tech",
    "AUCA Campuses",
    "Submit University Program",
  ],
  Tutors: ["Apply as Peer Tutor", "Tutoring Guidelines", "Earnings & Payouts"],
};

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-surface-container-lowest)",
        borderTop: "1px solid var(--color-outline-variant)",
        padding: "3rem 2rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr repeat(3, auto)",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.5rem",
                backgroundColor: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "white", fontSize: "1.1rem" }}>
                school
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--color-primary)",
              }}
            >
              AMANOTA
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-on-surface-variant)",
              maxWidth: "16rem",
              lineHeight: 1.6,
            }}
          >
            The high-trust academic video learning library and verified peer tutoring marketplace for campus excellence.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h4
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--color-on-surface)",
                marginBottom: "0.75rem",
              }}
            >
              {heading}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {links.map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--color-on-surface-variant)",
                      textDecoration: "none",
                    }}
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "2rem auto 0",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-outline-variant)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)" }}>
          © 2025 AMANOTA Academic Technologies. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {["Privacy Policy", "Honor Code", "Terms of Service"].map((item) => (
            <Link
              key={item}
              href="#"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "var(--color-on-surface-variant)",
                textDecoration: "none",
              }}
            >
              {item}
            </Link>
          ))}
          <Link
            href="/admin/ledger"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--color-outline)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              opacity: 0.7,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>admin_panel_settings</span>
            Platform Ledger
          </Link>
        </div>
      </div>
    </footer>
  );
}
