"use client";

import { SessionCard as SessionCardType } from "@/lib/data";

interface Props {
  session: SessionCardType;
}

export default function SessionCard({ session }: Props) {
  const accentColor =
    session.accentColor === "secondary"
      ? "var(--color-secondary)"
      : "var(--color-primary)";

  const badgeBgMap: Record<string, string> = {
    error: "var(--color-error-container)",
    primary: "var(--color-primary-fixed)",
    secondary: "var(--color-surface-container)",
  };
  const badgeColorMap: Record<string, string> = {
    error: "var(--color-on-error-container)",
    primary: "var(--color-primary)",
    secondary: "var(--color-on-surface-variant)",
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-container-lowest)",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 10px 25px -5px rgba(30,41,59,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* Accent top stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "0.375rem",
          backgroundColor: accentColor,
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          paddingBottom: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Mentor avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "1rem",
              backgroundColor: "var(--color-surface-container-high)",
              overflow: "hidden",
            }}
          >
            {session.mentorImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.mentorImg}
                alt={session.mentorImgAlt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "var(--color-primary-fixed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-label)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                }}
              >
                {session.mentorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            )}
          </div>
          <span
            style={{
              position: "absolute",
              bottom: "-0.25rem",
              right: "-0.25rem",
              width: "1rem",
              height: "1rem",
              borderRadius: "9999px",
              backgroundColor: "var(--color-secondary)",
              border: "2px solid var(--color-surface-container-lowest)",
            }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.375rem",
              marginBottom: "0.375rem",
            }}
          >
            <span
              style={{
                padding: "0.125rem 0.625rem",
                borderRadius: "9999px",
                backgroundColor: "var(--color-primary-fixed)",
                color: "var(--color-primary)",
                fontFamily: "var(--font-label)",
                fontSize: "0.6875rem",
                fontWeight: 700,
              }}
            >
              {session.courseCode}
            </span>
            <span
              style={{
                padding: "0.125rem 0.625rem",
                borderRadius: "9999px",
                backgroundColor: "var(--color-surface-container-high)",
                color: "var(--color-on-surface)",
                fontFamily: "var(--font-label)",
                fontSize: "0.6875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "0.875rem", color: "var(--color-primary)" }}>
                {session.type === "online" ? "videocam" : session.type === "cafe" ? "local_cafe" : "domain"}
              </span>
              {session.type === "online"
                ? "Online Live 1-on-1"
                : session.type === "cafe"
                ? "Nearby Café"
                : "AUCA Campus In-Person"}
            </span>
            {session.badge && (
              <span
                style={{
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  backgroundColor: badgeBgMap[session.badgeColor ?? "primary"],
                  color: badgeColorMap[session.badgeColor ?? "primary"],
                  fontFamily: "var(--font-label)",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  animation: session.badgeColor === "error" ? "pulse 2s infinite" : undefined,
                }}
              >
                {session.badge}
              </span>
            )}
          </div>

          <h3
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--color-on-surface)",
              margin: "0 0 0.25rem",
            }}
          >
            {session.subject}
          </h3>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-on-surface-variant)",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              margin: 0,
              flexWrap: "wrap",
            }}
          >
            <span>
              Mentor: <strong style={{ color: "var(--color-on-surface)" }}>{session.mentorName}</strong>
            </span>
            {session.fellow && (
              <>
                <span style={{ color: "var(--color-outline)" }}>•</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.75rem" }}>
                  {session.fellow}
                </span>
              </>
            )}
            <span style={{ color: "var(--color-outline)" }}>•</span>
            <span
              style={{
                color: "var(--color-tertiary-container)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.125rem",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "0.9rem", fontVariationSettings: "'FILL' 1", color: "#885500" }}
              >
                star
              </span>
              {session.rating} ({session.sessionCount} sessions)
            </span>
          </p>
        </div>

        {/* Price */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--color-on-surface)",
            }}
          >
            {session.price.toLocaleString()}{" "}
            <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--color-on-surface-variant)" }}>RWF</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: "var(--color-secondary)",
              fontFamily: "var(--font-label)",
              fontSize: "0.75rem",
              justifyContent: "flex-end",
              marginTop: "0.125rem",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
              lock
            </span>
            In Amanota Vault
          </div>
        </div>
      </div>

      {/* Booking details grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
          backgroundColor: "var(--color-surface-container-low)",
          padding: "1rem",
          borderRadius: "0.75rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", fontSize: "1.25rem", marginTop: "0.125rem" }}>
            schedule
          </span>
          <div>
            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", margin: "0 0 0.125rem" }}>
              {session.type === "online" ? "Scheduled Time" : "Date & Time Slot"}
            </p>
            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.125rem" }}>
              {session.date}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: 0 }}>
              {session.time}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--color-secondary)", fontSize: "1.25rem", marginTop: "0.125rem" }}>
            {session.type === "online" ? "video_camera_front" : "location_on"}
          </span>
          <div>
            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", margin: "0 0 0.125rem" }}>
              {session.type === "online" ? "Meeting Link" : "Meeting Location"}
            </p>
            <p
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: session.type === "online" ? "var(--color-primary)" : "var(--color-on-surface)",
                margin: "0 0 0.125rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              {session.locationTitle}
              {session.type === "online" && (
                <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                  content_copy
                </span>
              )}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: 0 }}>
              {session.locationDetail}
            </p>
          </div>
        </div>
      </div>

      {/* Escrow breakdown */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem",
          borderRadius: "0.75rem",
          backgroundColor: "rgba(231,238,255,0.5)",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--color-secondary)", fontSize: "1.1rem" }}>
            payments
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>
            Tutor payout pending release:{" "}
            <strong style={{ color: "var(--color-on-surface)" }}>
              {session.tutorPayout.toLocaleString()} RWF (80%)
            </strong>{" "}
            • Platform Guarantee fee: {(session.price - session.tutorPayout).toLocaleString()} RWF
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--color-secondary)",
            backgroundColor: "var(--color-secondary-container)",
            padding: "0.125rem 0.5rem",
            borderRadius: "0.25rem",
          }}
        >
          Vault Locked
        </span>
      </div>

      {/* Footer actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {session.whatsapp && (
            <a
              href={`https://wa.me/${session.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.5rem 0.875rem",
                borderRadius: "0.75rem",
                backgroundColor: "var(--color-secondary-container)",
                color: "var(--color-on-secondary-container)",
                fontFamily: "var(--font-label)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                chat
              </span>
              WhatsApp {session.mentorName.split(" ")[0]}
            </a>
          )}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 0.875rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              fontFamily: "var(--font-label)",
              fontSize: "0.75rem",
              fontWeight: 600,
              transition: "background 0.15s",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              {session.type === "online" ? "videocam" : "map"}
            </span>
            {session.type === "online" ? "Join Meeting Room" : "Campus Directions"}
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            style={{
              padding: "0.5rem 0.875rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: "transparent",
              color: "var(--color-on-surface-variant)",
              fontFamily: "var(--font-label)",
              fontSize: "0.75rem",
              fontWeight: 600,
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-error-container)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-on-surface-variant)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            Reschedule
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-on-secondary)",
              fontFamily: "var(--font-label)",
              fontSize: "0.875rem",
              fontWeight: 600,
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              transition: "background 0.15s",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
              done_all
            </span>
            Mark Session Completed
          </button>
        </div>
      </div>
    </div>
  );
}
