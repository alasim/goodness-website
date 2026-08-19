import type { ReactNode } from 'react'

export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  aside,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
}) {
  return (
    <section className="gs-hero">
      <div className="gs-wrap">
        <div
          style={{
            display: 'grid',
            gap: 32,
            gridTemplateColumns: aside
              ? 'minmax(0, 1.4fr) minmax(0, 1fr)'
              : '1fr',
            alignItems: 'center',
          }}
        >
          <div className="gs-stack" style={{ gap: 18 }}>
            <p className="gs-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            {lede ? (
              <p className="gs-lede" style={{ maxWidth: 640 }}>
                {lede}
              </p>
            ) : null}
            {actions ? <div className="gs-row">{actions}</div> : null}
          </div>
          {aside}
        </div>
      </div>
    </section>
  )
}
