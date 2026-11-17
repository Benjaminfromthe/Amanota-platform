"use client";

/**
 * AuthContext
 * Single source of truth for authentication across the entire AMANOTA platform.
 *
 * - Uses Supabase Auth (email + password)
 * - Persists session via Supabase's built-in localStorage strategy
 * - Syncs user profile from the `profiles` table on sign-in
 * - Exposes signUp, signIn, signOut, updateProfile helpers
 */

import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from "react";
import { getSupabaseClient } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole   = "student" | "tutor";
export type UserCampus = "masoro"  | "gishushu";
export type UserFaculty =
  | "Software Engineering" | "Networking" | "Information Management"
  | "Business" | "Theology" | "Nursing" | "Education";

export interface UserProfile {
  id:         string;
  email:      string;
  full_name:  string;
  student_id: string;
  faculty:    UserFaculty;
  campus:     UserCampus;
  role:       UserRole;
  bio?:       string;
  expertise_tags?: string[];
  avatar_url?: string | null;
  created_at: string;
}

export interface SignUpData {
  email:      string;
  password:   string;
  full_name:  string;
  student_id: string;
  faculty:    UserFaculty;
  campus:     UserCampus;
  role:       UserRole;
  bio?:       string;
  expertise_tags?: string[];
}

export interface SignInData {
  email:    string;
  password: string;
}

interface AuthContextValue {
  user:        User | null;
  profile:     UserProfile | null;
  session:     Session | null;
  loading:     boolean;          // true while session is being restored
  isLoggedIn:  boolean;
  signUp:      (data: SignUpData) => Promise<{ error: string | null }>;
  signIn:      (data: SignInData) => Promise<{ error: string | null }>;
  signOut:     () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sb = getSupabaseClient();

  const [user,    setUser]    = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch profile from Supabase profiles table ──────────────────────────
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await sb
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error || !data) return null;
      return data as UserProfile;
    } catch {
      return null;
    }
  }, [sb]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    if (p) setProfile(p);
  }, [user, fetchProfile]);

  // ── Bootstrap session on mount ───────────────────────────────────────────
  useEffect(() => {
    // getSession() reads from localStorage automatically via Supabase SSR
    sb.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        const p = await fetchProfile(data.session.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
      if (event === "INITIAL_SESSION") setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── signUp ───────────────────────────────────────────────────────────────
  const signUp = async (data: SignUpData): Promise<{ error: string | null }> => {
    const { email, password, full_name, student_id, faculty, campus, role, bio, expertise_tags } = data;

    const { data: authData, error: authError } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, student_id, faculty, campus, role, bio: bio ?? "", expertise_tags: expertise_tags ?? [] },
      },
    });

    if (authError) return { error: authError.message };

    // If email confirmation is disabled, upsert profile immediately
    if (authData.user && !authData.user.email_confirmed_at) {
      // Profile is created by the DB trigger — but we upsert to ensure fresh data
    }
    if (authData.user) {
      // Allow trigger to run first, then upsert with explicit data
      await sb.from("profiles").upsert({
        id: authData.user.id,
        email,
        full_name,
        student_id,
        faculty,
        campus,
        role,
      }, { onConflict: "id" });
    }

    return { error: null };
  };

  // ── signIn ───────────────────────────────────────────────────────────────
  const signIn = async ({ email, password }: SignInData): Promise<{ error: string | null }> => {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  // ── signOut ──────────────────────────────────────────────────────────────
  const signOut = async () => {
    await sb.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // ── updateProfile ────────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<UserProfile>): Promise<{ error: string | null }> => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await sb.from("profiles").update(data).eq("id", user.id);
    if (error) return { error: error.message };
    await refreshProfile();
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading,
      isLoggedIn: !!user,
      signUp, signIn, signOut, updateProfile, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ─── Validation helpers ───────────────────────────────────────────────────────

export function validateEmail(email: string): string | null {
  if (!email.trim())          return "Email is required.";
  if (!email.includes("@"))   return "Enter a valid email address.";
  return null;
}

export function validatePassword(pw: string): string | null {
  if (!pw)          return "Password is required.";
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Include at least one uppercase letter.";
  if (!/[0-9]/.test(pw)) return "Include at least one number.";
  return null;
}

export function validateStudentId(id: string): string | null {
  if (!id.trim())              return "AUCA Student ID is required.";
  if (!/^\d{4,6}$/.test(id))  return "Student ID must be 4–6 digits (e.g. 28318).";
  return null;
}
