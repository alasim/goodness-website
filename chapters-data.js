// Wave 06.1 seed: the network. Chapter numbers are NEVER stored — loadNetwork() computes
// members/hours/missions/impact/capital live from the same stores every other page uses.
// coverage = cities whose volunteers belong to this chapter by default (until they pick one).
export const chapters = [
 {
  "id": "chp-dhaka", "name": "Goodness Dhaka", "type": "district", "parentId": null,
  "status": "active", "since": "Jan 2024", "city": "Dhaka", "division": "Dhaka",
  "coverage": ["Dhaka", "Gazipur", "Narayanganj", "Mymensingh"],
  "team": [
   { "volunteerId": "nusrat-j", "role": "Chapter Lead", "since": "Jan 2026" },
   { "volunteerId": "sabbir-r", "role": "Operations Lead", "since": "Mar 2026" },
   { "volunteerId": "arif-c", "role": "People Lead", "since": "Mar 2026" },
   { "volunteerId": "asif-m", "role": "Finance & Trust contact", "since": "Jun 2026" }
  ],
  "leadershipHistory": [{ "name": "Tanvir Ahmed", "role": "Founding Chapter Lead", "period": "2024–2025" }],
  "goals": [
   { "label": "People supported", "metric": "people", "target": 800 },
   { "label": "Verified service hours", "metric": "hours", "target": 600 },
   { "label": "Missions run", "metric": "missions", "target": 12 },
   { "label": "Active partners", "metric": "partners", "target": 5 }
  ],
  "standards": { "done": 6, "total": 6 },
  "story": "The founding chapter — where Goodness started and where national programmes are piloted."
 },
 {
  "id": "chp-du", "name": "Goodness University of Dhaka", "type": "university", "parentId": "chp-dhaka",
  "status": "active", "since": "Feb 2026", "city": "Dhaka", "division": "Dhaka",
  "coverage": [],
  "partnerIds": ["ptr-dhaka-university"],
  "campusNote": "26 campus volunteers · 210 service hours via the University of Dhaka Career Club partnership",
  "team": [{ "volunteerId": "sumaiya-k", "role": "Campus Lead", "since": "Feb 2026" }],
  "leadershipHistory": [],
  "goals": [
   { "label": "Students reached on campus", "metric": "people", "target": 500 },
   { "label": "Campus missions", "metric": "missions", "target": 6 }
  ],
  "standards": { "done": 5, "total": 6 },
  "story": "Our first university chapter — students, faculty and campus venues powering Career Launch."
 },
 {
  "id": "chp-chattogram", "name": "Goodness Chattogram", "type": "district", "parentId": null,
  "status": "active", "since": "Jun 2024", "city": "Chattogram", "division": "Chattogram",
  "coverage": ["Chattogram", "Cox's Bazar", "Cumilla"],
  "team": [
   { "volunteerId": "tanvir-a", "role": "Chapter Lead", "since": "Jun 2024" },
   { "volunteerId": "shakib-m", "role": "Operations Lead", "since": "Jan 2026" }
  ],
  "leadershipHistory": [],
  "goals": [
   { "label": "People supported", "metric": "people", "target": 300 },
   { "label": "Verified service hours", "metric": "hours", "target": 400 },
   { "label": "Missions run", "metric": "missions", "target": 8 }
  ],
  "standards": { "done": 6, "total": 6 },
  "story": "Port-city chapter focused on career readiness and digital certification cohorts."
 },
 {
  "id": "chp-sylhet", "name": "Goodness Sylhet", "type": "district", "parentId": null,
  "status": "active", "since": "Mar 2025", "city": "Sylhet", "division": "Sylhet",
  "coverage": ["Sylhet"],
  "team": [
   { "volunteerId": "mehedi-h", "role": "Chapter Lead", "since": "Mar 2025" },
   { "volunteerId": "farhana-a", "role": "People Lead", "since": "Feb 2026" }
  ],
  "leadershipHistory": [],
  "goals": [
   { "label": "People supported", "metric": "people", "target": 400 },
   { "label": "Missions run", "metric": "missions", "target": 10 },
   { "label": "Active partners", "metric": "partners", "target": 2 }
  ],
  "standards": { "done": 6, "total": 6 },
  "story": "Flood-response and community development — our fastest mobilising chapter."
 },
 {
  "id": "chp-rajshahi", "name": "Goodness Rajshahi", "type": "district", "parentId": null,
  "status": "active", "since": "Sep 2025", "city": "Rajshahi", "division": "Rajshahi",
  "coverage": ["Rajshahi", "Bogura", "Rangpur", "Dinajpur"],
  "team": [
   { "volunteerId": "sadia-i", "role": "Chapter Lead", "since": "Sep 2025" },
   { "volunteerId": "nadia-s", "role": "Operations Lead", "since": "Apr 2026" }
  ],
  "leadershipHistory": [],
  "goals": [
   { "label": "People supported", "metric": "people", "target": 300 },
   { "label": "Verified service hours", "metric": "hours", "target": 350 }
  ],
  "standards": { "done": 6, "total": 6 },
  "story": "Youth bootcamps and micro-grants across the north-west."
 },
 {
  "id": "chp-khulna", "name": "Goodness Khulna", "type": "district", "parentId": null,
  "status": "active", "since": "Jan 2026", "city": "Khulna", "division": "Khulna",
  "coverage": ["Khulna", "Jashore", "Barishal"],
  "team": [{ "volunteerId": "rakibul-h", "role": "Chapter Lead", "since": "Jan 2026" }],
  "leadershipHistory": [],
  "goals": [
   { "label": "People supported", "metric": "people", "target": 250 },
   { "label": "Missions run", "metric": "missions", "target": 6 }
  ],
  "standards": { "done": 4, "total": 6 },
  "story": "Community scorecards and ward-level development in the south-west."
 },
 {
  "id": "chp-cumilla", "name": "Goodness Cumilla", "type": "district", "parentId": null,
  "status": "forming", "since": "Aug 2026", "city": "Cumilla", "division": "Chattogram",
  "coverage": [],
  "team": [],
  "leadershipHistory": [],
  "goals": [],
  "standards": { "done": 2, "total": 6 },
  "story": "Community interest confirmed — leadership team being established with support from Goodness Chattogram."
 }
];
