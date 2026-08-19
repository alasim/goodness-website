import { Link } from '@tanstack/react-router'

const columns: Array<{
  title: string
  links: Array<{ label: string; to: string }>
}> = [
  {
    title: 'Take part',
    links: [
      { label: 'Missions', to: '/missions' },
      { label: 'Join as a volunteer', to: '/join' },
      { label: 'Chapters', to: '/chapters' },
      { label: 'Start a chapter', to: '/chapters/start' },
    ],
  },
  {
    title: 'Give',
    links: [
      { label: 'Fund Impact', to: '/fund' },
      { label: 'Partner with us', to: '/partner' },
      { label: 'Partner Room', to: '/partner-room' },
      { label: 'My Goodness', to: '/me' },
    ],
  },
  {
    title: 'Accountability',
    links: [
      { label: 'Impact', to: '/impact' },
      { label: 'Trust Ledger', to: '/trust' },
      { label: 'Transparency', to: '/transparency' },
      { label: 'Verify a credential', to: '/verify' },
    ],
  },
  {
    title: 'Organisation',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Programs', to: '/programs' },
      { label: 'People', to: '/people' },
      { label: 'Share Studio', to: '/studio' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="gs-footer">
      <div className="gs-wrap">
        <div className="gs-footer__cols">
          <div className="gs-stack">
            <strong
              style={{ color: '#fff', fontSize: 17, letterSpacing: '-0.02em' }}
            >
              Goodness Society
            </strong>
            <p style={{ fontSize: 13.5, maxWidth: 280 }}>
              Together for a Better Tomorrow. This is what goodness looks like
              when we organize it.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="gs-stack" style={{ gap: 10 }}>
              <h4>{col.title}</h4>
              {col.links.map((l) => (
                <Link key={l.to} to={l.to}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="gs-footer__bottom">
          <span>
            © {new Date().getFullYear()} Goodness Society — a
            government-registered non-profit.
          </span>
          <span>
            Every number on this site is computed from our governed record, not
            typed by hand.
          </span>
        </div>
      </div>
    </footer>
  )
}
