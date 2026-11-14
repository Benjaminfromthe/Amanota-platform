"use client";

import Link from "next/link";
import type { AppLesson } from "@/context/AppContext";

interface Props {
  lesson: AppLesson;
}

const FACULTY_COLORS: Record<string, string> = {
  "Software Engineering": "var(--color-primary)",
  "Networking": "var(--color-primary)",
  "Information Management": "var(--color-primary)",
  "Business": "var(--color-secondary)",
  "Theology": "var(--color-secondary)",
  "Nursing": "var(--color-secondary)",
  "Education": "var(--color-secondary)",
};

export default function ExploreLessonCard({ lesson }: Props) {
  const badgeBg =
    lesson.courseCodeColor === "secondary"
      ? "var(--color-secondary)"
      : "var(--color-primary)";
  const badgeColor =
    lesson.courseCodeColor === "secondary"
      ? "var(--color-on-secondary)"
      : "var(--color-on-primary)";
  const facultyColor = FACULTY_COLORS[lesson.facultyKey] ?? "var(--color-primary)";
  const stars = "★".repeat(Math.floor(lesson.rating));

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-container-lowest)",
        borderRadius: "1rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.25s, transform 0.25s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 20px 40px -8px rgba(30,41,59,0.14)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "var(--color-surface-container-highest)", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lesson.thumbnail === "/placeholder.svg" ? undefined : lesson.thumbnail}
          alt={lesson.thumbnailAlt}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {lesson.thumbnail === "/placeholder.svg" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-surface-container-high)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "var(--color-outline)" }}>play_circle</span>
          </div>
        )}
        {/* Gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,28,45,0.7) 0%, transparent 50%)" }} />
        {/* Course badge */}
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
          <span style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", backgroundColor: badgeBg, color: badgeColor, fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700, boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
            {lesson.courseCode}
          </span>
        </div>
        {/* Duration */}
        <div style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem", padding: "0.125rem 0.5rem", borderRadius: "0.375rem", backgroundColor: "rgba(17,28,45,0.8)", backdropFilter: "blur(8px)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.6875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>schedule</span>
          {lesson.duration}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* Faculty */}
        <p style={{ fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700, color: facultyColor, margin: 0, letterSpacing: "0.01em" }}>
          {lesson.faculty}
        </p>

        {/* Title */}
        <h3
          className="line-clamp-2"
          style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 600, color: "var(--color-on-surface)", margin: 0, lineHeight: 1.35 }}
        >
          {lesson.title}
        </h3>

        {/* Instructor */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
          <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "9999px", backgroundColor: lesson.instructor.color === "secondary" ? "var(--color-secondary-container)" : "var(--color-primary-fixed)", color: lesson.instructor.color === "secondary" ? "var(--color-on-secondary-container)" : "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0 }}>
            {lesson.instructor.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="line-clamp-1" style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface)", margin: 0 }}>{lesson.instructor.name}</p>
            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", color: "var(--color-on-surface-variant)", margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ padding: "0.0625rem 0.375rem", borderRadius: "9999px", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", fontWeight: 700, fontSize: "0.6rem" }}>AUCA</span>
              Verified Peer Tutor
            </p>
          </div>
        </div>

        {/* Rating + price row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--color-outline-variant)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ color: "var(--color-tertiary-container)", fontSize: "0.875rem", letterSpacing: "-0.05em" }}>{stars}</span>
            <span style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface)" }}>{lesson.rating.toFixed(1)}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>({lesson.reviewCount})</span>
          </div>
          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)" }}>From 1,000 RWF</span>
        </div>

        {/* CTA */}
        <Link
          href={`/lesson/${lesson.id}`}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", padding: "0.625rem", borderRadius: "0.75rem", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", transition: "background 0.15s", marginTop: "0.25rem" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-on-primary-fixed-variant)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-primary)"; }}
        >
          View Lesson
          <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
