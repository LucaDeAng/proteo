import { useCallback, useRef, useMemo } from 'react'
import { createNoise2D } from 'simplex-noise'
import { SlideWrapper, SlideTag, SlideTitle, SlideBody, MilestoneCard } from '../SlideWrapper'
import { useCanvas } from '../canvas/useCanvas'
import { eras, milestones } from '../../data/aiHistory'

interface IntelligenceSlideProps {
  active: boolean
  index: number
}

interface Node {
  baseX: number
  baseY: number
  x: number
  y: number
  size: number
  phase: number
  speed: number
  hue: number
  connections: number[]
  branchDepth: number
}

interface AmbientParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  drift: number
  hue: number
}

export default function IntelligenceSlide({ active, index }: IntelligenceSlideProps) {
  const nodesRef = useRef<Node[]>([])
  const particlesRef = useRef<AmbientParticle[]>([])
  const initedRef = useRef(false)
  const prevSizeRef = useRef({ w: 0, h: 0 })
  const noise2D = useMemo(() => createNoise2D(), [])

  const era = eras.find(e => e.id === 'intelligence')!
  const alexnet = milestones.find(m => m.id === 'alexnet')!
  const transformer = milestones.find(m => m.id === 'transformer')!

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const nodeCount = 48
    const particleCount = 80

    // Reinitialize if size changed significantly (e.g. resize)
    const sizeChanged =
      Math.abs(prevSizeRef.current.w - w) > 50 || Math.abs(prevSizeRef.current.h - h) > 50

    if (!initedRef.current || nodesRef.current.length === 0 || sizeChanged) {
      prevSizeRef.current = { w, h }

      // Place nodes using organic mycelium-like branching from multiple seed points
      const nodes: Node[] = []
      const seedCount = 5
      const seedCenters: { x: number; y: number }[] = []

      for (let s = 0; s < seedCount; s++) {
        const angle = (s / seedCount) * Math.PI * 2 + noise2D(s * 2, 0) * 0.8
        const dist = 60 + noise2D(s, 5) * 80
        seedCenters.push({
          x: w * 0.55 + Math.cos(angle) * dist,
          y: h * 0.5 + Math.sin(angle) * dist,
        })
      }

      for (let i = 0; i < nodeCount; i++) {
        // Assign to a seed cluster, with organic deviation
        const seed = seedCenters[i % seedCount]
        const branchAngle =
          (i / nodeCount) * Math.PI * 2 + noise2D(i * 0.5, 0) * 2.0
        const branchDist =
          40 + Math.random() * Math.min(w, h) * 0.28 + noise2D(i * 0.3, 1) * 80
        const bx = seed.x + Math.cos(branchAngle) * branchDist
        const by = seed.y + Math.sin(branchAngle) * branchDist

        nodes.push({
          baseX: bx,
          baseY: by,
          x: bx,
          y: by,
          size: 1.5 + Math.random() * 3.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.2 + Math.random() * 0.8,
          hue: 270 + Math.random() * 60, // purple to magenta
          connections: [],
          branchDepth: Math.floor(Math.random() * 3),
        })
      }

      // Build connections: each node connects to 2-4 nearest neighbors, biased toward
      // nodes in the same cluster for a more organic mycelium look
      for (let i = 0; i < nodes.length; i++) {
        const dists: { idx: number; d: number }[] = []
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue
          const dx = nodes[i].baseX - nodes[j].baseX
          const dy = nodes[i].baseY - nodes[j].baseY
          let d = Math.sqrt(dx * dx + dy * dy)
          // Bias: same cluster nodes get a distance bonus
          if (i % seedCount === j % seedCount) d *= 0.7
          dists.push({ idx: j, d })
        }
        dists.sort((a, b) => a.d - b.d)
        const count = 2 + Math.floor(Math.random() * 3)
        nodes[i].connections = dists.slice(0, count).map(d => d.idx)
      }

      nodesRef.current = nodes

      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.0 + 0.2,
        alpha: Math.random() * 0.12 + 0.02,
        drift: Math.random() * Math.PI * 2,
        hue: 260 + Math.random() * 80,
      }))

      initedRef.current = true
    }

    // Background
    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    // Multi-layered nebula background for depth
    const nb1 = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.55)
    nb1.addColorStop(0, 'rgba(168, 85, 247, 0.07)')
    nb1.addColorStop(0.3, 'rgba(140, 50, 200, 0.04)')
    nb1.addColorStop(0.6, 'rgba(100, 30, 160, 0.02)')
    nb1.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = nb1
    ctx.fillRect(0, 0, w, h)

    const nb2 = ctx.createRadialGradient(w * 0.65, h * 0.55, 0, w * 0.65, h * 0.55, Math.max(w, h) * 0.4)
    nb2.addColorStop(0, 'rgba(236, 72, 153, 0.05)')
    nb2.addColorStop(0.5, 'rgba(200, 50, 130, 0.02)')
    nb2.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = nb2
    ctx.fillRect(0, 0, w, h)

    const nodes = nodesRef.current

    // Update node positions with organic drift using noise
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      const nx = noise2D(i * 0.1 + t * 0.12, t * 0.06) * 25
      const ny = noise2D(i * 0.1 + 100, t * 0.06 + 50) * 25
      n.x = n.baseX + nx
      n.y = n.baseY + ny
    }

    // Draw connections with bioluminescent glow and traveling signal pulses
    ctx.lineCap = 'round'
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      for (const j of n.connections) {
        if (j <= i) continue // draw each connection once
        const m = nodes[j]
        const dx = m.x - n.x
        const dy = m.y - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 320) continue

        const baseAlpha = Math.max(0, 0.14 - dist * 0.00035)

        // Draw the connection as a slightly curved line for organic feel
        const midX = (n.x + m.x) / 2 + noise2D(i * 0.2, j * 0.2) * 15
        const midY = (n.y + m.y) / 2 + noise2D(j * 0.2, i * 0.2) * 15

        // Connection glow (wider, softer)
        ctx.lineWidth = 3
        const glowGrad = ctx.createLinearGradient(n.x, n.y, m.x, m.y)
        glowGrad.addColorStop(0, `hsla(${n.hue}, 80%, 65%, ${baseAlpha * 0.3})`)
        glowGrad.addColorStop(0.5, `hsla(${(n.hue + m.hue) / 2}, 85%, 70%, ${baseAlpha * 0.4})`)
        glowGrad.addColorStop(1, `hsla(${m.hue}, 80%, 65%, ${baseAlpha * 0.3})`)
        ctx.strokeStyle = glowGrad
        ctx.beginPath()
        ctx.moveTo(n.x, n.y)
        ctx.quadraticCurveTo(midX, midY, m.x, m.y)
        ctx.stroke()

        // Core line (thinner, brighter)
        ctx.lineWidth = 0.8
        const coreGrad = ctx.createLinearGradient(n.x, n.y, m.x, m.y)
        coreGrad.addColorStop(0, `hsla(${n.hue}, 80%, 75%, ${baseAlpha})`)
        coreGrad.addColorStop(1, `hsla(${m.hue}, 80%, 75%, ${baseAlpha})`)
        ctx.strokeStyle = coreGrad
        ctx.beginPath()
        ctx.moveTo(n.x, n.y)
        ctx.quadraticCurveTo(midX, midY, m.x, m.y)
        ctx.stroke()

        // Traveling signal pulses - multiple per connection at different speeds
        for (let p = 0; p < 2; p++) {
          const pulseSpeed = 0.3 + (i % 5) * 0.08 + p * 0.15
          const pulsePhase = (t * pulseSpeed + i * 0.7 + j * 0.3 + p * 1.5) % 3.5
          if (pulsePhase < 1) {
            const progress = pulsePhase
            // Evaluate quadratic bezier at progress
            const inv = 1 - progress
            const px = inv * inv * n.x + 2 * inv * progress * midX + progress * progress * m.x
            const py = inv * inv * n.y + 2 * inv * progress * midY + progress * progress * m.y
            const pulseAlpha = Math.sin(progress * Math.PI) * 0.7

            const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 10)
            pulseGrad.addColorStop(0, `hsla(310, 90%, 85%, ${pulseAlpha})`)
            pulseGrad.addColorStop(0.4, `hsla(290, 85%, 75%, ${pulseAlpha * 0.5})`)
            pulseGrad.addColorStop(1, 'hsla(300, 90%, 80%, 0)')
            ctx.fillStyle = pulseGrad
            ctx.beginPath()
            ctx.arc(px, py, 10, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    // Draw nodes with bioluminescent coral glow
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      const pulse = Math.sin(t * n.speed + n.phase) * 0.5 + 0.5
      const r = n.size + pulse * 2.5

      // Outer bioluminescent halo
      const haloR = r * 6
      const haloGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR)
      haloGrad.addColorStop(0, `hsla(${n.hue}, 90%, 78%, ${0.08 + pulse * 0.08})`)
      haloGrad.addColorStop(0.3, `hsla(${n.hue}, 85%, 70%, ${0.04 + pulse * 0.04})`)
      haloGrad.addColorStop(1, `hsla(${n.hue}, 85%, 70%, 0)`)
      ctx.fillStyle = haloGrad
      ctx.beginPath()
      ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2)
      ctx.fill()

      // Mid glow
      const midR = r * 3
      const midGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, midR)
      midGrad.addColorStop(0, `hsla(${n.hue}, 85%, 80%, ${0.2 + pulse * 0.2})`)
      midGrad.addColorStop(0.5, `hsla(${n.hue}, 80%, 70%, ${0.08 + pulse * 0.06})`)
      midGrad.addColorStop(1, `hsla(${n.hue}, 80%, 65%, 0)`)
      ctx.fillStyle = midGrad
      ctx.beginPath()
      ctx.arc(n.x, n.y, midR, 0, Math.PI * 2)
      ctx.fill()

      // Bright core
      const coreGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r)
      coreGrad.addColorStop(0, `hsla(${n.hue - 10}, 50%, 97%, ${0.75 + pulse * 0.25})`)
      coreGrad.addColorStop(0.4, `hsla(${n.hue}, 75%, 80%, ${0.5 + pulse * 0.2})`)
      coreGrad.addColorStop(1, `hsla(${n.hue}, 80%, 55%, 0)`)
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Ambient particle field
    for (const p of particlesRef.current) {
      p.x += p.vx + Math.sin(t * 0.25 + p.drift) * 0.08
      p.y += p.vy + Math.cos(t * 0.2 + p.drift) * 0.08
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      const twinkle = Math.sin(t * 1.8 + p.drift) * 0.5 + 0.5
      const a = p.alpha * (0.3 + twinkle * 0.7)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, 60%, 80%, ${a})`
      ctx.fill()
    }
  }, [noise2D])

  const canvasRef = useCanvas({ draw, active })

  const canvasEl = (
    <canvas ref={canvasRef} className="h-full w-full" style={{ display: 'block' }} />
  )

  return (
    <SlideWrapper index={index} active={active} canvas={canvasEl}>
      <div className="pl-8 sm:pl-16 md:pl-24 pr-4 max-w-2xl">
        <SlideTag>{era.period}</SlideTag>
        <SlideTitle>
          <span
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {era.name}
          </span>
          <br />
          <span className="text-white/60 text-2xl sm:text-3xl md:text-4xl font-light">
            {era.cosmicName}
          </span>
        </SlideTitle>
        <SlideBody>{era.description}</SlideBody>
        <MilestoneCard
          year={alexnet.year}
          name={alexnet.name}
          description={alexnet.description}
          color="#a855f7"
        />
        <MilestoneCard
          year={transformer.year}
          name={transformer.name}
          description={transformer.description}
          color="#ec4899"
        />
      </div>
    </SlideWrapper>
  )
}
