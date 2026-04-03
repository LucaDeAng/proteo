import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedCounterProps {
  value: string
  active: boolean
  className?: string
}

/**
 * Animates a number value counting up when it becomes active.
 * Handles mixed strings like "100M", "$2M", "~300", "14M" etc.
 */
export function AnimatedCounter({ value, active, className = '' }: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState(value)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!active) {
      setDisplayed(value)
      return
    }

    // Extract numeric portion
    const match = value.match(/^([~$]?)(\d+)(.*?)$/)
    if (!match) {
      setDisplayed(value)
      return
    }

    const [, prefix, numStr, suffix] = match
    const target = parseInt(numStr, 10)
    if (isNaN(target) || target === 0) {
      setDisplayed(value)
      return
    }

    const duration = 1200 // ms
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(target * eased)
      setDisplayed(`${prefix}${current}${suffix}`)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, value])

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={active ? 'counting' : 'static'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        {displayed}
      </motion.span>
    </AnimatePresence>
  )
}
