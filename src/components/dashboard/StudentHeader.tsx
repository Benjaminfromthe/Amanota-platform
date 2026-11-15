"use client";

import Link from "next/link";
import { GraduationCap, ShieldCheck, Calendar, PlusCircle, CheckCircle2 } from "lucide-react";

export default function StudentHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
      {/* Identity */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "0.875rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-headline)", fontSize: "1.125rem", fontWeight: 700, color: "white", boxShadow: "0 4px 12px rgba(53,37,205,0.2)" }}>CI</div>
          <div style={{ position: "absolute", bottom: "-3px", right: "-3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "var(--color-secondary)", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={10} color="white" />
          </div>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", fontWeight: 600, color: "var(--color-on-surface)", letterSpacing: "-0.01em" }}>Cedric Ishimwe</span>
            <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed-variant)", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700 }}>AUCA Active Learner</span>
            <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <ShieldCheck size={10} /> AUCA Escrow Protected
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8375rem", color: "var(--color-on-surface-variant)", margin: "0.25rem 0 0", display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap" }}>
            <GraduationCap size={15} color="var(--color-outline)" />
            <span>AUCA Faculty of Information Technology · Software Engineering</span>
            <span style={{ color: "var(--color-outline)" }}>·</span>
            <span style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.725rem", fontWeight: 600 }}>AUCA-CS-2022-894</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
        <Link href="#" style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", backgroundColor: "white", border: "1px solid var(--color-outline-variant)", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-surface)", textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Calendar size={15} color="var(--color-primary)" /> Sync Google Calendar
        </Link>
        <Link href="#" style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", backgroundColor: "var(--color-primary)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 2px 8px rgba(53,37,205,0.25)" }}>
          <PlusCircle size={15} /> Book New Tutor
        </Link>
      </div>
    </div>
  );
}
