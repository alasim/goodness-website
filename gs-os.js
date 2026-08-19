// GOODNESS OS — shared client store (prototype layer; real backend later)
const KEY = "gs-os-store";
const LEVELS = ["Volunteer", "Senior Volunteer", "Team Lead", "Chapter Lead"];

export function readStore() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
}
export function writeStore(store) {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
}
export function patchVolunteer(id, patch) {
  const store = readStore();
  store.volunteers = store.volunteers || {};
  store.volunteers[id] = Object.assign({}, store.volunteers[id], patch);
  writeStore(store);
  return store;
}
export function logAudit(action, detail) {
  const store = readStore();
  store.audit = store.audit || [];
  store.audit.unshift({ t: Date.now(), action, detail: detail || "" });
  store.audit = store.audit.slice(0, 60);
  writeStore(store);
}
export function readAudit() {
  return readStore().audit || [];
}
export function submitApplication(app) {
  const store = readStore();
  store.applications = store.applications || [];
  store.applications.unshift(Object.assign({ id: "app-" + Date.now(), t: Date.now(), status: "pending" }, app));
  writeStore(store);
  logAudit("New volunteer application received from " + (app.name || "applicant"));
}
export function readApplications() {
  return readStore().applications || [];
}
export function decideApplication(id, status, note) {
  const store = readStore();
  const apps = store.applications || [];
  const app = apps.find((a) => a.id === id);
  if (!app) return;
  app.status = status;
  app.decidedAt = Date.now();
  if (note) app.note = note;
  if (status === "approved") {
    store.approved = store.approved || [];
    if (!store.approved.some((a) => a.appId === id)) {
      const i = store.approved.length;
      store.approved.push({
        appId: id,
        id: "new-" + id,
        name: app.name,
        role: app.role || "Volunteer",
        program: app.program,
        programSlug: app.programSlug || "education-career-readiness",
        city: app.city,
        joinedMonth: new Date().toLocaleString([], { month: "short", year: "numeric" }),
        quote: app.why ? app.why.slice(0, 140) : "Excited to start contributing with Goodness Society.",
        bio: app.experience || "Newly approved volunteer with Goodness Society.",
        skills: (app.skills || "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 4),
        impactStat: "New",
        impactLabel: "Just joined",
        initials: (app.name || "G S").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        avatarColor: ["green", "blue", "teal"][i % 3],
      });
    }
  }
  writeStore(store);
  logAudit((status === "approved" ? "Approved" : "Rejected") + " application — " + app.name);
}
export function findCredential(ref, volunteers) {
  const needle = String(ref || "").trim().toUpperCase();
  if (!needle) return null;
  for (const v of volunteers) {
    const c = (v.credentials || []).find((x) => x.ref.toUpperCase() === needle || x.ref.toUpperCase().replace("GS-VOL-", "") === needle);
    if (c) return { credential: c, volunteer: v };
  }
  return null;
}
export function claim(id) {
  const store = readStore();
  store.me = id;
  writeStore(store);
}
// ── Wave 04: Trust ledger ────────────────────────────────────────
export function patchExpense(id, patch) {
  const store = readStore();
  store.expensePatches = store.expensePatches || {};
  store.expensePatches[id] = Object.assign({}, store.expensePatches[id], patch);
  writeStore(store);
}
export function addDonation(d) {
  const store = readStore();
  store.donations = store.donations || [];
  const rec = Object.assign({ id: "don-" + Date.now(), date: new Date().toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }), acknowledged: false }, d);
  store.donations.unshift(rec);
  writeStore(store);
  logAudit("Donation recorded \u2014 \u09F3" + Number(rec.amount).toLocaleString() + " from " + rec.donor);
  return rec;
}
export async function loadFinance() {
  const data = await import("./finance-data.js");
  const store = readStore();
  const expPatches = store.expensePatches || {};
  const donations = (store.donations || []).concat(data.donations);
  const expenses = data.expenses.map((e) => Object.assign({}, e, expPatches[e.id] || {}));
  const received = donations.reduce((n, d) => n + Number(d.amount || 0), 0);
  const funds = data.funds.map((f) => {
    const own = expenses.filter((e) => e.fundId === f.id);
    const spent = own.filter((e) => e.status === "approved").reduce((n, e) => n + e.amount, 0);
    const pending = own.filter((e) => e.status === "pending").reduce((n, e) => n + e.amount, 0);
    const restricted = donations.filter((d) => d.restricted === f.programSlug).reduce((n, d) => n + Number(d.amount || 0), 0);
    const allocated = f.allocated != null ? f.allocated : f.budget;
    const docs = own.reduce((n, e) => n + (e.evidence || []).length, 0);
    const checked = own.reduce((n, e) => n + (e.evidence || []).filter((x) => x.checked).length, 0);
    return Object.assign({}, f, {
      expenses: own, spent, pending, restricted, allocated,
      remaining: Math.max(0, allocated - spent),
      fundingGap: Math.max(0, f.budget - allocated),
      restrictedRemaining: Math.max(0, restricted - spent),
      spentPct: allocated ? Math.min(100, Math.round((spent / allocated) * 100)) : 0,
      docs, checked,
      withDocs: own.filter((e) => (e.evidence || []).length > 0).length,
      missingDocs: own.filter((e) => !(e.evidence || []).length).length,
    });
  });
  const allocated = funds.reduce((n, f) => n + f.allocated, 0);
  const budgeted = funds.reduce((n, f) => n + f.budget, 0);
  const spent = funds.reduce((n, f) => n + f.spent, 0);
  const pending = funds.reduce((n, f) => n + f.pending, 0);
  const programSpend = funds.filter((f) => f.programSlug !== "operations").reduce((n, f) => n + f.spent, 0);
  return {
    donations, expenses, funds,
    received, allocated, budgeted, spent, pending,
    unallocated: Math.max(0, received - allocated),
    fundingGap: Math.max(0, budgeted - allocated),
    programSharePct: spent ? Math.round((programSpend / spent) * 100) : 0,
    overheadPct: spent ? Math.round(((spent - programSpend) / spent) * 100) : 0,
    documentedPct: spent ? Math.round((expenses.filter((e) => e.status === "approved" && (e.evidence || []).length).reduce((n, e) => n + e.amount, 0) / spent) * 100) : 0,
    checkedPct: spent ? Math.round((expenses.filter((e) => e.status === "approved" && (e.evidence || []).length && (e.evidence || []).every((x) => x.checked)).reduce((n, e) => n + e.amount, 0) / spent) * 100) : 0,
  };
}

