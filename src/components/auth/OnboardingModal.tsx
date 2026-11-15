"use client";

import { useState } from "react";
import {
  GraduationCap, UserPlus, LogIn, X, ArrowLeft,
  ShieldCheck, MailCheck, AlertCircle, Send, Loader2,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import type { Faculty, Campus } from "@/context/AppContext";

const FACULTIES: Faculty[] = [
  "Software Engineering", "Networking", "Information Management",
  "Business", "Theology", "Nursing", "Education",
];

type Mode = "choose" | "register" | "signin";

interface Props {
  onClose:    () => void;
  reason?:    string;
  onSuccess?: () => void;
}

export default function OnboardingModal({ onClose, reason, onSuccess }: Props) {
  const sb = getSupabaseClient();
  const [mode, setMode] = useState<Mode>("choose");

  const [name,      setName]      = useState("");
  const [studentId, setStudentId] = useState("");
  const [email,     setEmail]     = useState("");
  const [faculty,   setFaculty]   = useState<Faculty>("Software Engineering");
  const [campus,    setCampus]    = useState<Exclude<Campus, "both">>("masoro");
  const [role,      setRole]      = useState<"student" | "tutor">("student");
  const [siEmail,   setSiEmail]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim())                           { setError("Full name is required."); return; }
    if (!/^\d{4,6}$/.test(studentId.trim()))   { setError("AUCA Student ID must be 4–6 digits."); return; }
    if (!email.trim() || !email.includes("@")) { setError("A valid email address is required."); return; }
    setError(""); setLoading(true);

    const { error: signUpError } = await sb.auth.signUp({
      email: email.trim().toLowerCase(),
      password: `AUCA-${studentId.trim()}-${name.trim().split(" ")[0]}`,
      options: { data: { full_name: name.trim(), student_id: studentId.trim(), faculty, campus, role } },
    });

    setLoading(false);
    if (signUpError) { setError(signUpError.message); return; }
    setSuccess(`Confirmation email sent to ${email.trim()}. Click the link then come back to sign in.`);
    onSuccess?.();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siEmail.trim()) { setError("Enter your email address."); return; }
    setError(""); setLoading(true);

    const { error: signInError } = await sb.auth.signInWithOtp({
      email: siEmail.trim().toLowerCase(),
      options: { shouldCreateUser: false },
    });

    setLoading(false);
    if (signInError) { setError(signInError.message); return; }
    setSuccess(`Magic link sent to ${siEmail.trim()} — check your inbox.`);
    setTimeout(onClose, 5000);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: "white", borderRadius: "1.25rem", width: "100%", maxWidth: "27rem", boxShadow: "0 24px 48px -8px rgba(30,41,59,0.28)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header band */}
        <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, var(--color-primary) 100%)", padding: "1.375rem 1.5rem 1.125rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <GraduationCap size={18} color="rgba(255,255,255,0.9)" />
                <span style={{ fontFamily: "var(--font-headline)", fontSize: "1.0625rem", fontWeight: 700, color: "white" }}>AMANOTA</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.825rem", color: "rgba(255,255,255,0.72)", margin: 0 }}>
                {reason ?? "AUCA Peer Academic Network"}
              </p>
            </div>
            <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,0.15)", borderRadius: "0.4375rem", cursor: "pointer", color: "white", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: "1.375rem 1.5rem" }}>

          {/* Success */}
          {success && (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(0,108,73,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem" }}>
                <MailCheck size={28} color="var(--color-secondary)" />
              </div>
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.125rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.5rem" }}>Check your email!</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.125rem", lineHeight: 1.65 }}>{success}</p>
              <button onClick={onClose} style={{ padding: "0.5rem 1.5rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontWeight: 700 }}>Close</button>
            </div>
          )}

          {/* Choose mode */}
          {!success && mode === "choose" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.125rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.375rem" }}>Join AMANOTA</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.125rem" }}>
                Sign in or create an account with your real email address.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <ModeBtn icon={<UserPlus size={18} color="white" />} title="Create New Account" sub="Register with your AUCA Student ID" accent onClick={() => setMode("register")} />
                <ModeBtn icon={<LogIn size={18} color="var(--color-on-surface-variant)" />} title="Sign In" sub="Send a magic link to your email" onClick={() => setMode("signin")} />
              </div>
              <div style={{ display: "flex", gap: "0.375rem", marginTop: "1.125rem", flexWrap: "wrap" }}>
                {["AUCA Verified", "Supabase Auth", "80/20 Escrow"].map((b) => (
                  <span key={b} style={{ padding: "0.1875rem 0.5625rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.675rem", fontWeight: 600 }}>{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Register form */}
          {!success && mode === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <BackBtn onClick={() => { setMode("choose"); setError(""); }} label="Create AUCA Account" />

              <Field label="Full Name *">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Benjamin Nshimiye" style={inp} required />
              </Field>
              <Field label="AUCA Student ID *">
                <input type="text" inputMode="numeric" value={studentId} onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 28318" maxLength={6} style={inp} required />
              </Field>
              <Field label="Your Email Address *">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. youremail@gmail.com" style={inp} required />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.725rem", color: "var(--color-on-surface-variant)", margin: "0.25rem 0 0" }}>Confirmation link will be sent here.</p>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                <Field label="Faculty">
                  <select value={faculty} onChange={(e) => setFaculty(e.target.value as Faculty)} style={inp}>
                    {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Campus">
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
                      style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: `2px solid ${role === r ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: role === r ? "rgba(226,223,255,0.2)" : "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, color: role === r ? "var(--color-primary)" : "var(--color-on-surface-variant)", textTransform: "capitalize" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </Field>
              {error && <ErrMsg msg={error} />}
              <button type="submit" disabled={loading} style={{ ...btnSt, opacity: loading ? 0.72 : 1 }}>
                {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <ShieldCheck size={16} />}
                {loading ? "Creating account…" : "Create AUCA Account"}
              </button>
            </form>
          )}

          {/* Sign-in form */}
          {!success && mode === "signin" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <BackBtn onClick={() => { setMode("choose"); setError(""); }} label="Sign In" />
              <Field label="Your Email Address">
                <input type="email" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} placeholder="e.g. youremail@gmail.com" style={inp} required />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.725rem", color: "var(--color-on-surface-variant)", margin: "0.25rem 0 0" }}>We&apos;ll send a magic link — no password needed.</p>
              </Field>
              {error && <ErrMsg msg={error} />}
              <button type="submit" disabled={loading} style={{ ...btnSt, opacity: loading ? 0.72 : 1 }}>
                {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
                {loading ? "Sending…" : "Send Magic Link"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

function ModeBtn({ icon, title, sub, accent, onClick }: { icon: React.ReactNode; title: string; sub: string; accent?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem", borderRadius: "0.75rem", border: `2px solid ${accent ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: accent ? "rgba(226,223,255,0.08)" : "transparent", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s" }}>
      <div style={{ width: "38px", height: "38px", borderRadius: "0.5rem", backgroundColor: accent ? "var(--color-primary)" : "var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, color: accent ? "var(--color-primary)" : "var(--color-on-surface)", margin: "0 0 0.125rem" }}>{title}</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)", margin: 0 }}>{sub}</p>
      </div>
    </button>
  );
}

function BackBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <button type="button" onClick={onClick} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.1875rem", fontFamily: "var(--font-label)", fontSize: "0.775rem", fontWeight: 600, padding: 0 }}>
        <ArrowLeft size={14} /> Back
      </button>
      <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>{label}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <p style={{ fontFamily: "var(--font-label)", fontSize: "0.675rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.3125rem" }}>{label}</p>
      {children}
    </label>
  );
}

function ErrMsg({ msg }: { msg: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.375rem", padding: "0.5625rem 0.75rem", borderRadius: "0.5rem", backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)" }}>
      <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>{msg}</span>
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "0.5625rem 0.8125rem", borderRadius: "0.5rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "white", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface)", outline: "none", boxSizing: "border-box" };
const btnSt: React.CSSProperties = { width: "100%", padding: "0.6875rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.9375rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" };
