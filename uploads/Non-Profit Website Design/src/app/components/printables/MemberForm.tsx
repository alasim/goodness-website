import { PrintShell } from "./PrintShell";

const field = (label: string, wide = false) => (
  <div style={{ marginBottom: 14, gridColumn: wide ? "1 / -1" : undefined }}>
    <div style={{ fontSize: 8.5, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ borderBottom: "1.5px solid #D1D5DB", height: 22 }} />
  </div>
);

const checkbox = (label: string) => (
  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
    <div style={{
      width: 13, height: 13, borderRadius: 3, border: "1.5px solid #D1D5DB", flexShrink: 0,
    }} />
    <span style={{ fontSize: 9.5, color: "#374151" }}>{label}</span>
  </div>
);

const sectionHead = (title: string) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 18,
  }}>
    <div style={{
      width: 4, height: 14, borderRadius: 2,
      background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
    }} />
    <div style={{ fontSize: 9.5, fontWeight: 700, color: "#0D0D0D", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</div>
  </div>
);

export function MemberForm() {
  return (
    <PrintShell docTitle="Membership Registration Form" docSubtitle="Official Document — Keep a copy for your records">
      <div style={{ padding: "16px 28px 10px" }}>

        {/* Intro */}
        <div style={{
          background: "linear-gradient(135deg, #f0faf3 0%, #e8f5e9 100%)",
          borderRadius: 8, padding: "10px 14px", marginBottom: 4,
          borderLeft: "3px solid #1B7A34",
        }}>
          <p style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.5 }}>
            Complete all sections in <strong>block capitals</strong>. Return this form to any Goodness Society office or scan and email to{" "}
            <span style={{ color: "#1B7A34", fontWeight: 600 }}>members@goodnesssociety.org</span>
          </p>
        </div>

        {/* Personal Info */}
        {sectionHead("Personal Information")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          {field("Full Name (Surname first)", true)}
          {field("Date of Birth (DD / MM / YYYY)")}
          {field("Gender")}
          {field("Nationality")}
          {field("Phone Number")}
          {field("WhatsApp Number (if different)")}
          {field("Email Address", true)}
          {field("Residential Address", true)}
          {field("City / State", true)}
        </div>

        {/* Professional */}
        {sectionHead("Professional Background")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          {field("Occupation / Job Title")}
          {field("Organisation / Employer")}
          {field("Highest Qualification")}
          {field("Years of Experience")}
        </div>

        {/* Areas of Interest */}
        {sectionHead("Areas of Interest")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 8px", marginBottom: 10 }}>
          {[
            "Education & Career Readiness",
            "AI & Digital Skills",
            "Youth Empowerment",
            "Community Development",
            "Innovation for Social Good",
            "Fundraising & Partnerships",
            "Communications & Media",
            "Research & Data",
            "General Volunteering",
          ].map(checkbox)}
        </div>

        {/* Referral */}
        {sectionHead("How Did You Hear About Us?")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0 8px", marginBottom: 10 }}>
          {["Social Media", "Friend / Colleague", "Event / Programme", "Website", "News / Press", "Other"].map(checkbox)}
        </div>

        {/* Declaration */}
        {sectionHead("Declaration")}
        <div style={{
          border: "1px solid #D1D5DB", borderRadius: 6, padding: "8px 12px", marginBottom: 14,
        }}>
          <p style={{ fontSize: 8.5, color: "#6B7280", lineHeight: 1.6 }}>
            I confirm that the information provided is accurate and complete. I agree to uphold the values and code of conduct of Goodness Society and understand that membership may be reviewed annually.
          </p>
        </div>

        {/* Signature row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          {field("Signature")}
          {field("Date")}
        </div>

        {/* Office use */}
        <div style={{
          marginTop: 6,
          padding: "8px 12px",
          border: "1px dashed #D1D5DB",
          borderRadius: 6,
          background: "#fafafa",
        }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>For Office Use Only</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>
            {["Member ID", "Date Received", "Processed By"].map((l) => (
              <div key={l}>
                <div style={{ fontSize: 7.5, color: "#9CA3AF", marginBottom: 3 }}>{l}</div>
                <div style={{ borderBottom: "1px solid #E5E7EB", height: 16 }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </PrintShell>
  );
}