export function readMe() { return readStore().me || null; }

// ── Wave 06.x: Goodness Commitment ───────────────────────────────
export function getCommitment(volunteerId) {
  return (readStore().commitments || {})[volunteerId] || null;
}
export function saveCommitment(volunteerId, c) {
  const store = readStore();
  store.commitments = store.commitments || {};
  store.commitments[volunteerId] = Object.assign({}, store.commitments[volunteerId], c);
  writeStore(store);
}
export function allCommitments() { return readStore().commitments || {}; }
export function rhythmPer30(rhythm) {
  return rhythm === "Daily" ? 30 : rhythm === "Weekly" ? 4.3 : rhythm === "Bi-weekly" ? 2.15 : 1;
}
export function contribute(volunteerId, name) {
  const store = readStore();
  const c = (store.commitments || {})[volunteerId];
  if (!c || c.status !== "active") return;
  c.contributions = c.contributions || [];
  c.contributions.push({ a: c.amount, t: Date.now() });
  writeStore(store);
  addDonation({ donor: name, type: "Member commitment", amount: c.amount,
    method: "Goodness Commitment \u00B7 " + c.rhythm, restricted: c.destSlug || null,
    receipt: "GS-RCP-" + new Date().getFullYear() + "-C" + String(c.contributions.length).padStart(3, "0") });
}

