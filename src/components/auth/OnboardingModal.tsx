"use client";

/**
 * OnboardingModal
 * Triggered when an unauthenticated user tries to book/upload.
 * Uses EMAIL + PASSWORD auth (not magic link) to avoid the
 * "Signups not allowed for otp" Supabase error.
 */

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap, X, UserPlus, LogIn,
  Eye, EyeOff, AlertCircle, MailCheck,
  Loader2, ArrowLeft, ChevronRight,
} from "lucide-react";
import {
  useAuth,
  validateEmail, validatePassword,
} from "@/context/AuthContext";
import type { UserFaculty, UserCampus, UserRole } from "@/context/AuthContext";

const FACULTIES: UserFaculty[] = [
  "Software Engineering", "Networking", "Information Management",
  "Business", "Theology", "Nursing", "Education",
];

type Mode = "choose" | "register" | "signin";

interface Props {
  onClose:    () => void;
  reason?:    string;
  onSuccess?: () => void;
}

const inp: React.CSSProperties = {
  width: "100%", padding: "0.5625rem 0.8125rem",
  borderRadius: "0.5rem", border: "1.5px solid var(--color-outline-variant)",
  backgroundColor: "white", fontFamily: "var(--font-body)", fontSize: "0.9rem",
  color: "var(--color-on-surface)", outline: "none", boxSizing: "border-box",
};
const btnPrimary: React.CSSProperties = {
  width: "100%", padding: "0.6875rem", borderRadius: "0.625rem", border: "none",
  cursor: "pointer", backgroundColor: "var(--color-primary)", color: "white",
  fontFamily: "var(--font-label)", fontSize: "0.9375rem", fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
};

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
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.3125rem", padding: "0.5625rem 0.75rem", borderRadius: "0.5rem", backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)" }}>
      <AlertCircle size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>{msg}</span>
    </div>
  );
}

