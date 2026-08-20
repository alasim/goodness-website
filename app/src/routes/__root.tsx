import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { createQueryClient } from '../lib/query'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Goodness Society — Goodness, organized.' },
      {
        name: 'description',
        content:
          'Goodness Society is the operating system for organized goodness — verified volunteers, real missions, measured impact and a public trust ledger.',
      },
      { name: 'theme-color', content: '#1B7A34' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;600;700&display=swap',
      },
      { rel: 'icon', href: '/assets/gs-logo-cropped.png' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootDocument({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  // Mission Control and Chapter Control are full-screen control surfaces with their own rail, so
  // they render without the public site's chrome — as their designs do.
  const isControl = useRouterState({
    select: (state) =>
      /^\/(admin|chapter-control)/.test(state.location.pathname),
  })

  if (isControl) {
    return (
      <div className="gs-shell">
        <a className="gs-skip" href="#main">
          Skip to content
        </a>
        <main id="main">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="gs-shell">
      <a className="gs-skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main className="gs-main" id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