// ── Wave 06: Network ─────────────────────────────────────────────────
export function submitProposal(p) {
  const store = readStore();
  store.chapterProposals = store.chapterProposals || [];
  store.chapterProposals.unshift(Object.assign({ id: "prop-" + Date.now(), t: Date.now(), stage: "pending" }, p));
  writeStore(store);
  logAudit("Chapter proposal \u2014 " + p.chapterName + ": " + p.title + " (awaiting HQ approval)");
}
export function readProposals() { return readStore().chapterProposals || []; }
export function decideProposal(id, stage, note) {
  const store = readStore();
  const p = (store.chapterProposals || []).find((x) => x.id === id);
  if (!p) return;
  p.stage = stage;
  if (note) p.note = note;
  writeStore(store);
  logAudit((stage === "approved" ? "Approved" : "Returned") + " chapter proposal \u2014 " + p.chapterName + ": " + p.title);
}
export function submitChapterRequest(q) {
  const store = readStore();
  store.chapterRequests = store.chapterRequests || [];
  store.chapterRequests.unshift(Object.assign({ id: "chreq-" + Date.now(), t: Date.now(), stage: "proposed" }, q));
  writeStore(store);
  logAudit("Chapter request \u2014 " + q.city + " (proposed)");
}
export function readChapterRequests() { return readStore().chapterRequests || []; }
export function decideChapterRequest(id, approve) {
  const store = readStore();
  const q = (store.chapterRequests || []).find((x) => x.id === id);
  if (!q) return;
  q.stage = approve ? "forming" : "returned";
  if (approve) {
    store.newChapters = store.newChapters || [];
    store.newChapters.push({
      id: "chp-" + Date.now(), name: "Goodness " + q.city, type: "district", parentId: null,
      status: "forming", since: new Date().toLocaleString([], { month: "short", year: "numeric" }),
      city: q.city, division: q.city, coverage: [], team: [], leadershipHistory: [], goals: [],
      standards: { done: 0, total: 6 },
      story: "Community interest confirmed \u2014 " + (q.why ? q.why.slice(0, 120) : "leadership team being established") + "."
    });
  }
  writeStore(store);
  logAudit((approve ? "Approved chapter formation \u2014 Goodness " : "Returned chapter request \u2014 ") + q.city);
}
export function claimChapterLead(id) {
  const store = readStore();
  store.chapterLead = id;
  writeStore(store);
}
export function readChapterLead() { return readStore().chapterLead || null; }
export function patchChapter(id, patch) {
  const store = readStore();
  store.chapterPatches = store.chapterPatches || {};
  store.chapterPatches[id] = Object.assign({}, store.chapterPatches[id], patch);
  writeStore(store);
}
export function setMyChapter(volunteerId, chapterId) {
  const store = readStore();
  store.memberChapter = store.memberChapter || {};
  store.memberChapter[volunteerId] = chapterId;
  writeStore(store);
}
export async function loadNetwork(pre) {
  const data = await import("./chapters-data.js");
  const store = readStore();
  const patches = store.chapterPatches || {};
  const memberOverride = store.memberChapter || {};
  const [os, missions, impact, fin, pc] = pre || await Promise.all([loadOS(), loadMissions(), loadImpact(), loadFinance(), loadPartners()]);
  const all = data.chapters.concat(store.newChapters || []).map((c) => Object.assign({}, c, patches[c.id] || {}));
  const cityToChapter = {};
  all.forEach((c) => { if (c.status === "active") (c.coverage || []).forEach((city) => { cityToChapter[city] = c.id; }); });
  const chapterOfVolunteer = (v) => memberOverride[v.id] || cityToChapter[v.city] || null;
  const chapters = all.map((c) => {
    const members = os.volunteers.filter((v) => v.status !== "suspended" && chapterOfVolunteer(v) === c.id);
    const teamResolved = (c.team || []).map((t) => {
      const v = os.volunteers.find((x) => x.id === t.volunteerId);
      return Object.assign({}, t, { volunteer: v || null });
    }).filter((t) => t.volunteer);
    const geoMatch = c.type === "university"
      ? () => false
      : (place) => place === c.city || (c.coverage || []).includes(place);
    const chMissions = missions.filter((m) => !m.remote && geoMatch(m.chapter));
    const chImpact = impact.filter((r) => r.published && geoMatch(r.chapter));
    const people = chImpact.reduce((n, r) => n + (r.beneficiaries || 0), 0);
    const hours = members.reduce((n, v) => n + (v.hours || 0), 0);
    const partners = c.partnerIds
      ? pc.partners.filter((p) => c.partnerIds.includes(p.id))
      : pc.partners.filter((p) => p.stage !== "proposal" && (p.districts || []).some(geoMatch));
    const deployed = fin.expenses.filter((e) => {
      if (e.status !== "approved") return false;
      const rec = impact.find((r) => r.id === e.impactId);
      const msn = missions.find((m) => m.id === e.missionId);
      return (rec && geoMatch(rec.chapter)) || (msn && geoMatch(msn.chapter));
    }).reduce((n, e) => n + e.amount, 0);
    const metricVal = { people, hours, missions: chMissions.length, partners: partners.length };
    return Object.assign({}, c, {
      members, memberCount: members.length,
      team: teamResolved,
      missions: chMissions,
      missionsLive: chMissions.filter((m) => m.state === "open").length,
      impact: chImpact, people, hours,
      partners, deployed,
      goals: (c.goals || []).map((g) => Object.assign({}, g, {
        current: metricVal[g.metric] || 0,
        pct: g.target ? Math.min(100, Math.round(((metricVal[g.metric] || 0) / g.target) * 100)) : 0,
      })),
    });
  });
  return { chapters, chapterOfVolunteer,
    active: chapters.filter((c) => c.status === "active"),
    forming: chapters.filter((c) => c.status === "forming") };
}

