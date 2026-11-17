"use client";

import Link from "next/link";
import { Clock, ArrowRight, ShieldCheck, Star } from "lucide-react";
import type { AppLesson } from "@/context/AppContext";
import LessonPlaceholder from "@/components/ui/LessonPlaceholder";

interface Props { lesson: AppLesson }

export default function ExploreLessonCard({ lesson }: Props) {
  const badgeBg    = lesson.courseCodeColor === "secondary" ? "var(--color-secondary)" : "var(--color-primary)";
  const badgeColor = lesson.courseCodeColor === "secondary" ? "var(--color-on-secondary)" : "var(--color-on-primary)";
  const stars      = Math.min(5, Math.floor(lesson.rating));
  const hasThumb   = !!lesson.thumbnail;

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid var(--color-outline-variant)",
        borderRadius: "0.75rem", overflow: "hidden",
        display: "flex", flexDirection: "column",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 12px 32px -4px rgba(30,41,59,0.12)";
        el.style.transform  = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "none";
        el.style.transform  = "translateY(0)";
      }}
    >
      {/* ── Thumbnail / Placeholder ──────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", flexShrink: 0 }}>
        {hasThumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lesson.thumbnail}
            alt={lesson.thumbnailAlt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <LessonPlaceholder
            courseCode={lesson.courseCode}
            facultyKey={lesson.facultyKey}
            title={lesson.title}
          />
        )}

        {/* Course badge (shown over placeholder too) */}
        {hasThumb && (
          <div style={{ position: "absolute", top: "0.625rem", left: "0.625rem" }}>
            <span style={{ padding: "0.1875rem 0.5rem", borderRadius: "0.3rem", backgroundColor: badgeBg, color: badgeColor, fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700 }}>
              {lesson.courseCode}
            </span>
          </div>
        )}

        {/* Duration badge */}
        {hasThumb && (
          <div style={{ position: "absolute", bottom: "0.625rem", right: "0.625rem", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.1875rem 0.5rem", borderRadius: "0.3rem", backgroundColor: "rgba(17,28,45,0.75)", backdropFilter: "blur(6px)" }}>
            <Clock size={11} color="white" />
            <span style={{ fontFamily: "var(--font-label)", fontSize: "0.6875rem", color: "white" }}>{lesson.duration}</span>
          </div>
        )}

        {/* Duration badge over placeholder */}
        {!hasThumb && (
          <div style={{ position: "absolute", bottom: "2.25rem", right: "0.625rem", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.1875rem 0.5rem", borderRadius: "0.3rem", backgroundColor: "rgba(0,0,0,0.4)" }}>
            <Clock size={11} color="white" />
            <span style={{ fontFamily: "var(--font-label)", fontSize: "0.6875rem", color: "white" }}>{lesson.duration}</span>
          </div>
        )}
      </div>

      {/* ── Card body ────────────────────────────────────────────────── */}
      <div style={{ padding: "0.875rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>

        <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-primary)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}
          className="line-clamp-1">
          {lesson.faculty}
        </p>

        <h3 className="line-clamp-2" style={{ fontFamily: "var(--font-headline)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-on-surface)", margin: 0, lineHeight: 1.35 }}>
          {lesson.title}
        </h3>

        {/* Instructor */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%",
            backgroundColor: lesson.instructor.color === "secondary" ? "var(--color-secondary-container)" : "var(--color-primary-fixed)",
            color: lesson.instructor.color === "secondary" ? "var(--color-on-secondary-container)" : "var(--color-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-label)", fontSize: "0.6rem", fontWeight: 700, flexShrink: 0,
          }}>
            {lesson.instructor.initials}
          </div>
          <p className="line-clamp-1" style={{ fontFamily: "var(--font-label)", fontSize: "0.775rem", fontWeight: 600, color: "var(--color-on-surface)", margin: 0, flex: 1 }}>
            {lesson.instructor.name}
          </p>
          <span style={{ display: "flex", alignItems: "center", gap: "0.1875rem", padding: "0.125rem 0.4375rem", borderRadius: "9999px", backgroundColor: "rgba(0,108,73,0.08)", flexShrink: 0 }}>
            <ShieldCheck size={10} color="var(--color-secondary)" />
            <span style={{ fontFamily: "var(--font-label)", fontSize: "0.6rem", fontWeight: 700, color: "var(--color-secondary)" }}>AUCA</span>
          </span>
        </div>

        {/* Rating + price */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid var(--color-outline-variant)", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.1875rem" }}>
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} size={12} color="#b45309" fill="#b45309" />
            ))}
            <span style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface)", marginLeft: "0.25rem" }}>{lesson.rating.toFixed(1)}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.725rem", color: "var(--color-on-surface-variant)", marginLeft: "0.125rem" }}>({lesson.reviewCount})</span>
          </div>
          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)" }}>From 1,000 RWF</span>
        </div>

        {/* CTA */}
        <Link
          href={`/lesson/${lesson.id}`}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", padding: "0.5625rem", borderRadius: "0.625rem", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", transition: "background 0.15s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-on-primary-fixed-variant)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-primary)"; }}
        >
          View Lesson <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
