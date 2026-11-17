/**
 * LessonPlaceholder
 * Renders a branded SVG thumbnail when no video/image has been uploaded yet.
 * Uses the course code and faculty to generate a unique gradient + pattern.
 */

import React from "react";

// Faculty → gradient pair (indigo spectrum)
const FACULTY_GRADIENTS: Record<string, [string, string]> = {
  "Software Engineering":   ["#3525cd", "#4f46e5"],
  "Networking":             ["#1d4ed8", "#3b82f6"],
  "Information Management": ["#0e7490", "#06b6d4"],
  "Business":               ["#065f46", "#059669"],
  "Theology":               ["#6b21a8", "#9333ea"],
  "Nursing":                ["#be185d", "#ec4899"],
  "Education":              ["#b45309", "#f59e0b"],
  "default":                ["#374151", "#6b7280"],
};

interface Props {
  courseCode:  string;
  facultyKey?: string;
  title?:      string;
  style?:      React.CSSProperties;
}

export default function LessonPlaceholder({ courseCode, facultyKey, title, style }: Props) {
  const [from, to] = FACULTY_GRADIENTS[facultyKey ?? "default"] ?? FACULTY_GRADIENTS["default"];
  const id         = `grad-${courseCode.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 180"
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-label={title ?? courseCode}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={from} />
          <stop offset="100%" stopColor={to}   />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="320" height="180" fill={`url(#${id})`} />

      {/* Subtle dot-grid pattern */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 14 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 24 + 8}
            cy={row * 24 + 8}
            r="1.5"
            fill="rgba(255,255,255,0.12)"
          />
        ))
      )}

      {/* Play-circle icon outline */}
      <circle cx="160" cy="82" r="28" fill="rgba(255,255,255,0.12)" />
      <circle cx="160" cy="82" r="20" fill="rgba(255,255,255,0.18)" />
      {/* Triangle */}
      <polygon points="155,74 155,90 171,82" fill="rgba(255,255,255,0.85)" />

      {/* Course code badge */}
      <rect x="12" y="12" width={courseCode.length * 9 + 16} height="22" rx="4" fill="rgba(0,0,0,0.35)" />
      <text
        x="20"
        y="27"
        fontFamily="'Inter', 'Helvetica Neue', sans-serif"
        fontWeight="700"
        fontSize="11"
        fill="white"
        letterSpacing="0.5"
      >
        {courseCode}
      </text>

      {/* "Upload your video" prompt */}
      <rect x="0" y="148" width="320" height="32" fill="rgba(0,0,0,0.3)" />
      <text
        x="160"
        y="168"
        textAnchor="middle"
        fontFamily="'Inter', 'Helvetica Neue', sans-serif"
        fontSize="11"
        fill="rgba(255,255,255,0.75)"
        letterSpacing="0.3"
      >
        Video coming soon · Upload via Creator Studio
      </text>
    </svg>
  );
}
