import { useRef, useEffect, useCallback } from 'react'

/**
 * A persistent full-screen canvas overlay of floating particles that
 * shift color as the user scrolls between eras.
 * Creates visual continuity between slides — the feeling that
 * you're moving through a single living universe, not clicking slides.
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  drift: number
}

const SLIDE_COLORS: [number, number, number][] = [
  [168, 85, 247],   // 0 hero - purple
  [76, 29, 149],    // 1 void - deep purple
  [245, 158, 11],   // 2 bigbang - gold
  [234, 88, 12],    // 3 stars - orange
  [14, 165, 233],   // 4 ice - blue
  [16, 185, 129],   // 5 cambrian - green
  [168, 85, 247],   // 6 intelligence - purple
  [234, 179, 8],    // 7 singularity - gold
  [52, 211, 153],   // 8 lineage - teal
  [232, 121, 249],  // 9 horizon - pink
  [192, 132, 252],  // 10 numbers - violet
  [139, 92, 246],   // 11 galaxy - indigo
  [100, 100, 120],  // 12 credits - grey
]

const PARTICLE_COUNT = 40

interface TransitionParticlesProps {
  scrollProgress: number // 0-1 overall scroll
  scrollVelocity: number // 0-1 normalized scroll speed
  totalSlides: number
}

export function TransitionParticles({ scrollProgress, scrollVelocity, totalSlides }: TransitionParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)
  const startRef = useRef(0)

  // Init particles once
  useEffect(() => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      size: 0.5 + Math.random() * 1.5,
      alpha: 0.05 + Math.random() * 0.15,
      drift: Math.random() * Math.PI * 2,
    }))
  }, [])

  const resize = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = c.clientWidth * dpr
    c.height = c.clientHeight * dpr
    const ctx = c.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  // Animation loop
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    startRef.current = performance.now()

    function loop(now: number) {
      const t = (now - startRef.current) / 1000
      const w = c!.clientWidth
      const h = c!.clientHeight

      ctx!.clearRect(0, 0, w, h)

      // Lerp color based on scroll
      const slideFloat = scrollProgress * (totalSlides - 1)
      const slideIdx = Math.floor(slideFloat)
      const slideFrac = slideFloat - slideIdx
      const colA = SLIDE_COLORS[Math.min(slideIdx, SLIDE_COLORS.length - 1)]
      const colB = SLIDE_COLORS[Math.min(slideIdx + 1, SLIDE_COLORS.length - 1)]
      const r = Math.round(colA[0] + (colB[0] - colA[0]) * slideFrac)
      const g = Math.round(colA[1] + (colB[1] - colA[1]) * slideFrac)
      const b = Math.round(colA[2] + (colB[2] - colA[2]) * slideFrac)

      // Velocity amplifies movement and adds vertical drift
      const vel = scrollVelocity
      const speedMult = 1 + vel * 8 // particles move up to 9x faster when scrolling

      for (const p of particlesRef.current) {
        p.x += (p.vx + Math.sin(t * 0.3 + p.drift) * 0.0001) * speedMult
        p.y += (p.vy + Math.cos(t * 0.25 + p.drift) * 0.0001) * speedMult
        // Scroll velocity pushes particles upward (scroll direction)
        p.y -= vel * 0.004

        // Wrap
        if (p.x < 0) p.x = 1
        if (p.x > 1) p.x = 0
        if (p.y < 0) p.y = 1
        if (p.y > 1) p.y = 0

        const twinkle = 0.5 + Math.sin(t * 1.5 + p.drift) * 0.5
        // Particles get brighter and larger when scrolling fast
        const a = p.alpha * twinkle * (1 + vel * 3)
        const sz = p.size * (1 + vel * 2)

        ctx!.beginPath()
        ctx!.arc(p.x * w, p.y * h, sz, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(a, 0.6)})`
        ctx!.fill()

        // Trail effect when scrolling fast
        if (vel > 0.05) {
          ctx!.beginPath()
          ctx!.arc(p.x * w, (p.y + vel * 0.01) * h, sz * 0.6, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.3})`
          ctx!.fill()
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrollProgress, totalSlides])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
