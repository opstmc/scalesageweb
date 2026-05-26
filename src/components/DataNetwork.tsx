import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Tier = 'hub' | 'mid' | 'leaf'

const NODE_CONFIG: Record<Tier, { count: number; radius: number; glowRadius: number; opacity: number }> = {
  hub:  { count: 8,  radius: 3.5, glowRadius: 28, opacity: 0.9 },
  mid:  { count: 20, radius: 1.8, glowRadius: 14, opacity: 0.6 },
  leaf: { count: 40, radius: 0.8, glowRadius: 0,  opacity: 0.35 },
}

const MAX_EDGE_DIST = 180
const REPEL_RADIUS = 160
const MAX_FORCE = 22
const MAX_PACKETS = 20

interface Node {
  tier: Tier
  x: number; y: number
  ox: number; oy: number
  tx: number; ty: number
  vx: number; vy: number
  alpha: number
  targetAlpha: number
  phase: number
  speed: number
  brightness: number
}

interface Edge {
  a: number; b: number
  cxOffset: number; cyOffset: number
  color: string
  brightness: number
}

interface Packet {
  edge: number
  t: number
  speed: number
  color: 'teal' | 'ice'
  opacity: number
}

function rand(min: number, max: number) { return min + Math.random() * (max - min) }

function generatePosition(side: 'left' | 'right' | 'centre' | 'footer', w: number, h: number) {
  const padding = 60
  if (side === 'centre') {
    // concentric from centre
    const cx = w / 2, cy = h / 2
    const r = rand(40, Math.min(w, h) * 0.42)
    const a = Math.random() * Math.PI * 2
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
  }
  if (side === 'footer') {
    return { x: rand(padding, w - padding), y: rand(padding, h - padding) }
  }
  const inSide = Math.random() < 0.6
  let x: number
  if (side === 'left') {
    x = inSide ? rand(padding, w * 0.45) : rand(w * 0.45, w - padding)
  } else {
    x = inSide ? rand(w * 0.55, w - padding) : rand(padding, w * 0.55)
  }
  const y = rand(padding, h - padding)
  return { x, y }
}

function sideForChapter(c: number): 'left' | 'right' | 'centre' | 'footer' {
  if (c === 8) return 'footer'
  if (c === 4 || c === 5 || c === 6 || c === 7) return 'centre'
  if ([0, 2].includes(c)) return 'left'
  return 'right'
}

