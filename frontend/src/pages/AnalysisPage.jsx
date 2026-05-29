import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SEV_COLOR = s => s >= 8 ? '#ef4444' : s >= 6 ? '#f59e0b' : '#22c55e'

const ROLES = [
  { label:'SOURCE', border:'#ef4444', text:'#fca5a5', dot:'#ef4444', bg:'rgba(239,68,68,0.08)' },
  { label:'AFFECTED', border:'#f59e0b', text:'#fcd34d', dot:'#f59e0b', bg:'rgba(245,158,11,0.08)' },
  { label:'CONNECTED', border:'#38bdf8', text:'#7dd3fc', dot:'#38bdf8', bg:'rgba(56,189,248,0.06)' },
]

function Card({ color, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 12, padding: '16px 18px',
        background: `${color}08`,
        border: `1px solid ${color}25`,
        boxShadow: `0 0 20px ${color}08`
      }}
    >
      <p style={{
        fontSize: 8, letterSpacing: '0.3em', color,
        fontFamily: 'JetBrains Mono', marginBottom: 12
      }}>{title}</p>
      {children}
    </motion.div>
  )
}

export default function AnalysisPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { news, analysis } = state || {}

  if (!news) return (
    <div style={{
      height: '100vh', background: '#020817',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <button onClick={() => navigate('/')}
        style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono',
          fontSize: 11, background: 'none', border: 'none', cursor: 'pointer',
          letterSpacing: '0.2em' }}>
        ← BACK TO RADAR
      </button>
    </div>
  )

  const sev = parseInt(news.severity) || 5
  const sc = SEV_COLOR(sev)

  return (
    <div style={{
      minHeight: '100vh', background: '#020817',
      fontFamily: 'Space Grotesk', overflowY: 'auto'
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '12px 40px',
        background: 'rgba(2,8,23,0.97)',
        borderBottom: '1px solid rgba(56,189,248,0.1)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: '#475569', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.2em'
        }}>← BACK TO RADAR</button>
        <span style={{
          fontSize: 9, letterSpacing: '0.3em', color: '#334155',
          fontFamily: 'JetBrains Mono'
        }}>FULL INTELLIGENCE REPORT</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{
            fontSize: 8, padding: '3px 8px', borderRadius: 4,
            background: sc + '20', color: sc,
            border: `1px solid ${sc}40`,
            fontFamily: 'JetBrains Mono', letterSpacing: '0.1em'
          }}>SEV {sev}/10</span>
          <span style={{
            fontSize: 8, padding: '3px 8px', borderRadius: 4,
            background: 'rgba(56,189,248,0.1)', color: '#38bdf8',
            border: '1px solid rgba(56,189,248,0.2)',
            fontFamily: 'JetBrains Mono', letterSpacing: '0.1em'
          }}>{news.category?.toUpperCase()}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }}>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{
            width: 40, height: 2, marginBottom: 16,
            background: `linear-gradient(90deg, ${sc}, transparent)`
          }} />
          <h1 style={{
            fontSize: 28, fontWeight: 700, lineHeight: 1.4,
            color: '#e2e8f0', fontFamily: 'Space Grotesk',
            marginBottom: 16, maxWidth: 800
          }}>{news.event}</h1>

          {/* Severity meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <span style={{ fontSize: 10, color: '#475569',
              fontFamily: 'JetBrains Mono', letterSpacing: '0.15em' }}>
              THREAT INDEX
            </span>
            <div style={{ flex: 1, maxWidth: 200, height: 4,
              background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sev * 10}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 2,
                  background: `linear-gradient(90deg, ${sc}88, ${sc})`,
                  boxShadow: `0 0 8px ${sc}` }}
              />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: sc,
              fontFamily: 'JetBrains Mono',
              textShadow: `0 0 12px ${sc}` }}>{sev}/10</span>
          </div>
        </motion.div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Nations involved */}
          <Card color="#38bdf8" title="NATIONS INVOLVED">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {news.countries?.map((c, i) => {
                const role = ROLES[Math.min(i, 2)]
                return (
                  <div key={c} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '7px 10px',
                    borderRadius: 7, background: role.bg,
                    border: `1px solid ${role.border}25`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: role.dot,
                        boxShadow: `0 0 5px ${role.dot}`
                      }} />
                      <span style={{ fontSize: 13, color: role.text,
                        fontFamily: 'Space Grotesk', fontWeight: 500 }}>{c}</span>
                    </div>
                    <span style={{
                      fontSize: 7, padding: '1px 6px', borderRadius: 2,
                      background: role.border + '15', color: role.border,
                      fontFamily: 'JetBrains Mono', letterSpacing: '0.1em'
                    }}>{role.label}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Root cause */}
          <Card color="#ef4444" title="ROOT CAUSE ANALYSIS">
            <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.9,
              fontFamily: 'Space Grotesk' }}>{news.cause}</p>
          </Card>

          {/* Consequences */}
          <Card color="#f59e0b" title="IMMEDIATE CONSEQUENCES">
            {news.consequences?.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10,
                marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ color: '#f59e0b', fontSize: 10,
                  fontFamily: 'JetBrains Mono', marginTop: 3 }}>▸</span>
                <p style={{ fontSize: 13, color: '#fcd34d', lineHeight: 1.7,
                  fontFamily: 'Space Grotesk' }}>{c}</p>
              </div>
            ))}
          </Card>

          {/* Countries at risk */}
          {analysis && (
            <Card color="#8b5cf6" title="NATIONS AT RISK">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {analysis.countries_at_risk?.map(c => (
                  <span key={c} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 5,
                    background: 'rgba(139,92,246,0.12)', color: '#c4b5fd',
                    border: '1px solid rgba(139,92,246,0.25)',
                    fontFamily: 'JetBrains Mono'
                  }}>{c}</span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Intelligence summary — full width */}
        {analysis && (
          <>
            <Card color="#818cf8" title="INTELLIGENCE CHAIN ANALYSIS">
              <p style={{ fontSize: 14, color: '#c4b5fd', lineHeight: 2,
                fontFamily: 'Space Grotesk' }}>{analysis.chain_summary}</p>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 16, marginTop: 16 }}>

              {/* Future projections */}
              <Card color="#22c55e" title="FUTURE PROJECTIONS">
                {analysis.future_consequences?.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10,
                    marginBottom: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#22c55e', fontSize: 9,
                      fontFamily: 'JetBrains Mono', marginTop: 3 }}>▸</span>
                    <p style={{ fontSize: 13, color: '#86efac', lineHeight: 1.7,
                      fontFamily: 'Space Grotesk' }}>{c}</p>
                  </div>
                ))}
              </Card>

              {/* Connected events */}
              <Card color="#f59e0b" title="CONNECTED PAST EVENTS">
                {analysis.connected_events?.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, marginBottom: 10,
                    alignItems: 'flex-start', paddingBottom: 10,
                    borderBottom: i < analysis.connected_events.length - 1
                      ? '1px solid rgba(245,158,11,0.1)' : 'none'
                  }}>
                    <span style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 3,
                      background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                      fontFamily: 'JetBrains Mono', minWidth: 20, textAlign: 'center'
                    }}>{i + 1}</span>
                    <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7,
                      fontFamily: 'Space Grotesk' }}>{c}</p>
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}