import { useEffect, useRef } from 'react'

/**
 * A subtle radial glow that follows the mouse cursor.
 * Creates an ambient light effect over the dark backgrounds.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    function onMove(e: MouseEvent) {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-30 pointer-events-none max-md:hidden"
      style={{
        width: 400,
        height: 400,
        marginLeft: -200,
        marginTop: -200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(168,85,247,0.02) 30%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  )
}
