import { useCallback, useRef, useMemo } from 'react'
import { createNoise2D } from 'simplex-noise'
import { SlideWrapper, SlideTag, SlideTitle, SlideBody, MilestoneCard } from '../SlideWrapper'
import { useCanvas } from '../canvas/useCanvas'
import { eras, milestones } from '../../data/aiHistory'

interface SingularitySlideProps {
  active: boolean
  index: number
}

interface CityLight {
  angle: number
  lat: number
  brightness: number
  current: number
  appearTime: number
  size: number
  flicker: number
  hue: number // warm gold variation
}

interface OrbitalParticle {
  angle: number
  radius: number
  speed: number
  size: number
  alpha: number
  tilt: number
  ring: number // which ring (0, 1, or 2)
}

interface BackgroundStar {
  x: number
  y: number
  size: number
  alpha: number
  twinkleSpeed: number
  twinklePhase: number
}

export default function SingularitySlide({ active, index }: SingularitySlideProps) {
  const lightsRef = useRef<CityLight[]>([])
  const orbitalsRef = useRef<OrbitalParticle[]>([])
  const bgStarsRef = useRef<BackgroundStar[]>([])
  const initedRef = useRef(false)
  const noise2D = useMemo(() => createNoise2D(), [])

  const era = eras.find(e => e.id === 'singularity')!
  const chatgpt = milestones.find(m => m.id === 'chatgpt')!
  const agents = milestones.find(m => m.id === 'agents')!

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const lightCount = 90
    const orbitalCount = 150
    const bgStarCount = 100

    if (!initedRef.current || lightsRef.current.length === 0) {
      // City lights scattered across the planet surface in clusters
      const clusterCenters = Array.from({ length: 8 }, () => ({
        angle: Math.random() * Math.PI * 2,
        lat: (Math.random() - 0.5) * Math.PI * 0.7,
      }))

      lightsRef.current = Array.from({ length: lightCount }, (_, i) => {
        // Some lights cluster around centers, some are scattered
        const clustered = i < lightCount * 0.6
        const cluster = clusterCenters[i % clusterCenters.length]
        const angle = clustered
          ? cluster.angle + (Math.random() - 0.5) * 0.8
          : Math.random() * Math.PI * 2
        const lat = clustered
          ? cluster.lat + (Math.random() - 0.5) * 0.5
          : (Math.random() - 0.5) * Math.PI * 0.85

        return {
          angle,
          lat,
          brightness: 0.3 + Math.random() * 0.7,
          current: 0,
          appearTime: 0.3 + (i / lightCount) * 5 + Math.random() * 2,
          size: 0.8 + Math.random() * 2.8,
          flicker: Math.random() * Math.PI * 2,
          hue: 40 + Math.random() * 20, // warm gold range
        }
      })

      // Multi-ring orbital particles
      orbitalsRef.current = Array.from({ length: orbitalCount }, () => {
        const ring = Math.floor(Math.random() * 3)
        const baseRadius = [1.18, 1.35, 1.55][ring]
        return {
          angle: Math.random() * Math.PI * 2,
          radius: baseRadius + (Math.random() - 0.5) * 0.08,
          speed: (0.08 + Math.random() * 0.25) * (ring === 1 ? -1 : 1), // alternate direction
          size: 0.3 + Math.random() * 1.2,
          alpha: 0.08 + Math.random() * 0.25,
          tilt: -0.25 + Math.random() * 0.5,
          ring,
        }
      })

      // Background stars
      bgStarsRef.current = Array.from({ length: bgStarCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
      }))

      initedRef.current = true
    }

    // Background - deep space
    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    const cx = w * 0.58
    const cy = h * 0.5
    const planetR = Math.min(w, h) * 0.22

    // Background stars
    for (const star of bgStarsRef.current) {
      const twinkle = Math.sin(t * star.twinkleSpeed + star.twinklePhase) * 0.4 + 0.6
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200, 200, 255, ${star.alpha * twinkle})`
      ctx.fill()
    }

    // Distant nebula layers
    const nb1 = ctx.createRadialGradient(cx - planetR * 2, cy - planetR, 0, cx, cy, planetR * 5)
    nb1.addColorStop(0, 'rgba(80, 40, 160, 0.04)')
    nb1.addColorStop(0.3, 'rgba(60, 30, 140, 0.025)')
    nb1.addColorStop(0.7, 'rgba(30, 20, 80, 0.01)')
    nb1.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = nb1
    ctx.fillRect(0, 0, w, h)

    const nb2 = ctx.createRadialGradient(cx + planetR * 1.5, cy + planetR, 0, cx, cy, planetR * 4)
    nb2.addColorStop(0, 'rgba(40, 20, 120, 0.03)')
    nb2.addColorStop(0.5, 'rgba(30, 15, 100, 0.015)')
    nb2.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = nb2
    ctx.fillRect(0, 0, w, h)

    // Outer atmospheric corona glow
    const coronaR = planetR * 1.6
    const coronaGrad = ctx.createRadialGradient(cx, cy, planetR * 0.85, cx, cy, coronaR)
    coronaGrad.addColorStop(0, 'rgba(100, 70, 200, 0.0)')
    coronaGrad.addColorStop(0.2, 'rgba(100, 80, 200, 0.06)')
    coronaGrad.addColorStop(0.5, 'rgba(80, 60, 180, 0.03)')
    coronaGrad.addColorStop(1, 'rgba(60, 40, 160, 0)')
    ctx.fillStyle = coronaGrad
    ctx.beginPath()
    ctx.arc(cx, cy, coronaR, 0, Math.PI * 2)
    ctx.fill()

    // Planet body - dark sphere with subtle gradient
    const planetGrad = ctx.createRadialGradient(
      cx - planetR * 0.3, cy - planetR * 0.3, 0,
      cx, cy, planetR
    )
    planetGrad.addColorStop(0, '#0c0a22')
    planetGrad.addColorStop(0.5, '#070516')
    planetGrad.addColorStop(0.85, '#04030e')
    planetGrad.addColorStop(1, '#020108')
    ctx.fillStyle = planetGrad
    ctx.beginPath()
    ctx.arc(cx, cy, planetR, 0, Math.PI * 2)
    ctx.fill()

    // Surface texture using noise — continental shapes
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, planetR, 0, Math.PI * 2)
    ctx.clip()

    for (let i = 0; i < 300; i++) {
      const sx = cx - planetR + Math.random() * planetR * 2
      const sy = cy - planetR + Math.random() * planetR * 2
      const dx = sx - cx
      const dy = sy - cy
      if (dx * dx + dy * dy > planetR * planetR) continue
      const n = noise2D(sx * 0.008, sy * 0.008) * 0.5 + 0.5
      if (n > 0.55) {
        const intensity = (n - 0.55) * 3
        ctx.fillStyle = `rgba(35, 25, 70, ${intensity * 0.2})`
        ctx.fillRect(sx, sy, 2 + intensity, 2 + intensity)
      }
    }

    // City lights on the planet surface
    const rotation = t * 0.04
    for (const light of lightsRef.current) {
      // Smooth lerp toward target brightness
      const target = t > light.appearTime ? light.brightness : 0
      light.current += (target - light.current) * 0.025

      if (light.current < 0.005) continue

      // 3D to 2D projection of point on sphere
      const cosLat = Math.cos(light.lat)
      const x3d = Math.cos(light.angle + rotation) * cosLat
      const y3d = Math.sin(light.lat)
      const z3d = Math.sin(light.angle + rotation) * cosLat

      // Only draw points on the visible hemisphere
      if (x3d < -0.05) continue

      const px = cx + z3d * planetR * 0.94
      const py = cy - y3d * planetR * 0.94

      // Edge darkening (limb effect)
      const edgeFade = Math.max(0, Math.pow(x3d, 0.6))
      const flicker = Math.sin(t * 3.5 + light.flicker) * 0.12 + 0.88
      const alpha = light.current * edgeFade * flicker

      // Warm glow halo
      const glowR = light.size * 5
      const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR)
      glowGrad.addColorStop(0, `hsla(${light.hue}, 90%, 65%, ${alpha * 0.5})`)
      glowGrad.addColorStop(0.2, `hsla(${light.hue}, 85%, 60%, ${alpha * 0.3})`)
      glowGrad.addColorStop(0.5, `hsla(${light.hue}, 80%, 55%, ${alpha * 0.1})`)
      glowGrad.addColorStop(1, `hsla(${light.hue}, 80%, 50%, 0)`)
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(px, py, glowR, 0, Math.PI * 2)
      ctx.fill()

      // Bright white-gold core
      ctx.beginPath()
      ctx.arc(px, py, light.size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 240, ${alpha * 0.95})`
      ctx.fill()
    }

    ctx.restore()

    // Atmospheric limb glow (rim light) with color
    const limbGrad = ctx.createRadialGradient(cx, cy, planetR * 0.9, cx, cy, planetR * 1.12)
    limbGrad.addColorStop(0, 'rgba(100, 80, 200, 0)')
    limbGrad.addColorStop(0.3, 'rgba(110, 85, 220, 0.1)')
    limbGrad.addColorStop(0.6, 'rgba(90, 70, 200, 0.06)')
    limbGrad.addColorStop(1, 'rgba(60, 40, 160, 0)')
    ctx.fillStyle = limbGrad
    ctx.beginPath()
    ctx.arc(cx, cy, planetR * 1.12, 0, Math.PI * 2)
    ctx.fill()

    // Golden sunrise terminator on right edge
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, planetR, 0, Math.PI * 2)
    ctx.clip()
    const sunGrad = ctx.createLinearGradient(cx + planetR * 0.4, cy, cx + planetR * 1.1, cy)
    sunGrad.addColorStop(0, 'rgba(234, 179, 8, 0)')
    sunGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.04)')
    sunGrad.addColorStop(0.8, 'rgba(250, 204, 21, 0.07)')
    sunGrad.addColorStop(1, 'rgba(255, 230, 100, 0.09)')
    ctx.fillStyle = sunGrad
    ctx.fillRect(cx - planetR, cy - planetR, planetR * 2, planetR * 2)
    ctx.restore()

    // Orbital particle rings
    for (const op of orbitalsRef.current) {
      op.angle += op.speed * 0.008

      const orbR = planetR * op.radius
      // Elliptical orbit with tilt per ring
      const tiltFactor = [0.28, 0.35, 0.22][op.ring]
      const ox = cx + Math.cos(op.angle) * orbR
      const oy = cy + Math.sin(op.angle) * orbR * tiltFactor + Math.sin(op.angle) * op.tilt * orbR * 0.15

      // Occlusion: skip particles behind the planet
      const dx = ox - cx
      const dy = oy - cy
      const distFromCenter = Math.sqrt(dx * dx + dy * dy)
      const behindPlanet =
        distFromCenter < planetR * 0.9 &&
        Math.sin(op.angle) > -0.4 &&
        Math.sin(op.angle) < 0.4
      if (behindPlanet) continue

      const twinkle = Math.sin(t * 2.5 + op.angle * 3) * 0.35 + 0.65
      const a = op.alpha * twinkle

      // Particle with subtle glow
      const pgR = op.size * 3
      const pgGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, pgR)
      pgGrad.addColorStop(0, `rgba(200, 180, 255, ${a})`)
      pgGrad.addColorStop(0.5, `rgba(180, 160, 240, ${a * 0.3})`)
      pgGrad.addColorStop(1, 'rgba(160, 140, 220, 0)')
      ctx.fillStyle = pgGrad
      ctx.beginPath()
      ctx.arc(ox, oy, pgR, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(ox, oy, op.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(220, 210, 255, ${a})`
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
              background: 'linear-gradient(135deg, #eab308 0%, #ffffff 60%, #facc15 100%)',
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
          year={chatgpt.year}
          name={chatgpt.name}
          description={chatgpt.description}
          color="#eab308"
        />
        <MilestoneCard
          year={agents.year}
          name={agents.name}
          description={agents.description}
          color="#facc15"
        />
      </div>
    </SlideWrapper>
  )
}
