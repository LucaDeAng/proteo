import { useCallback, useRef } from 'react'
import { SlideWrapper, SlideTag, SlideTitle, SlideBody, MilestoneCard } from '../SlideWrapper'
import { useCanvas } from '../canvas/useCanvas'
import { eras, milestones, t } from '../../data/aiHistory'
import { useLang } from '../../hooks/useLang'

interface BigBangSlideProps {
  active: boolean
  index: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  angle: number
  speed: number
  baseSpeed: number
  color: [number, number, number] // rgb
  delay: number // stagger the explosion
}

function lerpColor(t: number): [number, number, number] {
  // white -> gold -> amber
  if (t < 0.3) {
    const p = t / 0.3
    return [
      255,
      Math.round(255 - p * 10),
      Math.round(255 - p * 120),
    ]
  } else if (t < 0.7) {
    const p = (t - 0.3) / 0.4
    return [
      Math.round(245 - p * 10),
      Math.round(245 * (1 - p * 0.35)),
      Math.round(135 - p * 70),
    ]
  } else {
    const p = (t - 0.7) / 0.3
    return [
      Math.round(235 - p * 30),
      Math.round(160 - p * 60),
      Math.round(65 - p * 30),
    ]
  }
}

const NUM_PARTICLES = 200

export default function BigBangSlide({ active, index }: BigBangSlideProps) {
  const { lang } = useLang()
  const era = eras.find((e) => e.id === 'bigbang')!
  const turingTest = milestones.find((m) => m.id === 'turing-test')!
  const dartmouth = milestones.find((m) => m.id === 'dartmouth')!

  const particlesRef = useRef<Particle[]>([])
  const initedRef = useRef(false)
  const explosionStartRef = useRef<number | null>(null)
  const wasActiveRef = useRef(false)

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2
    const cy = h / 2

    // Detect activation edge to trigger explosion
    if (active && !wasActiveRef.current) {
      explosionStartRef.current = t
      // Reset particles to center
      initedRef.current = false
    }
    wasActiveRef.current = active

    // Initialize / reset particles at center
    if (!initedRef.current) {
      particlesRef.current = Array.from({ length: NUM_PARTICLES }, () => {
        const angle = Math.random() * Math.PI * 2
        const baseSpeed = Math.random() * 2.5 + 0.5
        const colorT = Math.random()
        return {
          x: cx + (Math.random() - 0.5) * 6,
          y: cy + (Math.random() - 0.5) * 6,
          vx: 0,
          vy: 0,
          size: Math.random() * 2.5 + 0.8,
          life: 1,
          maxLife: Math.random() * 0.4 + 0.6,
          angle,
          speed: 0,
          baseSpeed,
          color: lerpColor(colorT),
          delay: Math.random() * 0.6, // stagger over 0.6 seconds
        }
      })
      initedRef.current = true
    }

    // Dark background
    ctx.fillStyle = '#050008'
    ctx.fillRect(0, 0, w, h)

    const explosionT = explosionStartRef.current !== null ? t - explosionStartRef.current : 0
    const explosionActive = explosionT > 0

    // Central glow rings
    if (explosionActive) {
      const ringExpand = Math.min(explosionT * 0.8, 1)

      // Outer ring - expanding shockwave
      const ringR = ringExpand * Math.min(w, h) * 0.4
      if (ringR > 0) {
        const ringGrad = ctx.createRadialGradient(cx, cy, ringR * 0.85, cx, cy, ringR)
        const ringAlpha = Math.max(0, 0.15 * (1 - ringExpand))
        ringGrad.addColorStop(0, 'rgba(245, 158, 11, 0)')
        ringGrad.addColorStop(0.5, `rgba(245, 158, 11, ${ringAlpha})`)
        ringGrad.addColorStop(1, 'rgba(245, 158, 11, 0)')
        ctx.fillStyle = ringGrad
        ctx.beginPath()
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Central core glow - always present but stronger during explosion
    const coreIntensity = explosionActive
      ? Math.max(0.05, 1 - explosionT * 0.3)
      : 0.6 + Math.sin(t * 1.5) * 0.2

    const coreR = explosionActive
      ? 30 + Math.min(explosionT * 20, 60)
      : 25 + Math.sin(t * 1.2) * 8

    // Bright center glow
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${coreIntensity * 0.8})`)
    coreGrad.addColorStop(0.15, `rgba(255, 240, 180, ${coreIntensity * 0.5})`)
    coreGrad.addColorStop(0.4, `rgba(245, 158, 11, ${coreIntensity * 0.2})`)
    coreGrad.addColorStop(1, 'rgba(245, 158, 11, 0)')
    ctx.fillStyle = coreGrad
    ctx.beginPath()
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
    ctx.fill()

    // Secondary warm glow
    const warmR = coreR * 2.5
    const warmGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, warmR)
    warmGrad.addColorStop(0, `rgba(251, 191, 36, ${coreIntensity * 0.12})`)
    warmGrad.addColorStop(0.5, `rgba(245, 158, 11, ${coreIntensity * 0.05})`)
    warmGrad.addColorStop(1, 'rgba(245, 158, 11, 0)')
    ctx.fillStyle = warmGrad
    ctx.beginPath()
    ctx.arc(cx, cy, warmR, 0, Math.PI * 2)
    ctx.fill()

    // Update and draw particles
    for (const p of particlesRef.current) {
      if (explosionActive) {
        const particleT = explosionT - p.delay
        if (particleT > 0) {
          // Acceleration curve: fast burst then gradual slowdown
          const accel = Math.min(particleT * 3, 1)
          p.speed = p.baseSpeed * accel
          p.vx = Math.cos(p.angle) * p.speed
          p.vy = Math.sin(p.angle) * p.speed

          p.x += p.vx
          p.y += p.vy

          // Life fades based on distance from center
          const dx = p.x - cx
          const dy = p.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = Math.min(w, h) * 0.5
          p.life = Math.max(0, p.maxLife * (1 - dist / maxDist))
        }
      } else {
        // Pre-explosion: particles cluster at center with gentle jitter
        const jitter = Math.sin(t * 3 + p.angle * 10) * 2
        p.x = cx + Math.cos(p.angle) * (3 + jitter)
        p.y = cy + Math.sin(p.angle) * (3 + jitter)
        p.life = p.maxLife * 0.8
      }

      if (p.life <= 0) continue

      const [r, g, b] = p.color
      const alpha = p.life * 0.9

      // Particle glow
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`
      ctx.shadowBlur = 6

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fill()
    }

    ctx.shadowBlur = 0

    // Trailing sparks near particles (subtle)
    if (explosionActive && explosionT < 4) {
      for (let i = 0; i < particlesRef.current.length; i += 4) {
        const p = particlesRef.current[i]
        if (p.life <= 0.1 || p.speed < 0.3) continue
        const [r, g, b] = p.color
        const trailAlpha = p.life * 0.3
        ctx.beginPath()
        ctx.arc(
          p.x - p.vx * 2,
          p.y - p.vy * 2,
          p.size * 0.5,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${trailAlpha})`
        ctx.fill()
      }
    }
  }, [active])

  const canvasRef = useCanvas({ draw, active })

  const canvasEl = (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ display: 'block' }}
    />
  )

  return (
    <SlideWrapper
      index={index}
      active={active}
      canvas={canvasEl}
      chapter={era.chapter}
      quote={t(era.quote.text, lang)}
      quoteAuthor={`${era.quote.author}, ${era.quote.year}`}
      stats={era.stats.map(s => ({ value: s.value, label: t(s.label, lang), color: era.glowColor }))}
    >
      <div className="pl-8 sm:pl-16 md:pl-24 pr-6 max-w-3xl">
        <SlideTag>{era.period}</SlideTag>
        <SlideTitle>
          <span
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t(era.name, lang)}
          </span>
          <span className="text-white/30 ml-3 text-2xl sm:text-3xl md:text-4xl font-light italic">
            {t(era.cosmicName, lang)}
          </span>
        </SlideTitle>
        <SlideBody>{t(era.description, lang)}</SlideBody>

        <MilestoneCard
          year={turingTest.year}
          name={turingTest.name}
          description={t(turingTest.description, lang)}
          color={era.glowColor}
        />
        <MilestoneCard
          year={dartmouth.year}
          name={dartmouth.name}
          description={t(dartmouth.description, lang)}
          color={era.glowColor}
        />
      </div>
    </SlideWrapper>
  )
}
