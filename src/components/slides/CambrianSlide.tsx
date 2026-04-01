import { useCallback, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'
import { SlideWrapper, SlideTag, SlideTitle, SlideBody, MilestoneCard } from '../SlideWrapper'
import { useCanvas } from '../canvas/useCanvas'

interface Props {
  active: boolean
  index: number
}

interface Organism {
  x: number
  y: number
  baseR: number
  color: string
  speed: number
  phase: number
  rings: number
  born: number
}

const COLORS = ['#10b981', '#34d399', '#06b6d4', '#22d3ee', '#14b8a6', '#a3e635', '#fbbf24']
const noise2D = createNoise2D()

export default function CambrianSlide({ active, index }: Props) {
  const organismsRef = useRef<Organism[]>([])
  const initedRef = useRef(false)
  const spawnTimerRef = useRef(0)

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    if (!initedRef.current) {
      organismsRef.current = Array.from({ length: 30 }, () => makeOrganism(w, h, 0))
      initedRef.current = true
      spawnTimerRef.current = t
    }

    // Spawn new organisms over time (proliferation effect)
    if (t - spawnTimerRef.current > 0.4 && organismsRef.current.length < 120) {
      organismsRef.current.push(makeOrganism(w, h, t))
      spawnTimerRef.current = t
    }

    // Background
    ctx.fillStyle = '#030a12'
    ctx.fillRect(0, 0, w, h)

    // Ambient nebula
    for (let i = 0; i < 3; i++) {
      const nx = w * (0.3 + i * 0.2) + noise2D(i * 0.1, t * 0.05) * 60
      const ny = h * (0.3 + i * 0.25) + noise2D(i * 0.2, t * 0.04) * 60
      const r = 180 + i * 40
      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r)
      grad.addColorStop(0, i === 0 ? 'rgba(16, 185, 129, 0.06)' : i === 1 ? 'rgba(6, 182, 212, 0.05)' : 'rgba(20, 184, 166, 0.04)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    }

    // Draw organisms
    for (const org of organismsRef.current) {
      const age = Math.max(0, t - org.born)
      const growFactor = Math.min(1, age * 2) // grow in over 0.5s
      const r = org.baseR * growFactor

      const ox = org.x + noise2D(org.phase, t * org.speed * 0.3) * 30
      const oy = org.y + noise2D(org.phase + 100, t * org.speed * 0.3) * 30

      // Glow
      const glowGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r * 3)
      glowGrad.addColorStop(0, hexToRgba(org.color, 0.08))
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(ox, oy, r * 3, 0, Math.PI * 2)
      ctx.fill()

      // Outer membrane
      ctx.beginPath()
      ctx.arc(ox, oy, r, 0, Math.PI * 2)
      ctx.strokeStyle = hexToRgba(org.color, 0.5 * growFactor)
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Inner rings
      for (let ri = 1; ri <= org.rings; ri++) {
        const innerR = r * (ri / (org.rings + 1))
        const pulse = 1 + Math.sin(t * 2 + org.phase + ri) * 0.1
        ctx.beginPath()
        ctx.arc(ox, oy, innerR * pulse, 0, Math.PI * 2)
        ctx.strokeStyle = hexToRgba(org.color, 0.25 * growFactor)
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Nucleus
      const nucleusR = r * 0.2
      const pulse = 1 + Math.sin(t * 3 + org.phase) * 0.2
      ctx.beginPath()
      ctx.arc(ox, oy, nucleusR * pulse, 0, Math.PI * 2)
      ctx.fillStyle = hexToRgba(org.color, 0.6 * growFactor)
      ctx.fill()
    }

    // Connecting lines between nearby organisms
    const orgs = organismsRef.current
    ctx.lineWidth = 0.4
    for (let i = 0; i < orgs.length; i++) {
      for (let j = i + 1; j < orgs.length; j++) {
        const a = orgs[i], b = orgs[j]
        const ax = a.x + noise2D(a.phase, t * a.speed * 0.3) * 30
        const ay = a.y + noise2D(a.phase + 100, t * a.speed * 0.3) * 30
        const bx = b.x + noise2D(b.phase, t * b.speed * 0.3) * 30
        const by = b.y + noise2D(b.phase + 100, t * b.speed * 0.3) * 30
        const d = Math.hypot(ax - bx, ay - by)
        if (d < 100) {
          const alpha = (1 - d / 100) * 0.15
          ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
          ctx.stroke()
        }
      }
    }
  }, [])

  const canvasRef = useCanvas({ draw, active })

  return (
    <SlideWrapper
      index={index}
      active={active}
      canvas={<canvas ref={canvasRef} className="h-full w-full" style={{ display: 'block' }} />}
    >
      <div className="pl-8 sm:pl-16 md:pl-24 pr-8 max-w-2xl">
        <SlideTag>1993 — 2012</SlideTag>
        <SlideTitle>
          <span style={{
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            L'Esplosione Cambriana
          </span>
        </SlideTitle>
        <SlideBody>
          Internet porta dati. I dati portano possibilita. Come nell'esplosione cambriana che riempi gli oceani di forme di vita diverse, l'AI si diversifica. Deep Blue batte Kasparov. IBM Watson vince Jeopardy. Hinton, LeCun, Bengio pongono le basi del deep learning — i tre che non si arresero durante l'inverno.
        </SlideBody>
        <MilestoneCard year={1997} name="Deep Blue vs Kasparov" description="IBM Deep Blue batte il campione mondiale di scacchi" color="#10b981" />
        <MilestoneCard year={2009} name="ImageNet" description="14 milioni di immagini etichettate — il dataset che cambiera tutto" color="#06b6d4" />
      </div>
    </SlideWrapper>
  )
}

function makeOrganism(w: number, h: number, born: number): Organism {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    baseR: 8 + Math.random() * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 0.3 + Math.random() * 0.7,
    phase: Math.random() * 1000,
    rings: 1 + Math.floor(Math.random() * 3),
    born,
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
