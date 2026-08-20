import { CARD_HEIGHT, THEMES } from '../lib/card-spec'
import type { CSSProperties } from 'react'
import type { CardFormat, CardSpec, ThemeTokens } from '../lib/card-spec'

/**
 * One share card, composed at 540px wide exactly as `Share Studio.dc.html` composes it. The card is
 * rendered as real DOM so what is previewed is what is exported, and so every layout the design
 * defines can keep its own composition rather than being flattened into one template.
 */
export function ShareCard({
  spec,
  format,
  note,
  avatar,
  cardRef,
}: {
  spec: CardSpec
  format: CardFormat
  note?: string
  avatar?: { initials: string; gradient: string }
  cardRef?: React.Ref<HTMLDivElement>
}) {
  const t = THEMES[spec.theme]
  const showNote = spec.allowNote && note ? note : ''

  return (
    <div
      ref={cardRef}
      className="gs-card-art"
      style={{
        height: CARD_HEIGHT[format],
        background: t.bg,
        color: t.fg,
      }}
    >
      <div
        className="gs-card-art__motif"
        style={{ borderColor: t.motif }}
        aria-hidden="true"
      />

      {spec.layout === 'urgent' ? (
        <>
          <span className="gs-card-art__hazard gs-card-art__hazard--top" />
          <span className="gs-card-art__hazard gs-card-art__hazard--bottom" />
        </>
      ) : null}

      <div className="gs-card-art__brand">
        <span
          className="gs-card-art__tile"
          style={{ background: t.tileBg, color: t.tileFg }}
        >
          G
        </span>
        <span style={{ fontSize: 15, letterSpacing: '-0.01em' }}>
          <span style={{ fontWeight: 300 }}>Goodness</span>{' '}
          <span style={{ fontWeight: 800 }}>Society</span>
        </span>
      </div>

      <Body spec={spec} t={t} note={showNote} avatar={avatar} />

      <div className="gs-card-art__foot">
        <span
          className="gs-card-art__verified"
          style={{ background: t.verifiedBg, color: t.verifiedFg }}
        >
          GOODNESS VERIFIED ✓
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: t.sub }}>
          {spec.verifyLine}
        </span>
      </div>
    </div>
  )
}

function Body({
  spec,
  t,
  note,
  avatar,
}: {
  spec: CardSpec
  t: ThemeTokens
  note: string
  avatar?: { initials: string; gradient: string }
}) {
  switch (spec.layout) {
    case 'recruit':
      return <Recruit spec={spec} t={t} />
    case 'urgent':
      return <Urgent spec={spec} t={t} />
    case 'fund':
      return <Fund spec={spec} />
    case 'pct':
      return <Pct spec={spec} />
    case 'funded':
      return <Funded spec={spec} />
    case 'impactpub':
      return <ImpactPub spec={spec} />
    case 'outcome':
      return <Outcome spec={spec} t={t} />
    case 'evidence':
      return <Evidence spec={spec} />
    case 'duo':
      return <Duo spec={spec} t={t} />
    case 'digest':
      return <Digest spec={spec} t={t} />
    case 'year':
      return <Year spec={spec} t={t} />
    case 'money':
      return <Money spec={spec} t={t} />
    case 'chapmember':
      return <ChapMember spec={spec} />
    case 'chapmile':
      return <ChapMile spec={spec} t={t} />
    case 'lead':
      return <Lead spec={spec} t={t} note={note} avatar={avatar} />
    case 'launch':
      return <Launch spec={spec} />
    default:
      return <Default spec={spec} t={t} note={note} avatar={avatar} />
  }
}

const column = (gap: number, padding: string): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
  position: 'relative',
  padding,
})

function Recruit({ spec, t }: { spec: CardSpec; t: ThemeTokens }) {
  return (
    <div style={column(14, '20px 0 0')}>
      <div
        style={{
          borderTop: '3px solid #141410',
          borderBottom: '1px solid #141410',
          padding: '3px 0',
        }}
      />
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 0.98,
          letterSpacing: '-0.03em',
        }}
      >
        {spec.stack1}
        <br />
        <span style={{ color: '#1B7A34' }}>{spec.stack2}</span>
      </div>
      <div
        style={{
          fontSize: 25,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {spec.title}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: t.sub }}>
        {spec.meta}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {(spec.roles ?? []).map((role) => (
          <div
            key={role.role}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span className="gs-card-art__count">{role.count}</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>{role.role}</span>
          </div>
        ))}
      </div>
      <div className="gs-card-art__band">
        <span style={{ fontSize: 15, fontWeight: 800 }}>{spec.band1}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#4DC86A' }}>
          {spec.band2}
        </span>
      </div>
    </div>
  )
}

