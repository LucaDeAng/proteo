import { AnimatePresence, motion } from 'framer-motion'

const SLIDE_YEARS: (number | null)[] = [null, 1936, 1950, 1958, 1974, 1997, 2012, 2024, null, null, 2026, null]

interface YearCounterProps {
  activeSlide: number
}

export function YearCounter({ activeSlide }: YearCounterProps) {
  const year = SLIDE_YEARS[activeSlide] ?? null

  return (
    <div className="fixed bottom-8 left-8 z-20 max-md:hidden">
      <AnimatePresence mode="wait">
        {year !== null && (
          <motion.span
            key={year}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="block text-8xl font-mono text-white/[0.08] font-display select-none leading-none"
          >
            {year}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
