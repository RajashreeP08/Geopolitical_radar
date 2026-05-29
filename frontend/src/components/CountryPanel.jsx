import { motion } from 'framer-motion'

const CATEGORY_COLORS = {
  trade:'#38bdf8', conflict:'#ef4444', diplomacy:'#22c55e',
  military:'#f59e0b', economy:'#818cf8'
}

const SEV_COLOR = s => s >= 8 ? '#ef4444' : s >= 6 ? '#f59e0b' : '#22c55e'

function ThreatBar({ value, color }) {
  return (
    <div style={{
      width:'100%', height:3, background:'rgba(255,255,255,0.06)',
      borderRadius:2, overflow:'hidden'
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 10}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ height:'100%', background:color,
          boxShadow:`0 0 6px ${color}`, borderRadius:2 }}
      />
    </div>
  )
}

export default function CountryPanel({ country, events, onClose, onNewsClick }) {
  const maxSev = events.length ? Math.max(...events.map(e => parseInt(e.severity)||5)) : 0
  const sevColor = SEV_COLOR(maxSev)

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      style={{
        position:'absolute', right:16, top:76, bottom:16,
        width:360, borderRadius:16, overflow:'hidden',
        display:'flex', flexDirection:'column', zIndex:20,
        background:'rgba(2,8,23,0.88)',
        border:'1px solid rgba(56,189,248,0.2)',
        backdropFilter:'blur(24px)',
        boxShadow:'0 0 40px rgba(56,189,248,0.08), inset 0 1px 0 rgba(56,189,248,0.1)'
      }}
    >
      {/* Glowing top edge */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:1,
        background:'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)'
      }} />

      {/* Header */}
      <div style={{
        padding:'16px 18px 12px',
        borderBottom:'1px solid rgba(56,189,248,0.08)',
        background:'rgba(56,189,248,0.03)'
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:4}}>
              <div style={{width:6, height:6, borderRadius:'50%', background:'#38bdf8',
                boxShadow:'0 0 8px #38bdf8', animation:'pulse-glow 2s infinite'}} />
              <span style={{fontSize:8, letterSpacing:'0.3em', color:'#334155',
                fontFamily:'JetBrains Mono'}}>INTELLIGENCE BRIEFING</span>
            </div>
            <h2 style={{fontSize:20, fontWeight:700, letterSpacing:'0.12em',
              fontFamily:'Space Grotesk',
              background:'linear-gradient(90deg, #e2e8f0, #94a3b8)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
              {country.toUpperCase()}
            </h2>
            <div style={{display:'flex', gap:12, marginTop:6}}>
              <span style={{fontSize:9, color:'#475569', fontFamily:'JetBrains Mono'}}>
                {events.length} ACTIVE EVENT{events.length !== 1 ? 'S' : ''}
              </span>
              <span style={{fontSize:9, color:sevColor, fontFamily:'JetBrains Mono'}}>
                MAX SEV: {maxSev}/10
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:28, height:28, borderRadius:6,
            border:'1px solid rgba(56,189,248,0.2)',
            background:'rgba(56,189,248,0.05)',
            color:'#475569', cursor:'pointer', fontSize:11,
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>✕</button>
        </div>

        {/* Threat bar */}
        <div style={{marginTop:10}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
            <span style={{fontSize:7, letterSpacing:'0.2em', color:'#334155',
              fontFamily:'JetBrains Mono'}}>THREAT LEVEL</span>
            <span style={{fontSize:7, color:sevColor,
              fontFamily:'JetBrains Mono'}}>{maxSev}/10</span>
          </div>
          <ThreatBar value={maxSev} color={sevColor} />
        </div>
      </div>

      {/* Events */}
      <div style={{flex:1, overflowY:'auto', padding:10,
        display:'flex', flexDirection:'column', gap:7}}>

        {events.length === 0 && (
          <div style={{textAlign:'center', padding:'40px 20px'}}>
            <div style={{fontSize:24, marginBottom:8, color:'#334155'}}>◈</div>
            <p style={{fontSize:10, color:'#334155', fontFamily:'JetBrains Mono',
              letterSpacing:'0.1em'}}>NO ACTIVE EVENTS DETECTED</p>
          </div>
        )}

        {events.map((event, i) => {
          const sev = parseInt(event.severity) || 5
          const sc = SEV_COLOR(sev)
          const cc = CATEGORY_COLORS[event.category] || '#38bdf8'
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ borderColor:'rgba(56,189,248,0.4)',
                background:'rgba(56,189,248,0.04)' }}
              onClick={() => onNewsClick(event)}
              style={{
                background:'rgba(15,23,42,0.6)',
                borderRadius:10, border:'1px solid rgba(30,58,95,0.4)',
                padding:'11px 13px', cursor:'pointer',
                transition:'all 0.2s'
              }}
            >
              {/* Top row */}
              <div style={{display:'flex', justifyContent:'space-between',
                alignItems:'center', marginBottom:7}}>
                <span style={{
                  fontSize:7, padding:'2px 6px', borderRadius:3,
                  background:cc+'15', color:cc,
                  border:`1px solid ${cc}30`,
                  fontFamily:'JetBrains Mono', letterSpacing:'0.1em'
                }}>{event.category?.toUpperCase()}</span>
                <div style={{
                  width:20, height:20, borderRadius:'50%',
                  border:`1.5px solid ${sc}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 0 6px ${sc}44`
                }}>
                  <span style={{fontSize:8, color:sc,
                    fontFamily:'JetBrains Mono', fontWeight:600}}>{sev}</span>
                </div>
              </div>

              {/* Title */}
              <p style={{fontSize:11, fontWeight:500, color:'#cbd5e1',
                lineHeight:1.6, marginBottom:7, fontFamily:'Space Grotesk'}}>
                {event.event}
              </p>

              {/* Country tags */}
              <div style={{display:'flex', flexWrap:'wrap', gap:3, marginBottom:7}}>
                {event.countries?.slice(0,4).map(c => (
                  <span key={c} style={{
                    fontSize:7, padding:'1px 5px', borderRadius:3,
                    background:'rgba(30,58,95,0.5)', color:'#64748b',
                    fontFamily:'JetBrains Mono', letterSpacing:'0.05em'
                  }}>{c.toUpperCase()}</span>
                ))}
              </div>

              <div style={{display:'flex', justifyContent:'space-between',
                alignItems:'center', gap:10}}>
                <div style={{flex:1}}>
                  <ThreatBar value={sev} color={sc} />
                </div>
                <span style={{fontSize:7, color:'#334155',
                  fontFamily:'JetBrains Mono', whiteSpace:'nowrap'}}>
                  ANALYZE →
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}