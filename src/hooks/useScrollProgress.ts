import { useState, useEffect, useRef } from 'react'

/**
 * Returns a 0→1 progress value for each slide based on scroll position.
 * 0 = slide just entered from bottom, 0.5 = centered, 1 = leaving at top.
 * This enables scroll-LINKED animations (proportional to scroll),
 * not just scroll-TRIGGERED (on/off).
 */
export function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function onScroll() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = container!
        const scrollTop = el.scrollTop
        const scrollHeight = el.scrollHeight - el.clientHeight
        if (scrollHeight > 0) {
          setProgress(scrollTop / scrollHeight)
        }
      })
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef])

  return progress
}
