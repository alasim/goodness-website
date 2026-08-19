# Handoff: GOODNESS OS — Full Platform

## What to ask Claude Code

Paste this prompt into Claude Code from the repo root (the `CLAUDE-CODE-PROMPT.md` file in this bundle contains the same text):

> Build the GOODNESS OS platform from the design references in `design_reference/`. These are HTML prototypes (Design Components) showing the complete, approved UX for a non-profit operating system — recreate them faithfully as a production web app, do not ship the HTML directly. Read `design_reference/GOODNESS-OS.md` first: it is the product bible (vision, 7 waves, every feature's intent and status). Then read `design_reference/gs-os.js` — it is the entire prototype domain model and business-logic layer (stores, merge rules, derived rollups); port it to a real backend as your data model and API contract. Recommended stack: Next.js + TypeScript + Tailwind + Postgres (Prisma) + Auth.js, but if the repo already has conventions, follow them. Work wave by wave in this order — Identity, Missions, Impact, Trust/Finance, Partners, Network, Intelligence — and keep every guardrail in the Design principles section of the README below, especially: one source of truth (all stats computed, never stored twice), evidence before claims, secured ≠ received, shared attribution (never per-donor causality), audit log on every admin action, no gamified shame (no streaks, no donor tiers), and country-agnostic data (Bangladesh is seed data, not schema).

## Overview

GOODNESS OS is the operating system for the Goodness Society (Bangladesh non-profit, expanding internationally): a public trust-building site plus internal command centres covering the full loop — people join → missions run → hours verified → impact recorded with evidence → money traced end-to-end → partners funded and reported → chapters scale it → intelligence reads it.

## About the Design Files

Files in `design_reference/` are **design references created in HTML** ("Design Components": a template + a `class Component` logic block in one `.dc.html` file, sharing state through `localStorage` via `gs-os.js`). They are prototypes showing intended look and behavior, **not production code to copy directly**. The task is to recreate these designs in a real codebase environment using its established patterns — or choose an appropriate framework (recommendation above) if starting fresh. `support.js` and `doc-page.js` are prototype runtime plumbing — ignore them; recreate the pages natively.

## Fidelity

**High-fidelity.** Colors, type, spacing, copywriting, empty states, and interaction flows are final and approved. Recreate pixel-perfectly; all copy is deliberate (attribution language, no-guilt pause copy, verification wording) — keep it verbatim.

## Design Tokens

- Font: **Plus Jakarta Sans** (300/400/500/600/700/800; italic for quotes)
- Green gradient (primary actions, brand): `linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)`; green text `#1B7A34`, light green bg `#f0faf3` / `#f8fdf9`
- Blue (institutional/partner): `#1565C0`, light `#e8f0fc`; Intelligence beta chip `#90CAF9` on `rgba(21,101,192,.35)`
- Ink `#0D0D0D` (dark surfaces, footer, admin sidebar); page bg `#fafafa` (public) / `#f4f5f7` (admin); card `#ffffff`, border `rgba(0,0,0,0.07)`
- Warnings/pending `#E65100` on `#fff3e0`; danger/revoked `#d4183d` on `#fdecec`; forming/enquiry purple `#6B21A8` on `#f5f0ff`
- Muted text `#6B7280` / `#9CA3AF`; radius: cards 14–20px, pills 999px, avatars `border-radius: 28–30%` (rounded-square brand motif with initial letters — no photos)
- Currency: Bangladeshi taka `৳`, lakh notation (`৳11.2L` = 1,120,000)
- No emoji, no neon/sci-fi, no photos of people (initials avatars with per-person gradients)

## Screens / Views

**Public site** (shared `SiteNav` — max 7 primary links + "More ▾"; `SiteFooter` with admin links):
- `Home` — hero, programs, stats, flywheel
- `About`, `Programs`, `Impact`, `Transparency` — story, program cards, published impact records, finance transparency
- `Volunteers` — directory (live stats bar, cards from merged store) → `Volunteer Profile` — the **Goodness Passport**: hero (chapter + role, Sustaining Member chip), verified hours, journey levels, credentials with verify refs, certificate download (admin-gated)
- `Volunteer` — application form → Mission Control approval
- `Missions` board → `Mission Detail` — roles/spots, join flow, attendance → verification
- `Verify` — enter credential ref → Verified/Revoked card (QR target)
- `Trust Ledger` — money in/out, receipts, evidence, documented %; `Money Receipt` printable
- `Fund Impact` — backable initiatives ("secured of target, still seeking"); `Partner` (Partner with Us) → Partnership Builder → enquiry
- `Partner Profile` (public, dignity-safe finance disclosure) and `Partner Room` (private: commitments both sides, spending shared-attribution, reports)
- `Chapters` — network directory + activity feed + Start-a-Chapter application → `Chapter` mini-home (stats, needed-now, team, goals, join)
- `My Goodness` — member home: sign-in-lite, passport summary, my missions, My Chapter (join/switch), **Goodness Commitment** (amount ৳10–500/custom; rhythm Daily/Weekly/Bi-weekly/Monthly/Custom; destination unrestricted default/chapter/program; pause/resume/change without losing history; opt-in Sustaining Member passport badge — never shows amount publicly), My Giving
- `Volunteer Certificate`, `Printables`, `Social Cards`, `Member Registration Form` — print/share collateral

**Admin:**
- `Mission Control` — sidebar domains: Overview (**Decision Inbox**: one queue of everything pending across the OS with jump-to-tab; pulse tiles; city ops; audit log), Volunteers (table + control panel: cert toggle, level, credentials revoke/reissue, suspend), Applications, Missions, Attendance verification, Impact records, Money & approvals (expenses + evidence, **Goodness Commitments strip** with next-30-days rhythm-normalised outlook), Partners (pipeline New→Proposal→Active→Renewal, capture-commitment modal), Network (chapter health rows with reason strings, proposal + chapter-request approval queues), **Goodness Intelligence** (Beta; UI-only: Ask Goodness bar, 6 signal cards Risk/Opportunity/Forecast, forecast bars, recommended moves, auto-report stubs — wire a real engine later)
- `Chapter Control` — chapter-lead command centre: sign in as lead, publish low-risk local missions directly ("within your authority"), propose funding/budget/impact to HQ ("needs HQ approval"), verify chapter attendance, standards checklist 0–6, team roster, HQ announcements

## Interactions & Behavior (canonical rules)

- **One source of truth**: every stat (directory counts, chapter rollups, partner numbers, forecasts) is computed from base records at read time. Never store a number twice.
- **Approval flows**: application → pending → approve creates passport + directory entry; expense → pending → accepted into ledger; chapter proposal → pending → approved/returned; chapter request → proposed → forming; partner enquiry → new → proposal → committed (capture amount + cash/in-kind/mixed) → active → renewal (continuation, never reset).
- **Verification chain**: mission attendance → lead verifies → hours post to passport → credentials issued → publicly verifiable by ref; revoke flips the public chip to Revoked.
- **Attribution discipline**: partner/member money joins pooled program funding; results are always "shared across funders"; never "your ৳X changed N lives". Secured (signed) ≠ received (cash) — labelled everywhere.
- **No-guilt giving**: pausing a commitment keeps all history and recognition; missed contributions never shame ("17 of 18 planned", no streaks).
- **Audit log**: every admin/lead action appends `{time, action}`; surfaced in Overview.
- **Empty states are honest**: "No published impact records yet — nothing is invented before it's measured."
- Singular/plural is always conditional ("1 mission live", "1 member is sustaining").

## State Management (port `gs-os.js`)

`gs-os.js` holds: seed loaders (`loadOS/loadMissions/loadImpact/loadFinance/loadPartners/loadNetwork`) that merge static seed data (`*-data.js`) with a mutable overlay store (prototype: `localStorage` key `gs-os-store`); mutations (`patchVolunteer`, `createMission`, `setAssignmentState`, `addDonation`, `patchExpense`, partner enquiry/stage fns, `submitProposal/decideProposal`, `submitChapterRequest/decideChapterRequest`, `getCommitment/saveCommitment/contribute/rhythmPer30`, `logAudit`); and derived logic (chapter-of-volunteer coverage mapping, rollups). In production: seed data → database rows; overlay merge disappears; derived rollups → queries/views; `readMe`/`claimChapterLead` sign-in-lite → real auth with roles (public / member / chapter lead / HQ admin).

## Assets

No binary assets required — everything is CSS/SVG-free brand drawing (gradients, initials avatars, G-swash wordmark in text). Google Fonts: Plus Jakarta Sans.

## Files

All in `design_reference/`: 29 page `.dc.html` files, `gs-os.js` (domain layer), seed data (`volunteers-data.js`, `missions-data.js`, `impact-data.js`, `finance-data.js`, `partners-data.js`, `chapters-data.js`), `GOODNESS-OS.md` (product bible — read first).