function Urgent({ spec, t }: { spec: CardSpec; t: ThemeTokens }) {
  return (
    <div style={column(14, '20px 0')}>
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: '#FF7A28',
        }}
      >
        {spec.eyebrow}
      </div>
      <div>
        <div
          style={{
            fontSize: 132,
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            color: '#FF7A28',
          }}
        >
          {spec.giant}
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: '0.16em',
            marginTop: 8,
          }}
        >
          {spec.giantUnit}
        </div>
      </div>
      <div
        style={{
          fontSize: 27,
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.01em',
        }}
      >
        {spec.title}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: t.sub }}>
        {spec.meta}
      </div>
      <div
        style={{
          alignSelf: 'flex-start',
          fontSize: 16,
          fontWeight: 800,
          padding: '10px 20px',
          border: '2px solid #FF7A28',
          borderRadius: 10,
          color: '#fff',
        }}
      >
        {spec.band1}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#FF7A28' }}>
        {spec.band2}
      </div>
    </div>
  )
}

function Fund({ spec }: { spec: CardSpec }) {
  return (
    <div style={column(13, '20px 0')}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        {spec.eyebrow}
      </div>
      <div
        style={{
          fontSize: 27,
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.01em',
        }}
      >
        {spec.title}
      </div>
      <div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}
        >
          {spec.giant}
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: '0.16em',
            marginTop: 6,
          }}
        >
          {spec.giantUnit}
        </div>
      </div>
      <div>
        <div className="gs-card-art__track">
          <div style={{ width: `${spec.barPct ?? 0}%` }} />
        </div>
        <div className="gs-card-art__trackrow">
          <span>{spec.money1}</span>
          <span>{spec.pctLive}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {(spec.expected ?? []).map((item) => (
          <div key={item} className="gs-card-art__tick">
            <span>✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="gs-card-art__pill gs-card-art__pill--onblue">
        {spec.band2}
      </div>
    </div>
  )
}

function Pct({ spec }: { spec: CardSpec }) {
  return (
    <div style={column(15, '20px 0')}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.16em',
          color: '#1565C0',
        }}
      >
        {spec.eyebrow}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div
          className="gs-card-art__donut"
          style={{
            background: `conic-gradient(#1565C0 0 ${spec.barPct ?? 0}%, #E3EDF9 ${spec.barPct ?? 0}% 100%)`,
          }}
        >
          <div className="gs-card-art__donut-hole">
            <span
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: '#1565C0',
                letterSpacing: '-0.02em',
              }}
            >
              {spec.giant}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.16em',
                color: '#6B7280',
              }}
            >
              {spec.giantUnit}
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: 23,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            {spec.title}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1565C0' }}>
            {spec.money1}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#6B7280' }}>
            {spec.money2}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>
        {spec.statement}
      </div>
    </div>
  )
}

function Funded({ spec }: { spec: CardSpec }) {
  return (
    <div
      style={{
        ...column(14, '20px 0'),
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div className="gs-card-art__seal">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6L9 17L4 12"
            stroke="#1B7A34"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '0.02em' }}>
        FULLY FUNDED
      </div>
      <div
        style={{
          fontSize: 21,
          fontWeight: 700,
          lineHeight: 1.3,
          maxWidth: 400,
        }}
      >
        Together, we funded {spec.title}.
      </div>
      <div
        style={{
          fontSize: 14.5,
          lineHeight: 1.5,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.85)',
          maxWidth: 380,
        }}
      >
        {spec.statement}
      </div>
    </div>
  )
}

