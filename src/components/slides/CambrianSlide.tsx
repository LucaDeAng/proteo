import { useCallback, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'
import { useCanvas } from '../canvas/useCanvas'
import { SlideWrapper, SlideTag, SlideTitle, SlideBody, MilestoneCard } from '../SlideWrapper'
import { eras, milestones } from '../../data/aiHistory'

interface Props {
  active: boolean
  index: number
}

interface Organism {
  x: number
  y: number
  radius: number
  innerRings: number
  color: [number, number, number]
  phase: number
  spawnTime: number
  driftAngle: number
  driftSpeed: number
  noiseOffsetX: number
  noiseOffsetY: number
  hasTentacles: boolean
  tentacleCount: number
  rotationSpeed: number
  pulseSpeed: number
}

interface Connection {
  fromIdx: number
  toIdx: number
  strength: number
}

interface Spiral {
  x: number
  y: number
  radius: number
  color: [number, number, number]
  rotationSpeed: number
  arms: number
  spawnTime: number
  noiseOffset: number
  alpha: number
}

const INITIAL_ORGANISMS = 35
const MAX_ORGANISMS = 80
const SPIRAL_COUNT = 6

const COLORS: Array<[number, number, number]> = [
  [16, 185, 129],   // emerald #10b981
  [20, 184, 166],   // teal #14b8a6
  [6, 182, 212],    // cyan #06b6d4
  [52, 211, 153],   // emerald-light #34d399
  [45, 212, 191],   // teal-light #2dd4bf
  [234, 179, 8],    // yellow accent #eab308
  [249, 115, 22],   // orange accent #f97316
  [34, 197, 94],    // green #22c55e
]

function createOrganism(w: number, h: number, spawnTime: number): Organism {
  const c = COLORS[Math.floor(Math.random() * COLORS.length)]
  const big = Math.random() < 0.2
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: big ? 12 + Math.random() * 20 : 4 + Math.random() * 10,
    innerRings: Math.floor(Math.random() * 3) + 1,
    color: c,
    phase: Math.random() * Math.PI * 2,
    spawnTime,
    driftAngle: Math.random() * Math.PI * 2,
    driftSpeed: 5 + Math.random() * 15,
    noiseOffsetX: Math.random() * 1000,
    noiseOffsetY: Math.random() * 1000,
    hasTentacles: big || Math.random() < 0.3,
    tentacleCount: Math.floor(Math.random() * 5) + 3,
    rotationSpeed: 0.2 + Math.random() * 0.6,
    pulseSpeed: 1 + Math.random() * 2,
  }
}

function initOrganisms(w: number, h: number): Organism[] {
  const orgs: Organism[] = []
  for (let i = 0; i < INITIAL_ORGANISMS; i++) {
    orgs.push(createOrganism(w, h, Math.random() * -2))
  }
  return orgs
}

function initSpirals(w: number, h: number): Spiral[] {
  const spirals: Spiral[] = []
  for (let i = 0; i < SPIRAL_COUNT; i++) {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)]
    spirals.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 30 + Math.random() * 60,
      color: c,
      rotationSpeed: 0.15 + Math.random() * 0.3,
      arms: 2 + Math.floor(Math.random() * 3),
      spawnTime: Math.random() * 3,
      noiseOffset: Math.random() * 1000,
      alpha: 0.06 + Math.random() * 0.08,
    })
  }
  return spirals
}

