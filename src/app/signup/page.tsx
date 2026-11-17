"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, Eye, EyeOff, User, Users,
  BookOpen, ChevronRight, AlertCircle, CheckCircle2,
  Building2, Loader2,
} from "lucide-react";
import {
  useAuth,
  validateEmail, validatePassword, validateStudentId,
} from "@/context/AuthContext";
import type { UserRole, UserFaculty, UserCampus } from "@/context/AuthContext";

const FACULTIES: UserFaculty[] = [
  "Software Engineering", "Networking", "Information Management",
  "Business", "Theology", "Nursing", "Education",
];

const EXPERTISE_OPTIONS = [
  "OOP in Java", "Data Structures", "Algorithms", "Oracle/PostgreSQL",
  "Networking / CCNA", "Web Development", "Discrete Math",
  "Business Law", "Accounting", "Anatomy & Physiology",
  "Biblical Studies", "Curriculum Design", "Library Systems",
];

// ── Small helpers ─────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: "100%", padding: "0.6875rem 0.9375rem",
  borderRadius: "0.625rem",
  border: "1.5px solid var(--color-outline-variant)",
  backgroundColor: "white",
  fontFamily: "var(--font-body)", fontSize: "0.9375rem",
  color: "var(--color-on-surface)", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

const inpError: React.CSSProperties = { ...inp, borderColor: "var(--color-error)" };

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{ display: "flex", alignItems: "center", gap: "0.3125rem", fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-error)", margin: "0.25rem 0 0" }}>
      <AlertCircle size={13} style={{ flexShrink: 0 }} /> {msg}
    </p>
  );
}

