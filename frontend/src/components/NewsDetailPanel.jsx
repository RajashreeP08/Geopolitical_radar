import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SEV_COLOR = s => s >= 8 ? '#ef4444' : s >= 6 ? '#f59e0b' : '#22c55e'

const ROLES = [
  { label:'SOURCE', bg:'rgba(239,68,68,0.1)', border:'#ef4444', text:'#fca5a5', dot:'#ef4444' },
  { label:'AFFECTED', bg:'rgba(245,158,11,0.1)', border:'#f59e0b', text:'#fcd34d', dot:'#f59e0b' },
  { label:'CONNECTED', bg:'rgba(56,189,248,0.08)', border:'#38bdf8', text:'#7dd3fc', dot:'#38bdf8' },
]

function Module({ title, color, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{
      borderRadius:10, overflow:'hidden',
      border:`1px solid ${color}22`,
      background:`${color}06`
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:'100%', padding:'9px 13px',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          background:'none', border:'none', cursor:'pointer',
          borderBottom: open ? `1px solid ${color}15` : 'none'
        }}
      >
        <span style={{fontSize:7, letterSpacing:'0.25em', color,
          fontFamily:'JetBrains Mono'}}>{title}</span>
        <span style={{fontSize:9, color, opacity:0.6}}>{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ padding:'10px 13px', overflow:'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProgressBar({ value, max=10, color }) {
  return (
    <div style={{width:'100%', height:2, background:'rgba(255,255,255,0.06)',
      borderRadius:1, overflow:'hidden'}}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value/max)*100}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ height:'100%', background:color,
          boxShadow:`0 0 4px ${color}`, borderRadius:1 }}
      />
    </div>
  )
}

