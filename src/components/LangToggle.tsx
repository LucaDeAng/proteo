import { motion } from 'framer-motion'
import { useLang } from '../hooks/useLang'

export function LangToggle() {
  const { lang, toggle } = useLang()

  return (
    <button
      onClick={toggle}
      className="fixed top-6 left-6 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 cursor-pointer"
      aria-label="Toggle language"
    >
      <motion.span
        animate={{ color: lang === 'it' ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
        transition={{ duration: 0.3 }}
        className="text-xs font-mono font-medium"
      >
        IT
      </motion.span>
      <span className="text-white/20 text-xs">/</span>
      <motion.span
        animate={{ color: lang === 'en' ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
        transition={{ duration: 0.3 }}
        className="text-xs font-mono font-medium"
      >
        EN
      </motion.span>
    </button>
  )
}
