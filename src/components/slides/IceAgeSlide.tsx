import { useCallback, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'
import { useCanvas } from '../canvas/useCanvas'
import { SlideWrapper, SlideTag, SlideTitle, SlideBody, MilestoneCard } from '../SlideWrapper'
import { eras, milestones, t } from '../../data/aiHistory'
import { useLang } from '../../hooks/useLang'

interface Props {
  active: boolean
  index: number
}

interface Crystal {
  x: number
  y: number
  size: number
  rotation: number
  growDelay: number
  driftSpeed: number
  alpha: number
  noiseOffsetX: number
  noiseOffsetY: number
  innerComplexity: number // 0-1, how many sub-branches
}

interface Snowflake {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  phase: number
  opacity: number
}

interface DyingStar {
  x: number
  y: number
  radius: number
  phase: number
  flickerSpeed: number
  colorTemp: number // 0=warm, 1=cold
}

const CRYSTAL_COUNT = 22
const SNOW_COUNT = 100
const DYING_STAR_COUNT = 15

function initCrystals(w: number, h: number): Crystal[] {
  const crystals: Crystal[] = []
  for (let i = 0; i < CRYSTAL_COUNT; i++) {
    crystals.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 18 + Math.random() * 50,
      rotation: Math.random() * Math.PI,
      growDelay: Math.random() * 5,
      driftSpeed: 0.08 + Math.random() * 0.25,
      alpha: 0.06 + Math.random() * 0.14,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000,
      innerComplexity: 0.3 + Math.random() * 0.7,
    })
  }
  return crystals
}

function initSnow(w: number, h: number): Snowflake[] {
  const flakes: Snowflake[] = []
  for (let i = 0; i < SNOW_COUNT; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 0.3 + Math.random() * 1.8,
      speed: 6 + Math.random() * 18,
      drift: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.15 + Math.random() * 0.4,
    })
  }
  return flakes
}

function initDyingStars(w: number, h: number): DyingStar[] {
  const stars: DyingStar[] = []
  for (let i = 0; i < DYING_STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 0.4 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      flickerSpeed: 1.5 + Math.random() * 6,
      colorTemp: Math.random(),
    })
  }
  return stars
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = rotation + (Math.PI / 3) * i
    const px = x + Math.cos(angle) * size
    const py = y + Math.sin(angle) * size
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

