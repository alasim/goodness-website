/**
 * Wrapper that renders branded header/footer chrome used by all printables.
 * Children receive the inner content area.
 */
import gsLogo from "../../../imports/gs-logo.png";

interface PrintShellProps {
  children: React.ReactNode;
  /** Shown in the top-right corner beside the logo */
  docTitle: string;
  docSubtitle?: string;
  orientation?: "portrait" | "landscape";
}

export function PrintShell({ children, docTitle, docSubtitle, orientation = "portrait" }: PrintShellProps) {
  const isLandscape = orientation === "landscape";

  return (
    <div
      style={{
        width: isLandscape ? "297mm" : "210mm",
        minHeight: isLandscape ? "210mm" : "297mm",
        background: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Decorative corner shape — top-right ── */}
      <svg
        style={{ position: "absolute", top: 0, right: 0, pointerEvents: "none" }}
        width="120" height="120" viewBox="0 0 120 120"
      >
        <rect x="20" y="-30" width="130" height="130" rx="26"
          fill="none" stroke="#1B7A34" strokeWidth="2" opacity="0.12"
          transform="rotate(15 85 35)" />
        <rect x="50" y="-50" width="130" height="130" rx="26"
          fill="#4DC86A" opacity="0.06"
          transform="rotate(28 85 35)" />
      </svg>

      {/* ── Decorative corner shape — bottom-left ── */}
      <svg
        style={{ position: "absolute", bottom: 0, left: 0, pointerEvents: "none" }}
        width="100" height="100" viewBox="0 0 100 100"
      >
        <rect x="-40" y="10" width="120" height="120" rx="24"
          fill="#1565C0" opacity="0.05"
          transform="rotate(-18 30 70)" />
        <rect x="-20" y="30" width="100" height="100" rx="20"
          fill="none" stroke="#1B7A34" strokeWidth="1.5" opacity="0.1"
          transform="rotate(-10 30 70)" />
      </svg>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 28px 14px",
        borderBottom: "2px solid #1B7A34",
        position: "relative",
        zIndex: 1,
      }}>
        <img src={gsLogo} alt="Goodness Society" style={{ height: 44, width: "auto" }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D", letterSpacing: "-0.01em" }}>{docTitle}</div>
          {docSubtitle && <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{docSubtitle}</div>}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        {children}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "10px 28px",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ fontSize: 8.5, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Goodness Society — Society for Initiatives of Goodness
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 16, height: 16, borderRadius: "30%",
            background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
            display: "inline-block",
          }} />
          <div style={{ fontSize: 8.5, color: "#9CA3AF" }}>Together for a Better Tomorrow</div>
        </div>
      </div>
    </div>
  );
}
