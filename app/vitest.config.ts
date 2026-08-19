import { defineConfig } from 'vitest/config'

/**
 * Tests run against plain modules — no Start/Nitro plugins, so the run exits cleanly and a
 * failing test means a failing derivation, not a failing dev server.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
