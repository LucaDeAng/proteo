import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createNoise2D } from 'simplex-noise'
import { useCanvas } from '../canvas/useCanvas'
import { milestones, eraColors, eras, type Milestone, type Era } from '../../data/aiHistory'

interface Props {
  active: boolean
  index: number
}

const noise2D = createNoise2D()
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

interface StarPos {
  x: number
  y: number
  r: number
  milestone: Milestone
}

function layoutStars(w: number, h: number): StarPos[] {
  const cx = w / 2
  const cy = h / 2
  const maxR = Math.min(w, h) * 0.42
  const sorted = [...milestones].sort((a, b) => a.year - b.year)

  return sorted.map((m, i) => {
    const angle = i * GOLDEN_ANGLE
    const dist = Math.sqrt(i / sorted.length) * maxR
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: m.significance * 1.5 + 2,
      milestone: m,
    }
  })
}

export default function GalaxyMapSlide({ active, index }: Props) {
  const starsRef = useRef<StarPos[]>([])
  const [hovered, setHovered] = useState<Milestone | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    // Layout stars (recompute on resize)
    starsRef.current = layoutStars(w, h)

    // Background
    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    // Subtle nebula
    const cx = w / 2, cy = h / 2
    for (let i = 0; i < 4; i++) {
      const nx = cx + noise2D(i * 0.5, 0.01) * w * 0.3
      const ny = cy + noise2D(0.01, i * 0.5) * h * 0.3
      const r = Math.min(w, h) * 0.3
      const eraIdx = i % eras.length
      const col = eras[eraIdx].color
      const rgb = hexToRgb(col)
      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r)
      grad.addColorStop(0, `rgba(${rgb}, 0.04)`)
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    }

    // Draw stars
    for (const s of starsRef.current) {
      const { x, y, r, milestone } = s
      const colors = eraColors[milestone.era]
      const twinkle = 0.6 + Math.sin(t * 1.5 + milestone.year * 0.1) * 0.4

      // Glow
      if (milestone.significance >= 7) {
        const glowR = r * 4
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR)
        const rgb = hexToRgb(colors.glow)
        grad.addColorStop(0, `rgba(${rgb}, ${0.12 * twinkle})`)
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, glowR, 0, Math.PI * 2)
        ctx.fill()
      }

      // Star body
      ctx.beginPath()
      ctx.arc(x, y, r * twinkle, 0, Math.PI * 2)
      const rgb = hexToRgb(colors.main)
      ctx.fillStyle = `rgba(${rgb}, ${0.7 + twinkle * 0.3})`
      ctx.fill()

      // Bright core for significant stars
      if (milestone.significance >= 9) {
        ctx.beginPath()
        ctx.arc(x, y, r * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * twinkle})`
        ctx.fill()

        // Cross spikes
        const spikeLen = r * 3
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * twinkle})`
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(x - spikeLen, y)
        ctx.lineTo(x + spikeLen, y)
        ctx.moveTo(x, y - spikeLen)
        ctx.lineTo(x, y + spikeLen)
        ctx.stroke()
      }
    }
  }, [])

  const canvasRef = useCanvas({ draw, active })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    setMousePos({ x: e.clientX, y: e.clientY })

    let found: Milestone | null = null
    for (const s of starsRef.current) {
      const d = Math.hypot(s.x - mx, s.y - my)
      if (d < s.r + 8) {
        found = s.milestone
        break
      }
    }
    setHovered(found)
  }, [])

  const handleMouseLeave = useCallback(() => setHovered(null), [])

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden"
    >
      {/* Title */}
      <div className="absolute top-8 left-0 right-0 z-20 text-center pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          La Mappa dell'Universo AI
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/40 text-sm mt-2 font-mono"
        >
          {milestones.length} milestone &middot; 1679 — 2026
        </motion.p>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        style={{ display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none p-4 rounded-xl max-w-xs"
            style={{
              left: mousePos.x + 16,
              top: mousePos.y - 8,
              background: 'rgba(10, 5, 30, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: eraColors[hovered.era].main }}
              />
              <span className="font-mono text-xs text-white/50">{hovered.year}</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                style={{
                  backgroundColor: `${eraColors[hovered.era].main}22`,
                  color: eraColors[hovered.era].glow,
                }}
              >
                {eraLabel(hovered.era)}
              </span>
            </div>
            <p className="font-display font-semibold text-sm text-white mb-1">{hovered.name}</p>
            <p className="text-xs text-white/60 leading-relaxed">{hovered.description}</p>
            {hovered.creator && (
              <p className="text-xs text-white/40 mt-2 font-mono">{hovered.creator}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-4 flex-wrap px-4"
      >
        {eras.map((era) => (
          <div key={era.id} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: era.color }}
            />
            <span className="text-[10px] text-white/40 font-mono">{era.period}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

function eraLabel(era: Era): string {
  const map: Record<Era, string> = {
    void: 'Proto-Materia',
    bigbang: 'Big Bang',
    stars: 'Età dell\'Oro',
    ice: 'Inverno',
    cambrian: 'Rinascimento',
    intelligence: 'Deep Learning',
    singularity: 'Singolarità',
  }
  return map[era]
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
