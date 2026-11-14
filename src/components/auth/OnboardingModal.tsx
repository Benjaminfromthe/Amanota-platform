"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import type { Faculty, Campus } from "@/context/AppContext";

const FACULTIES: Faculty[] = [
  "Software Engineering", "Networking", "Information Management",
  "Business", "Theology", "Nursing", "Education",
];

type Mode = "choose" | "register" | "signin";

interface Props {
  onClose: () => void;
  reason?: string;
  onSuccess?: () => void;
}

export default function OnboardingModal({ onClose, reason, onSuccess }: Props) {
  const sb = getSupabaseClient();
  const [mode, setMode] = useState<Mode>("choose");

  // Register fields
  const [name, setName]           = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty]     = useState<Faculty>("Software Engineering");
  const [campus, setCampus]       = useState<Exclude<Campus, "both">>("masoro");
  const [role, setRole]           = useState<"student" | "tutor">("student");

  // Sign-in field
  const [siEmail, setSiEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // ── Register: signUp with Supabase Auth ────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim())                           { setError("Full name is required."); return; }
    if (!/^\d{4,6}$/.test(studentId.trim()))   { setError("AUCA Student ID must be 4–6 digits (e.g. 28318)."); return; }
    setError(""); setLoading(true);

    const email = `${studentId.trim()}@auca.ac.rw`;

    const { error: signUpError } = await sb.auth.signUp({
      email,
      password: `AUCA-${studentId.trim()}-${name.trim().split(" ")[0]}`,
      options: {
        data: {
          full_name:  name.trim(),
          student_id: studentId.trim(),
          faculty,
          campus,
          role,
        },
      },
    });

    setLoading(false);
    if (signUpError) { setError(signUpError.message); return; }

    setSuccess("Account created! Check your AUCA email to confirm, or sign in directly.");
    onSuccess?.();
    setTimeout(onClose, 3000);
  };

  // ── Sign-in: passwordless magic link ──────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawEmail = siEmail.trim();
    if (!rawEmail) { setError("Enter your AUCA email or Student ID."); return; }
    setError(""); setLoading(true);

    // Accept bare student ID (e.g. "28318") or full email
    const email = rawEmail.includes("@") ? rawEmail : `${rawEmail}@auca.ac.rw`;

    const { error: signInError } = await sb.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    setLoading(false);
    if (signInError) { setError(signInError.message); return; }

    setSuccess(`Magic link sent to ${email} — check your inbox.`);
    setTimeout(onClose, 3500);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1.5rem", width: "100%", maxWidth: "28rem", boxShadow: "0 25px 50px -12px rgba(30,41,59,0.3)", overflow: "hidden" }}>

        {/* Header */}
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
            <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,0.15)", borderRadius: "0.5rem", cursor: "pointer", color: "white", width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>close</span>
            </button>
          </div>
        </div>

        <div style={{ padding: "1.5rem 1.75rem" }}>

          {/* Success */}
          {success && (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "var(--color-secondary)", display: "block", marginBottom: "0.75rem", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.5rem" }}>You&apos;re in!</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: 0 }}>{success}</p>
            </div>
          )}

          {/* Choose */}
          {!success && mode === "choose" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.5rem" }}>Join AMANOTA</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.5rem" }}>
                Sign in with your AUCA Student ID or create a new account.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <ModeButton icon="person_add" title="Create New Account" sub="Register with your AUCA Student ID" accent onClick={() => setMode("register")} />
                <ModeButton icon="login" title="Sign In" sub="Already have an AMANOTA account" onClick={() => setMode("signin")} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
                {["AUCA Verified", "Supabase Auth", "Escrow Protected"].map((b) => (
                  <span key={b} style={{ padding: "0.25rem 0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600 }}>{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Register */}
          {!success && mode === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <BackBtn onClick={() => { setMode("choose"); setError(""); }} label="Create AUCA Account" />

              <Field label="Full Name *">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cedric Ishimwe" style={inp} required />
              </Field>

              <Field label="AUCA Student ID *">
                <input type="text" inputMode="numeric" value={studentId} onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 28318" maxLength={6} style={inp} required />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)", margin: "0.25rem 0 0" }}>
                  Your email will be <strong>{studentId || "XXXXX"}@auca.ac.rw</strong>
                </p>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Faculty">
                  <select value={faculty} onChange={(e) => setFaculty(e.target.value as Faculty)} style={inp}>
                    {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Primary Campus">
                  <select value={campus} onChange={(e) => setCampus(e.target.value as Exclude<Campus, "both">)} style={inp}>
                    <option value="masoro">Masoro Campus</option>
                    <option value="gishushu">Gishushu Campus</option>
                  </select>
                </Field>
              </div>

              <Field label="I am a">
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["student", "tutor"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: `2px solid ${role === r ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: role === r ? "rgba(226,223,255,0.2)" : "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, color: role === r ? "var(--color-primary)" : "var(--color-on-surface-variant)", textTransform: "capitalize" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </Field>

              {error && <ErrMsg msg={error} />}

              <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>{loading ? "hourglass_empty" : "verified_user"}</span>
                {loading ? "Creating account…" : "Create AUCA Account"}
              </button>
            </form>
          )}

          {/* Sign-in */}
          {!success && mode === "signin" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <BackBtn onClick={() => { setMode("choose"); setError(""); }} label="Sign In" />

              <Field label="AUCA Student ID or Email">
                <input type="text" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} placeholder="28318 or 28318@auca.ac.rw" style={inp} required />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)", margin: "0.25rem 0 0" }}>
                  We&apos;ll send a magic link to your AUCA email — no password needed.
                </p>
              </Field>

              {error && <ErrMsg msg={error} />}

              <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>{loading ? "hourglass_empty" : "send"}</span>
                {loading ? "Sending link…" : "Send Magic Link"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ModeButton({ icon, title, sub, accent, onClick }: { icon: string; title: string; sub: string; accent?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", borderRadius: "0.875rem", border: `2px solid ${accent ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: accent ? "rgba(226,223,255,0.1)" : "transparent", cursor: "pointer", textAlign: "left", width: "100%" }}>
      <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.625rem", backgroundColor: accent ? "var(--color-primary)" : "var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span className="material-symbols-outlined" style={{ color: accent ? "white" : "var(--color-on-surface-variant)", fontSize: "1.375rem" }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700, color: accent ? "var(--color-primary)" : "var(--color-on-surface)", margin: "0 0 0.125rem" }}>{title}</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)", margin: 0 }}>{sub}</p>
      </div>
    </button>
  );
}

function BackBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
      <button type="button" onClick={onClick} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, padding: 0 }}>
        <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_back</span> Back
      </button>
      <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>{label}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.375rem" }}>{label}</p>
      {children}
    </label>
  );
}

function ErrMsg({ msg }: { msg: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.375rem", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)" }}>
      <span className="material-symbols-outlined" style={{ fontSize: "1rem", flexShrink: 0 }}>error</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>{msg}</span>
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-on-surface)", outline: "none", boxSizing: "border-box" };
const btn: React.CSSProperties = { width: "100%", padding: "0.75rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" };