export default function CambrianSlide({ active, index }: Props) {
  const noise2D = useRef(createNoise2D()).current
  const organismsRef = useRef<Organism[] | null>(null)
  const spiralsRef = useRef<Spiral[] | null>(null)
  const connectionsRef = useRef<Connection[]>([])
  const prevSizeRef = useRef({ w: 0, h: 0 })
  const lastSpawnRef = useRef(0)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      if (
        !organismsRef.current ||
        Math.abs(prevSizeRef.current.w - w) > 50 ||
        Math.abs(prevSizeRef.current.h - h) > 50
      ) {
        organismsRef.current = initOrganisms(w, h)
        spiralsRef.current = initSpirals(w, h)
        connectionsRef.current = []
        lastSpawnRef.current = 0
        prevSizeRef.current = { w, h }
      }

      const organisms = organismsRef.current
      const spirals = spiralsRef.current!

      // Proliferation: spawn new organisms over time
      if (t - lastSpawnRef.current > 0.8 && organisms.length < MAX_ORGANISMS) {
        organisms.push(createOrganism(w, h, t))
        lastSpawnRef.current = t

        // Rebuild connections periodically
        if (organisms.length % 5 === 0) {
          connectionsRef.current = []
          for (let i = 0; i < organisms.length; i++) {
            for (let j = i + 1; j < organisms.length; j++) {
              const dx = organisms[i].x - organisms[j].x
              const dy = organisms[i].y - organisms[j].y
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist < 120 && Math.random() < 0.3) {
                connectionsRef.current.push({ fromIdx: i, toIdx: j, strength: Math.random() * 0.5 + 0.1 })
              }
            }
          }
        }
      }

      // Background: deep dark primordial ocean
      ctx.fillStyle = '#020d12'
      ctx.fillRect(0, 0, w, h)

      // Layered organic background haze
      const haze1 = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.5)
      haze1.addColorStop(0, 'rgba(16, 80, 60, 0.08)')
      haze1.addColorStop(0.6, 'rgba(10, 50, 40, 0.04)')
      haze1.addColorStop(1, 'transparent')
      ctx.fillStyle = haze1
      ctx.fillRect(0, 0, w, h)

      const haze2 = ctx.createRadialGradient(w * 0.7, h * 0.6, 0, w * 0.7, h * 0.6, w * 0.45)
      haze2.addColorStop(0, 'rgba(6, 60, 80, 0.06)')
      haze2.addColorStop(1, 'transparent')
      ctx.fillStyle = haze2
      ctx.fillRect(0, 0, w, h)

      // Drifting bio-luminescent fog
      for (let i = 0; i < 4; i++) {
        const fx = w * (0.15 + 0.7 * (i / 4)) + noise2D(i * 5.3, t * 0.02) * 120
        const fy = h * (0.2 + 0.6 * Math.sin(i * 0.9 + 0.5)) + noise2D(i * 5.3 + 80, t * 0.018) * 100
        const fr = 120 + noise2D(i * 3.1, t * 0.025) * 60
        const hue = i % 2 === 0 ? 160 : 170
        const fogGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr)
        fogGrad.addColorStop(0, `hsla(${hue}, 60%, 30%, 0.03)`)
        fogGrad.addColorStop(0.5, `hsla(${hue}, 50%, 20%, 0.015)`)
        fogGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = fogGrad
        ctx.fillRect(0, 0, w, h)
      }

      // Spirals - rotating organic structures
      for (const spiral of spirals) {
        const age = t - spiral.spawnTime
        if (age < 0) continue
        const growIn = Math.min(1, age / 2)
        const eased = 1 - Math.pow(1 - growIn, 2)

        const sx = spiral.x + noise2D(spiral.noiseOffset, t * 0.03) * 30
        const sy = spiral.y + noise2D(spiral.noiseOffset + 100, t * 0.025) * 25
        const currentR = spiral.radius * eased
        const rot = t * spiral.rotationSpeed

        const [sr, sg, sb] = spiral.color

        ctx.save()
        ctx.globalAlpha = spiral.alpha * eased

        for (let arm = 0; arm < spiral.arms; arm++) {
          const armOffset = (Math.PI * 2 / spiral.arms) * arm
          ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, 0.3)`
          ctx.lineWidth = 1.2
          ctx.beginPath()

          for (let step = 0; step < 40; step++) {
            const frac = step / 40
            const angle = rot + armOffset + frac * Math.PI * 2.5
            const r = frac * currentR
            const px = sx + Math.cos(angle) * r
            const py = sy + Math.sin(angle) * r
            if (step === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.stroke()
        }

        // Center glow
        const cGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, currentR * 0.3)
        cGrad.addColorStop(0, `rgba(${sr}, ${sg}, ${sb}, ${0.15 * eased})`)
        cGrad.addColorStop(1, 'transparent')
        ctx.globalAlpha = 1
        ctx.fillStyle = cGrad
        ctx.beginPath()
        ctx.arc(sx, sy, currentR * 0.3, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      // Connections between nearby organisms
      for (const conn of connectionsRef.current) {
        if (conn.fromIdx >= organisms.length || conn.toIdx >= organisms.length) continue
        const a = organisms[conn.fromIdx]
        const b = organisms[conn.toIdx]

        const ageA = t - a.spawnTime
        const ageB = t - b.spawnTime
        if (ageA < 0 || ageB < 0) continue
        const alphaA = Math.min(1, ageA / 1.5)
        const alphaB = Math.min(1, ageB / 1.5)
        const connAlpha = conn.strength * Math.min(alphaA, alphaB) * 0.3

        const ax = a.x + noise2D(a.noiseOffsetX, t * 0.04) * 20
        const ay = a.y + noise2D(a.noiseOffsetY, t * 0.04) * 20
        const bx = b.x + noise2D(b.noiseOffsetX, t * 0.04) * 20
        const by = b.y + noise2D(b.noiseOffsetY, t * 0.04) * 20

        ctx.strokeStyle = `rgba(52, 211, 153, ${connAlpha})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        const mx = (ax + bx) / 2 + noise2D(conn.fromIdx + conn.toIdx * 7, t * 0.05) * 15
        const my = (ay + by) / 2 + noise2D(conn.fromIdx * 3 + conn.toIdx, t * 0.05) * 15
        ctx.moveTo(ax, ay)
        ctx.quadraticCurveTo(mx, my, bx, by)
        ctx.stroke()
      }

      // Organisms - abstract cell-like forms
      for (const org of organisms) {
        const age = t - org.spawnTime
        if (age < 0) continue

        const growIn = Math.min(1, age / 1.5)
        const eased = 1 - Math.pow(1 - growIn, 3)
        const currentR = org.radius * eased

        if (currentR < 0.5) continue

        // Position with organic drift
        const ox = org.x + noise2D(org.noiseOffsetX, t * 0.04) * 20 + Math.cos(org.driftAngle) * t * org.driftSpeed * 0.05
        const oy = org.y + noise2D(org.noiseOffsetY, t * 0.04) * 20 + Math.sin(org.driftAngle) * t * org.driftSpeed * 0.05
        const wx = ((ox % w) + w) % w
        const wy = ((oy % h) + h) % h

        const [r, g, b] = org.color
        const pulse = 0.85 + 0.15 * Math.sin(t * org.pulseSpeed + org.phase)
        const baseAlpha = eased * pulse

        // Outer glow / aura
        const auraR = currentR * 3
        const auraGrad = ctx.createRadialGradient(wx, wy, 0, wx, wy, auraR)
        auraGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.08})`)
        auraGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.03})`)
        auraGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = auraGrad
        ctx.beginPath()
        ctx.arc(wx, wy, auraR, 0, Math.PI * 2)
        ctx.fill()

        // Outer membrane
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.5})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(wx, wy, currentR, 0, Math.PI * 2)
        ctx.stroke()

        // Inner rings
        for (let ring = 1; ring <= org.innerRings; ring++) {
          const ringR = currentR * (1 - ring * 0.25)
          if (ringR < 1) continue
          const ringAlpha = baseAlpha * (0.3 + ring * 0.1)
          ctx.strokeStyle = `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, ${ringAlpha})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.arc(wx, wy, ringR, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Nucleus glow
        const nucleusR = currentR * 0.3
        const nucleusGrad = ctx.createRadialGradient(wx, wy, 0, wx, wy, nucleusR)
        nucleusGrad.addColorStop(0, `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, ${baseAlpha * 0.6})`)
        nucleusGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.25})`)
        nucleusGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = nucleusGrad
        ctx.beginPath()
        ctx.arc(wx, wy, nucleusR, 0, Math.PI * 2)
        ctx.fill()

        // Tentacle-like appendages
        if (org.hasTentacles && eased > 0.6) {
          const tentAlpha = (eased - 0.6) * 2.5 * pulse * 0.3
          const rot = t * org.rotationSpeed
          ctx.save()
          ctx.globalAlpha = tentAlpha

          for (let ti = 0; ti < org.tentacleCount; ti++) {
            const baseAngle = rot + (Math.PI * 2 / org.tentacleCount) * ti
            const tentLen = currentR * (1.8 + noise2D(org.noiseOffsetX + ti * 10, t * 0.1) * 0.8)

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(wx + Math.cos(baseAngle) * currentR, wy + Math.sin(baseAngle) * currentR)

            const ctrlAngle = baseAngle + noise2D(org.noiseOffsetX + ti * 5, t * 0.15) * 0.5
            const ctrlR = currentR + tentLen * 0.6
            const endAngle = baseAngle + noise2D(org.noiseOffsetY + ti * 5, t * 0.12) * 0.3
            const endR = currentR + tentLen

            ctx.quadraticCurveTo(
              wx + Math.cos(ctrlAngle) * ctrlR,
              wy + Math.sin(ctrlAngle) * ctrlR,
              wx + Math.cos(endAngle) * endR,
              wy + Math.sin(endAngle) * endR,
            )
            ctx.stroke()

            // Dot at tentacle tip
            ctx.fillStyle = `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, 0.5)`
            ctx.beginPath()
            ctx.arc(
              wx + Math.cos(endAngle) * endR,
              wy + Math.sin(endAngle) * endR,
              1.2,
              0, Math.PI * 2,
            )
            ctx.fill()
          }
          ctx.restore()
        }
      }

      // Floating micro-particles (spores/plankton)
      for (let i = 0; i < 50; i++) {
        const px = noise2D(i * 7.3, t * 0.02) * w * 0.5 + w * 0.5
        const py = noise2D(i * 7.3 + 200, t * 0.018) * h * 0.5 + h * 0.5
        const pa = 0.08 + 0.06 * Math.sin(t * 1.5 + i * 0.8)
        const ci = i % COLORS.length
        const [pr, pg, pb] = COLORS[ci]
        ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${pa})`
        ctx.beginPath()
        ctx.arc(px, py, 0.8, 0, Math.PI * 2)
        ctx.fill()
      }

      // Vignette
      const vigGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.3, w * 0.5, h * 0.5, w * 0.85)
      vigGrad.addColorStop(0, 'transparent')
      vigGrad.addColorStop(1, 'rgba(2, 13, 18, 0.5)')
      ctx.fillStyle = vigGrad
      ctx.fillRect(0, 0, w, h)
    },
    [noise2D],
  )

  const canvasRef = useCanvas({ draw, active })

  const era = eras.find(e => e.id === 'cambrian')!
  const deepBlue = milestones.find(m => m.id === 'deep-blue')!
  const imageNet = milestones.find(m => m.id === 'imagenet')!

  return (
    <SlideWrapper
      index={index}
      active={active}
      canvas={
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: 'block' }}
        />
      }
    >
      <div className="pl-8 sm:pl-16 md:pl-24 pr-6 max-w-3xl">
        <SlideTag>{era.period}</SlideTag>
        <SlideTitle>
          <span
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 35%, #06b6d4 65%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {era.name}
          </span>
          <br />
          <span className="text-white/40 text-2xl sm:text-3xl md:text-4xl font-light">
            {era.cosmicName}
          </span>
        </SlideTitle>
        <SlideBody>{era.description}</SlideBody>
        <MilestoneCard
          year={deepBlue.year}
          name={deepBlue.name}
          description={deepBlue.description}
          color={era.color}
        />
        <MilestoneCard
          year={imageNet.year}
          name={imageNet.name}
          description={imageNet.description}
          color={era.color}
        />
      </div>
    </SlideWrapper>
  )
}
