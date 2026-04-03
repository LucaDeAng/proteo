import { useRef, useEffect, useCallback } from 'react'

/**
 * Shooting stars that streak across the screen diagonally.
 * Spawns from edges, each with a gradient trail that fades.
 * Inspired by 21st.dev/aceternity meteors component.
 */

interface Star {
  x: number
  y: number
  len: number
  speed: number
  angle: number
  alpha: number
  width: number
  life: number
  maxLife: number
  hue: number
}

const MAX_STARS = 4 // max concurrent shooting stars
const SPAWN_INTERVAL = 2.5 // seconds between spawns (average)

export function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const rafRef = useRef(0)
  const lastSpawnRef = useRef(0)

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

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const startTime = performance.now()

    function spawnStar(w: number, h: number): Star {
      // Random angle between -60 and -30 degrees (upper-left to lower-right)
      const angle = (-30 - Math.random() * 30) * (Math.PI / 180)
      // Alternate: sometimes from right side
      const fromRight = Math.random() > 0.5
      const fromTop = Math.random() > 0.3

      let x: number, y: number
      if (fromRight) {
        x = w * (0.3 + Math.random() * 0.7)
        y = -20
      } else if (fromTop) {
        x = -20
        y = h * Math.random() * 0.5
      } else {
        x = w * Math.random()
        y = -20
      }

      const hues = [260, 270, 280, 40, 45] // purple or gold
      return {
        x, y,
        len: 80 + Math.random() * 120,
        speed: 400 + Math.random() * 300,
        angle: fromRight ? Math.PI * 0.6 + Math.random() * 0.3 : angle,
        alpha: 0.4 + Math.random() * 0.4,
        width: 1 + Math.random() * 1.5,
        life: 0,
        maxLife: 1.5 + Math.random() * 1,
        hue: hues[Math.floor(Math.random() * hues.length)],
      }
    }

    function loop(now: number) {
      const t = (now - startTime) / 1000
      const w = c!.clientWidth
      const h = c!.clientHeight

      ctx!.clearRect(0, 0, w, h)

      // Spawn new stars
      if (t - lastSpawnRef.current > SPAWN_INTERVAL * (0.5 + Math.random()) && starsRef.current.length < MAX_STARS) {
        starsRef.current.push(spawnStar(w, h))
        lastSpawnRef.current = t
      }

      // Update and draw
      const alive: Star[] = []
      for (const star of starsRef.current) {
        star.life += 1 / 60 // approximate dt
        if (star.life > star.maxLife) continue

        const progress = star.life / star.maxLife
        // Fade in first 20%, full middle, fade out last 30%
        let fade = 1
        if (progress < 0.2) fade = progress / 0.2
        else if (progress > 0.7) fade = 1 - (progress - 0.7) / 0.3

        const currentAlpha = star.alpha * fade

        // Move
        star.x += Math.cos(star.angle) * star.speed * (1 / 60)
        star.y += Math.sin(star.angle) * star.speed * (1 / 60)

        // Trail (gradient line)
        const tailX = star.x - Math.cos(star.angle) * star.len
        const tailY = star.y - Math.sin(star.angle) * star.len

        const grad = ctx!.createLinearGradient(tailX, tailY, star.x, star.y)
        grad.addColorStop(0, `hsla(${star.hue}, 80%, 70%, 0)`)
        grad.addColorStop(0.6, `hsla(${star.hue}, 80%, 80%, ${currentAlpha * 0.3})`)
        grad.addColorStop(1, `hsla(${star.hue}, 80%, 95%, ${currentAlpha})`)

        ctx!.strokeStyle = grad
        ctx!.lineWidth = star.width
        ctx!.lineCap = 'round'
        ctx!.beginPath()
        ctx!.moveTo(tailX, tailY)
        ctx!.lineTo(star.x, star.y)
        ctx!.stroke()

        // Bright head
        const headGrad = ctx!.createRadialGradient(star.x, star.y, 0, star.x, star.y, 3)
        headGrad.addColorStop(0, `hsla(${star.hue}, 60%, 100%, ${currentAlpha})`)
        headGrad.addColorStop(1, `hsla(${star.hue}, 80%, 80%, 0)`)
        ctx!.fillStyle = headGrad
        ctx!.beginPath()
        ctx!.arc(star.x, star.y, 3, 0, Math.PI * 2)
        ctx!.fill()

        alive.push(star)
      }
      starsRef.current = alive

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[2] pointer-events-none w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
