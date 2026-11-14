"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { Faculty, Campus } from "@/context/AppContext";

const FACULTIES: Faculty[] = [
  "Software Engineering",
  "Networking",
  "Information Management",
  "Business",
  "Theology",
  "Nursing",
  "Education",
];

type Mode = "choose" | "register" | "signin";

interface Props {
  onClose: () => void;
  /* Optional headline shown above the modal — e.g. "Sign in to book a session" */
  reason?: string;
}

export default function OnboardingModal({ onClose, reason }: Props) {
  const { completeOnboarding } = useApp();
  const [mode, setMode] = useState<Mode>("choose");

  // Register fields
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState<Faculty>("Software Engineering");
  const [campus, setCampus] = useState<Exclude<Campus, "both">>("masoro");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Sign-in fields (re-use name + studentId as the "credential")
  const [siName, setSiName] = useState("");
  const [siId, setSiId] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Full name is required."); return; }
    if (!/^\d{4,6}$/.test(studentId.trim())) { setError("AUCA Student ID must be 4–6 digits (e.g. 28318)."); return; }
    setError("");
    completeOnboarding({ name: name.trim(), studentId: studentId.trim(), faculty, campus });
    setSuccess(true);
    setTimeout(onClose, 1600);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siName.trim() || !/^\d{4,6}$/.test(siId.trim())) {
      setError("Enter your registered name and AUCA Student ID.");
      return;
    }
    setError("");
    completeOnboarding({ name: siName.trim(), studentId: siId.trim(), faculty: "Software Engineering", campus: "masoro" });
    setSuccess(true);
    setTimeout(onClose, 1600);
  };

  return (
    /* ── Backdrop ── */
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1.5rem", width: "100%", maxWidth: "28rem", boxShadow: "0 25px 50px -12px rgba(30,41,59,0.3)", overflow: "hidden" }}>

        {/* ── Header band ── */}
        <div style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%)", padding: "1.5rem 1.75rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                <span className="material-symbols-outlined" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.5rem" }}>school</span>
                <span style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "white" }}>AMANOTA</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                {reason ?? "AUCA Peer Academic Network"}
              </p>
            </div>
            <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,0.15)", borderRadius: "0.5rem", cursor: "pointer", color: "white", width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>close</span>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "1.5rem 1.75rem" }}>

          {/* Success state */}
          {success && (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary-container)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "2rem", color: "var(--color-secondary)", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.375rem" }}>Welcome to AMANOTA!</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: 0 }}>Your AUCA account is verified and ready.</p>
            </div>
          )}

          {/* Choose mode */}
          {!success && mode === "choose" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.5rem" }}>Join AMANOTA</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.5rem" }}>
                Sign in with your AUCA Student ID or create a new account.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  onClick={() => setMode("register")}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", borderRadius: "0.875rem", border: "2px solid var(--color-primary)", backgroundColor: "rgba(226,223,255,0.15)", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(226,223,255,0.3)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(226,223,255,0.15)"; }}
                >
                  <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.625rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: "white", fontSize: "1.375rem" }}>person_add</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-primary)", margin: "0 0 0.125rem" }}>Create New Account</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)", margin: 0 }}>Register with your AUCA Student ID</p>
                  </div>
                </button>

                <button
                  onClick={() => setMode("signin")}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", borderRadius: "0.875rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-surface-container-low)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                >
                  <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.625rem", backgroundColor: "var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--color-on-surface-variant)", fontSize: "1.375rem" }}>login</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.125rem" }}>Sign In</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)", margin: 0 }}>Already have an AMANOTA account</p>
                  </div>
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
                {["AUCA Verified", "Escrow Protected", "Masoro & Gishushu"].map((badge) => (
                  <span key={badge} style={{ padding: "0.25rem 0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600 }}>{badge}</span>
                ))}
              </div>
            </div>
          )}

          {/* Register form */}
          {!success && mode === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <button type="button" onClick={() => { setMode("choose"); setError(""); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, padding: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_back</span> Back
                </button>
                <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>Create AUCA Account</h2>
              </div>

              <FieldGroup label="Full Name *">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cedric Ishimwe" style={inputSt} required />
              </FieldGroup>

              <FieldGroup label="AUCA Student ID *">
                <input type="text" inputMode="numeric" value={studentId} onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 28318" maxLength={6} style={inputSt} required />
              </FieldGroup>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <FieldGroup label="Faculty">
                  <select value={faculty} onChange={(e) => setFaculty(e.target.value as Faculty)} style={inputSt}>
                    {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </FieldGroup>
                <FieldGroup label="Primary Campus">
                  <select value={campus} onChange={(e) => setCampus(e.target.value as Exclude<Campus, "both">)} style={inputSt}>
                    <option value="masoro">Masoro Campus</option>
                    <option value="gishushu">Gishushu Campus</option>
                  </select>
                </FieldGroup>
              </div>

              {error && <ErrorMsg msg={error} />}

              <button type="submit" style={primaryBtnSt}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>verified_user</span>
                Create AUCA Account
              </button>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)", textAlign: "center", margin: 0 }}>
                Your Student ID generates your @auca.ac.rw email automatically.
              </p>
            </form>
          )}

          {/* Sign-in form */}
          {!success && mode === "signin" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <button type="button" onClick={() => { setMode("choose"); setError(""); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, padding: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_back</span> Back
                </button>
                <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>Sign In</h2>
              </div>

              <FieldGroup label="Full Name">
                <input type="text" value={siName} onChange={(e) => setSiName(e.target.value)} placeholder="e.g. Cedric Ishimwe" style={inputSt} required />
              </FieldGroup>

              <FieldGroup label="AUCA Student ID">
                <input type="text" inputMode="numeric" value={siId} onChange={(e) => setSiId(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 28318" maxLength={6} style={inputSt} required />
              </FieldGroup>

              {error && <ErrorMsg msg={error} />}

              <button type="submit" style={primaryBtnSt}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>login</span>
                Sign In to AMANOTA
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.375rem" }}>{label}</p>
      {children}
    </label>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.375rem", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)" }}>
      <span className="material-symbols-outlined" style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.0625rem" }}>error</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>{msg}</span>
    </div>
  );
}

const inputSt: React.CSSProperties = {
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

const primaryBtnSt: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.75rem",
  border: "none",
  cursor: "pointer",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-on-primary)",
  fontFamily: "var(--font-label)",
  fontSize: "0.95rem",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
};
