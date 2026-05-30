import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

const COORDS = {
  'united states': [-95.71, 37.09], 'us': [-95.71, 37.09], 'usa': [-95.71, 37.09],
  'china': [104.19, 35.86], 'russia': [105.31, 61.52], 'india': [78.96, 20.59],
  'iran': [53.68, 32.42], 'israel': [34.85, 31.04], 'ukraine': [31.16, 48.37],
  'germany': [10.45, 51.16], 'france': [2.21, 46.22], 'uk': [-3.43, 55.37],
  'japan': [138.25, 36.20], 'saudi arabia': [45.07, 23.88], 'turkey': [35.24, 38.96],
  'pakistan': [69.34, 30.37], 'brazil': [-51.92, -14.23],
  'european union': [15.25, 54.52], 'other nations': [0, 20],
  'north korea': [127.51, 40.33], 'south korea': [127.76, 35.90],
  'egypt': [30.80, 26.82], 'nigeria': [8.67, 9.08],
  'south africa': [25.08, -29.00], 'ethiopia': [40.49, 9.14],
  'indonesia': [113.92, -0.79], 'australia': [133.77, -25.27],
  'mexico': [-102.55, 23.63], 'argentina': [-63.61, -38.41],
  'venezuela': [-66.58, 6.42], 'colombia': [-74.29, 4.57],
  'syria': [38.99, 34.80], 'iraq': [43.67, 33.22],
  'afghanistan': [67.70, 33.93], 'myanmar': [95.95, 16.87],
  'taiwan': [120.97, 23.70], 'philippines': [121.77, 12.88],
  'poland': [19.14, 51.91], 'hungary': [19.50, 47.16],
  'serbia': [21.00, 44.01], 'libya': [17.22, 26.33],
  'sudan': [30.21, 12.86], 'somalia': [46.19, 5.15],
  'yemen': [48.51, 15.55], 'lebanon': [35.86, 33.85],
  'canada': [-96.80, 56.13], 'chile': [-71.54, -35.67],
  'peru': [-75.01, -9.19], 'bolivia': [-64.96, -16.29],
  'romania': [24.96, 45.94], 'niger': [8.08, 17.60],
  'spain': [-3.74, 40.46], 'italy': [12.56, 41.87],
  'greece': [21.82, 39.07], 'sweden': [18.64, 60.12],
  'norway': [8.46, 60.47], 'finland': [25.74, 61.92],
  'kazakhstan': [66.92, 48.01], 'uzbekistan': [63.94, 41.37],
  'bangladesh': [90.35, 23.68], 'sri lanka': [80.77, 7.87],
  'nepal': [84.12, 28.39], 'thailand': [100.99, 15.87],
  'vietnam': [108.27, 14.05], 'malaysia': [109.70, 4.21],
  'singapore': [103.81, 1.35], 'new zealand': [174.88, -40.90],
  'morocco': [-7.09, 31.79], 'algeria': [1.65, 28.03],
  'tunisia': [9.53, 33.88], 'kenya': [37.90, 0.02],
  'tanzania': [34.88, -6.36], 'ghana': [-1.02, 7.94],
  'angola': [17.87, -11.20], 'mozambique': [35.52, -18.66],
  'cuba': [-79.52, 21.52], 'haiti': [-72.28, 18.97],
  'ecuador': [-77.81, -1.83], 'paraguay': [-58.44, -23.44],
  'uruguay': [-55.76, -32.52], 'panama': [-80.78, 8.99],
  'costa rica': [-83.75, 9.74], 'guatemala': [-90.23, 15.78],
  'honduras': [-86.24, 15.20], 'el salvador': [-88.89, 13.79],
  'nicaragua': [-85.20, 12.87], 'qatar': [51.18, 25.35],
  'kuwait': [47.48, 29.31], 'bahrain': [50.55, 26.07],
  'oman': [57.55, 21.51], 'jordan': [36.23, 30.58],
  'armenia': [44.94, 40.07], 'azerbaijan': [47.57, 40.14],
  'georgia': [43.35, 42.31], 'belarus': [27.95, 53.71],
  'moldova': [28.37, 47.41], 'latvia': [24.60, 56.88],
  'lithuania': [23.88, 55.17], 'estonia': [25.01, 58.60],
  'slovakia': [19.70, 48.67], 'czechia': [15.47, 49.82],
  'austria': [14.55, 47.52], 'switzerland': [8.23, 46.82],
  'belgium': [4.47, 50.50], 'netherlands': [5.29, 52.13],
  'portugal': [-8.22, 39.40], 'denmark': [9.50, 56.26],
  'senegal': [-14.45, 14.50], 'mali': [-1.98, 17.57],
  'burkina faso': [-1.56, 12.36], 'cameroon': [12.35, 5.69],
  'dr congo': [23.65, -2.87], 'congo': [15.83, -0.22],
  'zimbabwe': [29.15, -19.02], 'zambia': [27.85, -13.13],
  'madagascar': [46.87, -18.77], 'rwanda': [29.87, -1.94],
  'uganda': [32.29, 1.37], 'chad': [18.73, 15.45],
  'central african republic': [20.94, 6.61],
  'south sudan': [31.30, 6.88], 'eritrea': [39.78, 15.18],
  'djibouti': [42.59, 11.83], 'burundi': [29.92, -3.37]
}

