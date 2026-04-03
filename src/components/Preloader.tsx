import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

const LETTERS = 'GENESIS'.split('')

export function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<'dot' | 'pulse' | 'expand' | 'text' | 'done'>('dot')

  useEffect(() => {
    const t0 = setTimeout(() => setPhase('pulse'), 800)
    const t1 = setTimeout(() => setPhase('expand'), 2200)
    const t2 = setTimeout(() => setPhase('text'), 3200)
    const t3 = setTimeout(() => setPhase('done'), 5200)
    const t4 = setTimeout(onComplete, 5800)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#030014]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Central particle — breathes, then expands */}
          <motion.div
            className="absolute rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(168,85,247,0.5) 30%, rgba(250,204,21,0.15) 60%, transparent 75%)',
            }}
            initial={{ width: 3, height: 3, opacity: 0 }}
            animate={
              phase === 'dot'
                ? { width: 3, height: 3, opacity: 1 }
                : phase === 'pulse'
                ? { width: 8, height: 8, opacity: 1 }
                : phase === 'expand'
                ? { width: 200, height: 200, opacity: 0.4 }
                : { width: 500, height: 500, opacity: 0 }
            }
            transition={{
              duration: phase === 'dot' ? 0.6 : phase === 'pulse' ? 1.2 : 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Breathing ring during pulse phase */}
          {(phase === 'pulse' || phase === 'expand') && (
            <motion.div
              className="absolute rounded-full border border-white/10"
              initial={{ width: 20, height: 20, opacity: 0 }}
              animate={{ width: 80, height: 80, opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          {/* GENESIS — letter by letter */}
          <div className="relative flex gap-[2px] sm:gap-1">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                className="font-display text-5xl sm:text-6xl md:text-8xl font-black tracking-[0.08em]"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #fbbf24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={
                  phase === 'text'
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 20, filter: 'blur(8px)' }
                }
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
