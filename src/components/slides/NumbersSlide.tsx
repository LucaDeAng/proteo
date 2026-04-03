import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { milestones, eras } from '../../data/aiHistory'
import { useLang } from '../../hooks/useLang'

interface Props {
  active: boolean
  index: number
}

interface CounterProps {
  value: number
  suffix?: string
  active: boolean
  duration?: number
  color: string
}

function BigCounter({ value, suffix = '', active, duration = 2000, color }: CounterProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) { setDisplay(0); return }
    const start = performance.now()
    let raf = 0
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // ease out quart
      setDisplay(Math.round(value * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, value, duration])

  return (
    <div className="text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="block font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none glow-text"
        style={{ color }}
      >
        {display}{suffix}
      </motion.span>
    </div>
  )
}

export default function NumbersSlide({ active, index }: Props) {
  const { lang } = useLang()

  const totalYears = new Date().getFullYear() - 1950 // AI moderna dal Test di Turing
  const totalMilestones = milestones.length
  const totalEras = eras.length
  const latestYear = Math.max(...milestones.map(m => m.year))

  const stats = [
    {
      value: totalYears,
      suffix: '',
      color: '#c084fc',
      label: { it: 'anni di AI moderna', en: 'years of modern AI' },
      delay: 0,
    },
    {
      value: totalMilestones,
      suffix: '+',
      color: '#fbbf24',
      label: { it: 'milestone', en: 'milestones' },
      delay: 0.2,
    },
    {
      value: totalEras,
      suffix: '',
      color: '#34d399',
      label: { it: 'ere cosmiche', en: 'cosmic eras' },
      delay: 0.4,
    },
    {
      value: latestYear,
      suffix: '',
      color: '#38bdf8',
      label: { it: 'e il viaggio continua', en: 'and the journey continues' },
      delay: 0.6,
    },
  ]

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden bg-[#030014]"
    >
      {/* Subtle radial glow background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.08) 0%, rgba(0,0,0,0) 60%)',
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 mb-12"
        >
          {lang === 'it' ? 'La storia in numeri' : 'The story in numbers'}
        </motion.p>

        {/* Numbers grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: stat.delay, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <BigCounter
                value={stat.value}
                suffix={stat.suffix}
                active={active}
                color={stat.color}
                duration={2000 + i * 300}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: stat.delay + 0.8 }}
                className="block mt-3 text-sm text-white/50 font-display"
              >
                {stat.label[lang]}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-48 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-16 mb-8"
        />

        {/* Bottom quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="text-white/30 text-sm text-center max-w-lg italic"
        >
          {lang === 'it'
            ? '"In 76 anni, da una domanda su un foglio di carta a un\'intelligenza che scrive, vede, ragiona e agisce. Dove ci portera?"'
            : '"In 76 years, from a question on a piece of paper to an intelligence that writes, sees, reasons and acts. Where will it take us?"'
          }
        </motion.p>
      </div>
    </section>
  )
}