// ── Wave 05: Partners & capital ─────────────────────────────
export function claimPartner(id) {
  const store = readStore();
  store.partner = id;
  writeStore(store);
}
export function readPartner() { return readStore().partner || null; }
export function submitPartnerEnquiry(q) {
  const store = readStore();
  store.partnerEnquiries = store.partnerEnquiries || [];
  store.partnerEnquiries.unshift(Object.assign({ id: "enq-" + Date.now(), t: Date.now(), stage: "new" }, q));
  writeStore(store);
  logAudit("New partnership enquiry \u2014 " + (q.company || "organisation") + (q.opportunity ? " \u00B7 " + q.opportunity : ""));
}
export function readPartnerEnquiries() { return readStore().partnerEnquiries || []; }
export function commitEnquiry(id, committed, kind) {
  const store = readStore();
  const q = (store.partnerEnquiries || []).find((x) => x.id === id);
  if (!q) return;
  q.stage = "committed";
  store.newPartners = store.newPartners || [];
  const yr = new Date().getFullYear();
  store.newPartners.push({
    id: "ptr-" + Date.now(),
    name: q.company,
    kind: kind === "Cash" ? "Corporate sponsorship" : kind + " partnership",
    tier: "Impact Partner",
    since: new Date().toLocaleString([], { month: "short", year: "numeric" }),
    stage: "active",
    renewal: new Date().toLocaleString([], { month: "short" }) + " " + (yr + 1),
    programs: [q.cause || "education-career-readiness"],
    committed: committed || 0,
    received: 0,
    contact: q.contact || "",
    discloseFunding: true,
    inKind: [],
    employees: { participated: 0, hours: 0, sessions: 0 },
    goal: { label: q.opportunity || "First partnership year", target: 0 },
    story: q.message || "",
    timeline: [{ date: new Date().toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }), type: "start", text: "Commitment confirmed" + (committed ? " \u2014 \u09F3" + committed.toLocaleString() : "") + " \u00B7 " + kind.toLowerCase() }],
  });
  writeStore(store);
  logAudit("Partnership committed \u2014 " + q.company + (committed ? " \u00B7 \u09F3" + committed.toLocaleString() : "") + " " + kind.toLowerCase());
}
export function patchEnquiry(id, patch) {
  const store = readStore();
  const q = (store.partnerEnquiries || []).find((x) => x.id === id);
  if (q) Object.assign(q, patch);
  writeStore(store);
}
export function patchPartner(id, patch) {
  const store = readStore();
  store.partnerPatches = store.partnerPatches || {};
  store.partnerPatches[id] = Object.assign({}, store.partnerPatches[id], patch);
  writeStore(store);
}
export async function loadPartners() {
  const data = await import("./partners-data.js");
  const store = readStore();
  const patches = store.partnerPatches || {};
  return {
    partners: data.partners.concat(store.newPartners || []).map((p) => Object.assign({}, p, patches[p.id] || {})),
    opportunities: data.opportunities.map((o) => Object.assign({}, o, {
      pct: o.target ? Math.min(100, Math.round((o.secured / o.target) * 100)) : 0,
      gap: Math.max(0, o.target - o.secured),
    })),
  };
}

