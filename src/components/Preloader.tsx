import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<'dot' | 'expand' | 'text' | 'done'>('dot')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('expand'), 400)
    const t2 = setTimeout(() => setPhase('text'), 1200)
    const t3 = setTimeout(() => setPhase('done'), 2800)
    const t4 = setTimeout(onComplete, 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#030014]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Central growing particle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(168,85,247,0.4) 40%, transparent 70%)',
            }}
            initial={{ width: 4, height: 4, opacity: 0 }}
            animate={
              phase === 'dot'
                ? { width: 4, height: 4, opacity: 1 }
                : phase === 'expand'
                ? { width: 120, height: 120, opacity: 0.6 }
                : { width: 300, height: 300, opacity: 0 }
            }
            transition={{ duration: phase === 'dot' ? 0.3 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* GENESIS text */}
          <motion.h1
            className="relative font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-[0.15em]"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={
              phase === 'text'
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.8, y: 10 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            GENESIS
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
