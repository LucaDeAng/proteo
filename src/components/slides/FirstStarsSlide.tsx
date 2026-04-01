import { useCallback, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'
import { useCanvas } from '../canvas/useCanvas'
import { SlideWrapper, SlideTag, SlideTitle, SlideBody, MilestoneCard } from '../SlideWrapper'
import { eras, milestones } from '../../data/aiHistory'

interface Props {
  active: boolean
  index: number
}

interface Star {
  x: number
  y: number
  radius: number
  color: string
  colorRGB: [number, number, number]
  phase: number
  igniteDelay: number
  hasCross: boolean
  pulseSpeed: number
}

interface NebulaCloud {
  cx: number
  cy: number
  rx: number
  ry: number
  hue: number
  saturation: number
  baseAlpha: number
  driftPhaseX: number
  driftPhaseY: number
  driftSpeed: number
}

const STAR_COUNT = 60
const NEBULA_COUNT = 7
const WARM_COLORS: Array<{ hex: string; rgb: [number, number, number] }> = [
  { hex: '#ea580c', rgb: [234, 88, 12] },
  { hex: '#f59e0b', rgb: [245, 158, 11] },
  { hex: '#f97316', rgb: [249, 115, 22] },
  { hex: '#fbbf24', rgb: [251, 191, 36] },
  { hex: '#d97706', rgb: [217, 119, 6] },
  { hex: '#eab308', rgb: [234, 179, 8] },
]

function initStars(w: number, h: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < STAR_COUNT; i++) {
    const big = Math.random() < 0.15
    const c = WARM_COLORS[Math.floor(Math.random() * WARM_COLORS.length)]
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: big ? 2.5 + Math.random() * 3.5 : 0.8 + Math.random() * 2,
      color: c.hex,
      colorRGB: c.rgb,
      phase: Math.random() * Math.PI * 2,
      igniteDelay: Math.random() * 3.5,
      hasCross: big,
      pulseSpeed: 1.5 + Math.random() * 3,
    })
  }
  return stars
}

function initNebulae(w: number, h: number): NebulaCloud[] {
  const clouds: NebulaCloud[] = []
  for (let i = 0; i < NEBULA_COUNT; i++) {
    clouds.push({
      cx: Math.random() * w,
      cy: Math.random() * h,
      rx: 100 + Math.random() * 200,
      ry: 80 + Math.random() * 160,
      hue: 10 + Math.random() * 35, // warm hues: orange-amber-gold
      saturation: 60 + Math.random() * 30,
      baseAlpha: 0.02 + Math.random() * 0.04,
      driftPhaseX: Math.random() * 100,
      driftPhaseY: Math.random() * 100,
      driftSpeed: 0.015 + Math.random() * 0.02,
    })
  }
  return clouds
}

