"use client";

import { Scale, ShieldCheck } from "lucide-react";

export default function EscrowBanner() {
  return (
    <div style={{
      background: "linear-gradient(to right, rgba(0,108,73,0.07), rgba(108,248,187,0.12), var(--color-surface-container-high))",
      padding: "1rem 1.25rem", borderRadius: "0.875rem",
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", backgroundColor: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Scale size={20} color="var(--color-on-secondary)" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <h4 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>Amanota Student Escrow Vault</h4>
            <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary)", color: "var(--color-on-secondary)", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700 }}>Protected</span>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8375rem", color: "var(--color-on-surface-variant)", maxWidth: "44rem", margin: 0 }}>
            Your prepaid funds are guarded in the vault. Clicking <strong style={{ color: "var(--color-on-surface)" }}>&ldquo;Mark Session Completed&rdquo;</strong> releases 80% to your peer mentor&apos;s MTN MoMo or Airtel Money account.
          </p>
        </div>
      </div>
      <button style={{
        display: "flex", alignItems: "center", gap: "0.375rem",
        padding: "0.4375rem 0.875rem", borderRadius: "0.625rem",
        border: "none", cursor: "pointer",
        backgroundColor: "white", color: "var(--color-secondary)",
        fontFamily: "var(--font-label)", fontSize: "0.775rem", fontWeight: 600,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)", alignSelf: "flex-end",
      }}>
        <ShieldCheck size={14} />
        Escrow Rules (80/20)
      </button>
    </div>
  );
}
