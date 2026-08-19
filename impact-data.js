// Wave 03 seed. Two independent axes: publication (draft|published) and evidence verification
// (derived from evidence items). Outcomes carry a basis: verified | self-reported | observed | pending.
export const impactRecords = [
 {
  "id": "imp-khulna-survey-2026",
  "missionId": "msn-khulna-community-01",
  "title": "Community Needs Assessment — Rupsha ward",
  "programSlug": "community-development",
  "program": "Community Development",
  "project": "Khulna Ward Scorecard 2026",
  "chapter": "Khulna",
  "date": "Aug 2026",
  "published": true,
  "unit": "households",
  "unitLabel": "households surveyed",
  "primaryValue": 162,
  "beneficiaries": 150,
  "outputs": [
   { "label": "Households surveyed", "value": 162, "target": 150 },
   { "label": "Volunteer hours contributed", "value": 60, "target": 60 },
   { "label": "Ward scorecards produced", "value": 1, "target": 1 }
  ],
  "outcomes": [
   { "label": "Priority needs formally documented", "value": 4, "basis": "observed", "note": "Water access, girls' schooling, drainage, waste collection", "evidence": "Ward council minutes" },
   { "label": "Council commitments secured", "value": 2, "basis": "verified", "note": "Ward council agreed to fund drainage repair and a waste pickup route", "evidence": "Ward council minutes" }
  ],
  "evidence": [
   { "label": "Signed survey sheets (162)", "type": "document", "verified": true },
   { "label": "Field photographs", "type": "photo", "verified": true },
   { "label": "Ward council minutes", "type": "document", "verified": true },
   { "label": "Scorecard PDF", "type": "report", "verified": false }
  ]
 },
 {
  "id": "imp-career-bootcamp-2026",
  "title": "Career Bootcamp — Dhaka Cohort 01",
  "programSlug": "education-career-readiness",
  "program": "Education & Career Readiness",
  "project": "Career Launch 2026",
  "chapter": "Dhaka",
  "date": "Jun 2026",
  "published": true,
  "unit": "people",
  "unitLabel": "people supported",
  "primaryValue": 120,
  "beneficiaries": 120,
  "outputs": [
   { "label": "Participants enrolled", "value": 120, "target": 120 },
   { "label": "Participants completed", "value": 104, "target": 110 },
   { "label": "CVs reviewed", "value": 118, "target": 120 },
   { "label": "Mock interviews delivered", "value": 96, "target": 90 }
  ],
  "outcomes": [
   { "label": "Interviewed within 90 days", "value": 73, "basis": "self-reported", "note": "70% of those who completed the programme, from the exit survey", "evidence": "Cohort exit survey" },
   { "label": "Secured employment", "value": 29, "basis": "verified", "note": "Confirmed by employer letter or contract copy", "evidence": "Employer confirmation letters (29)" },
   { "label": "Progressed to further study", "value": 11, "basis": "self-reported", "note": "Diploma or certification programmes", "evidence": "Cohort exit survey" }
  ],
  "evidence": [
   { "label": "Attendance register", "type": "document", "verified": true },
   { "label": "Employer confirmation letters (29)", "type": "document", "verified": true },
   { "label": "Completion certificates issued", "type": "credential", "verified": true },
   { "label": "Cohort exit survey", "type": "report", "verified": true }
  ]
 },
 {
  "id": "imp-ai-literacy-2026",
  "title": "AI Literacy Workshops — 8 districts",
  "programSlug": "ai-digital-skills",
  "program": "AI & Digital Skills Development",
  "project": "Digital Bangladesh Skills Drive",
  "chapter": "Multi-chapter",
  "date": "May 2026",
  "published": true,
  "unit": "people",
  "unitLabel": "people supported",
  "primaryValue": 486,
  "beneficiaries": 486,
  "outputs": [
   { "label": "Workshops delivered", "value": 22, "target": 20 },
   { "label": "Participants trained", "value": 486, "target": 450 },
   { "label": "Districts reached", "value": 8, "target": 6 }
  ],
  "outcomes": [
   { "label": "Using AI tools weekly after 60 days", "value": 214, "basis": "self-reported", "note": "44% of participants, from the 60-day follow-up survey", "evidence": "60-day follow-up survey data" },
   { "label": "Small businesses automating a task", "value": 63, "basis": "observed", "note": "Recorded during follow-up interviews", "evidence": "Business interview recordings" },
   { "label": "Participants now volunteering as trainers", "value": 9, "basis": "verified", "note": "Listed on the public volunteer directory", "evidence": "Volunteer records" }
  ],
  "evidence": [
   { "label": "Workshop sign-in sheets", "type": "document", "verified": true },
   { "label": "60-day follow-up survey data", "type": "report", "verified": true },
   { "label": "Session photographs", "type": "photo", "verified": true },
   { "label": "Volunteer records", "type": "document", "verified": true },
   { "label": "Business interview recordings", "type": "media", "verified": false }
  ]
 },
 {
  "id": "imp-youth-bootcamp-2026",
  "title": "Youth Skills Bootcamp — Rajshahi",
  "programSlug": "youth-empowerment",
  "program": "Youth Empowerment",
  "project": "Youth Futures 2026",
  "chapter": "Rajshahi",
  "date": "Apr 2026",
  "published": true,
  "unit": "youth",
  "unitLabel": "young people supported",
  "primaryValue": 201,
  "beneficiaries": 201,
  "outputs": [
   { "label": "Young people attending", "value": 201, "target": 180 },
   { "label": "Financial literacy modules run", "value": 6, "target": 6 },
   { "label": "Micro-grants awarded", "value": 12, "target": 15 }
  ],
  "outcomes": [
   { "label": "Opened a first savings account", "value": 88, "basis": "verified", "note": "Confirmed against partner bank onboarding records", "evidence": "Partner bank onboarding list" },
   { "label": "Micro-grant ventures still trading at 6 months", "value": 9, "basis": "observed", "note": "Of 12 funded, ৳50,000 average grant", "evidence": "6-month venture check-in notes" },
   { "label": "Joined a mentorship circle", "value": 46, "basis": "verified", "note": "Continuing engagement beyond the bootcamp", "evidence": "Bootcamp attendance register" }
  ],
  "evidence": [
   { "label": "Bootcamp attendance register", "type": "document", "verified": true },
   { "label": "Grant disbursement receipts", "type": "document", "verified": true },
   { "label": "Partner bank onboarding list", "type": "document", "verified": true },
   { "label": "6-month venture check-in notes", "type": "report", "verified": false }
  ]
 },
 {
  "id": "imp-innovation-lab-2026",
  "title": "Tech for Good Lab — first cohort",
  "programSlug": "innovation-social-good",
  "program": "Innovation for Social Good",
  "project": "Open Impact Tools",
  "chapter": "Dhaka",
  "date": "Jul 2026",
  "published": true,
  "unit": "tools",
  "unitLabel": "tools deployed",
  "primaryValue": 2,
  "beneficiaries": 86,
  "outputs": [
   { "label": "Prototypes built", "value": 5, "target": 4 },
   { "label": "Open-source tools published", "value": 2, "target": 2 },
   { "label": "Contributors involved", "value": 31, "target": 25 }
  ],
  "outcomes": [
   { "label": "Tools in active use by partner NGOs", "value": 2, "basis": "verified", "note": "Impact dashboard and volunteer attendance tool", "evidence": "Partner adoption confirmations" },
   { "label": "People served through deployed tools", "value": 86, "basis": "observed", "note": "Counted from tool usage logs, not estimated", "evidence": "Usage log extracts" }
  ],
  "evidence": [
   { "label": "Public repositories", "type": "document", "verified": true },
   { "label": "Partner adoption confirmations", "type": "document", "verified": true },
   { "label": "Usage log extracts", "type": "report", "verified": false }
  ]
 },
 {
  "id": "imp-ai-cohort-nov-2026",
  "title": "Digital Skills Certification — Cohort 04",
  "programSlug": "ai-digital-skills",
  "program": "AI & Digital Skills Development",
  "project": "Digital Bangladesh Skills Drive",
  "chapter": "Chattogram",
  "date": "Aug 2026",
  "published": true,
  "unit": "people",
  "unitLabel": "people supported",
  "primaryValue": 80,
  "beneficiaries": 80,
  "outputs": [
   { "label": "Participants enrolled", "value": 80, "target": 80 },
   { "label": "Participants certified", "value": 71, "target": 70 },
   { "label": "Training hours delivered", "value": 240, "target": 240 }
  ],
  "outcomes": [
   { "label": "Employment outcome at 90 days", "value": null, "basis": "pending", "note": "Measurement due 30 Nov 2026 — we do not publish an outcome before we can measure it", "evidence": "Follow-up survey scheduled" }
  ],
  "evidence": [
   { "label": "Attendance register", "type": "document", "verified": true },
   { "label": "Certificates issued (71)", "type": "credential", "verified": true },
   { "label": "Follow-up survey scheduled", "type": "report", "verified": false }
  ]
 },
 {
  "id": "imp-dhaka-draft-2026",
  "title": "School Digital Corner — Mirpur (draft)",
  "programSlug": "ai-digital-skills",
  "program": "AI & Digital Skills Development",
  "project": "Digital Bangladesh Skills Drive",
  "chapter": "Dhaka",
  "date": "Aug 2026",
  "published": false,
  "unit": "students",
  "unitLabel": "students supported",
  "primaryValue": 30,
  "beneficiaries": 30,
  "outputs": [
   { "label": "Students attending", "value": 30, "target": 30 },
   { "label": "Devices set up", "value": 6, "target": 8 }
  ],
  "outcomes": [
   { "label": "Students continuing weekly sessions", "value": null, "basis": "pending", "note": "First follow-up scheduled for Oct 2026", "evidence": "Session log" }
  ],
  "evidence": [
   { "label": "Session log", "type": "document", "verified": false },
   { "label": "Setup photographs", "type": "photo", "verified": false }
  ]
 }
];