export default function NewsDetailPanel({ news, onClose, onBack }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const sev = parseInt(news.severity) || 5
  const sc = SEV_COLOR(sev)

  const getAnalysis = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `http://localhost:8000/analyze?event=${encodeURIComponent(news.event)}`
      )
      setAnalysis(res.data)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ x: 410, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 410, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      style={{
        position:'absolute', right:16, top:76, bottom:16,
        width:370, borderRadius:16, overflow:'hidden',
        display:'flex', flexDirection:'column', zIndex:20,
        background:'rgba(2,8,23,0.88)',
        border:'1px solid rgba(239,68,68,0.2)',
        backdropFilter:'blur(24px)',
        boxShadow:'0 0 40px rgba(239,68,68,0.06), inset 0 1px 0 rgba(239,68,68,0.15)'
      }}
    >
      {/* Glowing top edge */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:1,
        background:'linear-gradient(90deg, transparent, rgba(239,68,68,0.6), transparent)'
      }} />

      {/* Header */}
      <div style={{
        padding:'14px 16px 12px',
        borderBottom:'1px solid rgba(239,68,68,0.08)',
        background:'rgba(239,68,68,0.03)'
      }}>
        <button onClick={onBack} style={{
          fontSize:7, letterSpacing:'0.2em', color:'#475569',
          background:'none', border:'none', cursor:'pointer',
          fontFamily:'JetBrains Mono', marginBottom:8,
          display:'flex', alignItems:'center', gap:6
        }}>← BACK TO COUNTRY</button>

        <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            <div style={{display:'flex', alignItems:'center', gap:5, marginBottom:5}}>
              <span style={{
                fontSize:7, padding:'2px 5px', borderRadius:3,
                background:sc+'20', color:sc, border:`1px solid ${sc}40`,
                fontFamily:'JetBrains Mono', letterSpacing:'0.1em'
              }}>{news.category?.toUpperCase()}</span>
              <span style={{
                fontSize:7, padding:'2px 5px', borderRadius:3,
                background:'rgba(239,68,68,0.1)', color:'#ef4444',
                border:'1px solid rgba(239,68,68,0.2)',
                fontFamily:'JetBrains Mono', letterSpacing:'0.1em'
              }}>THREAT {sev}</span>
            </div>
            <h2 style={{fontSize:12, fontWeight:600, color:'#e2e8f0',
              lineHeight:1.6, fontFamily:'Space Grotesk'}}>
              {news.event}
            </h2>
          </div>
          <div style={{
            width:34, height:34, borderRadius:7, flexShrink:0,
            border:`1.5px solid ${sc}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:`${sc}10`, boxShadow:`0 0 14px ${sc}30`
          }}>
            <span style={{fontSize:13, fontWeight:700, color:sc,
              fontFamily:'JetBrains Mono'}}>{sev}</span>
          </div>
        </div>

        <div style={{marginTop:8}}>
          <ProgressBar value={sev} color={sc} />
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1, overflowY:'auto', padding:10,
        display:'flex', flexDirection:'column', gap:7}}>

        <Module title="NATIONS INVOLVED" color="#38bdf8">
          <div style={{display:'flex', flexDirection:'column', gap:5}}>
            {news.countries?.map((c, i) => {
              const role = ROLES[Math.min(i, 2)]
              return (
                <div key={c} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'6px 9px', borderRadius:6,
                  background:role.bg, border:`1px solid ${role.border}30`
                }}>
                  <div style={{display:'flex', alignItems:'center', gap:7}}>
                    <div style={{width:5, height:5, borderRadius:'50%',
                      background:role.dot, boxShadow:`0 0 5px ${role.dot}`}} />
                    <span style={{fontSize:12, fontWeight:500, color:role.text,
                      fontFamily:'Space Grotesk'}}>{c}</span>
                  </div>
                  <span style={{
                    fontSize:7, letterSpacing:'0.1em', padding:'1px 5px',
                    borderRadius:2, background:role.border+'18', color:role.border,
                    fontFamily:'JetBrains Mono'
                  }}>{role.label}</span>
                </div>
              )
            })}
          </div>
        </Module>

        <Module title="ROOT CAUSE ANALYSIS" color="#ef4444">
          <p style={{fontSize:12, color:'#cbd5e1', lineHeight:1.8,
            fontFamily:'Space Grotesk'}}>{news.cause}</p>
        </Module>

        <Module title="IMMEDIATE CONSEQUENCES" color="#f59e0b">
          {news.consequences?.map((c, i) => (
            <div key={i} style={{display:'flex', gap:7, marginBottom:7,
              alignItems:'flex-start'}}>
              <span style={{color:'#f59e0b', fontSize:9, marginTop:3,
                fontFamily:'JetBrains Mono'}}>▸</span>
              <p style={{fontSize:12, color:'#cbd5e1', lineHeight:1.6,
                fontFamily:'Space Grotesk'}}>{c}</p>
            </div>
          ))}
        </Module>

        {!analysis && (
          <motion.button
            whileHover={{
              boxShadow:'0 0 30px rgba(56,189,248,0.3)',
              borderColor:'rgba(56,189,248,0.6)'
            }}
            whileTap={{ scale: 0.97 }}
            onClick={getAnalysis}
            disabled={loading}
            style={{
              width:'100%', padding:'12px',
              borderRadius:8,
              background: loading
                ? 'rgba(15,23,42,0.8)'
                : 'linear-gradient(135deg, rgba(29,78,216,0.8), rgba(56,189,248,0.8))',
              border:'1px solid rgba(56,189,248,0.3)',
              color:'white', fontSize:9,
              fontWeight:600, letterSpacing:'0.2em',
              fontFamily:'JetBrains Mono', cursor:'pointer',
              transition:'all 0.3s'
            }}
          >
            {loading ? (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >⟳ ANALYZING CONNECTIONS...</motion.span>
            ) : '⚡ DEEP INTELLIGENCE ANALYSIS'}
          </motion.button>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display:'flex', flexDirection:'column', gap:7 }}
          >
            <Module title="INTELLIGENCE SUMMARY" color="#818cf8">
              <p style={{fontSize:11, color:'#c4b5fd', lineHeight:1.8,
                fontFamily:'Space Grotesk'}}>{analysis.chain_summary}</p>
            </Module>

            <Module title="NATIONS AT RISK" color="#8b5cf6">
              <div style={{display:'flex', flexWrap:'wrap', gap:5}}>
                {analysis.countries_at_risk?.map(c => (
                  <span key={c} style={{
                    fontSize:9, padding:'3px 7px', borderRadius:4,
                    background:'rgba(139,92,246,0.12)', color:'#c4b5fd',
                    border:'1px solid rgba(139,92,246,0.2)',
                    fontFamily:'JetBrains Mono'
                  }}>{c}</span>
                ))}
              </div>
            </Module>

            <Module title="FUTURE PROJECTIONS" color="#22c55e">
              {analysis.future_consequences?.map((c, i) => (
                <div key={i} style={{display:'flex', gap:7, marginBottom:7}}>
                  <span style={{color:'#22c55e', fontSize:8,
                    fontFamily:'JetBrains Mono', marginTop:3}}>▸</span>
                  <p style={{fontSize:11, color:'#86efac', lineHeight:1.6,
                    fontFamily:'Space Grotesk'}}>{c}</p>
                </div>
              ))}
            </Module>

            <motion.button
              whileHover={{ boxShadow:'0 0 30px rgba(139,92,246,0.4)' }}
              onClick={() => navigate('/analysis', { state:{ news, analysis } })}
              style={{
                width:'100%', padding:'12px', borderRadius:8,
                background:'linear-gradient(135deg, rgba(109,40,217,0.8), rgba(139,92,246,0.8))',
                border:'1px solid rgba(139,92,246,0.4)',
                color:'white', fontSize:9,
                fontWeight:600, letterSpacing:'0.2em',
                fontFamily:'JetBrains Mono', cursor:'pointer'
              }}
            >
              OPEN FULL INTELLIGENCE REPORT →
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}