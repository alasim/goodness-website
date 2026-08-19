// Wave 05 seed: the capital side. Partners tie to real donations in finance-data.js;
// people/impact numbers in partner views are computed LIVE from the same stores the
// Trust Ledger and Impact pages use — one truth, two audiences.
export const partners = [
 {
  "id": "ptr-brightworks",
  "districts": ["Dhaka", "Chattogram"],
  "name": "BrightWorks Bangladesh Ltd",
  "kind": "Corporate sponsorship",
  "tier": "Strategic Impact Partner",
  "since": "Jun 2026",
  "stage": "active",
  "renewal": "Jun 2027",
  "programs": ["ai-digital-skills", "education-career-readiness"],
  "committed": 2500000,
  "received": 1500000,
  "contact": "Farid Hossain, Head of CSR",
  "inKind": [{ "label": "Training venue, Gulshan (12 sessions)", "estValue": 300000 }],
  "employees": { "participated": 9, "hours": 62, "sessions": 3 },
  "discloseFunding": true,
  "commitments": {
   "goodness": [
    { "label": "Digital-skills cohorts delivered", "done": 3, "total": 4 },
    { "label": "Quarterly impact reports", "done": 2, "total": 4 },
    { "label": "90-day outcome measurement", "note": "Next due 30 Nov 2026" }
   ],
   "partner": [
    { "label": "Funding commitment received", "done": 15, "total": 25, "unit": "L" },
    { "label": "Employee volunteers", "done": 9, "total": 20 },
    { "label": "Training venue sessions", "done": 8, "total": 12 }
   ]
  },
  "goal": { "label": "Support 1,000 young people with digital skills", "target": 1000 },
  "story": "Building digital opportunity for young Bangladeshis — practical AI skills, verified certifications, and pathways into work.",
  "timeline": [
   { "date": "18 Aug 2026", "type": "evidence", "text": "Attendance registers checked for Cohort 04 — 71 certificates issued" },
   { "date": "12 Aug 2026", "type": "money", "text": "Second instalment received — ৳15.0L of ৳25.0L commitment" },
   { "date": "02 Aug 2026", "type": "mission", "text": "Digital Skills Certification Cohort 04 completed in Chattogram" },
   { "date": "14 Jul 2026", "type": "people", "text": "6 BrightWorks employees volunteered at the Dhaka AI workshop" },
   { "date": "28 Jun 2026", "type": "money", "text": "৳5.0L allocated to the Digital Bangladesh Skills Drive" },
   { "date": "15 Jun 2026", "type": "start", "text": "Partnership signed — ৳25.0L committed over 12 months" }
  ]
 },
 {
  "id": "ptr-rahman-foundation",
  "districts": ["Dhaka"],
  "name": "Rahman Family Foundation",
  "kind": "Restricted grant",
  "tier": "Impact Partner",
  "since": "Aug 2026",
  "stage": "active",
  "renewal": "Aug 2027",
  "programs": ["education-career-readiness"],
  "committed": 2500000,
  "received": 2500000,
  "contact": "Grants office",
  "discloseFunding": false,
  "inKind": [],
  "employees": { "participated": 0, "hours": 0, "sessions": 0 },
  "goal": { "label": "500 graduates through Career Launch", "target": 500 },
  "story": "Funding career readiness for graduates across Dhaka division.",
  "timeline": [
   { "date": "05 Aug 2026", "type": "money", "text": "Grant received in full — ৳25.0L, restricted to Education & Career Readiness" },
   { "date": "01 Aug 2026", "type": "start", "text": "Grant agreement signed with quarterly reporting" }
  ]
 },
 {
  "id": "ptr-delta",
  "districts": ["Rajshahi"],
  "name": "Delta Textiles CSR",
  "kind": "CSR partnership",
  "tier": "Impact Partner",
  "since": "Jul 2026",
  "stage": "active",
  "renewal": "Jul 2027",
  "programs": ["youth-empowerment"],
  "committed": 900000,
  "received": 900000,
  "contact": "CSR desk",
  "inKind": [],
  "employees": { "participated": 4, "hours": 18, "sessions": 1 },
  "goal": { "label": "200 young people through skills bootcamps", "target": 200 },
  "story": "Backing youth micro-grants and bootcamps in Rajshahi.",
  "timeline": [
   { "date": "20 Jul 2026", "type": "money", "text": "৳9.0L received for Youth Futures 2026" }
  ]
 },
 {
  "id": "ptr-nagorik",
  "districts": ["Khulna", "Sylhet"],
  "name": "Nagorik Trust",
  "kind": "Grant",
  "tier": "Impact Partner",
  "since": "Jul 2026",
  "stage": "active",
  "renewal": "Jan 2027",
  "programs": ["community-development"],
  "committed": 1200000,
  "received": 1200000,
  "contact": "Programme officer",
  "inKind": [],
  "employees": { "participated": 0, "hours": 0, "sessions": 0 },
  "goal": { "label": "3 community projects delivered", "target": 3 },
  "story": "Community-led development in Khulna and Sylhet.",
  "timeline": [
   { "date": "08 Jul 2026", "type": "money", "text": "৳12.0L received for community development work" }
  ]
 },
 {
  "id": "ptr-techhub",
  "districts": ["Dhaka"],
  "name": "TechHub Dhaka",
  "kind": "Corporate sponsorship + in-kind",
  "tier": "Founding Partner",
  "since": "Jun 2024",
  "stage": "renewal",
  "renewal": "Oct 2026",
  "programs": ["innovation-social-good", "ai-digital-skills"],
  "committed": 600000,
  "received": 600000,
  "contact": "Partnerships team",
  "discloseFunding": true,
  "inKind": [{ "label": "Co-working space for Tech for Good Lab", "estValue": 240000 }, { "label": "Cloud credits", "estValue": 90000 }],
  "employees": { "participated": 12, "hours": 96, "sessions": 5 },
  "goal": { "label": "2 open-source tools in the field", "target": 2 },
  "story": "Our longest-running technology partner — powering the Tech for Good Lab since 2024.",
  "timeline": [
   { "date": "18 Jun 2026", "type": "money", "text": "2026 sponsorship received — ৳6.0L" },
   { "date": "05 Jun 2026", "type": "people", "text": "TechHub engineers mentored the Innovation Sprint" }
  ]
 },
 {
  "id": "ptr-dhaka-university",
  "districts": ["Dhaka"],
  "name": "University of Dhaka Career Club",
  "kind": "Institutional partner — venue, faculty & participants (in-kind)",
  "tier": "Knowledge Partner",
  "since": "Feb 2026",
  "stage": "active",
  "renewal": "Feb 2027",
  "programs": ["education-career-readiness", "youth-empowerment"],
  "committed": 0,
  "received": 0,
  "contact": "Faculty adviser",
  "discloseFunding": true,
  "inKind": [{ "label": "Auditorium & classrooms for bootcamps", "estValue": 350000 }, { "label": "Faculty mentoring hours", "estValue": 120000 }],
  "employees": { "participated": 26, "hours": 210, "sessions": 7 },
  "goal": { "label": "Reach 500 students through campus programmes", "target": 500 },
  "story": "No cash changes hands — the university contributes venues, faculty time, and student participation.",
  "timeline": [
   { "date": "11 Aug 2026", "type": "people", "text": "26 student volunteers completed the Career Launch support missions" },
   { "date": "02 Feb 2026", "type": "start", "text": "MoU signed — venue and faculty support for 2026" }
  ]
 },
 {
  "id": "ptr-prospect-bank",
  "districts": ["Dhaka"],
  "name": "Eastern Capital Bank",
  "kind": "Prospect — CSR partnership",
  "tier": "Prospect",
  "since": "—",
  "stage": "proposal",
  "renewal": "—",
  "programs": ["education-career-readiness"],
  "committed": 0,
  "received": 0,
  "contact": "Head of Sustainability",
  "inKind": [],
  "employees": { "participated": 0, "hours": 0, "sessions": 0 },
  "goal": { "label": "Proposal: Mock Interview Days with employee volunteers", "target": 0 },
  "story": "",
  "timeline": [
   { "date": "14 Aug 2026", "type": "note", "text": "Proposal sent — Career Launch co-funding + employee volunteering" }
  ]
 }
];

