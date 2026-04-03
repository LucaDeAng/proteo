import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { SlideWrapper } from '../SlideWrapper'
import { useCanvas } from '../canvas/useCanvas'
import { useMouseParallax } from '../../hooks/useMouseParallax'
import { useLang } from '../../hooks/useLang'

interface HeroSlideProps {
  active: boolean
  index: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  drift: number
  orbitR: number
  orbitSpeed: number
}

export default function HeroSlide({ active, index }: HeroSlideProps) {
  const { lang } = useLang()
  const mouse = useMouseParallax(active)
  const particlesRef = useRef<Particle[]>([])
  const initedRef = useRef(false)

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    if (!initedRef.current) {
      particlesRef.current = Array.from({ length: 120 }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.8 + 0.2,
        alpha: Math.random() * 0.25 + 0.03,
        drift: Math.random() * Math.PI * 2,
        orbitR: 80 + Math.random() * 300,
        orbitSpeed: (0.05 + Math.random() * 0.15) * (i % 2 === 0 ? 1 : -1),
      }))
      initedRef.current = true
    }

    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h / 2
    const breathe = Math.sin(t * 0.6) * 0.5 + 0.5
    const breathe2 = Math.sin(t * 0.9 + 1.2) * 0.5 + 0.5
    const breathe3 = Math.sin(t * 0.4 + 2.5) * 0.5 + 0.5

    // Deep ambient glow — fills the space
    const ambR = Math.min(w, h) * 0.6
    const ambGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, ambR)
    ambGrad.addColorStop(0, `rgba(76, 29, 149, ${0.06 + breathe3 * 0.03})`)
    ambGrad.addColorStop(0.3, `rgba(88, 28, 135, ${0.03 + breathe * 0.02})`)
    ambGrad.addColorStop(0.6, `rgba(30, 10, 60, 0.02)`)
    ambGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = ambGrad
    ctx.fillRect(0, 0, w, h)

    // Orbital rings — thin, elegant, slowly rotating
    ctx.lineWidth = 0.5
    for (let ring = 0; ring < 3; ring++) {
      const ringR = 100 + ring * 90 + breathe * 15
      const ringAlpha = 0.04 + breathe2 * 0.02 - ring * 0.01
      const rot = t * (0.08 - ring * 0.02)
      const tilt = 0.3 + ring * 0.15

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot + ring * 0.8)
      ctx.scale(1, tilt)
      ctx.strokeStyle = `rgba(168, 85, 247, ${ringAlpha})`
      ctx.beginPath()
      ctx.arc(0, 0, ringR, 0, Math.PI * 2)
      ctx.stroke()

      // Dashed inner ring
      ctx.setLineDash([4, 12])
      ctx.strokeStyle = `rgba(250, 204, 21, ${ringAlpha * 0.5})`
      ctx.beginPath()
      ctx.arc(0, 0, ringR - 20, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    }

    // Core glow layers
    // Layer 1: outermost aura
    const auraR = 160 + breathe * 60
    const auraGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraR)
    auraGrad.addColorStop(0, `rgba(168, 85, 247, ${0.06 + breathe * 0.04})`)
    auraGrad.addColorStop(0.3, `rgba(139, 92, 246, ${0.03 + breathe2 * 0.02})`)
    auraGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = auraGrad
    ctx.beginPath()
    ctx.arc(cx, cy, auraR, 0, Math.PI * 2)
    ctx.fill()

    // Layer 2: warm gold shimmer
    const goldR = 50 + breathe2 * 30
    const goldGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, goldR)
    goldGrad.addColorStop(0, `rgba(250, 204, 21, ${0.1 + breathe2 * 0.08})`)
    goldGrad.addColorStop(0.4, `rgba(245, 158, 11, ${0.04 + breathe * 0.03})`)
    goldGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = goldGrad
    ctx.beginPath()
    ctx.arc(cx, cy, goldR, 0, Math.PI * 2)
    ctx.fill()

    // Layer 3: white hot core
    const coreR = 12 + breathe * 8
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.85 + breathe * 0.15})`)
    coreGrad.addColorStop(0.3, `rgba(250, 204, 21, ${0.5 + breathe * 0.2})`)
    coreGrad.addColorStop(0.6, `rgba(168, 85, 247, ${0.15})`)
    coreGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = coreGrad
    ctx.beginPath()
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
    ctx.fill()

    // Cross-flare on core
    const flareLen = 30 + breathe * 20
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + breathe * 0.06})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx - flareLen, cy)
    ctx.lineTo(cx + flareLen, cy)
    ctx.moveTo(cx, cy - flareLen * 0.7)
    ctx.lineTo(cx, cy + flareLen * 0.7)
    ctx.stroke()

    // Particles — some orbit, some drift
    for (const p of particlesRef.current) {
      // Drift
      p.x += p.vx + Math.sin(t * 0.3 + p.drift) * 0.08
      p.y += p.vy + Math.cos(t * 0.25 + p.drift) * 0.08

      // Gentle attraction toward center
      const dx = cx - p.x, dy = cy - p.y
      const dist = Math.hypot(dx, dy)
      if (dist > 50) {
        p.x += (dx / dist) * 0.03
        p.y += (dy / dist) * 0.03
      }

      // Wrap
      if (p.x < -10) p.x = w + 10
      if (p.x > w + 10) p.x = -10
      if (p.y < -10) p.y = h + 10
      if (p.y > h + 10) p.y = -10

      const twinkle = 0.4 + Math.sin(t * 1.8 + p.drift) * 0.6
      const a = p.alpha * twinkle

      // Particle glow
      if (p.size > 1) {
        const pgR = p.size * 4
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pgR)
        pg.addColorStop(0, `rgba(192, 160, 255, ${a * 0.3})`)
        pg.addColorStop(1, 'transparent')
        ctx.fillStyle = pg
        ctx.beginPath()
        ctx.arc(p.x, p.y, pgR, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(220, 200, 255, ${a})`
      ctx.fill()
    }
  }, [])

  const canvasRef = useCanvas({ draw, active })

  return (
    <SlideWrapper
      index={index}
      active={active}
      canvas={<canvas ref={canvasRef} className="h-full w-full" style={{ display: 'block' }} />}
    >
      <div
        className="flex flex-col items-center justify-center text-center px-4"
        style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -12}px)` }}
      >
        {/* Top decorative line */}
        <motion.div
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: { scaleX: 1, opacity: 1, transition: { delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"
        />

        {/* Date range */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="font-mono text-xs tracking-[0.4em] text-white/30 uppercase mb-6"
        >
          1950 — 2026
        </motion.p>

        {/* GENESIS title */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 40, letterSpacing: '0.3em' },
            visible: {
              opacity: 1, y: 0, letterSpacing: '0.15em',
              transition: { delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none mb-4"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e0ccff 25%, #c084fc 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          GENESIS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="font-display text-base sm:text-lg md:text-xl text-white/50 tracking-[0.15em] uppercase mb-3"
        >
          {lang === 'it' ? "La Storia dell'Intelligenza Artificiale" : 'The History of Artificial Intelligence'}
        </motion.p>

        {/* Bottom decorative line */}
        <motion.div
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: { scaleX: 1, opacity: 1, transition: { delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6 mb-12"
        />

        {/* Scroll indicator — elegant line that grows */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 1.5, duration: 0.8 } },
          }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-white/25 text-[10px] font-mono tracking-[0.3em] uppercase">
            {lang === 'it' ? 'Scroll' : 'Scroll'}
          </span>
          <motion.div
            className="w-[1px] bg-gradient-to-b from-white/40 to-transparent"
            animate={{ height: [20, 40, 20] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </SlideWrapper>
  )
}
