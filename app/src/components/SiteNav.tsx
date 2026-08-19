import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'

type NavItem = { label: string; to: string; hint?: string }

const primary: Array<NavItem> = [
  { label: 'Missions', to: '/missions' },
  { label: 'Fund Impact', to: '/fund' },
  { label: 'Impact', to: '/impact' },
  { label: 'Chapters', to: '/chapters' },
  { label: 'People', to: '/people' },
]

const secondary: Array<NavItem> = [
  { label: 'About', to: '/about', hint: 'Our story' },
  { label: 'Programs', to: '/programs', hint: 'Five areas of work' },
  { label: 'Trust Ledger', to: '/trust', hint: 'Follow the money' },
  { label: 'Partner Room', to: '/partner-room', hint: 'For sponsors' },
  { label: 'Transparency', to: '/transparency', hint: 'Yearly summary' },
  { label: 'Share Studio', to: '/studio', hint: 'Cards to share' },
  { label: 'Verify a credential', to: '/verify', hint: 'Check a ref' },
]

export function SiteNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setMoreOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <header className="gs-nav" ref={navRef}>
      <div className="gs-wrap gs-nav__inner">
        <Link
          to="/"
          className="gs-nav__logo"
          aria-label="Goodness Society home"
        >
          <img src="/assets/gs-logo-cropped.png" alt="Goodness Society" />
        </Link>

        <nav className="gs-nav__links" aria-label="Primary">
          {primary.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="gs-nav__link"
              activeProps={{ className: 'gs-nav__link is-active' }}
            >
              {item.label}
            </Link>
          ))}
          <div className="gs-nav__more">
            <button
              type="button"
              className="gs-chip"
              aria-expanded={moreOpen}
              onClick={(e) => {
                e.stopPropagation()
                setMoreOpen((v) => !v)
              }}
            >
              More ▾
            </button>
            {moreOpen ? (
              <div className="gs-nav__menu">
                {secondary.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                    <span className="gs-nav__hint">{item.hint}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link to="/me" className="gs-btn gs-btn--ghost gs-btn--sm">
            My Goodness
          </Link>
          <Link to="/partner" className="gs-btn gs-btn--primary gs-btn--sm">
            Partner with Us
          </Link>
        </nav>

        <button
          type="button"
          className="gs-btn gs-btn--ghost gs-btn--sm gs-nav__burger"
          aria-expanded={drawerOpen}
          aria-label="Menu"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          Menu
        </button>

        {drawerOpen ? (
          <div className="gs-nav__drawer">
            {[
              ...primary,
              ...secondary,
              { label: 'My Goodness', to: '/me' },
              { label: 'Partner with Us', to: '/partner' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setDrawerOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  )
}
