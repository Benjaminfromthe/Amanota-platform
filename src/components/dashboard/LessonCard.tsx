"use client";

import { Clock, PlayCircle, RotateCcw, Download, FileDown, CheckCircle2 } from "lucide-react";
import { Lesson } from "@/lib/data";

interface Props { lesson: Lesson }

const assetIconColor: Record<string, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  tertiary: "var(--color-tertiary)",
};

export default function LessonCard({ lesson }: Props) {
  const isComplete    = lesson.status === "completed";
  const progressColor = isComplete ? "var(--color-secondary)" : "var(--color-primary)";
  const badgeBg       = lesson.courseCodeColor === "secondary" ? "var(--color-secondary)" : "var(--color-primary)";
  const badgeColor    = lesson.courseCodeColor === "secondary" ? "var(--color-on-secondary)" : "var(--color-on-primary)";

  return (
    <div
      style={{ backgroundColor: "white", border: "1px solid var(--color-outline-variant)", borderRadius: "0.75rem", overflow: "hidden", display: "flex", flexDirection: "column", transition: "box-shadow 0.25s, transform 0.25s" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 12px 32px -4px rgba(30,41,59,0.12)"; el.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "var(--color-surface-container-highest)", flexShrink: 0 }}>
        {lesson.thumbnail && lesson.thumbnail !== "/placeholder.svg" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lesson.thumbnail} alt={lesson.thumbnailAlt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--color-surface-container-high), var(--color-surface-container-highest))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-outline)", opacity: 0.4 }}>{lesson.courseCode}</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,28,45,0.65) 0%, transparent 55%)" }} />

        {/* Top badges */}
        <div style={{ position: "absolute", top: "0.625rem", left: "0.625rem", display: "flex", gap: "0.375rem" }}>
          <span style={{ padding: "0.1875rem 0.5rem", borderRadius: "0.3rem", backgroundColor: badgeBg, color: badgeColor, fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700 }}>{lesson.courseCode}</span>
          <span style={{ padding: "0.1875rem 0.5rem", borderRadius: "0.3rem", backgroundColor: "rgba(17,28,45,0.7)", backdropFilter: "blur(6px)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.65rem" }}>1080p HD</span>
        </div>

        {/* Duration */}
        <div style={{ position: "absolute", bottom: "0.625rem", right: "0.625rem", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.1875rem 0.5rem", borderRadius: "0.3rem", backgroundColor: "rgba(17,28,45,0.75)", backdropFilter: "blur(6px)" }}>
          <Clock size={11} color="white" />
          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", color: "white" }}>{lesson.duration}</span>
        </div>

        {/* Completed badge */}
        {isComplete && (
          <div style={{ position: "absolute", top: "0.625rem", right: "0.625rem", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.1875rem 0.5rem", borderRadius: "0.375rem", backgroundColor: "var(--color-secondary)", color: "var(--color-on-secondary)", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700 }}>
            <CheckCircle2 size={11} /> Completed
          </div>
        )}

        {/* Play button */}
        <button style={{ position: "absolute", inset: 0, margin: "auto", width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(79,70,229,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", transition: "transform 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
          {isComplete ? <RotateCcw size={18} color="white" /> : <PlayCircle size={20} color="white" />}
        </button>
      </div>

      {/* Progress strip */}
      <div style={{ width: "100%", height: "3px", backgroundColor: "var(--color-surface-container)" }}>
        <div style={{ width: `${lesson.progress}%`, height: "100%", backgroundColor: progressColor }} />
      </div>

      {/* Body */}
      <div style={{ padding: "0.875rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 600, color: isComplete ? "var(--color-secondary)" : "var(--color-primary)" }} className="line-clamp-1">{lesson.faculty}</span>
          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: isComplete ? "var(--color-secondary)" : "var(--color-on-surface-variant)" }}>{lesson.progress}%</span>
        </div>

        <h3 className="line-clamp-1" style={{ fontFamily: "var(--font-headline)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-on-surface)", margin: 0, lineHeight: 1.35 }}>{lesson.title}</h3>
        <p className="line-clamp-2" style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--color-on-surface-variant)", margin: 0, lineHeight: 1.5 }}>{lesson.description}</p>

        {/* Instructor */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--color-surface-container-low)", padding: "0.5rem", borderRadius: "0.625rem" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: lesson.instructor.color === "secondary" ? "var(--color-secondary-container)" : "var(--color-primary-fixed)", color: lesson.instructor.color === "secondary" ? "var(--color-on-secondary-container)" : "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-label)", fontSize: "0.6rem", fontWeight: 700, flexShrink: 0 }}>{lesson.instructor.initials}</div>
          <div style={{ minWidth: 0 }}>
            <p className="line-clamp-1" style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface)", margin: 0 }}>{lesson.instructor.name}</p>
            <p className="line-clamp-1" style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", color: "var(--color-on-surface-variant)", margin: 0 }}>{lesson.instructor.title}</p>
          </div>
        </div>

        {/* Asset badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3125rem" }}>
          {lesson.assets.map((asset) => (
            <span key={asset.label} style={{ display: "flex", alignItems: "center", gap: "0.1875rem", padding: "0.125rem 0.4375rem", borderRadius: "0.3rem", backgroundColor: asset.color === "secondary" ? "var(--color-secondary-container)" : "var(--color-surface-container)", color: asset.color === "secondary" ? "var(--color-on-secondary-container)" : "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.625rem", fontWeight: 600 }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: assetIconColor[asset.color ?? "primary"] ?? "var(--color-primary)", display: "inline-block" }} />
              {asset.label}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--color-outline-variant)", marginTop: "auto" }}>
          <a href="#" style={{ flex: 1, padding: "0.5rem", borderRadius: "0.625rem", backgroundColor: isComplete ? "var(--color-surface-container)" : "var(--color-primary)", color: isComplete ? "var(--color-on-surface)" : "white", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", textDecoration: "none" }}>
            {isComplete ? <RotateCcw size={14} /> : <PlayCircle size={14} />}
            {isComplete ? "Review Lecture" : lesson.resumeAt ? `Resume (at ${lesson.resumeAt})` : "Start Lesson"}
          </a>
          <button title="Download" style={{ width: "36px", height: "36px", borderRadius: "0.625rem", border: "none", cursor: "pointer", backgroundColor: isComplete ? "var(--color-primary-fixed)" : "var(--color-surface-container)", color: isComplete ? "var(--color-primary)" : "var(--color-on-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isComplete ? <FileDown size={16} /> : <Download size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
