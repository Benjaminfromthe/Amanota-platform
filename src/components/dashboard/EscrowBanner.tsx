"use client";

export default function EscrowBanner() {
  return (
    <div
      style={{
        background:
          "linear-gradient(to right, rgba(0,108,73,0.08), rgba(108,248,187,0.15), var(--color-surface-container-high))",
        padding: "1rem",
        borderRadius: "1rem",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "1rem",
            backgroundColor: "var(--color-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "var(--color-on-secondary)", fontSize: "1.6rem" }}
          >
            gavel
          </span>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <h4
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--color-on-surface)",
                margin: 0,
              }}
            >
              Amanota Student Escrow Vault
            </h4>
            <span
              style={{
                padding: "0.125rem 0.625rem",
                borderRadius: "9999px",
                backgroundColor: "var(--color-secondary)",
                color: "var(--color-on-secondary)",
                fontFamily: "var(--font-label)",
                fontSize: "0.6875rem",
                fontWeight: 700,
              }}
            >
              Protected
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-on-surface-variant)",
              maxWidth: "48rem",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Your prepaid funds are guarded safely in the vault. Clicking{" "}
            <strong style={{ color: "var(--color-on-surface)" }}>"Mark Session Completed"</strong> releases
            the 80% payout directly to your peer mentor&apos;s MTN MoMo or Airtel Money account once you have
            met and finished your session.
          </p>
        </div>
      </div>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.75rem",
          border: "none",
          cursor: "pointer",
          backgroundColor: "var(--color-surface-container-lowest)",
          color: "var(--color-secondary)",
          fontFamily: "var(--font-label)",
          fontSize: "0.75rem",
          fontWeight: 600,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          alignSelf: "flex-end",
          transition: "background 0.15s",
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
          verified
        </span>
        Escrow Rules (80/20)
      </button>
    </div>
  );
}
