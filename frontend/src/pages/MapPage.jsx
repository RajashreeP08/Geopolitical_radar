import { useState, useEffect } from 'react'
import axios from 'axios'
import WorldMap from '../components/WorldMap'
import CountryPanel from '../components/CountryPanel'
import NewsDetailPanel from '../components/NewsDetailPanel'
import { motion, AnimatePresence } from 'framer-motion'

function RadarWidget() {
  return (
    <div style={{position:'relative', width:72, height:72}}>
      <svg width="72" height="72" style={{position:'absolute'}}>
        <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1"/>
        <circle cx="36" cy="36" r="22" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="1"/>
        <circle cx="36" cy="36" r="12" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="1"/>
        <line x1="36" y1="4" x2="36" y2="68" stroke="rgba(56,189,248,0.1)" strokeWidth="0.5"/>
        <line x1="4" y1="36" x2="68" y2="36" stroke="rgba(56,189,248,0.1)" strokeWidth="0.5"/>
      </svg>
      <svg width="72" height="72" style={{
        position:'absolute',
        animation:'radar-sweep 3s linear infinite',
        transformOrigin:'36px 36px'
      }}>
        <defs>
          <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(56,189,248,0)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.5)" />
          </linearGradient>
        </defs>
        <path d="M36,36 L36,4 A32,32 0 0,1 68,36 Z" fill="url(#radarGrad)" />
      </svg>
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:5, height:5, borderRadius:'50%',
        background:'#38bdf8', boxShadow:'0 0 10px #38bdf8'
      }} />
    </div>
  )
}

function LiveTicker({ events }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (!events.length) return
    const t = setInterval(() => setIdx(i => (i+1) % events.length), 4000)
    return () => clearInterval(t)
  }, [events])
  if (!events.length) return null
  const ev = events[idx]
  const sev = parseInt(ev?.severity) || 5
  const color = sev >= 8 ? '#ef4444' : sev >= 6 ? '#f59e0b' : '#22c55e'
  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      style={{ display:'flex', alignItems:'center', gap:8 }}
    >
      <span style={{
        fontSize:7, padding:'2px 5px', borderRadius:3,
        background:color+'22', color, border:`1px solid ${color}44`,
        fontFamily:'JetBrains Mono', whiteSpace:'nowrap'
      }}>SEV {sev}</span>
      <span style={{fontSize:10, color:'#94a3b8', fontFamily:'JetBrains Mono',
        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
        {ev?.event}
      </span>
    </motion.div>
  )
}

