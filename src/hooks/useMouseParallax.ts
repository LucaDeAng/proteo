import { useState, useEffect, useCallback, useRef } from 'react'

interface ParallaxState {
  x: number // -1 to 1 (left to right)
  y: number // -1 to 1 (top to bottom)
}

/**
 * Returns normalized mouse position relative to viewport center.
 * Use to offset elements for parallax: transform: translate(x * depth, y * depth)
 */
export function useMouseParallax(enabled = true): ParallaxState {
  const [pos, setPos] = useState<ParallaxState>({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const targetRef = useRef({ x: 0, y: 0 })

  const onMove = useCallback((e: MouseEvent) => {
    targetRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    window.addEventListener('mousemove', onMove)

    // Smooth lerp loop
    function loop() {
      setPos((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.08,
        y: prev.y + (targetRef.current.y - prev.y) * 0.08,
      }))
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, onMove])

  return pos
}