function Label({ text }: { text: string }) {
  return (
    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.3125rem" }}>
      {text}
    </p>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router  = useRouter();
  const { signUp } = useAuth();

  const [role,     setRole]     = useState<UserRole>("student");
  const [step,     setStep]     = useState<1 | 2>(1);    // step 1 = credentials, step 2 = profile
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  const [showPw2,  setShowPw2]  = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  // ── Form values ────────────────────────────────────────────────────────
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [password2, setPassword2] = useState("");
  const [name,      setName]      = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty,   setFaculty]   = useState<UserFaculty>("Software Engineering");
  const [campus,    setCampus]    = useState<UserCampus>("masoro");
  const [bio,       setBio]       = useState("");
  const [tags,      setTags]      = useState<string[]>([]);

  // ── Errors ─────────────────────────────────────────────────────────────
  const [errs, setErrs] = useState<Record<string, string>>({});

  const setErr = (field: string, msg: string) =>
    setErrs((prev) => ({ ...prev, [field]: msg }));
  const clearErr = (field: string) =>
    setErrs((prev) => { const n = { ...prev }; delete n[field]; return n; });

  // ── Step 1 validation ──────────────────────────────────────────────────
  const validateStep1 = () => {
    const e: Record<string, string> = {};
    const eErr  = validateEmail(email);
    const pwErr = validatePassword(password);
    if (eErr)  e.email    = eErr;
    if (pwErr) e.password = pwErr;
    if (password !== password2) e.password2 = "Passwords do not match.";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  // ── Step 2 validation ──────────────────────────────────────────────────
  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name      = "Full name is required.";
    const idErr = validateStudentId(studentId);
    if (idErr) e.studentId = idErr;
    if (role === "tutor" && !bio.trim()) e.bio = "A short bio is required for tutors.";
    if (role === "tutor" && tags.length === 0) e.tags = "Select at least one expertise area.";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setGlobalErr("");

    const { error } = await signUp({
      email, password,
      full_name: name.trim(),
      student_id: studentId.trim(),
      faculty, campus, role,
      bio: bio.trim() || undefined,
      expertise_tags: tags.length ? tags : undefined,
    });

    setLoading(false);
    if (error) { setGlobalErr(error); return; }
    setSuccess(true);
  };

  const toggleTag = (tag: string) =>
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-surface-container-low)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "30rem" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", justifyContent: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary)", margin: 0, letterSpacing: "-0.02em" }}>AMANOTA</p>
            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.6rem", fontWeight: 700, color: "var(--color-on-surface-variant)", margin: 0, textTransform: "uppercase", letterSpacing: "0.07em" }}>AUCA Peer Academic Network</p>
          </div>
        </Link>

        {/* Card */}
        <div style={{ backgroundColor: "white", borderRadius: "1rem", border: "1px solid var(--color-outline-variant)", boxShadow: "0 4px 24px rgba(30,41,59,0.08)", overflow: "hidden" }}>

          {/* Success state */}
          {success && (
            <div style={{ padding: "2.5rem 2rem", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(0,108,73,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <CheckCircle2 size={32} color="var(--color-secondary)" />
              </div>
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.5rem" }}>Account Created!</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
                Check your inbox at <strong>{email}</strong> for a confirmation link, then sign in.
              </p>
              <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.6875rem 1.75rem", borderRadius: "0.625rem", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none" }}>
                Go to Sign In <ChevronRight size={16} />
              </Link>
            </div>
          )}

          {!success && (
            <>
              {/* Header */}
              <div style={{ padding: "1.5rem 1.75rem 0" }}>
                <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.25rem" }}>
                  {step === 1 ? "Create your account" : "Complete your profile"}
                </h1>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.25rem" }}>
                  {step === 1 ? "Join AUCA's peer academic marketplace." : `Step 2 of 2 — ${role === "tutor" ? "Tutor" : "Student"} profile`}
                </p>

                {/* Step indicator */}
                <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem" }}>
                  {[1, 2].map((s) => (
                    <div key={s} style={{ flex: 1, height: "3px", borderRadius: "9999px", backgroundColor: s <= step ? "var(--color-primary)" : "var(--color-outline-variant)", transition: "background 0.3s" }} />
                  ))}
                </div>
              </div>

              <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
                <div style={{ padding: "0 1.75rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

                  {/* ── STEP 1: Credentials + Role ── */}
                  {step === 1 && (
                    <>
                      {/* Role selector */}
                      <div>
                        <Label text="I want to" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                          {([
                            { id: "student", icon: <BookOpen size={18} />, label: "Learn", sub: "Student" },
                            { id: "tutor",   icon: <Users size={18} />,    label: "Teach",  sub: "Peer Tutor" },
                          ] as const).map((r) => (
                            <button key={r.id} type="button" onClick={() => setRole(r.id as UserRole)}
                              style={{ padding: "0.875rem", borderRadius: "0.75rem", border: `2px solid ${role === r.id ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: role === r.id ? "rgba(226,223,255,0.2)" : "white", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", transition: "all 0.15s" }}>
                              <span style={{ color: role === r.id ? "var(--color-primary)" : "var(--color-on-surface-variant)" }}>{r.icon}</span>
                              <span style={{ fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700, color: role === r.id ? "var(--color-primary)" : "var(--color-on-surface)" }}>{r.label}</span>
                              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>{r.sub}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <Label text="Email Address *" />
                        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
                          placeholder="e.g. yourname@gmail.com" style={errs.email ? inpError : inp}
                          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--color-primary)"; }}
                          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errs.email ? "var(--color-error)" : "var(--color-outline-variant)"; }}
                        />
                        <FieldError msg={errs.email} />
                      </div>

                      {/* Password */}
                      <div>
                        <Label text="Password *" />
                        <div style={{ position: "relative" }}>
                          <input type={showPw ? "text" : "password"} value={password}
                            onChange={(e) => { setPassword(e.target.value); clearErr("password"); }}
                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                            style={{ ...(errs.password ? inpError : inp), paddingRight: "2.75rem" }}
                          />
                          <button type="button" onClick={() => setShowPw(!showPw)}
                            style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-outline)", display: "flex", alignItems: "center" }}>
                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <FieldError msg={errs.password} />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <Label text="Confirm Password *" />
                        <div style={{ position: "relative" }}>
                          <input type={showPw2 ? "text" : "password"} value={password2}
                            onChange={(e) => { setPassword2(e.target.value); clearErr("password2"); }}
                            placeholder="Repeat your password"
                            style={{ ...(errs.password2 ? inpError : inp), paddingRight: "2.75rem" }}
                          />
                          <button type="button" onClick={() => setShowPw2(!showPw2)}
                            style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-outline)", display: "flex", alignItems: "center" }}>
                            {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <FieldError msg={errs.password2} />
                      </div>

                      <button type="submit" style={{ width: "100%", padding: "0.75rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.9375rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                        Continue <ChevronRight size={16} />
                      </button>
                    </>
                  )}

                  {/* ── STEP 2: Profile ── */}
                  {step === 2 && (
                    <>
                      {/* Full name */}
                      <div>
                        <Label text="Full Name *" />
                        <input type="text" value={name} onChange={(e) => { setName(e.target.value); clearErr("name"); }}
                          placeholder="e.g. Benjamin Nshimiye" style={errs.name ? inpError : inp} />
                        <FieldError msg={errs.name} />
                      </div>

                      {/* Student ID */}
                      <div>
                        <Label text="AUCA Student ID *" />
                        <input type="text" inputMode="numeric" value={studentId}
                          onChange={(e) => { setStudentId(e.target.value.replace(/\D/g, "")); clearErr("studentId"); }}
                          placeholder="e.g. 28318" maxLength={6} style={errs.studentId ? inpError : inp} />
                        <FieldError msg={errs.studentId} />
                      </div>

                      {/* Faculty + Campus */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <Label text="AUCA Faculty *" />
                          <select value={faculty} onChange={(e) => setFaculty(e.target.value as UserFaculty)} style={inp}>
                            {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label text="Primary Campus *" />
                          <select value={campus} onChange={(e) => setCampus(e.target.value as UserCampus)} style={inp}>
                            <option value="masoro">Masoro Campus</option>
                            <option value="gishushu">Gishushu Campus</option>
                          </select>
                        </div>
                      </div>

                      {/* Tutor-only fields */}
                      {role === "tutor" && (
                        <>
                          <div>
                            <Label text="Short Bio (Tutor) *" />
                            <textarea value={bio} onChange={(e) => { setBio(e.target.value); clearErr("bio"); }}
                              placeholder="e.g. Final-year CS student, 3 years tutoring Java and Data Structures at AUCA Masoro."
                              rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.65 }} />
                            <FieldError msg={errs.bio} />
                          </div>

                          <div>
                            <Label text="Expertise Areas * (choose at least 1)" />
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.375rem" }}>
                              {EXPERTISE_OPTIONS.map((tag) => (
                                <button key={tag} type="button" onClick={() => { toggleTag(tag); clearErr("tags"); }}
                                  style={{ padding: "0.3125rem 0.75rem", borderRadius: "9999px", border: `1.5px solid ${tags.includes(tag) ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: tags.includes(tag) ? "rgba(226,223,255,0.25)" : "white", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: "0.775rem", fontWeight: 600, color: tags.includes(tag) ? "var(--color-primary)" : "var(--color-on-surface-variant)", transition: "all 0.15s" }}>
                                  {tag}
                                </button>
                              ))}
                            </div>
                            <FieldError msg={errs.tags} />
                          </div>
                        </>
                      )}

                      {/* Campus badge preview */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 0.875rem", borderRadius: "0.625rem", backgroundColor: "var(--color-surface-container-low)", border: "1px solid var(--color-outline-variant)" }}>
                        <Building2 size={15} color="var(--color-secondary)" />
                        <span style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-surface)" }}>
                          AUCA · {campus === "masoro" ? "Masoro Campus" : "Gishushu Campus"} · {role === "tutor" ? "Peer Tutor" : "Student"}
                        </span>
                      </div>

                      {globalErr && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.375rem", padding: "0.6875rem 0.875rem", borderRadius: "0.5rem", backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)" }}>
                          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8375rem" }}>{globalErr}</span>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "0.625rem" }}>
                        <button type="button" onClick={() => setStep(1)}
                          style={{ flex: 1, padding: "0.75rem", borderRadius: "0.625rem", border: "1.5px solid var(--color-outline-variant)", cursor: "pointer", backgroundColor: "white", color: "var(--color-on-surface)", fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700 }}>
                          Back
                        </button>
                        <button type="submit" disabled={loading}
                          style={{ flex: 2, padding: "0.75rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", backgroundColor: role === "tutor" ? "var(--color-secondary)" : "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", opacity: loading ? 0.75 : 1 }}>
                          {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : (role === "tutor" ? <User size={16} /> : <BookOpen size={16} />)}
                          {loading ? "Creating account…" : `Create ${role === "tutor" ? "Tutor" : "Student"} Account`}
                        </button>
                      </div>
                    </>
                  )}

                </div>
              </form>

              <div style={{ padding: "1rem 1.75rem", borderTop: "1px solid var(--color-outline-variant)", textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>
                  Already have an account?{" "}
                  <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
                </span>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)", marginTop: "1.25rem" }}>
          By signing up you agree to AMANOTA's{" "}
          <Link href="#" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Terms of Service</Link> and{" "}
          <Link href="#" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
