import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Design contract for the home page.
 *
 * `Home.dc.html` at the repository root is the design source of truth. This test reads it and
 * asserts the React build still renders every section and every split-weight heading it defines,
 * so the page cannot quietly drift away from the design again.
 */

/** Straight and curly apostrophes are the same word to a reader. */
function normalise(text: string): string {
  return text
    .replace(/[’‘]/g, "'")
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

const root = resolve(__dirname, '../../..')
const design = readFileSync(resolve(root, 'Home.dc.html'), 'utf8')
const source = readFileSync(resolve(__dirname, 'index.tsx'), 'utf8')

/** Comments must not satisfy the contract — only what the page actually renders counts. */
const built = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')

const designSections = [
  ...design.matchAll(/data-screen-label="(\d+ [^"]+)"/g),
].map((m) => m[1]!)

/** Heading clauses in the design: a light 300 span followed by an extrabold span. */
const designHeadings = [
  ...design.matchAll(
    /font-weight: 300;?[^"]*">([^<]+)<\/span>\s*<span[^>]*>([^<]+)<\/span>/g,
  ),
].map((m) => ({ light: normalise(m[1]!), bold: normalise(m[2]!) }))

/** The (light, bold) pairs the page really renders, read off its Display calls. */
const builtHeadings = [...built.matchAll(/<Display\b[^>]*?\/>/gs)].map(
  (match) => {
    const tag = match[0]
    const attr = (name: string) => {
      const value = new RegExp(`${name}="([^"]+)"`).exec(tag)?.[1]
      return value ? normalise(value) : ''
    }
    return { light: attr('light'), bold: attr('bold') }
  },
)

describe('home page follows Home.dc.html', () => {
  it('reads the design source', () => {
    expect(designSections.length).toBe(13)
    expect(designHeadings.length).toBe(11)
  })

  it('keeps a section for every section in the design', () => {
    const builtSections = [...source.matchAll(/\/\* ── (\d+) /g)].map(
      (m) => m[1]!,
    )
    expect(builtSections).toEqual(designSections.map((s) => s.split(' ')[0]))
  })

  it('renders every designed heading as its own split-weight pair', () => {
    for (const heading of designHeadings) {
      const match = builtHeadings.find(
        (h) => h.light === heading.light && h.bold === heading.bold,
      )
      expect(
        match,
        `no <Display light="${heading.light}" bold="${heading.bold}" /> in the page`,
      ).toBeTruthy()
    }
  })

  it('reverses the hero the way the design does — bold name, light italic claim', () => {
    const hero = builtHeadings.find((h) => h.bold === 'Goodness,')
    expect(hero?.light).toBe('organized.')
    expect(built).toMatch(
      /<Display[\s\S]*?variant="hero"[\s\S]*?reverse[\s\S]*?italic/,
    )
  })

  it('uses the split-weight component rather than plain headings', () => {
    expect(builtHeadings.length).toBeGreaterThanOrEqual(12)
    expect(built).not.toMatch(/<h2>/)
  })

  it('keeps the design copy that carries the product promises', () => {
    const promises = [
      'Together for a Better Tomorrow',
      'every mission, taka and outcome connected and verifiable',
      'secured and received are never blurred',
      'the commitment matters, never the size',
      'output, not outcome',
      'shared programme results across all funders',
      'Not an annual summary',
    ]
    const normalisedBuild = normalise(built)
    for (const promise of promises) {
      expect(normalisedBuild, `missing: "${promise}"`).toContain(
        normalise(promise),
      )
    }
  })
})