export default function OnboardingModal({ onClose, reason, onSuccess }: Props) {
  const { signUp, signIn } = useAuth();
  const [mode,    setMode]    = useState<Mode>("choose");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [showPw,  setShowPw]  = useState(false);

  // Shared
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  // Register extras
  const [name,      setName]      = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty,   setFaculty]   = useState<UserFaculty>("Software Engineering");
  const [campus,    setCampus]    = useState<UserCampus>("masoro");
  const [role,      setRole]      = useState<UserRole>("student");

  // ── Register ──────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr  = validateEmail(email);
    const pwErr = validatePassword(password);
    if (eErr)  { setError(eErr);  return; }
    if (pwErr) { setError(pwErr); return; }
    if (!name.trim())                           { setError("Full name is required."); return; }
    if (!/^\d{4,6}$/.test(studentId.trim()))   { setError("AUCA Student ID must be 4–6 digits."); return; }
    setError(""); setLoading(true);

    const { error: err } = await signUp({
      email: email.trim().toLowerCase(),
      password,
      full_name:  name.trim(),
      student_id: studentId.trim(),
      faculty, campus, role,
    });

    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess(`Account created! Check ${email.trim()} for a confirmation link, then sign in.`);
    onSuccess?.();
  };

  // ── Sign-in ───────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    if (eErr) { setError(eErr); return; }
    if (!password) { setError("Password is required."); return; }
    setError(""); setLoading(true);

    const { error: err } = await signIn({ email: email.trim().toLowerCase(), password });
    setLoading(false);

    if (err) {
      if (err.includes("Invalid login credentials"))
        setError("Incorrect email or password.");
      else if (err.includes("Email not confirmed"))
        setError("Please confirm your email first — check your inbox.");
      else
        setError(err);
      return;
    }

    onSuccess?.();
    onClose();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: "white", borderRadius: "1.25rem", width: "100%", maxWidth: "27rem", boxShadow: "0 24px 48px -8px rgba(30,41,59,0.28)", overflow: "hidden", maxHeight: "92vh", overflowY: "auto" }}>

        {/* Header band */}
        <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, var(--color-primary) 100%)", padding: "1.25rem 1.5rem 1rem", position: "sticky", top: 0, zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.1875rem" }}>
                <GraduationCap size={17} color="rgba(255,255,255,0.9)" />
                <span style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "white" }}>AMANOTA</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.72)", margin: 0 }}>
                {reason ?? "AUCA Peer Academic Network"}
              </p>
            </div>
            <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,0.15)", borderRadius: "0.4375rem", cursor: "pointer", color: "white", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={15} />
            </button>
          </div>
        </div>

        <div style={{ padding: "1.375rem 1.5rem" }}>

          {/* Success */}
          {success && (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "rgba(0,108,73,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem" }}>
                <MailCheck size={26} color="var(--color-secondary)" />
              </div>
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.125rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.5rem" }}>Check your email!</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.125rem", lineHeight: 1.65 }}>{success}</p>
              <button onClick={() => { setSuccess(""); setMode("signin"); }} style={{ ...btnPrimary, width: "auto", padding: "0.5rem 1.5rem" }}>
                <LogIn size={15} /> Sign In Now
              </button>
            </div>
          )}

          {/* Choose mode */}
          {!success && mode === "choose" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.125rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.3125rem" }}>Join AMANOTA</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.125rem" }}>
                Sign in or create an account with your email address.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <button onClick={() => setMode("register")}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.9375rem", borderRadius: "0.75rem", border: "2px solid var(--color-primary)", backgroundColor: "rgba(226,223,255,0.08)", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <UserPlus size={17} color="white" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-primary)", margin: "0 0 0.125rem" }}>Create New Account</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)", margin: 0 }}>Register with your AUCA Student ID</p>
                  </div>
                </button>
                <button onClick={() => setMode("signin")}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.9375rem", borderRadius: "0.75rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", backgroundColor: "var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <LogIn size={17} color="var(--color-on-surface-variant)" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.125rem" }}>Sign In</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)", margin: 0 }}>Sign in with email & password</p>
                  </div>
                </button>
              </div>
              <div style={{ display: "flex", gap: "0.375rem", marginTop: "1rem", flexWrap: "wrap" }}>
                {["AUCA Verified", "Email Auth", "80/20 Escrow"].map((b) => (
                  <span key={b} style={{ padding: "0.1875rem 0.5625rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.675rem", fontWeight: 600 }}>{b}</span>
                ))}
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-on-surface-variant)", marginTop: "1rem", textAlign: "center" }}>
                Want the full signup flow?{" "}
                <Link href="/signup" onClick={onClose} style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}>
                  Create account <ChevronRight size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                </Link>
              </p>
            </div>
          )}

          {/* Register form */}
          {!success && mode === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <BackBtn onClick={() => { setMode("choose"); setError(""); }} label="Create AUCA Account" />
              <Field label="Email Address *">
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="yourname@gmail.com" style={inp} required />
              </Field>
              <Field label="Password *">
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Min 8 chars, 1 uppercase, 1 number" style={{ ...inp, paddingRight: "2.5rem" }} required />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-outline)", display: "flex", alignItems: "center" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>
              <Field label="Full Name *">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cedric Ishimwe" style={inp} required />
              </Field>
              <Field label="AUCA Student ID *">
                <input type="text" inputMode="numeric" value={studentId} onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 28318" maxLength={6} style={inp} required />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                <Field label="Faculty">
                  <select value={faculty} onChange={(e) => setFaculty(e.target.value as UserFaculty)} style={inp}>
                    {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Campus">
                  <select value={campus} onChange={(e) => setCampus(e.target.value as UserCampus)} style={inp}>
                    <option value="masoro">Masoro Campus</option>
                    <option value="gishushu">Gishushu Campus</option>
                  </select>
                </Field>
              </div>
              <Field label="I am a">
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["student", "tutor"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: `2px solid ${role === r ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: role === r ? "rgba(226,223,255,0.2)" : "white", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, color: role === r ? "var(--color-primary)" : "var(--color-on-surface-variant)", textTransform: "capitalize" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </Field>
              {error && <ErrMsg msg={error} />}
              <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.72 : 1 }}>
                {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <UserPlus size={16} />}
                {loading ? "Creating account…" : "Create AUCA Account"}
              </button>
            </form>
          )}

          {/* Sign-in form */}
          {!success && mode === "signin" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <BackBtn onClick={() => { setMode("choose"); setError(""); }} label="Sign In" />
              <Field label="Email Address">
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="yourname@gmail.com" style={inp} required />
              </Field>
              <Field label="Password">
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Your password" style={{ ...inp, paddingRight: "2.5rem" }} required />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-outline)", display: "flex", alignItems: "center" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>
              {error && <ErrMsg msg={error} />}
              <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.72 : 1 }}>
                {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <LogIn size={16} />}
                {loading ? "Signing in…" : "Sign In"}
              </button>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-on-surface-variant)", textAlign: "center", margin: 0 }}>
                No account?{" "}
                <Link href="/signup" onClick={onClose} style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}>Create one</Link>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
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