export default function IceAgeSlide({ active, index }: Props) {
  const { lang } = useLang()
  const noise2D = useRef(createNoise2D()).current
  const crystalsRef = useRef<Crystal[] | null>(null)
  const snowRef = useRef<Snowflake[] | null>(null)
  const dyingStarsRef = useRef<DyingStar[] | null>(null)
  const prevSizeRef = useRef({ w: 0, h: 0 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      if (
        !crystalsRef.current ||
        Math.abs(prevSizeRef.current.w - w) > 50 ||
        Math.abs(prevSizeRef.current.h - h) > 50
      ) {
        crystalsRef.current = initCrystals(w, h)
        snowRef.current = initSnow(w, h)
        dyingStarsRef.current = initDyingStars(w, h)
        prevSizeRef.current = { w, h }
      }
      const crystals = crystalsRef.current
      const snow = snowRef.current!
      const dyingStars = dyingStarsRef.current!

      // Background: deep cold abyss
      ctx.fillStyle = '#01080f'
      ctx.fillRect(0, 0, w, h)

      // Cold atmospheric haze - layered
      const haze1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.7)
      haze1.addColorStop(0, 'rgba(10, 35, 70, 0.10)')
      haze1.addColorStop(0.5, 'rgba(6, 20, 45, 0.06)')
      haze1.addColorStop(1, 'transparent')
      ctx.fillStyle = haze1
      ctx.fillRect(0, 0, w, h)

      const haze2 = ctx.createRadialGradient(w * 0.7, h * 0.7, 0, w * 0.7, h * 0.7, w * 0.5)
      haze2.addColorStop(0, 'rgba(8, 30, 60, 0.08)')
      haze2.addColorStop(1, 'transparent')
      ctx.fillStyle = haze2
      ctx.fillRect(0, 0, w, h)

      // Subtle noise-based fog texture
      const fogDensity = 0.015
      for (let i = 0; i < 5; i++) {
        const fx = w * (0.1 + 0.8 * (i / 5)) + noise2D(i * 3.7, t * 0.02) * 100
        const fy = h * (0.2 + 0.6 * Math.sin(i * 1.2)) + noise2D(i * 3.7 + 50, t * 0.015) * 80
        const fr = 150 + noise2D(i * 2.1, t * 0.03) * 50
        const fogGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr)
        fogGrad.addColorStop(0, `rgba(20, 50, 90, ${fogDensity})`)
        fogGrad.addColorStop(0.6, `rgba(15, 40, 70, ${fogDensity * 0.5})`)
        fogGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = fogGrad
        ctx.fillRect(0, 0, w, h)
      }

      // Dying stars - dim, flickering, fading away
      for (const star of dyingStars) {
        const flicker = Math.max(0, Math.sin(t * star.flickerSpeed + star.phase))
        // Irregular flickering: sometimes they almost vanish
        const irregularity = 0.5 + 0.5 * Math.sin(t * star.flickerSpeed * 0.37 + star.phase * 2.1)
        const dimAlpha = flicker * irregularity * 0.25
        if (dimAlpha < 0.015) continue

        // Color ranges from warm-white (dying) to cold blue-white
        const r = Math.round(120 + star.colorTemp * 40)
        const g = Math.round(140 + star.colorTemp * 30)
        const b = Math.round(180 + star.colorTemp * 30)

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dimAlpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()

        // Faint glow
        const glowGrad = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 5
        )
        glowGrad.addColorStop(0, `rgba(${r}, ${g + 20}, ${b + 20}, ${dimAlpha * 0.3})`)
        glowGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius * 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Ice crystals - hexagonal geometric forms with organic growth
      for (const crystal of crystals) {
        const growProgress = Math.min(1, Math.max(0, (t - crystal.growDelay) / 3.5))
        if (growProgress <= 0) continue

        const eased = 1 - Math.pow(1 - growProgress, 2.5)
        const currentSize = crystal.size * eased

        // Organic drift from noise
        const nx = crystal.x + noise2D(crystal.noiseOffsetX, t * 0.06) * 18
        const ny = crystal.y + noise2D(crystal.noiseOffsetY, t * 0.06) * 18
        const rot = crystal.rotation + t * 0.03 + noise2D(crystal.noiseOffsetX + 200, t * 0.02) * 0.2

        ctx.save()
        ctx.globalAlpha = crystal.alpha * eased

        // Outer hexagon - main structure
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)'
        ctx.lineWidth = 1.2
        drawHexagon(ctx, nx, ny, currentSize, rot)
        ctx.stroke()

        // Second ring
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'
        ctx.lineWidth = 0.8
        drawHexagon(ctx, nx, ny, currentSize * 0.65, rot)
        ctx.stroke()

        // Inner ring
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)'
        ctx.lineWidth = 0.5
        drawHexagon(ctx, nx, ny, currentSize * 0.3, rot)
        ctx.stroke()

        // Connecting branches from center to vertices
        for (let i = 0; i < 6; i++) {
          const angle = rot + (Math.PI / 3) * i
          const branchNoise = noise2D(i + crystal.noiseOffsetX * 0.01, t * 0.08)
          const branchLen = currentSize * (0.85 + branchNoise * 0.25)

          // Main branch line
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)'
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(nx, ny)
          ctx.lineTo(nx + Math.cos(angle) * branchLen, ny + Math.sin(angle) * branchLen)
          ctx.stroke()

          // Sub-branches at 60% along main branch
          if (eased > 0.5 && crystal.innerComplexity > 0.4) {
            const subAlpha = crystal.alpha * (eased - 0.5) * 2
            const subAngle1 = angle + Math.PI / 6
            const subAngle2 = angle - Math.PI / 6
            const subLen = branchLen * 0.35
            const bx = nx + Math.cos(angle) * branchLen * 0.6
            const by = ny + Math.sin(angle) * branchLen * 0.6

            ctx.globalAlpha = subAlpha
            ctx.strokeStyle = 'rgba(125, 211, 252, 0.25)'
            ctx.lineWidth = 0.4
            ctx.beginPath()
            ctx.moveTo(bx, by)
            ctx.lineTo(bx + Math.cos(subAngle1) * subLen, by + Math.sin(subAngle1) * subLen)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(bx, by)
            ctx.lineTo(bx + Math.cos(subAngle2) * subLen, by + Math.sin(subAngle2) * subLen)
            ctx.stroke()

            // Tertiary micro-branches for complex crystals
            if (eased > 0.75 && crystal.innerComplexity > 0.7) {
              const bx2 = nx + Math.cos(angle) * branchLen * 0.85
              const by2 = ny + Math.sin(angle) * branchLen * 0.85
              const microLen = subLen * 0.5
              ctx.globalAlpha = subAlpha * 0.5
              ctx.strokeStyle = 'rgba(186, 230, 253, 0.2)'
              ctx.lineWidth = 0.3
              ctx.beginPath()
              ctx.moveTo(bx2, by2)
              ctx.lineTo(bx2 + Math.cos(subAngle1) * microLen, by2 + Math.sin(subAngle1) * microLen)
              ctx.stroke()
              ctx.beginPath()
              ctx.moveTo(bx2, by2)
              ctx.lineTo(bx2 + Math.cos(subAngle2) * microLen, by2 + Math.sin(subAngle2) * microLen)
              ctx.stroke()
            }
          }
        }

        // Center glow - icy core
        ctx.globalAlpha = 1
        const centerGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, currentSize * 0.35)
        centerGrad.addColorStop(0, `rgba(200, 235, 255, ${0.1 * eased})`)
        centerGrad.addColorStop(0.5, `rgba(56, 189, 248, ${0.04 * eased})`)
        centerGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = centerGrad
        ctx.beginPath()
        ctx.arc(nx, ny, currentSize * 0.35, 0, Math.PI * 2)
        ctx.fill()

        // Outer icy aura
        const auraGrad = ctx.createRadialGradient(nx, ny, currentSize * 0.5, nx, ny, currentSize * 1.3)
        auraGrad.addColorStop(0, `rgba(14, 165, 233, ${0.02 * eased})`)
        auraGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = auraGrad
        ctx.beginPath()
        ctx.arc(nx, ny, currentSize * 1.3, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      // Snow particles drifting downward
      for (const flake of snow) {
        const y = (flake.y + t * flake.speed) % h
        const xNoise = noise2D(flake.x * 0.008, t * 0.08 + flake.phase) * 25
        const xDrift = flake.x + Math.sin(t * 0.4 + flake.drift) * 15 + xNoise
        const x = ((xDrift % w) + w) % w

        const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.8 + flake.phase))
        const a = twinkle * flake.opacity

        // Snow particle with soft glow
        ctx.fillStyle = `rgba(200, 220, 255, ${a})`
        ctx.beginPath()
        ctx.arc(x, y, flake.radius, 0, Math.PI * 2)
        ctx.fill()

        // Tiny glow around larger flakes
        if (flake.radius > 1.2) {
          const snowGlow = ctx.createRadialGradient(x, y, 0, x, y, flake.radius * 3)
          snowGlow.addColorStop(0, `rgba(180, 210, 255, ${a * 0.2})`)
          snowGlow.addColorStop(1, 'transparent')
          ctx.fillStyle = snowGlow
          ctx.beginPath()
          ctx.arc(x, y, flake.radius * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Frost overlay at edges - cold vignette
      const edgeGrad = ctx.createLinearGradient(0, 0, 0, h)
      edgeGrad.addColorStop(0, 'rgba(4, 18, 40, 0.35)')
      edgeGrad.addColorStop(0.12, 'transparent')
      edgeGrad.addColorStop(0.88, 'transparent')
      edgeGrad.addColorStop(1, 'rgba(4, 18, 40, 0.45)')
      ctx.fillStyle = edgeGrad
      ctx.fillRect(0, 0, w, h)

      // Side frost
      const sideGradL = ctx.createLinearGradient(0, 0, w * 0.08, 0)
      sideGradL.addColorStop(0, 'rgba(6, 20, 50, 0.25)')
      sideGradL.addColorStop(1, 'transparent')
      ctx.fillStyle = sideGradL
      ctx.fillRect(0, 0, w * 0.08, h)

      const sideGradR = ctx.createLinearGradient(w * 0.92, 0, w, 0)
      sideGradR.addColorStop(0, 'transparent')
      sideGradR.addColorStop(1, 'rgba(6, 20, 50, 0.25)')
      ctx.fillStyle = sideGradR
      ctx.fillRect(w * 0.92, 0, w * 0.08, h)
    },
    [noise2D],
  )

  const canvasRef = useCanvas({ draw, active })

  const era = eras.find(e => e.id === 'ice')!
  const lighthill = milestones.find(m => m.id === 'lighthill')!
  const backprop = milestones.find(m => m.id === 'backprop-rumelhart')!

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
              background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 35%, #7dd3fc 65%, #bae6fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t(era.name, lang)}
          </span>
          <br />
          <span className="text-white/40 text-2xl sm:text-3xl md:text-4xl font-light">
            {t(era.cosmicName, lang)}
          </span>
        </SlideTitle>
        <SlideBody>{t(era.description, lang)}</SlideBody>
        <MilestoneCard
          year={lighthill.year}
          name={lighthill.name}
          description={t(lighthill.description, lang)}
          color={era.color}
        />
        <MilestoneCard
          year={backprop.year}
          name={backprop.name}
          description={t(backprop.description, lang)}
          color={era.color}
        />
      </div>
    </SlideWrapper>
  )
}
