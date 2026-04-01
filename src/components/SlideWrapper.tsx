import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface SlideWrapperProps {
  index: number
  active: boolean
  children: ReactNode
  canvas?: ReactNode
  className?: string
}

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function SlideWrapper({ index, active, children, canvas, className = '' }: SlideWrapperProps) {
  return (
    <section
      data-slide={index}
      className={`relative h-screen w-full flex-shrink-0 snap-start overflow-hidden ${className}`}
    >
      {/* Canvas background layer */}
      {canvas && (
        <div className="absolute inset-0 z-0">
          {canvas}
        </div>
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

export function SlideBody({ children }: { children: ReactNode }) {
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
      className="mt-6 flex gap-4 items-start p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-lg"
    >
      <span className="font-mono text-sm shrink-0" style={{ color }}>{year}</span>
      <div>
        <span className="font-semibold text-white text-sm">{name}</span>
        <p className="text-white/50 text-xs mt-1 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
