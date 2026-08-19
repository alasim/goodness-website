# Goodness Society — Nonprofit Website Plan

## Context
Building a 5-page nonprofit website for **Goodness Society** (Society for Initiatives of Goodness) from a blank App.tsx. The user wants a site that feels distinctly connected to their brand — not generic — using **brand abstractions pulled directly from the logo shape language**. Key feedback: white backgrounds (not cream), minimal gradient use, bold + thin font pairing for editorial headings, and the transparency/accountability section as a hero feature.

---

## Logo Analysis & Brand Abstractions

The logo yields three reusable shape primitives that will appear as decorative elements throughout the site:

1. **The Rounded Square** — the icon container shape (heavily rounded rect, ~20% corner radius). Used as: rotated/oversized background shapes, image frames, card containers, section dividers.
2. **The "g" Swash Curve** — the circular bowl + descending tail of the letterform. Abstracted as a large SVG swoosh/arc used as a section background ornament and page divider.
3. **The Gradient Block** — the two-tone green gradient (light #4DC86A top-left → dark #1B7A34 bottom-right) used sparingly: one hero accent, primary CTA button, active nav indicator.

**Color tokens to set in theme.css:**
- `--gs-green-light: #4DC86A` (logo light green)
- `--gs-green-dark: #1B7A34` (logo dark green)
- `--gs-blue: #1565C0` (logo "Goodness" blue)
- `--gs-blue-mid: #1976D2`
- Background: `#ffffff`
- Text primary: `#0D0D0D`
- Text muted: `#6B7280`

**Typography (Google Fonts):**
- **Plus Jakarta Sans** — humanist sans, friendly and rounded, matches logo's warmth
- Weights: 300 (thin), 400, 600, 800 (extrabold)
- Heading pattern: "Together for a *Better* Tomorrow" — normal weight word + extrabold word alternating to create drama

---

## Pages & Routing

React Router v7 (already installed). Routes:
- `/` — Home
- `/about` — About
- `/programs` — Programs
- `/transparency` — Transparency
- `/partner` — Partner with Us (primary CTA)

---

## File Structure

```
src/app/
├── App.tsx                          (router root)
├── components/
│   ├── layout/
│   │   ├── Nav.tsx                  (sticky top nav)
│   │   └── Footer.tsx
│   ├── brand/
│   │   ├── RoundedSquare.tsx        (SVG shape primitive, rotatable/resizable)
│   │   ├── GSwash.tsx               (SVG "g" curve ornament)
│   │   └── GradientTag.tsx          (small gradient pill/label)
│   ├── sections/
│   │   ├── ImpactCounter.tsx        (animated numbers)
│   │   └── TransparencyDashboard.tsx (placeholder charts/metrics)
│   └── figma/ImageWithFallback.tsx  (existing)
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Programs.tsx
│   ├── Transparency.tsx
│   └── Partner.tsx
```

---

## Section-by-Section Plan

### Nav (Nav.tsx)
- Fixed top, white bg with subtle border-bottom
- Logo (gs-logo.png) left, links center/right
- "Partner with Us" button → green gradient, rounded-full
- Mobile: hamburger → sheet drawer (use shadcn Sheet)

### Home Page
1. **Hero** — Full-viewport. Left: large editorial headline ("Together for a *Better* Tomorrow" — thin + extrabold alternating), sub-copy, two CTAs. Right: A large rotated rounded-square shape (brand abstraction) in green gradient containing a placeholder image. Background: white with an oversized GSwash ornament in very light green (#f0faf3).
2. **Impact Bar** — 4 animated counters: `2,400+ Lives Touched`, `12 Active Programs`, `8 Partner Organizations`, `₦0 Wasted` (100% accountability). White bar with green accent numbers.
3. **Mission Strip** — Full-width green gradient section (one of the few gradient uses). White text. Short 2-sentence mission statement. Large rounded-square shape abstract on right edge.
4. **Focus Areas Preview** — 5 cards (grid), each with a rounded-square icon in green, program name, 1-line description. Cards are white with subtle shadow + green top border on hover.
5. **Transparency Feature** — "Our Promise: Radical Transparency." Large section, white bg. Left: big bold text + 5 donor promise bullets with green checkmarks. Right: placeholder "Impact Dashboard" card (donut chart from recharts, simple bar, key metric callouts).
6. **Partner CTA** — Full-width section. Oversized "G" letterform from the logo as background watermark. "Ready to create change?" + Partner button.

### About Page
- Who We Are (editorial layout, big quote pulled out)
- Vision & Mission (two-column, rounded-square decorative shape)
- What Makes Us Different (4 pillars in card grid)
- Team placeholder (avatar cards)

### Programs Page
- Hero section with page title
- 5 program cards — each full-bleed with description, goals, and a "Learn More" expand (Accordion or Dialog)

### Transparency Page ← Hero Feature
- "Our Open Books" header
- Placeholder financial snapshot: total raised (₦24,500,000), total spent (₦21,800,000), overhead ratio (11%), Recharts PieChart + BarChart
- Timeline of milestones (vertical timeline component)
- "Download Annual Report" CTA (placeholder PDF link)
- Donor promise grid (5 commitments with icons)

### Partner Page
- Hero: "Build the Future with Us"
- Partnership types (Corporate, Foundation, Academic, Tech, Individual) — tab or card layout
- Simple contact form (react-hook-form): Name, Organization, Type (Select), Message, Submit
- "What happens next" 3-step process strip

---

## Brand Abstraction Usage Map

| Element | Where Used |
|---|---|
| Rounded Square (rotated, large) | Hero background, section transitions, image frames |
| Rounded Square (small, colored) | Program icon containers, feature icon containers |
| G Swash SVG curve | Hero bg ornament, About page bg, Footer top |
| Green gradient | Mission strip, nav CTA button, primary buttons only |
| Green light (#4DC86A) | Accent text, checkmarks, active states |
| Blue (#1565C0) | Secondary links, "Goodness" accent on headings |

---

## Typography System

```css
/* Heading pattern — bold word + thin word alternating */
/* "Together for a Better Tomorrow"
   "Together for a" → font-weight: 300
   "Better Tomorrow" → font-weight: 800 */
```

Applied via two `<span>` children: `<span className="font-light">` + `<span className="font-extrabold text-gs-green-dark">`.

---

## Key Implementation Notes

- Import `gs-logo.png` using `import logo from "figma:asset/..."` — check actual hash from the imports folder
- Actually the logo is at `src/imports/gs-logo.png` — import as a relative path from components
- Use `motion` (already installed) for counter animations and scroll-triggered reveals
- Use `recharts` (already installed) for transparency charts
- Use shadcn `Sheet` for mobile nav, shadcn `Tabs` for partner page types
- No `tailwind.config.js` — use CSS variables in theme.css for brand tokens
- Gradient used in ≤3 places total per the user's feedback

---

## Verification

1. Navigate all 5 routes — no broken links
2. Mobile responsive — nav collapses, hero stacks, cards reflow to 1 column
3. Counters animate on scroll
4. Charts render with placeholder data
5. Partner form validates (required fields) before submit
6. Logo visible in nav and footer
7. Brand shape ornaments visible on Home hero and About page