// ── Wave 02: Mission engine ──────────────────────────────────────────────
export function createMission(m) {
  const store = readStore();
  store.missions = store.missions || [];
  const mission = Object.assign({ id: "msn-" + Date.now(), createdAt: Date.now(), status: "open", seedFilled: 0, roles: [] }, m);
  store.missions.unshift(mission);
  writeStore(store);
  logAudit("Created mission \u201C" + mission.title + "\u201D (" + mission.chapter + ")");
  return mission;
}
export function patchMission(id, patch) {
  const store = readStore();
  store.missionPatches = store.missionPatches || {};
  store.missionPatches[id] = Object.assign({}, store.missionPatches[id], patch);
  writeStore(store);
}
export function joinMission(missionId, volunteerId, role) {
  const store = readStore();
  store.assignments = store.assignments || [];
  const existing = store.assignments.find((a) => a.missionId === missionId && a.volunteerId === volunteerId);
  if (existing) { existing.role = role; writeStore(store); return; }
  store.assignments.push({ id: "asg-" + Date.now(), missionId, volunteerId, role, state: "joined", t: Date.now() });
  writeStore(store);
}
export function leaveMission(missionId, volunteerId) {
  const store = readStore();
  store.assignments = (store.assignments || []).filter((a) => !(a.missionId === missionId && a.volunteerId === volunteerId));
  writeStore(store);
}
export function setAssignmentState(missionId, volunteerId, state, hours) {
  const store = readStore();
  const a = (store.assignments || []).find((x) => x.missionId === missionId && x.volunteerId === volunteerId);
  if (!a) return;
  a.state = state;
  if (typeof hours === "number") a.hours = hours;
  a[state + "At"] = Date.now();
  writeStore(store);
}
export function readAssignments() { return readStore().assignments || []; }

// ── Wave 03: Impact ─────────────────────────────────────────────────────
export function saveImpact(rec) {
  const store = readStore();
  store.impact = store.impact || [];
  const i = store.impact.findIndex((r) => r.id === rec.id);
  if (i >= 0) store.impact[i] = rec; else store.impact.unshift(rec);
  writeStore(store);
}
export function patchImpact(id, patch) {
  const store = readStore();
  store.impactPatches = store.impactPatches || {};
  store.impactPatches[id] = Object.assign({}, store.impactPatches[id], patch);
  writeStore(store);
}
export async function loadImpact() {
  const data = await import("./impact-data.js");
  const store = readStore();
  const patches = store.impactPatches || {};
  const all = (store.impact || []).concat(data.impactRecords);
  return all.map((r) => {
    const merged = Object.assign({ published: false }, r, patches[r.id] || {});
    const outputs = merged.outputs || [];
    const outcomes = merged.outcomes || [];
    const evidence = merged.evidence || [];
    const evVerified = evidence.filter((e) => e.verified).length;
    const hit = outputs.filter((o) => o.target && o.value >= o.target).length;
    const evPct = evidence.length ? Math.round((evVerified / evidence.length) * 100) : 0;
    const verification = !evidence.length ? "pending" : evVerified === evidence.length ? "verified" : evVerified > 0 ? "partial" : "pending";
    return Object.assign(merged, {
      outputs, outcomes, evidence,
      evidenceVerified: evVerified,
      evidenceTotal: evidence.length,
      evidencePct: evPct,
      verification,
      pendingOutcomes: outcomes.filter((o) => o.basis === "pending").length,
      targetsHit: hit,
      targetsTotal: outputs.filter((o) => o.target).length,
    });
  });
}

