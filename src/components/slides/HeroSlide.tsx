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

interface DustParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  drift: number
}

export default function HeroSlide({ active, index }: HeroSlideProps) {
  const { lang } = useLang()
  const mouse = useMouseParallax(active)
  const dustRef = useRef<DustParticle[]>([])
  const initedRef = useRef(false)

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    // Initialize dust particles once
    if (!initedRef.current || dustRef.current.length === 0) {
      dustRef.current = Array.from({ length: 80 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.3 + 0.05,
        drift: Math.random() * Math.PI * 2,
      }))
      initedRef.current = true
    }

    // Background
    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h / 2

    // Central pulsing particle with glow
    const breathe = Math.sin(t * 0.8) * 0.5 + 0.5 // 0..1
    const breathe2 = Math.sin(t * 1.3 + 1) * 0.5 + 0.5

    // Outermost glow - very subtle, large radius
    const outerR = 120 + breathe * 80
    const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR)
    outerGrad.addColorStop(0, `rgba(168, 85, 247, ${0.04 + breathe * 0.03})`)
    outerGrad.addColorStop(0.4, `rgba(120, 50, 200, ${0.02 + breathe * 0.02})`)
    outerGrad.addColorStop(1, 'rgba(120, 50, 200, 0)')
    ctx.fillStyle = outerGrad
    ctx.fillRect(0, 0, w, h)

    // Mid glow - purple/gold shimmer
    const midR = 60 + breathe2 * 40
    const midGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, midR)
    midGrad.addColorStop(0, `rgba(250, 204, 21, ${0.08 + breathe2 * 0.06})`)
    midGrad.addColorStop(0.3, `rgba(168, 85, 247, ${0.06 + breathe * 0.04})`)
    midGrad.addColorStop(1, 'rgba(168, 85, 247, 0)')
    ctx.fillStyle = midGrad
    ctx.beginPath()
    ctx.arc(cx, cy, midR, 0, Math.PI * 2)
    ctx.fill()

    // Inner glow - bright core
    const innerR = 20 + breathe * 15
    const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR)
    innerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.7 + breathe * 0.3})`)
    innerGrad.addColorStop(0.2, `rgba(250, 204, 21, ${0.4 + breathe * 0.2})`)
    innerGrad.addColorStop(0.5, `rgba(168, 85, 247, ${0.15 + breathe * 0.1})`)
    innerGrad.addColorStop(1, 'rgba(168, 85, 247, 0)')
    ctx.fillStyle = innerGrad
    ctx.beginPath()
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
    ctx.fill()

    // Bright center point
    const coreR = 3 + breathe * 2
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 + breathe * 0.1})`)
    coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = coreGrad
    ctx.beginPath()
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
    ctx.fill()

    // Dust particles
    for (const p of dustRef.current) {
      p.x += p.vx + Math.sin(t * 0.5 + p.drift) * 0.15
      p.y += p.vy + Math.cos(t * 0.4 + p.drift) * 0.15

      // Wrap around edges
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      // Subtle twinkle
      const twinkle = Math.sin(t * 2 + p.drift) * 0.5 + 0.5
      const alpha = p.alpha * (0.5 + twinkle * 0.5)

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200, 180, 255, ${alpha})`
      ctx.fill()
    }
  }, [])

  const canvasRef = useCanvas({ draw, active })

  const canvasEl = (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ display: 'block' }}
    />
  )

  return (
    <SlideWrapper index={index} active={active} canvas={canvasEl}>
      <div
        className="flex flex-col items-center justify-center text-center px-4"
        style={{ transform: `translate(${mouse.x * -15}px, ${mouse.y * -10}px)` }}
      >
        {/* GENESIS title */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 60, scale: 0.9 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.15em] leading-none mb-6"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #a855f7 60%, #fbbf24 100%)',
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
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="font-display text-lg sm:text-xl md:text-2xl text-white/70 tracking-[0.2em] uppercase mb-12"
        >
          {lang === 'it' ? "La Storia dell'Intelligenza Artificiale" : 'The History of Artificial Intelligence'}
        </motion.p>

        {/* Scroll prompt */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delay: 1.2, duration: 0.8 },
            },
          }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-white/40 text-sm tracking-[0.15em] uppercase">
            {lang === 'it' ? 'Scrolla per viaggiare nel tempo' : 'Scroll to travel through time'}
          </span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-white/30 text-2xl"
          >
            &#8595;
          </motion.span>
        </motion.div>
      </div>
    </SlideWrapper>
  )
}