const FLAGS = {
  'united states':'🇺🇸', 'us':'🇺🇸', 'usa':'🇺🇸',
  'china':'🇨🇳', 'russia':'🇷🇺', 'india':'🇮🇳',
  'iran':'🇮🇷', 'israel':'🇮🇱', 'ukraine':'🇺🇦',
  'germany':'🇩🇪', 'france':'🇫🇷', 'uk':'🇬🇧',
  'japan':'🇯🇵', 'saudi arabia':'🇸🇦', 'turkey':'🇹🇷',
  'pakistan':'🇵🇰', 'brazil':'🇧🇷', 'european union':'🇪🇺',
  'north korea':'🇰🇵', 'south korea':'🇰🇷',
  'egypt':'🇪🇬', 'nigeria':'🇳🇬', 'south africa':'🇿🇦',
  'ethiopia':'🇪🇹', 'indonesia':'🇮🇩', 'australia':'🇦🇺',
  'mexico':'🇲🇽', 'argentina':'🇦🇷', 'venezuela':'🇻🇪',
  'colombia':'🇨🇴', 'syria':'🇸🇾', 'iraq':'🇮🇶',
  'afghanistan':'🇦🇫', 'myanmar':'🇲🇲', 'taiwan':'🇹🇼',
  'philippines':'🇵🇭', 'poland':'🇵🇱', 'hungary':'🇭🇺',
  'serbia':'🇷🇸', 'libya':'🇱🇾', 'sudan':'🇸🇩',
  'somalia':'🇸🇴', 'yemen':'🇾🇪', 'lebanon':'🇱🇧',
  'canada':'🇨🇦', 'chile':'🇨🇱', 'peru':'🇵🇪',
  'bolivia':'🇧🇴', 'romania':'🇷🇴', 'niger':'🇳🇪',
  'spain':'🇪🇸', 'italy':'🇮🇹', 'greece':'🇬🇷',
  'sweden':'🇸🇪', 'norway':'🇳🇴', 'finland':'🇫🇮',
  'kazakhstan':'🇰🇿', 'bangladesh':'🇧🇩', 'thailand':'🇹🇭',
  'vietnam':'🇻🇳', 'malaysia':'🇲🇾', 'singapore':'🇸🇬',
  'new zealand':'🇳🇿', 'morocco':'🇲🇦', 'kenya':'🇰🇪',
  'ghana':'🇬🇭', 'cuba':'🇨🇺', 'ecuador':'🇪🇨',
  'qatar':'🇶🇦', 'kuwait':'🇰🇼', 'oman':'🇴🇲',
  'jordan':'🇯🇴', 'armenia':'🇦🇲', 'georgia':'🇬🇪',
  'belarus':'🇧🇾', 'austria':'🇦🇹', 'switzerland':'🇨🇭',
  'belgium':'🇧🇪', 'netherlands':'🇳🇱', 'portugal':'🇵🇹',
  'denmark':'🇩🇰', 'other nations':'🌐'
}

const SEV_COLOR = s => s >= 8 ? '#ef4444' : s >= 6 ? '#f59e0b' : '#22c55e'

