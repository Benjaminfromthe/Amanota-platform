"use client";

import { Monitor, Users, Wallet, TrendingUp, Infinity, Shield, Award } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  sub: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
  footer?: React.ReactNode;
}

function MetricCard({ label, value, sub, icon, iconBg, footer }: MetricCardProps) {
  return (
    <div style={{
      backgroundColor: "white", padding: "1rem", borderRadius: "0.75rem",
      border: "1px solid var(--color-outline-variant)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px -4px rgba(30,41,59,0.1)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.25rem" }}>{label}</p>
          <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.625rem", fontWeight: 700, color: "var(--color-on-surface)", lineHeight: 1.1 }}>{value}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>{sub}</div>
        </div>
        <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.625rem", backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      {footer && <div style={{ marginTop: "0.75rem" }}>{footer}</div>}
    </div>
  );
}

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div style={{ width: "100%", height: "0.3125rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", overflow: "hidden" }}>
      <div style={{ width: `${percent}%`, height: "100%", borderRadius: "9999px", backgroundColor: color }} />
    </div>
  );
}

export default function MetricsBento() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
      <MetricCard
        label="Unlocked Lessons"
        value="6 Lessons"
        sub={<><Infinity size={13} color="var(--color-secondary)" /> <span style={{ color: "var(--color-secondary)", fontWeight: 600 }}>100% Lifetime Access</span></>}
        icon={<Monitor size={22} color="var(--color-primary)" />}
        iconBg="var(--color-primary-fixed)"
        footer={<ProgressBar percent={100} color="var(--color-primary)" />}
      />
      <MetricCard
        label="Upcoming Sessions"
        value="3 Booked"
        sub={<span>1 Online · 1 AUCA · 1 Cafe</span>}
        icon={<Users size={22} color="var(--color-secondary)" />}
        iconBg="var(--color-secondary-container)"
        footer={
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--color-secondary)", animation: "pulse 2s infinite", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: "0.675rem", fontWeight: 700, color: "var(--color-secondary)" }}>Next: Tomorrow at AUCA Library</span>
          </div>
        }
      />
      <MetricCard
        label="Amanota Escrow Vault"
        value={<span style={{ color: "var(--color-primary)" }}>8,000 <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--color-on-surface-variant)" }}>RWF</span></span>}
        sub={<><Shield size={13} color="var(--color-secondary)" /> <span>100% Student Protection</span></>}
        icon={<Wallet size={22} color="var(--color-primary)" />}
        iconBg="var(--color-primary-fixed)"
        footer={
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-label)", fontSize: "0.675rem", color: "var(--color-on-surface-variant)" }}>
            <span>Tutor Payout Pool</span>
            <span style={{ fontWeight: 700, color: "var(--color-on-surface)" }}>6,400 RWF (80%)</span>
          </div>
        }
      />
      <MetricCard
        label="Syllabus Progress"
        value="84%"
        sub={<><Award size={13} color="var(--color-tertiary-container)" /> <span>Top 5% in AUCA Faculty of IT Cohort</span></>}
        icon={<TrendingUp size={22} color="var(--color-primary)" />}
        iconBg="var(--color-surface-container-highest)"
        footer={<ProgressBar percent={84} color="var(--color-secondary)" />}
      />
    </div>
  );
}
