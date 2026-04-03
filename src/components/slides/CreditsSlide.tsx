import { motion } from 'framer-motion'
import { useLang } from '../../hooks/useLang'

interface Props {
  active: boolean
  index: number
}

export default function CreditsSlide({ active, index }: Props) {
  const { lang } = useLang()

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden bg-[#030014]"
    >
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center">
        {/* Logo/title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          GENESIS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/40 text-sm font-display tracking-[0.15em] uppercase mb-12"
        >
          {lang === 'it'
            ? "La Storia dell'Intelligenza Artificiale"
            : 'The History of Artificial Intelligence'}
        </motion.p>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6 mb-12"
        >
          <div>
            <p className="text-white/25 text-xs font-mono uppercase tracking-widest mb-1">
              {lang === 'it' ? 'Concept & Sviluppo' : 'Concept & Development'}
            </p>
            <p className="text-white/70 text-sm font-display">Luca De Angelis</p>
          </div>
          <div>
            <p className="text-white/25 text-xs font-mono uppercase tracking-widest mb-1">
              {lang === 'it' ? 'Costruito con' : 'Built with'}
            </p>
            <p className="text-white/70 text-sm font-display">
              Claude Code + React + Canvas + Framer Motion
            </p>
          </div>
          <div>
            <p className="text-white/25 text-xs font-mono uppercase tracking-widest mb-1">
              {lang === 'it' ? 'Fonti dati' : 'Data sources'}
            </p>
            <p className="text-white/50 text-xs max-w-sm">
              Wikipedia, arXiv, Papers with Code, HuggingFace
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent mb-8"
        />

        {/* Call to action */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-white/20 text-xs font-mono"
        >
          {lang === 'it'
            ? 'Scrolla verso l\'alto per rivivere il viaggio'
            : 'Scroll up to relive the journey'}
        </motion.p>

        {/* Year */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 text-white/10 text-xs font-mono"
        >
          MMXXVI
        </motion.p>
      </div>
    </section>
  )
}
