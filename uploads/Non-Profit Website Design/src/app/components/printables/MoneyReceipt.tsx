import { PrintShell } from "./PrintShell";

const line = (label: string, value?: string, wide = false) => (
  <div style={{ marginBottom: 14, gridColumn: wide ? "1 / -1" : undefined }}>
    <div style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
      {label}
    </div>
    <div style={{
      borderBottom: "1.5px solid #D1D5DB",
      height: 24,
      display: "flex",
      alignItems: "flex-end",
      paddingBottom: 3,
    }}>
      {value && <span style={{ fontSize: 10, color: "#0D0D0D", fontWeight: 500 }}>{value}</span>}
    </div>
  </div>
);

const paymentMethod = (label: string) => (
  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid #D1D5DB", flexShrink: 0 }} />
    <span style={{ fontSize: 9.5, color: "#374151" }}>{label}</span>
  </div>
);

function ReceiptBody({ copy }: { copy: "Original" | "Duplicate" }) {
  return (
    <div style={{ padding: "14px 28px 10px", flex: 1 }}>
      {/* Receipt number & date row */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>Receipt No.</div>
          <div style={{ borderBottom: "1.5px solid #D1D5DB", width: 100, height: 22, marginTop: 4 }} />
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>Date</div>
          <div style={{ borderBottom: "1.5px solid #D1D5DB", width: 120, height: 22, marginTop: 4 }} />
        </div>
        <div style={{
          padding: "4px 10px", borderRadius: 20,
          background: copy === "Original"
            ? "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)"
            : "#F3F4F6",
          color: copy === "Original" ? "white" : "#6B7280",
          fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          {copy}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        {line("Received From (Full Name)", undefined, true)}
        {line("Organisation / Company (if applicable)", undefined, true)}

        {/* Amount box */}
        <div style={{ gridColumn: "1 / -1", marginBottom: 14 }}>
          <div style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Amount</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "stretch" }}>
            <div style={{
              background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
              borderRadius: 8,
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
            }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>₦</span>
            </div>
            <div style={{
              border: "2px solid #1B7A34", borderRadius: 8,
              display: "flex", alignItems: "center", padding: "0 14px",
              minHeight: 40,
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0D0D0D", letterSpacing: "0.12em" }}>
                ___________________
              </span>
            </div>
          </div>
        </div>

        {line("Amount in Words", undefined, true)}
        {line("Purpose / Description of Payment", undefined, true)}
      </div>

      {/* Payment method */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Payment Method</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {["Cash", "Bank Transfer", "Cheque", "POS / Card", "Online"].map(paymentMethod)}
        </div>
      </div>

      {/* Bank transfer details */}
      <div style={{
        background: "#f0faf3", borderRadius: 6, padding: "8px 12px", marginBottom: 16,
        borderLeft: "3px solid #4DC86A",
      }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#1B7A34", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Bank Account Details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[["Account Name", "Goodness Society"], ["Account Number", "0000000000"], ["Bank", "First Bank Nigeria"]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 7.5, color: "#6B7280" }}>{k}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#0D0D0D" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Signatures */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {["Received by (Name)", "Signature", "Date"].map((l) => (
          <div key={l}>
            <div style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{l}</div>
            <div style={{ borderBottom: "1.5px solid #D1D5DB", height: 24 }} />
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 10, fontSize: 7.5, color: "#9CA3AF", textAlign: "center",
        fontStyle: "italic",
      }}>
        This receipt is issued by Goodness Society (Society for Initiatives of Goodness) — a registered non-profit organisation.
        Please retain for your records. For queries: hello@goodnesssociety.org
      </div>
    </div>
  );
}

export function MoneyReceipt() {
  return (
    <PrintShell docTitle="Official Money Receipt" docSubtitle="Issued by Goodness Society">
      {/* Original copy */}
      <ReceiptBody copy="Original" />

      {/* Cut line */}
      <div style={{
        margin: "0 20px",
        borderTop: "1.5px dashed #D1D5DB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        <span style={{
          background: "white",
          padding: "0 10px",
          fontSize: 8,
          color: "#D1D5DB",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          position: "absolute",
        }}>✂ Cut here — Duplicate copy below</span>
      </div>

      {/* Duplicate copy */}
      <ReceiptBody copy="Duplicate" />
    </PrintShell>
  );
}