function ImpactPub({ spec }: { spec: CardSpec }) {
  return (
    <div style={column(12, '10px 0 0')}>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: '0.06em',
          borderBottom: '3px solid #0D0D0D',
          paddingBottom: 10,
        }}
      >
        {spec.eyebrow}
      </div>
      <div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
          }}
        >
          {spec.title}
        </div>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: '#6B7280',
            marginTop: 4,
          }}
        >
          {spec.meta}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {(spec.rows ?? []).map((row) => (
          <div key={row.label} className="gs-card-art__row">
            <span
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                minWidth: 76,
              }}
            >
              {row.value}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#374151',
                flex: 1,
              }}
            >
              {row.label}
            </span>
            {row.basis ? (
              <span className="gs-card-art__basis">{row.basis}</span>
            ) : null}
          </div>
        ))}
      </div>
      <div
        style={{
          alignSelf: 'flex-start',
          fontSize: 13,
          fontWeight: 800,
          color: '#1565C0',
        }}
      >
        {spec.band2}
      </div>
    </div>
  )
}

function Outcome({ spec, t }: { spec: CardSpec; t: ThemeTokens }) {
  return (
    <div style={column(14, '16px 0')}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: t.accent,
        }}
      >
        {spec.eyebrow}
      </div>
      <div>
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
          }}
        >
          {spec.giant}
        </div>
        <div
          style={{
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: '0.1em',
            marginTop: 8,
            maxWidth: 420,
            lineHeight: 1.3,
          }}
        >
          {spec.giantUnit}
        </div>
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        {spec.title}
      </div>
      <div className="gs-card-art__pill gs-card-art__pill--ghost">
        {spec.chip}
      </div>
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.5,
          color: t.sub,
          maxWidth: 400,
        }}
      >
        {spec.statement}
      </div>
    </div>
  )
}

function Evidence({ spec }: { spec: CardSpec }) {
  return (
    <div
      style={{
        ...column(12, '8px 0 0'),
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div className="gs-card-art__ring">
        <span style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>✓</span>
        <span style={{ fontSize: 14, fontWeight: 800 }}>{spec.giant}</span>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: '0.18em',
          color: '#1B7A34',
        }}
      >
        {spec.eyebrow}
      </div>
      <div>
        <div
          style={{
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
          }}
        >
          {spec.title}
        </div>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: '#6B7280',
            marginTop: 4,
          }}
        >
          {spec.meta}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignItems: 'flex-start',
          margin: '0 auto',
        }}
      >
        {(spec.expected ?? []).map((item) => (
          <div
            key={item}
            style={{
              display: 'flex',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#374151',
            }}
          >
            <span style={{ color: '#1B7A34' }}>✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#1565C0' }}>
        {spec.band2}
      </div>
    </div>
  )
}

function Duo({ spec, t }: { spec: CardSpec; t: ThemeTokens }) {
  return (
    <div style={column(13, '10px 0 0')}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.18em',
          color: t.accent,
        }}
      >
        {spec.eyebrow}
      </div>
      {spec.giant ? (
        <div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
            }}
          >
            {spec.giant}
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: '0.12em',
              marginTop: 8,
              maxWidth: 430,
              lineHeight: 1.3,
            }}
          >
            {spec.giantUnit}
          </div>
        </div>
      ) : null}
      {spec.title ? (
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
          }}
        >
          {spec.title}
        </div>
      ) : null}
      {spec.line1 ? (
        <div style={{ fontSize: 14.5, fontWeight: 700, color: t.sub }}>
          {spec.line1}
        </div>
      ) : null}
      {spec.chip ? (
        <div
          className="gs-card-art__pill gs-card-art__pill--outline"
          style={{ borderColor: t.accent, color: t.accent }}
        >
          {spec.chip}
        </div>
      ) : null}
      {spec.stats?.length ? (
        <div style={{ display: 'flex', gap: 26 }}>
          {spec.stats.map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: t.sub,
                  marginTop: 2,
                  maxWidth: 120,
                  lineHeight: 1.35,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {spec.statement ? (
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: t.sub,
            maxWidth: 410,
          }}
        >
          {spec.statement}
        </div>
      ) : null}
      {spec.band2 ? (
        <div
          className="gs-card-art__pill"
          style={{ background: t.tileBg, color: t.tileFg, fontSize: 13.5 }}
        >
          {spec.band2}
        </div>
      ) : null}
    </div>
  )
}

