#!/usr/bin/env node
/**
 * GOODNESS OS — end-to-end check of the contribution loop.
 *
 * Walks the path a volunteer and a team lead actually take, in a real browser, against a built
 * server: claim a passport, join a mission, check in, submit the contribution, verify the hours in
 * Mission Control, and confirm the hours reach the passport and the audit trail.
 *
 * Usage:
 *   npm run build && npm start &          # or: PORT=3000 node .output/server/index.mjs
 *   node e2e/flow.mjs http://localhost:3000
 */
import { chromium } from 'playwright'

const base = process.argv[2] ?? 'http://localhost:3000'
const executablePath = process.env.CHROMIUM_PATH || undefined

const results = []
const check = (label, ok) => {
  results.push({ label, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`)
}

const browser = await chromium.launch(executablePath ? { executablePath } : {})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

await page.goto(`${base}/missions/msn-dhaka-digital-01`, {
  waitUntil: 'networkidle',
})
await page.getByRole('button', { name: /Nusrat Jahan/ }).click()
await page.waitForTimeout(400)
await page
  .getByRole('button', { name: /Join as Trainer/ })
  .first()
  .click()
await page.waitForTimeout(500)
check(
  'joining a mission offers the next step',
  (await page.getByRole('button', { name: 'Check in with QR' }).count()) > 0,
)

await page.getByRole('button', { name: 'Check in with QR' }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'Submit completion' }).click()
await page.waitForTimeout(300)
check(
  'a submitted contribution waits for a team lead',
  (await page.locator('text=Awaiting verification').count()) > 0,
)

await page.goto(`${base}/me`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
const before = Number(
  (await page.locator('.gs-stat__value').first().innerText()).replace(
    /[^0-9]/g,
    '',
  ),
)

await page.goto(`${base}/admin?tab=attendance`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.getByRole('button', { name: /Verify 5 hours/ }).click()
await page.waitForTimeout(400)
check(
  'a team lead can verify the hours',
  (await page.locator('text=Hours verified').count()) > 0,
)

await page.goto(`${base}/me`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
const after = Number(
  (await page.locator('.gs-stat__value').first().innerText()).replace(
    /[^0-9]/g,
    '',
  ),
)
check(
  `verified hours reach the passport (${before} -> ${after})`,
  after === before + 5,
)

await page.goto(`${base}/admin?tab=audit`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
check(
  'the governed changes are in the audit trail',
  (await page.locator('table tbody tr').count()) > 0,
)

await page.goto(`${base}/studio`, { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
const size = await page
  .locator('canvas')
  .first()
  .evaluate((c) => `${c.width}x${c.height}`)
check('share studio renders a full-size card', size === '1080x1080')

await page.goto(`${base}/trust`, { waitUntil: 'networkidle' })
await page
  .getByRole('button', { name: /Show \d+ expenses/ })
  .first()
  .click()
await page.waitForTimeout(300)
check(
  'the ledger opens down to individual expenses',
  (await page.locator('table tbody tr').count()) > 0,
)

await browser.close()
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
