"use client";

import { Lesson } from "@/lib/data";

interface Props {
  lesson: Lesson;
}

const assetColorMap: Record<string, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  tertiary: "var(--color-tertiary)",
};

export default function LessonCard({ lesson }: Props) {
  const isComplete = lesson.status === "completed";
  const progressColor = isComplete ? "var(--color-secondary)" : "var(--color-primary)";
  const badgeBg =
    lesson.courseCodeColor === "secondary"
      ? "var(--color-secondary)"
      : "var(--color-primary)";
  const badgeColor =
    lesson.courseCodeColor === "secondary"
      ? "var(--color-on-secondary)"
      : "var(--color-on-primary)";

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-container-lowest)",
        borderRadius: "1rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 20px 40px -8px rgba(30,41,59,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",
          backgroundColor: "var(--color-surface-container-highest)",
        }}
      >
        {/* Thumbnail Image */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url('${lesson.thumbnail}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.5s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(17,28,45,0.8) 0%, transparent 50%, transparent 100%)",
          }}
        />

        {/* Top badges */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          <span
            style={{
              padding: "0.25rem 0.625rem",
              borderRadius: "0.375rem",
              backgroundColor: badgeBg,
              color: badgeColor,
              fontFamily: "var(--font-label)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          >
            {lesson.courseCode}
          </span>
          <span
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
              backgroundColor: "rgba(17,28,45,0.7)",
              backdropFilter: "blur(8px)",
              color: "white",
              fontFamily: "var(--font-label)",
              fontSize: "0.6875rem",
            }}
          >
            1080p HD
          </span>
        </div>

        {/* Duration badge */}
        <div
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "0.75rem",
            padding: "0.125rem 0.5rem",
            borderRadius: "0.375rem",
            backgroundColor: "rgba(17,28,45,0.8)",
            backdropFilter: "blur(8px)",
            color: "white",
            fontFamily: "var(--font-label)",
            fontSize: "0.6875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
            schedule
          </span>
          {lesson.duration}
        </div>

        {/* Completed badge */}
        {isComplete && (
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-on-secondary)",
              fontFamily: "var(--font-label)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              check_circle
            </span>
            Completed
          </div>
        )}

        {/* Play button */}
        <button
          style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: "3rem",
            height: "3rem",
            borderRadius: "9999px",
            backgroundColor: "rgba(79,70,229,0.9)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(79,70,229,0.9)";
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: "white",
              fontSize: "1.75rem",
              paddingLeft: isComplete ? 0 : "0.125rem",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {isComplete ? "replay" : "play_arrow"}
          </span>
        </button>
      </div>

      {/* Progress strip */}
      <div
        style={{
          width: "100%",
          height: "0.375rem",
          backgroundColor: "var(--color-surface-container)",
        }}
      >
        <div
          style={{
            width: `${lesson.progress}%`,
            height: "100%",
            backgroundColor: progressColor,
          }}
        />
      </div>

      {/* Card body */}
      <div
        style={{
          padding: "1rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Faculty + progress label */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.375rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "0.6875rem",
                fontWeight: 600,
                color:
                  isComplete
                    ? "var(--color-secondary)"
                    : "var(--color-primary)",
              }}
            >
              {lesson.faculty}
            </span>
            <span
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: isComplete ? "var(--color-secondary)" : "var(--color-on-surface-variant)",
              }}
            >
              {lesson.progress}% {isComplete ? "Watched" : "Completed"}
            </span>
          </div>

          {/* Title */}
          <h3
            className="line-clamp-1"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--color-on-surface)",
              margin: "0 0 0.25rem",
              lineHeight: 1.3,
              transition: "color 0.15s",
            }}
          >
            {lesson.title}
          </h3>

          {/* Description */}
          <p
            className="line-clamp-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-on-surface-variant)",
              margin: "0 0 1rem",
              lineHeight: 1.5,
            }}
          >
            {lesson.description}
          </p>

          {/* Instructor strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--color-surface-container-low)",
              padding: "0.5rem",
              borderRadius: "0.75rem",
            }}
          >
            <div
              style={{
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "9999px",
                backgroundColor:
                  lesson.instructor.color === "secondary"
                    ? "var(--color-secondary-container)"
                    : "var(--color-primary-fixed)",
                color:
                  lesson.instructor.color === "secondary"
                    ? "var(--color-on-secondary-container)"
                    : "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.7rem",
                flexShrink: 0,
              }}
            >
              {lesson.instructor.initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                className="line-clamp-1"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-on-surface)",
                  margin: 0,
                }}
              >
                {lesson.instructor.name}
              </p>
              <p
                className="line-clamp-1"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "0.6875rem",
                  color: "var(--color-on-surface-variant)",
                  margin: 0,
                }}
              >
                {lesson.instructor.title}
              </p>
            </div>
          </div>

          {/* Asset badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.375rem",
              marginTop: "0.75rem",
            }}
          >
            {lesson.assets.map((asset) => (
              <span
                key={asset.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "0.375rem",
                  backgroundColor:
                    asset.color === "secondary"
                      ? "var(--color-secondary-container)"
                      : "var(--color-surface-container)",
                  color:
                    asset.color === "secondary"
                      ? "var(--color-on-secondary-container)"
                      : "var(--color-on-surface-variant)",
                  fontFamily: "var(--font-label)",
                  fontSize: "0.6875rem",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "0.8rem",
                    color: asset.color
                      ? assetColorMap[asset.color] ?? "var(--color-on-surface-variant)"
                      : "inherit",
                  }}
                >
                  {asset.icon}
                </span>
                {asset.label}
              </span>
            ))}
          </div>
        </div>

        {/* Action row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--color-outline-variant)",
          }}
        >
          <a
            href="#"
            style={{
              flex: 1,
              padding: "0.625rem",
              borderRadius: "0.75rem",
              backgroundColor: isComplete
                ? "var(--color-surface-container)"
                : "var(--color-primary)",
              color: isComplete ? "var(--color-on-surface)" : "var(--color-on-primary)",
              fontFamily: "var(--font-label)",
              fontSize: "0.875rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.375rem",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
              {isComplete ? "replay" : "play_circle"}
            </span>
            {isComplete
              ? "Review Lecture"
              : lesson.resumeAt
              ? `Resume (at ${lesson.resumeAt})`
              : "Start Lesson"}
          </a>
          <button
            title="Download Materials"
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: isComplete
                ? "var(--color-primary-fixed)"
                : "var(--color-surface-container)",
              color: isComplete ? "var(--color-primary)" : "var(--color-on-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
              {isComplete ? "file_download" : "download"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