// Impact Marketplace. Innovation's numbers mirror the Trust Ledger's real funding gap.
export const opportunities = [
 {
  "id": "opp-ai-500",
  "title": "AI skills for 500 young people",
  "programSlug": "ai-digital-skills",
  "where": "Dhaka · Chattogram",
  "urgent": false,
  "target": 1800000,
  "secured": 1140000,
  "seeking": ["Lead Partner — ৳10L+", "Supporting partners — ৳2L+", "20 employee volunteers"],
  "expected": ["500 learners complete foundation training", "400 certifications", "90-day follow-up measured and published"],
  "note": "Contributions join the funding pool for this initiative; results are reported collectively with evidence."
 },
 {
  "id": "opp-sylhet-floods",
  "title": "Rebuild learning access after the Sylhet floods",
  "programSlug": "community-development",
  "where": "Sylhet division",
  "urgent": true,
  "target": 1200000,
  "secured": 380000,
  "seeking": ["Relief partners — any amount", "In-kind: school supplies, transport"],
  "expected": ["400 family relief packs", "6 learning spaces restored", "Household recovery tracked on the ward scorecard"],
  "note": "Urgent — packing missions are already scheduled and waiting on funding."
 },
 {
  "id": "opp-career-rajshahi",
  "title": "Career Launch — Rajshahi",
  "programSlug": "education-career-readiness",
  "where": "Rajshahi",
  "urgent": false,
  "target": 950000,
  "secured": 250000,
  "seeking": ["Anchor partner — ৳5L", "Mock-interview employee volunteers"],
  "expected": ["250 graduating students coached", "CVs and mock interviews for all participants", "Employment outcomes measured at 90 days"],
  "note": "Extends the Dhaka cohort model whose outcomes are already published."
 },
 {
  "id": "opp-open-tools",
  "title": "Open Impact Tools — close the funding gap",
  "programSlug": "innovation-social-good",
  "where": "Dhaka · remote",
  "urgent": false,
  "target": 800000,
  "secured": 560000,
  "seeking": ["Technology partner — ৳2.4L", "In-kind: cloud hosting, design time"],
  "expected": ["2 open-source tools maintained in the field", "Partner NGOs onboarded", "Usage logged, not estimated"],
  "note": "This is the same ৳2.4L gap shown on the Trust Ledger's Innovation fund."
 }
];