function Digest({ spec, t }: { spec: CardSpec; t: ThemeTokens }) {
  return (
    <div style={column(13, '8px 0 0')}>
      <div
        style={{
          borderTop: '3px solid currentColor',
          borderBottom: '1px solid currentColor',
          padding: '8px 0 9px',
        }}
      >
        <div
          style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-0.01em' }}
        >
          {spec.eyebrow}
        </div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.sub }}>
        {spec.meta}
      </div>
      {spec.title ? (
        <div
          style={{
            fontSize: 21,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            borderLeft: `4px solid ${t.accent}`,
            paddingLeft: 14,
          }}
        >
          {spec.title}
        </div>
      ) : null}
      <div className="gs-card-art__grid2">
        {(spec.stats ?? []).map((stat) => (
          <div key={stat.label} className="gs-card-art__cell">
            <div
              style={{
                fontSize: 31,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: t.sub,
                marginTop: 2,
                lineHeight: 1.35,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      {spec.statement ? (
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: t.sub }}>
          {spec.statement}
        </div>
      ) : null}
    </div>
  )
}

function Year({ spec, t }: { spec: CardSpec; t: ThemeTokens }) {
  return (
    <div style={column(9, '0')}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: t.accent,
        }}
      >
        {spec.eyebrow}
      </div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 800,
          lineHeight: 0.9,
          letterSpacing: '-0.05em',
        }}
      >
        {spec.giant}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
        }}
      >
        {spec.title}
      </div>
      {spec.meta ? (
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.sub }}>
          {spec.meta}
        </div>
      ) : null}
      <div className="gs-card-art__grid3">
        {(spec.stats ?? []).map((stat) => (
          <div key={stat.label} className="gs-card-art__cell">
            <div
              style={{
                fontSize: 23,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 8.5,
                fontWeight: 800,
                letterSpacing: '0.09em',
                color: t.sub,
                marginTop: 2,
                lineHeight: 1.35,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      {spec.statement ? (
        <div
          style={{
            fontSize: 12.5,
            lineHeight: 1.5,
            color: t.sub,
            maxWidth: 420,
          }}
        >
          {spec.statement}
        </div>
      ) : null}
    </div>
  )
}

function Money({ spec, t }: { spec: CardSpec; t: ThemeTokens }) {
  return (
    <div style={column(12, '12px 0 0')}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: t.accent,
        }}
      >
        {spec.eyebrow}
      </div>
      <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-0.01em' }}>
        {spec.title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {(spec.rows ?? []).map((row) => (
          <div key={row.label} className="gs-card-art__moneyrow">
            <span
              style={{
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                minWidth: 128,
              }}
            >
              {row.value}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              {row.label}
            </span>
          </div>
        ))}
      </div>
      <div className="gs-card-art__pill gs-card-art__pill--white">
        {spec.band2}
      </div>
    </div>
  )
}

function ChapMember({ spec }: { spec: CardSpec }) {
  return (
    <div style={column(13, '18px 0 0')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span className="gs-card-art__mono">{spec.mono}</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.16em',
            color: '#6B7280',
          }}
        >
          {spec.eyebrow}
        </span>
      </div>
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: '#1B7A34',
        }}
      >
        {spec.title}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#6B7280' }}>
        {spec.meta}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>
        {spec.statement}
      </div>
      <div className="gs-card-art__statband">
        {(spec.stats ?? []).map((stat) => (
          <div key={stat.label}>
            <div
              style={{
                fontSize: 27,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.75)',
                marginTop: 2,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChapMile({ spec, t }: { spec: CardSpec; t: ThemeTokens }) {
  return (
    <div style={column(15, '20px 0')}>
      <span
        className="gs-card-art__mono gs-card-art__mono--sm"
        style={{ background: t.tileBg, color: t.tileFg }}
      >
        {spec.mono}
      </span>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: '0.18em',
          color: t.accent,
        }}
      >
        {spec.eyebrow}
      </div>
      <div>
        <div
          style={{
            fontSize: 112,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
          }}
        >
          {spec.giant}
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: '0.16em',
            marginTop: 8,
          }}
        >
          {spec.giantUnit}
        </div>
      </div>
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.5,
          fontWeight: 500,
          color: t.sub,
          maxWidth: 380,
        }}
      >
        {spec.statement}
      </div>
    </div>
  )
}