export async function loadMissions() {
  const data = await import("./missions-data.js");
  const store = readStore();
  const patches = store.missionPatches || {};
  const all = (store.missions || []).concat(data.missions);
  const assignments = store.assignments || [];
  return all.map((m) => {
    const merged = Object.assign({ priority: "normal", participation: "onsite" }, m, patches[m.id] || {});
    const mine = assignments.filter((a) => a.missionId === m.id);
    const need = (merged.roles || []).reduce((n, r) => n + r.need, 0);
    const filled = (merged.seedFilled || 0) + mine.length;
    const spotsLeft = Math.max(0, need - filled);
    const state = merged.status === "completed" ? "completed" : spotsLeft === 0 ? "full" : "open";
    return Object.assign(merged, {
      need, filled, spotsLeft,
      state,
      urgent: merged.priority === "urgent" && state === "open",
      remote: merged.participation === "remote",
      pct: need ? Math.min(100, Math.round((filled / need) * 100)) : 0,
      assignments: mine,
    });
  });
}

function pad(n, w) { return String(n).padStart(w, "0"); }

function seedPassport(v, i) {
  const num = parseInt(String(v.impactStat).replace(/[^0-9]/g, ""), 10);
  const people = !isNaN(num) && num >= 30 ? num : 40 + ((i * 37) % 160);
  const missions = Math.min(44, 6 + Math.round(people / 12) + (i % 4));
  const hours = missions * (4 + (i % 3));
  const programsCount = 1 + (i % 3) + (v.featured ? 1 : 0);
  const level = v.featured ? 2 : (i % 5 === 4 ? 2 : i % 3 === 1 ? 1 : 0);
  const certRef = "GS-VOL-2024-" + pad(100 + i * 3, 4);
  const credentials = [
    { ref: certRef, title: "Certificate of Volunteer Service", issued: v.joinedMonth, status: "valid" },
  ];
  if (v.programSlug === "ai-digital-skills") credentials.push({ ref: "GS-CRD-2024-" + pad(400 + i, 4), title: "AI Literacy Trainer", issued: "Sep 2024", status: "valid" });
  if (level >= 2) credentials.push({ ref: "GS-CRD-2024-" + pad(700 + i, 4), title: "Volunteer Leadership", issued: "Nov 2024", status: "valid" });
  return {
    goodnessId: "GS-" + pad(1000 + i * 17, 4),
    missions, hours, people, programsCount,
    levelIndex: level,
    level: LEVELS[level],
    certEnabled: i % 3 !== 2,
    certRef,
    credentials,
    status: "active",
    chapter: v.city + " Chapter",
  };
}

export async function loadOS() {
  const data = await import("./volunteers-data.js");
  const store = readStore();
  const overrides = store.volunteers || {};
  const seedList = data.volunteers.concat(store.approved || []);
  const validIds = new Set(seedList.map((v) => v.id));
  const stale = Object.keys(overrides).filter((k) => !validIds.has(k));
  if (stale.length) {
    stale.forEach((k) => { delete overrides[k]; });
    store.volunteers = overrides;
    writeStore(store);
  }
  const volunteers = seedList.map((v, i) => {
    const base = Object.assign({}, v, seedPassport(v, i));
    if (v.impactStat === "New") {
      Object.assign(base, { missions: 0, hours: 0, people: 0, programsCount: 1, levelIndex: 0, level: LEVELS[0], certEnabled: false, credentials: [], isNew: true });
    }
    const o = overrides[v.id] || {};
    const merged = Object.assign(base, o);
    if (typeof o.levelIndex === "number") merged.level = LEVELS[o.levelIndex];
    const verified = (store.assignments || []).filter((a) => a.volunteerId === v.id && a.state === "verified");
    if (verified.length) {
      merged.missions = (merged.missions || 0) + verified.length;
      merged.hours = (merged.hours || 0) + verified.reduce((n, a) => n + (a.hours || 0), 0);
      merged.newlyVerified = verified.length;
    }
    return merged;
  });
  return {
    volunteers,
    levels: LEVELS,
    programColors: data.programColors,
    avatarGradients: data.avatarGradients,
    programFilters: data.programFilters,
    store,
  };
}