export function DataNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = window.innerWidth
    let H = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const nodes: Node[] = []
    const tiers: Tier[] = ['hub', 'mid', 'leaf']
    let currentChapter = 0
    let chapterFooterFade = false

    tiers.forEach(tier => {
      const cfg = NODE_CONFIG[tier]
      for (let i = 0; i < cfg.count; i++) {
        const p = generatePosition('left', W, H)
        nodes.push({
          tier,
          x: p.x, y: p.y,
          ox: p.x, oy: p.y,
          tx: p.x, ty: p.y,
          vx: 0, vy: 0,
          alpha: cfg.opacity,
          targetAlpha: cfg.opacity,
          phase: Math.random() * Math.PI * 2,
          speed: rand(0.3, 0.8),
          brightness: 1,
        })
      }
    })

    let edges: Edge[] = []
    function rebuildEdges() {
      edges = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          if (a.tier === 'leaf' && b.tier === 'leaf') continue
          const dx = a.tx - b.tx, dy = a.ty - b.ty
          const d = Math.hypot(dx, dy)
          if (d > MAX_EDGE_DIST) continue
          const hubHub = a.tier === 'hub' && b.tier === 'hub'
          let color: string
          if (hubHub) color = 'rgba(0, 229, 195, 0.14)'
          else if (a.tier === 'hub' || b.tier === 'hub') color = 'rgba(0, 229, 195, 0.10)'
          else if (a.tier === 'mid' || b.tier === 'mid') color = 'rgba(100, 160, 255, 0.07)'
          else color = 'rgba(180, 210, 255, 0.04)'
          edges.push({
            a: i, b: j,
            cxOffset: rand(-30, 30),
            cyOffset: rand(-30, 30),
            color,
            brightness: hubHub ? 0.14 : 0.10,
          })
        }
      }
    }
    rebuildEdges()

    const packets: Packet[] = []
    let frameCount = 0
    let spawnEvery = 9

    let mouseX = -9999, mouseY = -9999
    function onMove(e: MouseEvent) { mouseX = e.clientX; mouseY = e.clientY }
    function onLeave() { mouseX = -9999; mouseY = -9999 }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', resize)

    function transitionNetwork(newChapter: number) {
      const side = sideForChapter(newChapter)
      chapterFooterFade = newChapter === 8
      const isQuiet = newChapter === 4 || newChapter === 5
      nodes.forEach(n => {
        const p = generatePosition(side, W, H)
        n.tx = p.x
        n.ty = p.y
        n.ox = p.x
        n.oy = p.y
        const baseAlpha = NODE_CONFIG[n.tier].opacity
        n.targetAlpha = chapterFooterFade ? 0.15 : (isQuiet ? baseAlpha * 0.6 : baseAlpha)
      })
      // edges will be rebuilt after a short delay (phase 2)
      setTimeout(rebuildEdges, 450)
    }

    const st = ScrollTrigger.create({
      trigger: '#pin-wrap',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const newChapter = Math.min(Math.floor(self.progress * 9), 8)
        if (newChapter !== currentChapter) {
          currentChapter = newChapter
          transitionNetwork(newChapter)
        }
      },
    })

    // initial positions for chapter 0
    transitionNetwork(0)

    function getPosOnEdge(edge: Edge, t: number) {
      const a = nodes[edge.a], b = nodes[edge.b]
      const mx = (a.x + b.x) / 2 + edge.cxOffset
      const my = (a.y + b.y) / 2 + edge.cyOffset
      const u = 1 - t
      const x = u * u * a.x + 2 * u * t * mx + t * t * b.x
      const y = u * u * a.y + 2 * u * t * my + t * t * b.y
      return { x, y }
    }

    let animId = 0
    let time = 0

    function draw() {
      animId = requestAnimationFrame(draw)
      time += 0.016
      frameCount++
      ctx.clearRect(0, 0, W, H)

      // update nodes
      for (const n of nodes) {
        // ease ox/oy toward tx/ty
        n.ox += (n.tx - n.ox) * 0.04
        n.oy += (n.ty - n.oy) * 0.04
        n.alpha += (n.targetAlpha - n.alpha) * 0.03

        // mouse repulsion
        const dx = n.x - mouseX
        const dy = n.y - mouseY
        const dist = Math.hypot(dx, dy)
        if (dist < REPEL_RADIUS && dist > 0.1) {
          const force = (1 - dist / REPEL_RADIUS) * MAX_FORCE
          const eased = force * force
          n.vx += (dx / dist) * eased * 0.06
          n.vy += (dy / dist) * eased * 0.06
        }
        n.vx *= 0.88
        n.vy *= 0.88
        n.x += n.vx + (n.ox - n.x) * 0.055
        n.y += n.vy + (n.oy - n.y) * 0.055

        if (n.tier === 'hub') {
          n.brightness = 1
        } else {
          n.brightness = 1
        }
      }

      // draw edges
      ctx.lineWidth = 0.3
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b]
        if (a.alpha < 0.1 && b.alpha < 0.1) continue
        const mx = (a.x + b.x) / 2 + e.cxOffset
        const my = (a.y + b.y) / 2 + e.cyOffset
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.quadraticCurveTo(mx, my, b.x, b.y)
        ctx.strokeStyle = e.color
        ctx.stroke()
      }

      // draw nodes
      for (const n of nodes) {
        const cfg = NODE_CONFIG[n.tier]
        const a = n.alpha * n.brightness
        if (cfg.glowRadius > 0) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, cfg.glowRadius)
          if (n.tier === 'hub') {
            g.addColorStop(0, `rgba(0, 229, 195, ${0.55 * a})`)
            g.addColorStop(0.4, `rgba(0, 229, 195, ${0.12 * a})`)
            g.addColorStop(1, 'rgba(0, 229, 195, 0)')
          } else {
            g.addColorStop(0, `rgba(168, 196, 255, ${0.35 * a})`)
            g.addColorStop(1, 'rgba(168, 196, 255, 0)')
          }
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(n.x, n.y, cfg.glowRadius, 0, Math.PI * 2)
          ctx.fill()
        }
        // core
        ctx.beginPath()
        ctx.arc(n.x, n.y, cfg.radius, 0, Math.PI * 2)
        if (n.tier === 'hub') ctx.fillStyle = `rgba(0, 229, 195, ${a})`
        else if (n.tier === 'mid') ctx.fillStyle = `rgba(168, 196, 255, ${a})`
        else ctx.fillStyle = `rgba(230, 240, 255, ${a})`
        ctx.fill()
      }

      // spawn packets
      const quietChapter = currentChapter === 4 || currentChapter === 5
      if (!chapterFooterFade && !quietChapter && edges.length > 0 && packets.length < MAX_PACKETS && frameCount % spawnEvery === 0) {
        spawnEvery = 8 + Math.floor(Math.random() * 3)
        // pick edge whose nodes are visible
        for (let tries = 0; tries < 6; tries++) {
          const edgeIdx = Math.floor(Math.random() * edges.length)
          const e = edges[edgeIdx]
          if (nodes[e.a].alpha > 0.2 && nodes[e.b].alpha > 0.2) {
            packets.push({
              edge: edgeIdx,
              t: 0,
              speed: rand(0.002, 0.005),
              color: Math.random() < 0.7 ? 'teal' : 'ice',
              opacity: rand(0.6, 0.95),
            })
            break
          }
        }
      }

      // draw + advance packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        if (p.edge >= edges.length) { packets.splice(i, 1); continue }
        p.t += p.speed
        if (p.t >= 1) { packets.splice(i, 1); continue }
        const e = edges[p.edge]
        const head = getPosOnEdge(e, p.t)
        const tailT = Math.max(0, p.t - 0.10)
        const tail = getPosOnEdge(e, tailT)
        const baseCol = p.color === 'teal' ? '0, 229, 195' : '126, 184, 255'
        const grd = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y)
        grd.addColorStop(0, `rgba(${baseCol}, 0)`)
        grd.addColorStop(1, `rgba(${baseCol}, ${p.opacity})`)
        ctx.beginPath()
        ctx.moveTo(tail.x, tail.y)
        ctx.lineTo(head.x, head.y)
        ctx.strokeStyle = grd
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(head.x, head.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.opacity * 1.2)})`
        ctx.fill()
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', resize)
      st.kill()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
