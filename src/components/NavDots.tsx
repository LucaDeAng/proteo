import { motion } from 'framer-motion'

const slideLabels = [
  'Genesis',
  'Il Vuoto',
  'Big Bang',
  'Prime Stelle',
  'Ere Glaciali',
  'Esplosione',
  'Intelligenza',
  'Singolarità',
  'Genealogia',
  'L\'Orizzonte',
  'I Numeri',
  'La Mappa',
  'Credits',
]

interface NavDotsProps {
  active: number
  total: number
  onNavigate: (index: number) => void
}

export function NavDots({ active, total, onNavigate }: NavDotsProps) {
  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-end max-md:hidden"
      aria-label="Navigazione slide"
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          className="group flex items-center gap-2"
          aria-label={`Vai a ${slideLabels[i] || `slide ${i + 1}`}`}
          aria-current={i === active ? 'step' : undefined}
        >
          <span className="text-xs text-white/0 group-hover:text-white/70 transition-colors duration-300 font-mono whitespace-nowrap">
            {slideLabels[i]}
          </span>
          <motion.span
            className="block rounded-full border border-white/30"
            animate={{
              width: i === active ? 12 : 6,
              height: i === active ? 12 : 6,
              backgroundColor: i === active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
            }}
            transition={{ duration: 0.3 }}
          />
        </button>
      ))}
    </nav>
  )
}
