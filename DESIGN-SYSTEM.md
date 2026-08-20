# GOODNESS OS — design system

Extracted from the confirmed design source (`Home.dc.html`, `SiteNav.dc.html`, `SiteFooter.dc.html`
and the rest of the `.dc.html` set). **The prototype is the authority.** When a screen in `app/`
disagrees with the `.dc.html` file, the `.dc.html` file is right.

## 1. The signature: split-weight headings
Every heading in the product is one line made of two weights — a light 300 clause followed by an
extrabold 800 clause. This is the single most recognisable thing about the brand, and it is not
optional:

| Heading | Light 300 | Bold 800 |
|---------|-----------|----------|
| Hero | *organized.* (also italic) | **Goodness,** |
| Section | See how | **Goodness works** |
| Section | We don't stop at what we delivered. | **We measure what changed.** |
| CTA | There is a place for you | **in Goodness.** |

Hero reverses the order (bold first, light italic second). Everywhere else: light clause, then bold.

## 2. Type scale
| Role | Size | Weight | Colour | Notes |
|------|------|--------|--------|-------|
| Hero h1 | `clamp(40px, 5.2vw, 64px)` | 800 + 300 italic | ink | line-height 1.02, tracking −0.02em |
| Section h2 | `clamp(26px, 3.4vw, 38px)` | 800 + 300 | ink / white | tracking −0.01em |
| Minor h2 | `clamp(24px, 3vw, 34px)` | 800 + 300 | ink | programmes, people |
| CTA h2 | `clamp(30px, 4.2vw, 48px)` | 800 + 300 | white | tracking −0.015em |
| Hero eyebrow | 11px | 800 | `#1B7A34` | uppercase, tracking 0.3em |
| Band label | 10px | 800 | `#9CA3AF` | uppercase, tracking 0.24em |
| Card kicker | 10px | 800 | `#1B7A34` (or `#4DC86A` on ink) | uppercase, tracking 0.18em |
| Hero lede | 17px | 400 | `#4B5563` | line-height 1.7, max-width 480px |
| Section sub | 14.5px | 400 | `#6B7280` | |
| Card title | 17–18px | 800 | ink | |
| Card body | 12.5px | 400 | `#6B7280` | line-height 1.6 |
| Stat value | 20–24px | 800 | ink or green | tracking −0.01em |
| Stat label | 10.5–11.5px | 400 | `#9CA3AF` | |
| Link | 13.5px | 700–800 | green | always ends in `→` |

Italics are used deliberately and sparingly: the hero's *organized.*, the growth cards' closing
sentence, and the CTA's *Together for a Better Tomorrow.*

## 3. Colour
```
ink        #0D0D0D     green      #1B7A34     green light  #4DC86A
gradient   linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)
body       #4B5563     muted      #6B7280     faint        #9CA3AF
band       #fafafa     wash       #f8fdf9     pill wash    #f0faf3
blue       #1565C0     blue soft  #90CAF9 (on ink)
orange     #E65100     orange soft #FFB74D (on ink)
purple     #6B21A8     purple soft #CBB2FF (on ink)
hairline   rgba(0,0,0,0.08)        band edge rgba(0,0,0,0.06)
on ink:    surface rgba(255,255,255,0.05), border rgba(255,255,255,0.08),
           text .55 / .5 / .45 / .4 by importance
```
Accent colours carry meaning: blue = money/partner, orange = attention/outcome, purple = network,
green = verified/people.

## 4. Layout
- Container `max-width: 1280px`, side padding `24px`.
- Section rhythm `padding: 72px 24px`. Hero `72px 24px 56px`. CTA band `80px 24px`.
- Full-bleed bands: `#fafafa` with 1px `rgba(0,0,0,0.06)` top **and** bottom borders; `#0D0D0D`
  for the live feed and impact sections; gradient for the closing CTA.
- Grids: hero `1.05fr 0.95fr` gap 48 · roles `4×` gap 16 · feed `2×` gap 12 · chapters `4×` gap 14
  · chain `7×` gap 0 with `→` between · growth `3×` gap 16 · programmes `5×` gap 12 · people `3×`
  gap 14 · trust and partners `1fr 1fr` gap 48.

## 5. Surfaces
| Surface | Radius | Border | Padding | Hover |
|---------|--------|--------|---------|-------|
| Hero live panel (ink) | 26px | — | 26px 28px | shadow `0 30px 60px rgba(13,13,13,0.18)` |
| Role / growth card | 18px | `rgba(0,0,0,0.08)` | 24–26px | border `#1B7A34`, shadow `0 12px 30px rgba(27,122,52,0.1)` |
| Impact / partner card | 20px | `rgba(0,0,0,0.08)` | 26–28px | as above |
| Chapter / person card | 16px | `rgba(0,0,0,0.08)` | 18–20px | as above |
| Feed row, chain step, money step | 14px | hairline (or white 0.07 on ink) | 14–18px | lighten |
| Chip / pill / button | 999px | — | — | — |
| Avatar, logo mark | **28%** (squircle) | — | — | the rounded-square motif |

## 6. Buttons
- **Primary**: gradient, white, `15px 30px`, 14.5px/800, radius 999. Secondary sizes `13px 26px`.
- **Ghost**: transparent, `1.5px solid rgba(0,0,0,0.16)`, hover border+text green.
- **On gradient**: white fill with green text, or `1.5px solid rgba(255,255,255,0.55)`.
- **Inline link**: 13.5px/700–800 green, always ending `→`.

## 7. Home page section order (13)
1. Hero — split-weight h1 + lede + two buttons + "See Goodness live →", beside the ink **Goodness
   live** panel (mission needing people, newest published impact, top chapter, funding opportunity).
2. `Goodness right now` — six-metric strip on `#fafafa`, each metric a link ending `→`.
3. `How will you create Goodness?` — four role cards; the fourth (Partner) is ink.
4. `Goodness is happening now.` — ink band, six live feed rows with coloured source chips.
5. `Goodness across Bangladesh` — seven chapter cards + a dashed "propose a chapter" card.
6. `See how Goodness works` — seven-step traceability chain on `#fafafa`, arrows between steps.
7. `Your Goodness grows with you.` — three cards: Passport, Commitment, Partner Room.
8. `We measure what changed.` — ink band with a white impact card (Delivered vs What changed).
9. `Follow the money.` — three trust stats + a five-step numbered ledger flow with `↓` between.
10. `More than a logo placement.` — partner pitch + BrightWorks card on `#fafafa`.
11. `Five areas of sustainable impact` — five programme cards.
12. `The people behind the system` — three volunteer cards with squircle avatars.
13. Gradient CTA band — four pill actions.

Then the ink footer: logo in a white rounded tile, mission statement, contact, three link columns
(Act / Explore / Trust), a faint green G watermark bleeding off the top-right, and a bottom rule
with the registration line and the Mission Control / Chapter Control links.

## 8. Voice
Sentence case, no exclamation marks, no emoji. Numbers always carry their qualifier
("people supported", "spending documented"). Money is short-form (`৳67.9L`). Every claim links to
the record behind it.
