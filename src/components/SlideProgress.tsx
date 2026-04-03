import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_NAMES = [
  '', // hero - no label
  'Il Vuoto',
  'Il Big Bang',
  'Le Prime Stelle',
  'Le Ere Glaciali',
  'L\'Esplosione',
  'L\'Intelligenza',
  'La Singolarità',
  'Genealogia',
  'L\'Orizzonte',
  'I Numeri',
  'La Mappa',
  '', // credits - no label
]

interface SlideProgressProps {
  activeSlide: number
  totalSlides: number
}

export function SlideProgress({ activeSlide, totalSlides }: SlideProgressProps) {
  const name = SLIDE_NAMES[activeSlide] || ''
  const num = String(activeSlide + 1).padStart(2, '0')
  const total = String(totalSlides).padStart(2, '0')

  // Hide on hero and credits
  if (activeSlide === 0 || activeSlide === totalSlides - 1) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
      <AnimatePresence mode="wait">
        <motion.span
          key={activeSlide}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="font-mono text-[9px] md:text-[11px] text-white/25"
        >
          {num} / {total}
        </motion.span>
      </AnimatePresence>

      {name && (
        <>
          <span className="text-white/10">·</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-display text-[9px] md:text-[11px] text-white/20"
            >
              {name}
            </motion.span>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