function Lead({
  spec,
  t,
  note,
  avatar,
}: {
  spec: CardSpec
  t: ThemeTokens
  note: string
  avatar?: { initials: string; gradient: string }
}) {
  return (
    <div style={column(14, '22px 0')}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.16em',
          color: t.accent,
        }}
      >
        {spec.eyebrow}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          className="gs-card-art__avatar"
          style={{ background: avatar?.gradient }}
        >
          {avatar?.initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 33,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {spec.title}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: t.accent,
              marginTop: 5,
            }}
          >
            {spec.meta}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: '-0.01em',
          maxWidth: 400,
        }}
      >
        {spec.statement}
      </div>
      {spec.stats?.length ? (
        <div style={{ display: 'flex', gap: 26 }}>
          {spec.stats.map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: 29,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: t.sub,
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {note ? (
        <div
          style={{
            fontSize: 15,
            fontStyle: 'italic',
            color: t.sub,
            maxWidth: 380,
          }}
        >
          “{note}”
        </div>
      ) : null}
    </div>
  )
}

function Launch({ spec }: { spec: CardSpec }) {
  return (
    <div
      style={{
        ...column(13, '20px 0'),
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        {spec.eyebrow}
      </div>
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
        }}
      >
        {spec.giant}
      </div>
      <div
        style={{
          fontSize: 19,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
        }}
      >
        {spec.title}
      </div>
      {spec.expected?.length ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            alignItems: 'center',
          }}
        >
          {spec.expected.map((item) => (
            <div key={item} style={{ fontSize: 15, fontWeight: 700 }}>
              ✓ {item}
            </div>
          ))}
        </div>
      ) : null}
      <div className="gs-card-art__pill gs-card-art__pill--ongreen">
        {spec.band2}
      </div>
    </div>
  )
}

function Default({
  spec,
  t,
  note,
  avatar,
}: {
  spec: CardSpec
  t: ThemeTokens
  note: string
  avatar?: { initials: string; gradient: string }
}) {
  return (
    <div style={column(16, '24px 0')}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.16em',
          color: t.accent,
        }}
      >
        {spec.eyebrow}
      </div>
      {spec.showAvatar ? (
        <div
          className="gs-card-art__avatar gs-card-art__avatar--sm"
          style={{ background: avatar?.gradient }}
        >
          {avatar?.initials}
        </div>
      ) : null}
      {spec.showBadge ? (
        <div className="gs-card-art__badge" style={{ background: t.badgeBg }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17L4 12"
              stroke={t.badgeStroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : null}
      {spec.giant ? (
        <div>
          <div
            style={{
              fontSize: 148,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: t.giant,
            }}
          >
            {spec.giant}
          </div>
          <div
            style={{
              fontSize: 21,
              fontWeight: 800,
              letterSpacing: '0.18em',
              marginTop: 10,
            }}
          >
            {spec.giantUnit}
          </div>
        </div>
      ) : null}
      {spec.title ? (
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
          }}
        >
          {spec.title}
        </div>
      ) : null}
      {spec.line1 ? (
        <div style={{ fontSize: 16, fontWeight: 600, color: t.sub }}>
          {spec.line1}
        </div>
      ) : null}
      {spec.chip ? (
        <div
          className="gs-card-art__pill"
          style={{ background: t.chipBg, color: t.chipFg, fontSize: 14 }}
        >
          {spec.chip}
        </div>
      ) : null}
      {spec.stats?.length ? (
        <div style={{ display: 'flex', gap: 28, paddingTop: 6 }}>
          {spec.stats.map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: 33,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: t.sub,
                  marginTop: 3,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {spec.refLine ? (
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.04em',
            fontFamily: "'Courier New', monospace",
            color: t.sub,
          }}
        >
          {spec.refLine}
        </div>
      ) : null}
      {spec.statement ? (
        <div
          style={{
            fontSize: 16,
            lineHeight: 1.5,
            fontWeight: 500,
            maxWidth: 380,
          }}
        >
          {spec.statement}
        </div>
      ) : null}
      {note ? (
        <div
          style={{
            fontSize: 15,
            fontStyle: 'italic',
            color: t.sub,
            maxWidth: 380,
          }}
        >
          “{note}”
        </div>
      ) : null}
    </div>
  )
}
