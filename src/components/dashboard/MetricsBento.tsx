"use client";

import { useApp } from "@/context/AppContext";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  sub: React.ReactNode;
  icon: string;
  iconBg: string;
  iconColor: string;
  footer?: React.ReactNode;
}

function MetricCard({ label, value, sub, icon, iconBg, iconColor, footer }: MetricCardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-container-lowest)",
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 25px -5px rgba(30,41,59,0.08), 0 8px 10px -6px rgba(30,41,59,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              color: "var(--color-on-surface-variant)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.25rem",
            }}
          >
            {label}
          </p>
          <div
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--color-on-surface)",
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--color-on-surface-variant)",
              marginTop: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            {sub}
          </div>
        </div>
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "0.75rem",
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: "1.6rem" }}>
            {icon}
          </span>
        </div>
      </div>
      {footer && <div style={{ marginTop: "0.75rem" }}>{footer}</div>}
    </div>
  );
}

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "0.375rem",
        borderRadius: "9999px",
        backgroundColor: "var(--color-surface-container)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height: "100%",
          borderRadius: "9999px",
          backgroundColor: color,
        }}
      />
    </div>
  );
}

export default function MetricsBento() {
  const { purchases, bookings } = useApp();

  const unlockedCount = purchases.filter((p) => p.tier === "recorded").length;
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const escrowTotal = bookings
    .filter((b) => b.status === "upcoming")
    .reduce((sum, b) => {
      const p = purchases.find((pu) => pu.lessonId === b.lessonId);
      return sum + (p?.pricePaid ?? 0);
    }, 0);
  const tutorPayoutPool = Math.round(escrowTotal * 0.8);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {/* Unlocked Modules */}
      <MetricCard
        label="Unlocked Modules"
        value={`${unlockedCount} Lesson${unlockedCount !== 1 ? "s" : ""}`}
        sub={
          <>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--color-secondary)" }}>
              all_inclusive
            </span>
            <span style={{ color: "var(--color-secondary)", fontWeight: 600 }}>100% Lifetime Access</span>
          </>
        }
        icon="smart_display"
        iconBg="var(--color-primary-fixed)"
        iconColor="var(--color-primary)"
        footer={<ProgressBar percent={100} color="var(--color-primary)" />}
      />

      {/* Upcoming Sessions */}
      <MetricCard
        label="Upcoming Sessions"
        value={`${upcomingCount} Booked`}
        sub={<span>Peer tutoring sessions</span>}
        icon="groups"
        iconBg="var(--color-secondary-container)"
        iconColor="var(--color-secondary)"
        footer={
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span
              style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                backgroundColor: "var(--color-secondary)",
                animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: "var(--color-secondary)",
              }}
            >
              AUCA Escrow Protected
            </span>
          </div>
        }
      />

      {/* Escrow Vault */}
      <MetricCard
        label="Amanota Escrow Vault"
        value={
          <span style={{ color: "var(--color-primary)" }}>
            {escrowTotal.toLocaleString()}{" "}
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-on-surface-variant)" }}>RWF</span>
          </span>
        }
        sub={
          <>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--color-secondary)" }}>
              shield
            </span>
            <span>100% Student Protection</span>
          </>
        }
        icon="account_balance_wallet"
        iconBg="var(--color-primary-fixed)"
        iconColor="var(--color-primary)"
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-label)",
              fontSize: "0.6875rem",
              color: "var(--color-on-surface-variant)",
            }}
          >
            <span>Tutor Payout Pool</span>
            <span style={{ fontWeight: 700, color: "var(--color-on-surface)" }}>{tutorPayoutPool.toLocaleString()} RWF (80%)</span>
          </div>
        }
      />

      {/* Syllabus Progress */}
      <MetricCard
        label="Syllabus Progress"
        value="84%"
        sub={
          <>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--color-tertiary)" }}>
              military_tech
            </span>
            <span>Top 5% in AUCA Faculty of IT Cohort</span>
          </>
        }
        icon="trending_up"
        iconBg="var(--color-surface-container-highest)"
        iconColor="var(--color-primary)"
        footer={<ProgressBar percent={84} color="var(--color-secondary)" />}
      />
    </div>
  );
}
