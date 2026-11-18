"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, Eye, EyeOff, AlertCircle,
  LogIn, Loader2, ChevronRight,
} from "lucide-react";
import { useAuth, validateEmail } from "@/context/AuthContext";

const inp: React.CSSProperties = {
  width: "100%", padding: "0.6875rem 0.9375rem",
  borderRadius: "0.625rem",
  border: "1.5px solid var(--color-outline-variant)",
  backgroundColor: "white",
  fontFamily: "var(--font-body)", fontSize: "0.9375rem",
  color: "var(--color-on-surface)", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s, box-shadow 0.15s",
};

const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "var(--color-primary)";
  e.target.style.boxShadow   = "0 0 0 3px rgba(53,37,205,0.12)";
};
const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "var(--color-outline-variant)";
  e.target.style.boxShadow   = "none";
};

function Label({ text }: { text: string }) {
  return (
    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.3125rem" }}>
      {text}
    </p>
  );
}

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const returnUrl    = searchParams.get("return") ?? "/";
  const { signIn }   = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr)   { setError(emailErr); return; }
    if (!password)  { setError("Password is required."); return; }

    setLoading(true);
    setError("");
    const { error: signInError } = await signIn({ email: email.trim().toLowerCase(), password });
    setLoading(false);

    if (signInError) {
      if (signInError.includes("Invalid login credentials")) {
        setError("Incorrect email or password. Try again, or create an account.");
      } else if (signInError.includes("Email not confirmed")) {
        setError("Please confirm your email first — check your inbox for the confirmation link.");
      } else {
        setError(signInError);
      }
      return;
    }

    router.replace(returnUrl);
    router.refresh();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-surface-container-low)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", marginTop: "-64px" }}>
      <div style={{ width: "100%", maxWidth: "26rem" }}>

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
        <div style={{ backgroundColor: "white", borderRadius: "1rem", border: "1px solid var(--color-outline-variant)", boxShadow: "0 4px 24px rgba(30,41,59,0.08)", animation: "fadeIn 0.2s ease-out both" }}>
          <div style={{ padding: "1.5rem 1.75rem 0" }}>
            <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.25rem" }}>Welcome back</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.375rem" }}>
              Sign in to your AMANOTA account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding: "0 1.75rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

              <div>
                <Label text="Email Address" />
                <input type="email" value={email} autoComplete="email"
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="yourname@gmail.com" style={inp}
                  onFocus={focusHandler} onBlur={blurHandler}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.3125rem" }}>
                  <Label text="Password" />
                  <Link href="#" style={{ fontFamily: "var(--font-label)", fontSize: "0.725rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}>Forgot password?</Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password} autoComplete="current-password"
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Your password"
                    style={{ ...inp, paddingRight: "2.75rem" }}
                    onFocus={focusHandler} onBlur={blurHandler}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "var(--color-outline)", display: "flex", alignItems: "center" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.375rem", padding: "0.6875rem 0.875rem", borderRadius: "0.5rem", backgroundColor: "var(--color-error-container)", color: "var(--color-on-error-container)" }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8375rem" }}>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.9375rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: loading ? 0.75 : 1 }}>
                {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <LogIn size={16} />}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </div>
          </form>

          <div style={{ padding: "1rem 1.75rem", borderTop: "1px solid var(--color-outline-variant)", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}>Create one <ChevronRight size={12} style={{ display: "inline", verticalAlign: "middle" }} /></Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} /></div>}>
      <LoginForm />
    </Suspense>
  );
}