export default function MapPage() {
  const [events, setEvents] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedNews, setSelectedNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())
  const [lastUpdated, setLastUpdated] = useState(null)
  const panelOpen = selectedCountry || selectedNews

  const loadEvents = () => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/events`)
      .then(res => {
        setEvents(res.data)
        setLoading(false)
        setLastUpdated(new Date())
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadEvents()
    // Auto refresh every 4 hours
    const refreshInterval = setInterval(loadEvents, 4 * 60 * 60 * 1000)
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => {
      clearInterval(refreshInterval)
      clearInterval(t)
    }
  }, [])

  const countryEvents = selectedCountry
    ? events.filter(e => e.countries?.some(c =>
        c.toLowerCase().includes(selectedCountry.toLowerCase()) ||
        selectedCountry.toLowerCase().includes(c.toLowerCase())
      ))
    : []

  const highSevCount = events.filter(e => parseInt(e.severity) >= 8).length
  const allNations = [...new Set(events.flatMap(e => e.countries || []))]

  return (
    <div className="scanlines" style={{
      width:'100vw', height:'100vh', background:'#020817',
      position:'relative', overflow:'hidden'
    }}>

      {/* Map — shifts left when panel opens */}
      <motion.div
        animate={{ x: panelOpen ? -190 : 0 }}
        transition={{ type:'spring', damping:30, stiffness:180 }}
        style={{position:'absolute', inset:0}}
      >
        <WorldMap
          events={events}
          selectedNews={selectedNews}
          onCountryClick={(country) => {
            setSelectedCountry(country)
            setSelectedNews(null)
          }}
        />
      </motion.div>

      {/* Top HUD */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, zIndex:10,
        padding:'10px 20px',
        background:'linear-gradient(180deg, rgba(2,8,23,0.98) 0%, transparent 100%)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:'1px solid rgba(56,189,248,0.07)'
      }}>

        {/* Logo + Radar */}
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <RadarWidget />
          <div>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <span style={{
                fontSize:17, fontWeight:700, letterSpacing:'0.25em',
                fontFamily:'Space Grotesk',
                background:'linear-gradient(90deg, #38bdf8, #818cf8)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
              }}>GEOPOLITICAL RADAR</span>
              <span style={{
                fontSize:7, padding:'2px 5px', borderRadius:2,
                background:'rgba(34,197,94,0.15)', color:'#22c55e',
                border:'1px solid rgba(34,197,94,0.3)',
                fontFamily:'JetBrains Mono', letterSpacing:'0.15em',
                animation:'pulse-glow 2s infinite'
              }}>LIVE</span>
            </div>
            <div style={{fontSize:7, letterSpacing:'0.25em', color:'#1e3a5f',
              fontFamily:'JetBrains Mono', marginTop:2}}>
              GLOBAL INTELLIGENCE MONITORING SYSTEM v2.0
            </div>
          </div>
        </div>

        {/* Live ticker */}
        <div style={{
          flex:1, margin:'0 20px',
          padding:'5px 12px', borderRadius:6,
          background:'rgba(56,189,248,0.03)',
          border:'1px solid rgba(56,189,248,0.08)',
          overflow:'hidden', minWidth:0
        }}>
          <div style={{fontSize:7, letterSpacing:'0.2em', color:'#1e3a5f',
            fontFamily:'JetBrains Mono', marginBottom:3}}>▶ LIVE INTELLIGENCE FEED</div>
          <LiveTicker events={events} />
        </div>

        {/* Stats + Clock */}
        <div style={{display:'flex', alignItems:'center', gap:14}}>
          {[
            ['EVENTS', events.length, '#38bdf8'],
            ['NATIONS', allNations.length, '#f59e0b'],
            ['HIGH SEV', highSevCount, '#ef4444'],
          ].map(([label, val, color]) => (
            <div key={label} style={{textAlign:'center'}}>
              <div style={{fontSize:16, fontWeight:700, color,
                fontFamily:'JetBrains Mono',
                textShadow:`0 0 10px ${color}`}}>{val}</div>
              <div style={{fontSize:7, letterSpacing:'0.15em', color:'#1e3a5f',
                fontFamily:'JetBrains Mono'}}>{label}</div>
            </div>
          ))}

          {/* Manual refresh button */}
          <motion.button
            whileHover={{ borderColor:'rgba(56,189,248,0.5)', scale:1.05 }}
            whileTap={{ scale:0.95 }}
            onClick={loadEvents}
            style={{
              padding:'5px 10px', borderRadius:6,
              background:'rgba(56,189,248,0.05)',
              border:'1px solid rgba(56,189,248,0.15)',
              color:'#38bdf8', cursor:'pointer',
              fontFamily:'JetBrains Mono', fontSize:8,
              letterSpacing:'0.1em'
            }}
          >⟳ REFRESH</motion.button>

          {/* Clock */}
          <div style={{
            padding:'6px 12px', borderRadius:6,
            background:'rgba(56,189,248,0.04)',
            border:'1px solid rgba(56,189,248,0.1)',
            textAlign:'center'
          }}>
            <div style={{fontSize:13, fontWeight:500, color:'#38bdf8',
              fontFamily:'JetBrains Mono', letterSpacing:'0.1em'}}>
              {time.toLocaleTimeString('en-US', {hour12:false})}
            </div>
            <div style={{fontSize:7, color:'#1e3a5f',
              fontFamily:'JetBrains Mono', letterSpacing:'0.1em'}}>UTC</div>
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:10,
        padding:'7px 20px',
        background:'linear-gradient(0deg, rgba(2,8,23,0.98) 0%, transparent 100%)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderTop:'1px solid rgba(56,189,248,0.05)'
      }}>
        {/* Legend */}
        <div style={{display:'flex', gap:16}}>
          {[
            ['#ef4444','HIGH (8-10)'],
            ['#f59e0b','MEDIUM (5-7)'],
            ['#22c55e','LOW (1-4)']
          ].map(([color, label]) => (
            <div key={label} style={{display:'flex', alignItems:'center', gap:5}}>
              <div style={{width:5, height:5, borderRadius:'50%',
                background:color, boxShadow:`0 0 5px ${color}`}} />
              <span style={{fontSize:7, color:'#334155',
                fontFamily:'JetBrains Mono', letterSpacing:'0.08em'}}>{label}</span>
            </div>
          ))}
        </div>

        {/* Hint */}
        {!selectedCountry && !selectedNews && events.length > 0 && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
            style={{fontSize:7, color:'#1e3a5f',
              fontFamily:'JetBrains Mono', letterSpacing:'0.15em'}}>
            CLICK ANY MARKER TO BEGIN ANALYSIS
          </motion.div>
        )}

        {/* Last updated */}
        <div style={{fontSize:7, color:'#1e3a5f',
          fontFamily:'JetBrains Mono', letterSpacing:'0.1em'}}>
          {lastUpdated
            ? `UPDATED ${lastUpdated.toLocaleTimeString('en-US', {hour12:false})}`
            : time.toLocaleDateString('en-US',{
                year:'numeric', month:'short', day:'2-digit'
              }).toUpperCase()
          }
        </div>
      </div>

      {/* Side Panels */}
      <AnimatePresence>
        {selectedCountry && !selectedNews && (
          <CountryPanel
            key="country"
            country={selectedCountry}
            events={countryEvents}
            onClose={() => setSelectedCountry(null)}
            onNewsClick={setSelectedNews}
          />
        )}
        {selectedNews && (
          <NewsDetailPanel
            key="news"
            news={selectedNews}
            onClose={() => { setSelectedNews(null); setSelectedCountry(null) }}
            onBack={() => setSelectedNews(null)}
          />
        )}
      </AnimatePresence>

      {/* Loading screen */}
      {loading && (
        <motion.div
          exit={{ opacity: 0 }}
          style={{
            position:'absolute', inset:0, background:'#020817',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', zIndex:100
          }}
        >
          <RadarWidget />
          <motion.p
            animate={{ opacity: [0,1,0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ marginTop:20, fontSize:10, letterSpacing:'0.4em',
              color:'#38bdf8', fontFamily:'JetBrains Mono' }}
          >
            INITIALIZING INTELLIGENCE SYSTEMS...
          </motion.p>
        </motion.div>
      )}
    </div>
  )
}