export default function WorldMap({ events, selectedNews, onCountryClick }) {
  const svgRef = useRef()

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const w = window.innerWidth
    const h = window.innerHeight

    svg.selectAll('*').remove()
    svg.attr('width', w).attr('height', h)

    const projection = d3.geoNaturalEarth1()
      .scale(w / 6.2)
      .translate([w / 2, h / 2])

    const path = d3.geoPath().projection(projection)

    svg.append('rect').attr('width', w).attr('height', h).attr('fill', '#020817')

    // Star field
    for (let i = 0; i < 250; i++) {
      svg.append('circle')
        .attr('cx', Math.random() * w)
        .attr('cy', Math.random() * h)
        .attr('r', Math.random() * 1.2)
        .attr('fill', 'white')
        .attr('opacity', Math.random() * 0.5 + 0.1)
    }

    // Graticule
    const graticule = d3.geoGraticule()
    svg.append('path')
      .datum(graticule())
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(56,189,248,0.05)')
      .attr('stroke-width', 0.4)

    // Scan line
    const scanLine = svg.append('rect')
      .attr('x', 0).attr('width', w).attr('height', 2)
      .attr('fill', 'rgba(56,189,248,0.06)').attr('y', -10)

    function animateScan() {
      scanLine.attr('y', -10)
        .transition().duration(10000).ease(d3.easeLinear)
        .attr('y', h + 10).on('end', animateScan)
    }
    animateScan()

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        const countries = topojson.feature(world, world.objects.countries)

        svg.selectAll('.country')
          .data(countries.features)
          .enter().append('path')
          .attr('class', 'country')
          .attr('d', path)
          .attr('fill', '#0a1628')
          .attr('stroke', 'rgba(56,189,248,0.12)')
          .attr('stroke-width', 0.5)
          .style('cursor', 'pointer')
          .on('mouseover', function() {
            d3.select(this).transition().duration(150)
              .attr('fill', '#0f2040')
              .attr('stroke', 'rgba(56,189,248,0.35)')
              .attr('stroke-width', 1)
          })
          .on('mouseout', function() {
            d3.select(this).transition().duration(150)
              .attr('fill', '#0a1628')
              .attr('stroke', 'rgba(56,189,248,0.12)')
              .attr('stroke-width', 0.5)
          })
          .on('click', function(event) {
            const [mx, my] = d3.pointer(event)
            let closest = null, minDist = Infinity
            Object.entries(COORDS).forEach(([name, coords]) => {
              const p = projection(coords)
              if (!p) return
              const dist = Math.hypot(p[0] - mx, p[1] - my)
              if (dist < minDist) { minDist = dist; closest = name }
            })
            if (closest && minDist < 200) onCountryClick(closest)
          })

        // Animated arcs for selected news
        if (selectedNews) {
          const newsCountries = selectedNews.countries || []
          const sourceKey = newsCountries[0]?.toLowerCase()
          const sourceCoords = sourceKey ? COORDS[sourceKey] : null

          newsCountries.forEach((country, i) => {
            if (i === 0) return
            const targetCoords = COORDS[country.toLowerCase()]
            if (!sourceCoords || !targetCoords) return
            const p1 = projection(sourceCoords)
            const p2 = projection(targetCoords)
            if (!p1 || !p2) return

            const cx = (p1[0] + p2[0]) / 2
            const cy = (p1[1] + p2[1]) / 2 - 70
            const arcD = `M${p1[0]},${p1[1]} Q${cx},${cy} ${p2[0]},${p2[1]}`

            svg.append('path').attr('d', arcD).attr('fill', 'none')
              .attr('stroke', 'rgba(251,191,36,0.12)').attr('stroke-width', 4)

            const arcLen = 400
            const arc = svg.append('path').attr('d', arcD).attr('fill', 'none')
              .attr('stroke', '#fbbf24').attr('stroke-width', 1.5)
              .attr('stroke-dasharray', `${arcLen} ${arcLen}`)
              .attr('stroke-dashoffset', arcLen).attr('opacity', 0.8)

            function animateArc() {
              arc.attr('stroke-dashoffset', arcLen)
                .transition().duration(1800).ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0).on('end', animateArc)
            }
            animateArc()

            const movingDot = svg.append('circle').attr('r', 3)
              .attr('fill', '#fbbf24').attr('opacity', 0)
              .style('filter', 'drop-shadow(0 0 4px #fbbf24)')

            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            pathEl.setAttribute('d', arcD)

            let t = 0
            function moveDot() {
              t = (t + 0.004) % 1
              const pt = pathEl.getPointAtLength(t * pathEl.getTotalLength())
              movingDot.attr('cx', pt.x).attr('cy', pt.y).attr('opacity', 1)
              requestAnimationFrame(moveDot)
            }
            moveDot()
          })

          if (sourceCoords) {
            const [sx, sy] = projection(sourceCoords)
            ;[40, 28, 16].forEach((r, i) => {
              svg.append('circle').attr('cx', sx).attr('cy', sy).attr('r', r)
                .attr('fill', 'none').attr('stroke', '#ef4444')
                .attr('stroke-width', 0.8).attr('opacity', 0.08 + i * 0.04)
            })
          }
        }

        // Event markers
        const allCountries = [...new Set(events.flatMap(e => e.countries || []))]

        allCountries.forEach(country => {
          const coords = COORDS[country.toLowerCase()]
          if (!coords) return
          const projected = projection(coords)
          if (!projected) return
          const [x, y] = projected

          const countryEvs = events.filter(e =>
            e.countries?.some(c => c.toLowerCase() === country.toLowerCase())
          )
          const maxSev = Math.max(...countryEvs.map(e => parseInt(e.severity) || 5))
          const color = SEV_COLOR(maxSev)
          const flag = FLAGS[country.toLowerCase()] || '📍'

          const isNewsCountry = selectedNews?.countries?.some(
            c => c.toLowerCase() === country.toLowerCase()
          )
          const dotColor = isNewsCountry ? '#fbbf24' : color
          const dotSize = isNewsCountry ? 7 : 5

          // Pulse rings
          ;[18, 12, 7].forEach((r, i) => {
            const ring = svg.append('circle')
              .attr('cx', x).attr('cy', y).attr('r', 4)
              .attr('fill', 'none').attr('stroke', dotColor)
              .attr('stroke-width', 0.5).attr('opacity', 0)

            function pulseRing() {
              ring.attr('r', 4).attr('opacity', 0.9)
                .transition().duration(2200 + i * 500).ease(d3.easeCubicOut)
                .attr('r', r).attr('opacity', 0).on('end', pulseRing)
            }
            setTimeout(() => pulseRing(), i * 350)
          })

          // Core dot
          svg.append('circle')
            .attr('cx', x).attr('cy', y).attr('r', dotSize)
            .attr('fill', dotColor).attr('stroke', '#020817')
            .attr('stroke-width', 1.5).style('cursor', 'pointer')
            .style('filter', `drop-shadow(0 0 ${isNewsCountry ? 10 : 6}px ${dotColor})`)
            .on('mouseover', function() {
              d3.select(this).transition().duration(150).attr('r', dotSize + 3)
            })
            .on('mouseout', function() {
              d3.select(this).transition().duration(150).attr('r', dotSize)
            })
            .on('click', () => onCountryClick(country))

          // Flag above dot
          svg.append('text')
            .attr('x', x).attr('y', y - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('pointer-events', 'none')
            .text(flag)

          // Label below dot — offset right to avoid overlap
          svg.append('text')
            .attr('x', x + 8).attr('y', y + 20)
            .attr('text-anchor', 'start')
            .attr('fill', isNewsCountry
              ? 'rgba(251,191,36,0.9)'
              : 'rgba(148,163,184,0.55)')
            .attr('font-size', '7px')
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('letter-spacing', '0.08em')
            .attr('pointer-events', 'none')
            .text(country.length > 12
              ? country.toUpperCase().slice(0, 10) + '..'
              : country.toUpperCase())

          // Event count badge
          if (countryEvs.length > 1) {
            svg.append('circle')
              .attr('cx', x + 8).attr('cy', y - 8).attr('r', 6)
              .attr('fill', '#0a1628').attr('stroke', dotColor).attr('stroke-width', 1)

            svg.append('text')
              .attr('x', x + 8).attr('y', y - 5)
              .attr('text-anchor', 'middle')
              .attr('fill', dotColor).attr('font-size', '6px')
              .attr('font-family', 'JetBrains Mono, monospace')
              .attr('font-weight', '700').attr('pointer-events', 'none')
              .text(countryEvs.length)
          }
        })
      })
      .catch(err => console.error('Map load error:', err))

  }, [events, selectedNews])

  return (
    <svg ref={svgRef}
      style={{position:'absolute', inset:0, width:'100%', height:'100%'}} />
  )
}