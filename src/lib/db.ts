/**
 * Typed query helpers for all Supabase tables.
 * Uses explicit casting because the ungenerated client resolves to `never` without
 * the full Database generic wired into the client factory.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any;

import type {
  FacultyType,
  TierType,
  CampusType,
  BookingStatus,
} from "./database.types";

// ─── Row types (mirrors database.types.ts) ────────────────────────────────────

export interface ProfileRow {
  id: string;
  full_name: string;
  student_id: string;
  faculty: FacultyType;
  campus: CampusType;
  role: "student" | "tutor";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonRow {
  id: string;
  title: string;
  course_code: string;
  faculty: FacultyType;
  campus: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  duration: string | null;
  rating: number;
  review_count: number;
  tags: string[];
  price_recorded: number;
  price_online: number;
  price_campus: number;
  price_custom: number;
  creator_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingRow {
  id: string;
  lesson_id: string;
  student_id: string;
  tutor_id: string | null;
  tier_type: TierType;
  price_rwf: number;
  status: BookingStatus;
  scheduled_at: string | null;
  scheduled_time: string | null;
  location: string | null;
  payment_method: string | null;
  phone_number: string | null;
  tutor_cut_rwf: number;
  platform_cut_rwf: number;
  created_at: string;
  updated_at: string;
}

export interface WalletRow {
  id: string;
  user_id: string;
  balance_rwf: number;
  total_earned_rwf: number;
  total_spent_rwf: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTxRow {
  id: string;
  booking_id: string | null;
  lesson_id: string | null;
  tutor_id: string | null;
  student_id: string | null;
  total_amount: number;
  tutor_cut: number;
  platform_cut: number;
  created_at: string;
}

// ─── Profiles ────────────────────────────────────────────────────────────────

export async function getProfile(sb: SB, userId: string): Promise<ProfileRow> {
  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return data as ProfileRow;
}

export async function upsertProfile(sb: SB, profile: Partial<ProfileRow> & { id: string }): Promise<ProfileRow> {
  const { data, error } = await sb.from("profiles").upsert(profile, { onConflict: "id" }).select().single();
  if (error) throw error;
  return data as ProfileRow;
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export async function getLessons(sb: SB, filters?: { faculty?: FacultyType; campus?: string }): Promise<(LessonRow & { profiles: { full_name: string; student_id: string } | null })[]> {
  let query = sb.from("lessons").select("*, profiles(full_name, student_id)").eq("is_published", true);
  if (filters?.faculty) query = query.eq("faculty", filters.faculty);
  if (filters?.campus && filters.campus !== "both") {
    query = query.or(`campus.eq.${filters.campus},campus.eq.both`);
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as (LessonRow & { profiles: { full_name: string; student_id: string } | null })[];
}

export async function getLessonById(sb: SB, id: string): Promise<LessonRow & { profiles: ProfileRow | null }> {
  const { data, error } = await sb.from("lessons").select("*, profiles(full_name, student_id, faculty, campus)").eq("id", id).single();
  if (error) throw error;
  return data as LessonRow & { profiles: ProfileRow | null };
}

export async function getLessonsByCreator(sb: SB, creatorId: string): Promise<LessonRow[]> {
  const { data, error } = await sb.from("lessons").select("*").eq("creator_id", creatorId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as LessonRow[];
}

export async function insertLesson(sb: SB, lesson: Omit<Partial<LessonRow>, "id" | "created_at" | "updated_at"> & { title: string; course_code: string; faculty: FacultyType }): Promise<LessonRow> {
  const { data, error } = await sb.from("lessons").insert(lesson).select().single();
  if (error) throw error;
  return data as LessonRow;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export type BookingWithLesson = BookingRow & { lessons: { title: string; course_code: string; faculty: string } | null };

export async function getBookingsByStudent(sb: SB, studentId: string): Promise<BookingWithLesson[]> {
  const { data, error } = await sb.from("bookings").select("*, lessons(title, course_code, faculty)").eq("student_id", studentId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BookingWithLesson[];
}

export async function insertBooking(sb: SB, booking: Omit<Partial<BookingRow>, "id" | "created_at" | "updated_at"> & { lesson_id: string; student_id: string; tier_type: TierType; price_rwf: number }): Promise<BookingRow> {
  const { data, error } = await sb.from("bookings").insert(booking).select().single();
  if (error) throw error;
  return data as BookingRow;
}

export async function updateBookingStatus(sb: SB, bookingId: string, status: "completed" | "cancelled"): Promise<BookingRow> {
  const { data, error } = await sb.from("bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", bookingId).select().single();
  if (error) throw error;
  return data as BookingRow;
}

// ─── Wallets ──────────────────────────────────────────────────────────────────

export async function getWallet(sb: SB, userId: string): Promise<WalletRow | null> {
  const { data, error } = await sb.from("wallets").select("*").eq("user_id", userId).single();
  if (error && error.code !== "PGRST116") throw error;
  return (data ?? null) as WalletRow | null;
}

export async function incrementWallet(sb: SB, userId: string, tutorEarned: number, studentSpent: number): Promise<void> {
  const wallet = await getWallet(sb, userId);
  if (!wallet) return;
  const { error } = await sb.from("wallets").update({
    balance_rwf: wallet.balance_rwf + tutorEarned,
    total_earned_rwf: wallet.total_earned_rwf + tutorEarned,
    total_spent_rwf: wallet.total_spent_rwf + studentSpent,
    updated_at: new Date().toISOString(),
  }).eq("user_id", userId);
  if (error) throw error;
}

// ─── Wallet Transactions ──────────────────────────────────────────────────────

export type WalletTxWithLesson = WalletTxRow & { lessons: { title: string; course_code: string } | null };

export async function insertWalletTransaction(sb: SB, tx: Omit<Partial<WalletTxRow>, "id" | "created_at"> & { total_amount: number; tutor_cut: number; platform_cut: number }): Promise<WalletTxRow> {
  const { data, error } = await sb.from("wallet_transactions").insert(tx).select().single();
  if (error) throw error;
  return data as WalletTxRow;
}

export async function getWalletTransactions(sb: SB, tutorId?: string): Promise<WalletTxWithLesson[]> {
  let query = sb.from("wallet_transactions").select("*, lessons(title, course_code)").order("created_at", { ascending: false });
  if (tutorId) query = query.eq("tutor_id", tutorId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as WalletTxWithLesson[];
}

// ─── Admin aggregates ─────────────────────────────────────────────────────────

export async function getAdminRevenueSummary(sb: SB): Promise<{ platformRevenue: number; tutorPayouts: number; gmv: number; transactionCount: number }> {
  const { data, error } = await sb.from("wallet_transactions").select("total_amount, tutor_cut, platform_cut");
  if (error) throw error;
  const rows = (data ?? []) as Pick<WalletTxRow, "total_amount" | "tutor_cut" | "platform_cut">[];
  return {
    platformRevenue:  rows.reduce((s, t) => s + t.platform_cut, 0),
    tutorPayouts:     rows.reduce((s, t) => s + t.tutor_cut, 0),
    gmv:              rows.reduce((s, t) => s + t.total_amount, 0),
    transactionCount: rows.length,
  };
}

export async function getLessonCountByFaculty(sb: SB): Promise<Partial<Record<FacultyType, number>>> {
  const { data, error } = await sb.from("lessons").select("faculty").eq("is_published", true);
  if (error) throw error;
  const counts: Partial<Record<FacultyType, number>> = {};
  for (const row of (data ?? []) as { faculty: FacultyType }[]) {
    counts[row.faculty] = (counts[row.faculty] ?? 0) + 1;
  }
  return counts;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function uiTierToDb(tier: string): TierType {
  const map: Record<string, TierType> = {
    recorded: "recorded",
    online:   "online",
    campus:   "campus",
    custom:   "custom_location",
  };
  return map[tier] ?? "recorded";
}

export function dbTierToUi(tier: TierType): string {
  const map: Record<TierType, string> = {
    recorded:        "Recorded Video",
    online:          "Online Live 1-on-1",
    campus:          "In-Person at AUCA Campus",
    custom_location: "In-Person — Custom Location",
  };
  return map[tier];
}

export function campusToDb(campus: string): CampusType {
  return campus === "gishushu" ? "gishushu" : "masoro";
}
