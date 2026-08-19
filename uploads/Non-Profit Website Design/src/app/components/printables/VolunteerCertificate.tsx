import gsLogo from "../../../imports/gs-logo.png";

export function VolunteerCertificate() {
  return (
    <div
      style={{
        width: "297mm",
        minHeight: "210mm",
        background: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Brand elements OUTSIDE the bordered rect ── */}

      {/* Top-left rounded-square cluster */}
      <svg style={{ position: "absolute", top: -12, left: -12, zIndex: 2, pointerEvents: "none" }} width="96" height="96" viewBox="0 0 96 96">
        <rect x="4" y="4" width="60" height="60" rx="14" fill="none" stroke="#4DC86A" strokeWidth="2.5" opacity="0.35" transform="rotate(14 34 34)" />
        <rect x="14" y="14" width="44" height="44" rx="10" fill="#4DC86A" opacity="0.10" transform="rotate(26 36 36)" />
      </svg>

      {/* Top-right rounded-square cluster */}
      <svg style={{ position: "absolute", top: -12, right: -12, zIndex: 2, pointerEvents: "none" }} width="96" height="96" viewBox="0 0 96 96">
        <rect x="32" y="4" width="60" height="60" rx="14" fill="none" stroke="#1565C0" strokeWidth="2.5" opacity="0.22" transform="rotate(-14 62 34)" />
        <rect x="38" y="14" width="44" height="44" rx="10" fill="#1565C0" opacity="0.07" transform="rotate(-26 60 36)" />
      </svg>

      {/* Bottom-left rounded-square cluster */}
      <svg style={{ position: "absolute", bottom: -12, left: -12, zIndex: 2, pointerEvents: "none" }} width="96" height="96" viewBox="0 0 96 96">
        <rect x="4" y="32" width="60" height="60" rx="14" fill="none" stroke="#1565C0" strokeWidth="2.5" opacity="0.22" transform="rotate(-14 34 62)" />
        <rect x="14" y="38" width="44" height="44" rx="10" fill="#1565C0" opacity="0.07" transform="rotate(-26 36 60)" />
      </svg>

      {/* Bottom-right rounded-square cluster */}
      <svg style={{ position: "absolute", bottom: -12, right: -12, zIndex: 2, pointerEvents: "none" }} width="96" height="96" viewBox="0 0 96 96">
        <rect x="32" y="32" width="60" height="60" rx="14" fill="none" stroke="#4DC86A" strokeWidth="2.5" opacity="0.35" transform="rotate(14 62 62)" />
        <rect x="38" y="38" width="44" height="44" rx="10" fill="#4DC86A" opacity="0.10" transform="rotate(26 60 60)" />
      </svg>

      {/* ── HEADER — logo outside bordered area ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px 14px",
        position: "relative",
        zIndex: 1,
      }}>
        <img src={gsLogo} alt="Goodness Society" style={{ height: 48, width: "auto" }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>Certificate of Volunteer Service</div>
          <div style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>Goodness Society — Official Recognition</div>
        </div>
      </div>

      {/* Green rule separating header from bordered cert body */}
      <div style={{ height: 3, background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)", margin: "0 32px" }} />

      {/* ── MAIN CERTIFICATE BODY — bordered rectangle ── */}
      <div style={{
        margin: "18px 32px",
        flex: 1,
        border: "2px solid rgba(27,122,52,0.2)",
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 52px",
        background: "#fff",
      }}>
        {/* Inner decorative border */}
        <div style={{
          position: "absolute",
          inset: 8,
          borderRadius: 8,
          border: "1px dashed rgba(27,122,52,0.12)",
          pointerEvents: "none",
        }} />

        {/* Watermark G */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          overflow: "hidden",
        }}>
          <span style={{ fontSize: "18rem", fontWeight: 800, color: "rgba(27,122,52,0.025)", lineHeight: 1, userSelect: "none" }}>G</span>
        </div>

        {/* ── Content ── */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 1, width: "100%" }}>

          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 2, background: "linear-gradient(90deg, transparent, #4DC86A)" }} />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "#1B7A34", textTransform: "uppercase", letterSpacing: "0.2em" }}>
              Certificate of Volunteer Service
            </span>
            <div style={{ width: 36, height: 2, background: "linear-gradient(90deg, #4DC86A, transparent)" }} />
          </div>

          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 22, letterSpacing: "0.03em" }}>
            This is to certify that
          </p>

          {/* Name line */}
          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontSize: 34,
              fontWeight: 300,
              color: "#0D0D0D",
              lineHeight: 1,
              borderBottom: "2.5px solid #1B7A34",
              minWidth: 380,
              paddingBottom: 8,
              display: "inline-block",
              letterSpacing: "-0.01em",
            }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div style={{ fontSize: 8.5, color: "#9CA3AF", marginTop: 4 }}>Full Name of Volunteer</div>
          </div>

          {/* Body text */}
          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.8, maxWidth: 480, margin: "0 auto 24px", fontWeight: 400 }}>
            has dedicated their time and talents as a volunteer with{" "}
            <strong style={{ fontWeight: 800, color: "#0D0D0D" }}>Goodness Society</strong>,
            contributing to our mission of creating sustainable social impact through
            education, skills development, and community empowerment.
          </p>

          {/* Program / Period / Hours */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, maxWidth: 520, margin: "0 auto 28px" }}>
            {["Program / Area", "Period of Service", "Hours Contributed"].map((label) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ borderBottom: "1.5px solid #D1D5DB", height: 26, marginBottom: 5 }} />
                <div style={{ fontSize: 7.5, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Signatures + seal */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "flex-end", gap: 28, maxWidth: 560, margin: "0 auto" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ borderBottom: "1.5px solid #0D0D0D", height: 40, marginBottom: 5 }} />
              <div style={{ fontSize: 9, fontWeight: 700, color: "#0D0D0D" }}>Executive Director</div>
              <div style={{ fontSize: 8, color: "#6B7280" }}>Goodness Society</div>
            </div>

            {/* Seal */}
            <div style={{
              width: 76, height: 76, borderRadius: "50%",
              border: "2.5px solid rgba(27,122,52,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "radial-gradient(circle, rgba(77,200,106,0.07) 0%, white 70%)",
            }}>
              <div style={{
                width: 58, height: 58, borderRadius: "50%",
                border: "1.5px dashed rgba(27,122,52,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 2,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "30%",
                  background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 800 }}>G</span>
                </div>
                <div style={{ fontSize: 5.5, color: "#1B7A34", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Official</div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ borderBottom: "1.5px solid #0D0D0D", height: 40, marginBottom: 5 }} />
              <div style={{ fontSize: 9, fontWeight: 700, color: "#0D0D0D" }}>Date Issued</div>
              <div style={{ fontSize: 8, color: "#6B7280" }}>DD / MM / YYYY</div>
            </div>
          </div>

          {/* Verification */}
          <p style={{ fontSize: 8, color: "#9CA3AF", fontStyle: "italic", marginTop: 18 }}>
            Certificate Reference: GS-VOL-__________ | Verify at goodnesssociety.org/verify
          </p>
        </div>
      </div>

      {/* ── FOOTER — tagline outside bordered area ── */}
      <div style={{
        padding: "10px 32px 16px",
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
          }} />
          <div style={{ fontSize: 8.5, color: "#9CA3AF" }}>Together for a Better Tomorrow</div>
        </div>
      </div>
    </div>
  );
}
