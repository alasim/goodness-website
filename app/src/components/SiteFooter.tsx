import { Link } from '@tanstack/react-router'

/**
 * Footer — built from `SiteFooter.dc.html`: the logo in a white rounded tile, the mission
 * statement, contact lines, three link columns, and the G monogram bleeding off the top-right at
 * 5% opacity.
 */
const COLUMNS: Array<{
  title: string
  lead?: boolean
  links: Array<{ label: string; to: string; hash?: string }>
}> = [
  {
    title: 'Act',
    lead: true,
    links: [
      { label: 'Join a Mission', to: '/missions' },
      { label: 'Volunteer With Us', to: '/join' },
      { label: 'Fund Impact', to: '/fund' },
      { label: 'Partner with Us', to: '/partner' },
      { label: 'Start a Chapter', to: '/chapters', hash: 'start' },
      { label: 'My Goodness', to: '/me' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Programs', to: '/programs' },
      { label: 'Impact', to: '/impact' },
      { label: 'Chapters', to: '/chapters' },
      { label: 'Our Volunteers', to: '/people' },
      { label: 'Share Studio', to: '/studio' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { label: 'Trust Ledger', to: '/trust' },
      { label: 'Transparency', to: '/transparency' },
      { label: 'Verify a Credential', to: '/verify' },
      { label: 'Partner Room', to: '/partner-room' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="gs-footer">
      <svg
        className="gs-footer__mark"
        width="460"
        height="320"
        viewBox="0 0 600 400"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="220"
          cy="180"
          r="160"
          stroke="#4DC86A"
          strokeWidth="44"
          fill="none"
        />
        <path
          d="M370 180 C390 180 420 200 430 240 C445 295 420 350 370 370 C310 395 240 370 210 320"
          stroke="#4DC86A"
          strokeWidth="44"
          fill="none"
          strokeLinecap="round"
        />
        <line
          x1="220"
          y1="180"
          x2="380"
          y2="180"
          stroke="#4DC86A"
          strokeWidth="44"
          strokeLinecap="round"
        />
      </svg>

      <div className="gs-wrap gs-footer__inner">
        <div className="gs-footer__cols">
          <div>
            <Link to="/" className="gs-footer__logo">
              <img
                src="/assets/gs-logo-cropped.png"
                alt="Society for Initiatives of Goodness"
              />
            </Link>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 13.5,
                lineHeight: 1.65,
                maxWidth: 320,
              }}
            >
              A government-registered non-profit creating measurable social
              impact through education, skills, and community empowerment — with
              every taka and every hour traceable.
            </p>
            <p
              style={{
                margin: '18px 0 0',
                color: 'rgba(255,255,255,0.35)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
              }}
            >
              Together for a Better Tomorrow
            </p>
            <div
              style={{
                marginTop: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                hello@goodnesssociety.org
              </span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                Dhaka, Bangladesh
              </span>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className={column.lead ? 'is-lead' : undefined}>
                {column.title}
              </h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} hash={link.hash}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gs-footer__bottom">
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Society for Initiatives of Goodness ·
            Registered Non-Profit Organisation
          </p>
          <p style={{ margin: 0 }}>
            <Link
              to="/admin"
              search={{ tab: 'overview' }}
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Mission Control
            </Link>{' '}
            ·{' '}
            <Link to="/chapters" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Chapter Control
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
