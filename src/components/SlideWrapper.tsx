import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface SlideWrapperProps {
  index: number
  active: boolean
  children: ReactNode
  canvas?: ReactNode
  className?: string
  chapter?: number
  quote?: string
  quoteAuthor?: string
  stats?: Array<{ value: string; label: string; color?: string }>
}

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function SlideWrapper({
  index,
  active,
  children,
  canvas,
  className = '',
  chapter,
  quote,
  quoteAuthor,
  stats,
}: SlideWrapperProps) {
  return (
    <section
      data-slide={index}
      className={`relative h-screen w-full flex-shrink-0 snap-start overflow-hidden ${className}`}
    >
      {/* Ghost chapter number */}
      {chapter != null && (
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 right-8 z-20 pointer-events-none select-none font-display text-[12rem] leading-none text-white/[0.03] hidden md:block"
        >
          {String(chapter).padStart(2, '0')}
        </motion.span>
      )}

      {/* Canvas background layer — subtle zoom-in when active */}
      {canvas && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.08, opacity: 0.3 }}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0.3 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {canvas}
        </motion.div>
      )}

      {/* Content overlay */}
      <div className="relative z-10 h-full w-full flex items-center">
        <motion.div
          className="w-full"
          initial="hidden"
          animate={active ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {},
          }}
        >
          {children}

          {/* Quote block */}
          {quote && quoteAuthor && (
            <motion.blockquote
              variants={textVariants}
              custom={4}
              className="mt-8 border-l-2 border-white/10 pl-4 max-w-md quote-glow"
            >
              <p className="italic text-white/40 text-sm leading-relaxed">{quote}</p>
              <cite className="mt-2 block font-mono text-xs text-white/30 not-italic">
                — {quoteAuthor}
              </cite>
            </motion.blockquote>
          )}

          {/* Stat pills */}
          {stats && stats.length > 0 && (
            <motion.div
              variants={textVariants}
              custom={5}
              className="mt-4 flex flex-wrap gap-3"
            >
              {stats.map((stat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 stat-pill cursor-default"
                >
                  <span
                    className="font-mono font-bold text-sm"
                    style={stat.color ? { color: stat.color } : undefined}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/40">{stat.label}</span>
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export function SlideTag({ children }: { children: ReactNode }) {
  return (
    <motion.span
      variants={textVariants}
      custom={0}
      className="inline-block font-mono text-xs tracking-[0.3em] uppercase text-white/50 mb-4"
    >
      {children}
    </motion.span>
  )
}

export function SlideTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.h2
      variants={textVariants}
      custom={1}
      className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6 ${className}`}
    >
      {children}
    </motion.h2>
  )
}

const wordVariants = {
  hidden: { opacity: 0, y: 8, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function SlideBody({ children }: { children: ReactNode }) {
  // If children is a string, do word-by-word reveal
  if (typeof children === 'string') {
    const words = children.split(' ')
    return (
      <motion.p
        variants={textVariants}
        custom={2}
        className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            custom={i}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    )
  }

  return (
    <motion.p
      variants={textVariants}
      custom={2}
      className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed"
    >
      {children}
    </motion.p>
  )
}

export function MilestoneCard({ year, name, description, color }: { year: number; name: string; description: string; color: string }) {
  return (
    <motion.div
      variants={textVariants}
      custom={3}
      className="mt-6 flex gap-4 items-start p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-[90vw] md:max-w-lg milestone-card"
    >
      <span className="font-mono text-sm shrink-0" style={{ color }}>{year}</span>
      <div>
        <span className="font-semibold text-white text-sm">{name}</span>
        <p className="text-white/50 text-xs mt-1 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