export default function FirstStarsSlide({ active, index }: Props) {
  const noise2D = useRef(createNoise2D()).current
  const starsRef = useRef<Star[] | null>(null)
  const nebulaeRef = useRef<NebulaCloud[] | null>(null)
  const prevSizeRef = useRef({ w: 0, h: 0 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      if (
        !starsRef.current ||
        Math.abs(prevSizeRef.current.w - w) > 50 ||
        Math.abs(prevSizeRef.current.h - h) > 50
      ) {
        starsRef.current = initStars(w, h)
        nebulaeRef.current = initNebulae(w, h)
        prevSizeRef.current = { w, h }
      }
      const stars = starsRef.current
      const nebulae = nebulaeRef.current!

      // Background: dark warm-tinted space with purple/brown tint
      ctx.fillStyle = '#0a0510'
      ctx.fillRect(0, 0, w, h)

      // Deep warm vignette
      const vigGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.9)
      vigGrad.addColorStop(0, 'rgba(40, 15, 30, 0.12)')
      vigGrad.addColorStop(0.5, 'rgba(25, 8, 20, 0.08)')
      vigGrad.addColorStop(1, 'rgba(5, 2, 8, 0.3)')
      ctx.fillStyle = vigGrad
      ctx.fillRect(0, 0, w, h)

      // Nebula clouds using simplex noise - semi-transparent radial gradients drifting slowly
      for (const cloud of nebulae) {
        const driftX = noise2D(cloud.driftPhaseX, t * cloud.driftSpeed) * 60
        const driftY = noise2D(cloud.driftPhaseY, t * cloud.driftSpeed * 0.8) * 50
        const cx = cloud.cx + driftX
        const cy = cloud.cy + driftY

        // Pulsing alpha driven by noise
        const alphaMod = noise2D(cloud.driftPhaseX + 50, t * 0.04)
        const alpha = cloud.baseAlpha + alphaMod * 0.015

        // Elongated nebula via transform
        ctx.save()
        ctx.translate(cx, cy)
        const scaleX = cloud.rx / Math.max(cloud.rx, cloud.ry)
        const scaleY = cloud.ry / Math.max(cloud.rx, cloud.ry)
        ctx.scale(scaleX, scaleY)

        const r = Math.max(cloud.rx, cloud.ry)
        const nebGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
        nebGrad.addColorStop(0, `hsla(${cloud.hue}, ${cloud.saturation}%, 45%, ${alpha + 0.03})`)
        nebGrad.addColorStop(0.3, `hsla(${cloud.hue}, ${cloud.saturation - 10}%, 35%, ${alpha + 0.01})`)
        nebGrad.addColorStop(0.6, `hsla(${cloud.hue + 10}, ${cloud.saturation - 20}%, 25%, ${alpha * 0.6})`)
        nebGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = nebGrad
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      // Secondary ambient warm glow zones (large, very subtle)
      const ambientGlow1 = ctx.createRadialGradient(w * 0.25, h * 0.6, 0, w * 0.25, h * 0.6, w * 0.45)
      ambientGlow1.addColorStop(0, 'rgba(120, 50, 10, 0.04)')
      ambientGlow1.addColorStop(1, 'transparent')
      ctx.fillStyle = ambientGlow1
      ctx.fillRect(0, 0, w, h)

      const ambientGlow2 = ctx.createRadialGradient(w * 0.75, h * 0.35, 0, w * 0.75, h * 0.35, w * 0.4)
      ambientGlow2.addColorStop(0, 'rgba(100, 40, 60, 0.03)')
      ambientGlow2.addColorStop(1, 'transparent')
      ctx.fillStyle = ambientGlow2
      ctx.fillRect(0, 0, w, h)

      // Stars
      for (const star of stars) {
        // Ignition: star scales from 0 to 1 based on time vs igniteDelay
        const ignitionProgress = Math.min(1, Math.max(0, (t - star.igniteDelay) / 1.2))
        if (ignitionProgress <= 0) continue

        // Ease out cubic
        const eased = 1 - Math.pow(1 - ignitionProgress, 3)
        const currentRadius = star.radius * eased
        const flicker = 0.82 + 0.18 * Math.sin(t * star.pulseSpeed + star.phase)
        const alpha = eased * flicker

        // Outermost soft bloom
        const bloomR = currentRadius * 8
        const bloomGrad = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, bloomR
        )
        const [r, g, b] = star.colorRGB
        bloomGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.06})`)
        bloomGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.02})`)
        bloomGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = bloomGrad
        ctx.beginPath()
        ctx.arc(star.x, star.y, bloomR, 0, Math.PI * 2)
        ctx.fill()

        // Outer glow halo
        const glowRadius = currentRadius * 4.5
        const glowGrad = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowRadius
        )
        glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.25})`)
        glowGrad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`)
        glowGrad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.04})`)
        glowGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Core - bright center with warm falloff
        const coreGrad = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, currentRadius
        )
        coreGrad.addColorStop(0, `rgba(255, 255, 240, ${alpha})`)
        coreGrad.addColorStop(0.35, `rgba(255, 245, 220, ${alpha * 0.85})`)
        coreGrad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`)
        coreGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = coreGrad
        ctx.beginPath()
        ctx.arc(star.x, star.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()

        // Cross spikes (lens flare) for big stars
        if (star.hasCross && eased > 0.4) {
          const spikeAlpha = (eased - 0.4) * 1.67 * flicker * 0.5
          const spikeLen = currentRadius * 8
          const spikeWidth = currentRadius * 0.4

          ctx.save()
          ctx.globalAlpha = spikeAlpha

          // Draw 4 spike directions using tapered gradients
          const angles = [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]
          const lengths = [spikeLen, spikeLen, spikeLen * 0.5, spikeLen * 0.5]
          const widths = [spikeWidth, spikeWidth, spikeWidth * 0.7, spikeWidth * 0.7]

          for (let s = 0; s < 4; s++) {
            const angle = angles[s]
            const len = lengths[s]
            const sw = widths[s]

            // Each spike is a thin quadrilateral
            const dx = Math.cos(angle)
            const dy = Math.sin(angle)
            const nx = -dy
            const ny = dx

            // Gradient along the spike
            const gx1 = star.x - dx * len
            const gy1 = star.y - dy * len
            const gx2 = star.x + dx * len
            const gy2 = star.y + dy * len
            const spikeGrad = ctx.createLinearGradient(gx1, gy1, gx2, gy2)
            spikeGrad.addColorStop(0, 'transparent')
            spikeGrad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.4)`)
            spikeGrad.addColorStop(0.5, `rgba(255, 250, 235, 0.8)`)
            spikeGrad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.4)`)
            spikeGrad.addColorStop(1, 'transparent')

            ctx.fillStyle = spikeGrad
            ctx.beginPath()
            ctx.moveTo(star.x - dx * len, star.y - dy * len)
            ctx.lineTo(star.x + nx * sw, star.y + ny * sw)
            ctx.lineTo(star.x + dx * len, star.y + dy * len)
            ctx.lineTo(star.x - nx * sw, star.y - ny * sw)
            ctx.closePath()
            ctx.fill()
          }

          ctx.restore()
        }
      }

      // Top and bottom subtle warm vignette overlay
      const edgeTop = ctx.createLinearGradient(0, 0, 0, h * 0.15)
      edgeTop.addColorStop(0, 'rgba(10, 5, 16, 0.4)')
      edgeTop.addColorStop(1, 'transparent')
      ctx.fillStyle = edgeTop
      ctx.fillRect(0, 0, w, h * 0.15)

      const edgeBot = ctx.createLinearGradient(0, h * 0.85, 0, h)
      edgeBot.addColorStop(0, 'transparent')
      edgeBot.addColorStop(1, 'rgba(10, 5, 16, 0.4)')
      ctx.fillStyle = edgeBot
      ctx.fillRect(0, h * 0.85, w, h * 0.15)
    },
    [noise2D],
  )

  const canvasRef = useCanvas({ draw, active })

  const era = eras.find(e => e.id === 'stars')!
  const perceptron = milestones.find(m => m.id === 'perceptron')!
  const eliza = milestones.find(m => m.id === 'eliza')!

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
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 40%, #f59e0b 70%, #d97706 100%)',
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
          year={perceptron.year}
          name={perceptron.name}
          description={perceptron.description}
          color={era.color}
        />
        <MilestoneCard
          year={eliza.year}
          name={eliza.name}
          description={eliza.description}
          color={era.color}
        />
      </div>
    </SlideWrapper>
  )
}
