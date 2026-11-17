"use client";

/**
 * useLessons
 * Loads lessons from Supabase on the client side.
 * Falls back to the seeded appLessons array when:
 *   - Supabase env vars are not set
 *   - The DB is empty (0 rows returned)
 *   - Any network error occurs
 *
 * This means the platform works out-of-the-box with no DB config,
 * and automatically shows real data once lessons are uploaded via /creator.
 */

import { useState, useEffect } from "react";
import { appLessons } from "@/lib/data";
import type { AppLesson } from "@/context/AppContext";

interface DbLesson {
  id:            string;
  title:         string;
  course_code:   string;
  faculty:       string;
  campus:        string;
  description:   string;
  video_url:     string;
  thumbnail_url: string | null;
  duration:      string | null;
  rating:        number;
  review_count:  number;
  tags:          string[];
  price_recorded: number;
  price_online:   number;
  price_campus:   number;
  price_custom:   number;
  creator_id:    string | null;
  profiles?: { full_name: string; student_id: string } | null;
}

function dbToAppLesson(row: DbLesson): AppLesson {
  // Best-effort faculty key mapping
  const facultyKeyMap: Record<string, AppLesson["facultyKey"]> = {
    "Software Engineering": "Software Engineering",
    "Networking":           "Networking",
    "Information Management": "Information Management",
    "Business":    "Business",
    "Theology":    "Theology",
    "Nursing":     "Nursing",
    "Education":   "Education",
  };

  const fk = (facultyKeyMap[row.faculty] ?? "Software Engineering") as AppLesson["facultyKey"];
  const tutorName    = row.profiles?.full_name ?? "AUCA Peer Tutor";
  const tutorInitials = tutorName.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");

  return {
    id:          row.id,
    courseCode:  row.course_code,
    courseCodeColor: "primary",
    faculty:     row.faculty,
    facultyKey:  fk,
    title:       row.title,
    description: row.description,
    duration:    row.duration ?? "",
    thumbnail:   row.thumbnail_url ?? "",
    thumbnailAlt: row.title,
    tutorId:     row.creator_id ?? "unknown",
    basePrice:   1000,
    tiers: { recorded: 1000, online: 2000, campus: 3000, custom: 5000 },
    rating:      row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    campus:      (row.campus as AppLesson["campus"]) ?? "both",
    tags:        row.tags ?? [],
    instructor: {
      initials: tutorInitials || "AT",
      name:     tutorName,
      title:    "AUCA Verified Peer Tutor",
      color:    "primary",
    },
    assets: [],
  };
}

export function useLessons() {
  const [lessons,  setLessons]  = useState<AppLesson[]>(appLessons);
  const [loading,  setLoading]  = useState(false);
  const [fromDb,   setFromDb]   = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;          // no Supabase config — keep seed data

    setLoading(true);

    import("@/lib/supabase")
      .then(({ getSupabaseClient }) => {
        const sb = getSupabaseClient();
        return sb
          .from("lessons")
          .select("*, profiles(full_name, student_id)")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
      })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) return; // keep seed data
        setLessons((data as DbLesson[]).map(dbToAppLesson));
        setFromDb(true);
      })
      .catch(() => { /* network error — keep seed data */ })
      .finally(() => setLoading(false));
  }, []);

  return { lessons, loading, fromDb };
}
