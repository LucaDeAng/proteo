import { useState, useEffect, useRef } from 'react'

/**
 * Returns scroll progress (0→1) and velocity (0→1 normalized).
 * Velocity decays smoothly when scrolling stops.
 */
export function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const rafRef = useRef(0)
  const lastScrollRef = useRef(0)
  const lastTimeRef = useRef(0)
  const velocityRef = useRef(0)
  const decayRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function onScroll() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = container!
        const scrollTop = el.scrollTop
        const scrollHeight = el.scrollHeight - el.clientHeight
        const now = performance.now()

        if (scrollHeight > 0) {
          setProgress(scrollTop / scrollHeight)
        }

        // Calculate velocity
        const dt = now - lastTimeRef.current
        if (dt > 0 && lastTimeRef.current > 0) {
          const delta = Math.abs(scrollTop - lastScrollRef.current)
          const rawV = delta / dt // px/ms
          velocityRef.current = Math.min(rawV / 2, 1) // normalize: 2 px/ms = max
        }

        lastScrollRef.current = scrollTop
        lastTimeRef.current = now
      })
    }

    // Decay velocity smoothly when not scrolling
    function decayLoop() {
      velocityRef.current *= 0.92 // smooth decay
      setVelocity(velocityRef.current)
      decayRef.current = requestAnimationFrame(decayLoop)
    }
    decayRef.current = requestAnimationFrame(decayLoop)

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(decayRef.current)
    }
  }, [containerRef])

  return { progress, velocity }
}
