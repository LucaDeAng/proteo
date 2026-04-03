import { useCallback, useRef, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createNoise2D } from 'simplex-noise'
import { useCanvas } from '../canvas/useCanvas'
import { milestones, eraColors, eras, t, type Milestone, type Era } from '../../data/aiHistory'
import { useLang } from '../../hooks/useLang'

interface GalaxyMapSlideProps {
  active: boolean
  index: number
}

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
      r: m.significance * 2 + 2,
      milestone: m,
    }
  })
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function eraLabel(era: Era): string {
  const map: Record<Era, string> = {
    void: 'Proto-Materia',
    bigbang: 'Big Bang',
    stars: "Eta dell'Oro",
    ice: 'Inverno',
    cambrian: 'Rinascimento',
    intelligence: 'Deep Learning',
    singularity: 'Singolarita',
  }
  return map[era]
}

export default function GalaxyMapSlide({ active, index }: GalaxyMapSlideProps) {
  const { lang } = useLang()
  const noise2D = useMemo(() => createNoise2D(), [])
  const starsRef = useRef<StarPos[]>([])
  const prevSizeRef = useRef({ w: 0, h: 0 })
  const nebulaImageRef = useRef<ImageData | null>(null)

  const [hovered, setHovered] = useState<Milestone | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const sizeChanged =
        Math.abs(prevSizeRef.current.w - w) > 50 ||
        Math.abs(prevSizeRef.current.h - h) > 50

      if (sizeChanged || starsRef.current.length === 0) {
        prevSizeRef.current = { w, h }
        starsRef.current = layoutStars(w, h)
        nebulaImageRef.current = null // force nebula recalculation
      }

      // Background
      ctx.fillStyle = '#020010'
      ctx.fillRect(0, 0, w, h)

      // Pre-render nebula to ImageData for performance (only once per resize)
      if (!nebulaImageRef.current) {
        const step = 4
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = w
        tempCanvas.height = h
        const tCtx = tempCanvas.getContext('2d')!
        tCtx.fillStyle = 'rgba(0,0,0,0)'
        tCtx.fillRect(0, 0, w, h)

        // Layered nebula clouds
        const cx = w / 2
        const cy = h / 2
        for (let x = 0; x < w; x += step) {
          for (let y = 0; y < h; y += step) {
            const n1 = noise2D(x * 0.003, y * 0.003) * 0.5 + 0.5
            const n2 = noise2D(x * 0.006 + 100, y * 0.006 + 100) * 0.5 + 0.5
            const n3 = noise2D(x * 0.0015 + 200, y * 0.0015 + 200) * 0.5 + 0.5

            // Distance from center affects intensity (brighter near center)
            const dx = (x - cx) / w
            const dy = (y - cy) / h
            const distFade = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.5)

            const intensity = (n1 * n2 * 0.1 + n3 * 0.03) * distFade
            if (intensity > 0.015) {
              const hue = 250 + n1 * 50 + n2 * 40
              const sat = 50 + n3 * 30
              tCtx.fillStyle = `hsla(${hue}, ${sat}%, 28%, ${intensity})`
              tCtx.fillRect(x, y, step, step)
            }
          }
        }

        // Radial nebula glow blobs for color variety
        const blobColors: [number, number, number, number][] = [
          [120, 60, 200, 0.04],
          [200, 100, 50, 0.03],
          [60, 40, 150, 0.035],
          [180, 140, 60, 0.025],
        ]
        for (let i = 0; i < blobColors.length; i++) {
          const bx = cx + noise2D(i * 3, 0.5) * w * 0.3
          const by = cy + noise2D(0.5, i * 3) * h * 0.3
          const br = Math.min(w, h) * 0.25
          const [r, g, b, a] = blobColors[i]
          const grad = tCtx.createRadialGradient(bx, by, 0, bx, by, br)
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`)
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
          tCtx.fillStyle = grad
          tCtx.fillRect(0, 0, w, h)
        }

        nebulaImageRef.current = tCtx.getImageData(0, 0, w, h)
      }

      // Draw cached nebula
      ctx.putImageData(nebulaImageRef.current, 0, 0)

      // Subtle animated nebula shimmer on top (very light, uses time)
      const shimmerCx = w * 0.5 + Math.sin(t * 0.1) * w * 0.05
      const shimmerCy = h * 0.5 + Math.cos(t * 0.08) * h * 0.05
      const shimmerGrad = ctx.createRadialGradient(
        shimmerCx, shimmerCy, 0,
        shimmerCx, shimmerCy, Math.min(w, h) * 0.4
      )
      const shimmerAlpha = 0.015 + Math.sin(t * 0.3) * 0.005
      shimmerGrad.addColorStop(0, `rgba(160, 120, 240, ${shimmerAlpha})`)
      shimmerGrad.addColorStop(0.5, `rgba(100, 80, 200, ${shimmerAlpha * 0.5})`)
      shimmerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = shimmerGrad
      ctx.fillRect(0, 0, w, h)

      // Faint spiral arm hints
      ctx.save()
      ctx.globalAlpha = 0.02
      ctx.strokeStyle = 'rgba(180, 160, 240, 1)'
      ctx.lineWidth = 1.5
      for (let arm = 0; arm < 3; arm++) {
        ctx.beginPath()
        for (let i = 0; i < 250; i++) {
          const angle = i * 0.07 + arm * ((Math.PI * 2) / 3)
          const r = i * Math.min(w, h) * 0.002
          const px = w * 0.5 + Math.cos(angle) * r
          const py = h * 0.5 + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      ctx.restore()

      // Draw stars (milestones)
      const stars = starsRef.current
      for (let i = 0; i < stars.length; i++) {
        const { x, y, r, milestone } = stars[i]
        const colors = eraColors[milestone.era]
        const [cr, cg, cb] = hexToRgb(colors.main)
        const [gr, gg, gb] = hexToRgb(colors.glow)

        // Organic twinkle using multiple frequencies
        const twinkle =
          Math.sin(t * (1.0 + (i % 7) * 0.12) + i * 0.9) * 0.15 +
          Math.sin(t * (0.5 + (i % 5) * 0.08) + i * 1.7) * 0.1 +
          0.75

        // Outer halo glow (all stars get some, larger for significant ones)
        const haloR = r * (milestone.significance >= 7 ? 5 : 3)
        const haloAlpha = milestone.significance >= 7 ? 0.14 : 0.06
        const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, haloR)
        haloGrad.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${haloAlpha * twinkle})`)
        haloGrad.addColorStop(0.3, `rgba(${gr}, ${gg}, ${gb}, ${haloAlpha * 0.4 * twinkle})`)
        haloGrad.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`)
        ctx.fillStyle = haloGrad
        ctx.beginPath()
        ctx.arc(x, y, haloR, 0, Math.PI * 2)
        ctx.fill()

        // Star body with radial gradient
        const bodyGrad = ctx.createRadialGradient(x, y, 0, x, y, r)
        bodyGrad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * twinkle})`)
        bodyGrad.addColorStop(0.3, `rgba(${cr}, ${cg}, ${cb}, ${0.75 * twinkle})`)
        bodyGrad.addColorStop(0.7, `rgba(${cr}, ${cg}, ${cb}, ${0.35 * twinkle})`)
        bodyGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`)
        ctx.fillStyle = bodyGrad
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()

        // Cross-flare spikes for landmark milestones (significance >= 9)
        if (milestone.significance >= 9) {
          const spikeLen = r * 3.5
          const spikeAlpha = 0.18 * twinkle
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${spikeAlpha})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(x - spikeLen, y)
          ctx.lineTo(x + spikeLen, y)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x, y - spikeLen)
          ctx.lineTo(x, y + spikeLen)
          ctx.stroke()

          // Diagonal spikes (fainter)
          const diagLen = spikeLen * 0.6
          const diagAlpha = spikeAlpha * 0.5
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${diagAlpha})`
          ctx.beginPath()
          ctx.moveTo(x - diagLen * 0.707, y - diagLen * 0.707)
          ctx.lineTo(x + diagLen * 0.707, y + diagLen * 0.707)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x + diagLen * 0.707, y - diagLen * 0.707)
          ctx.lineTo(x - diagLen * 0.707, y + diagLen * 0.707)
          ctx.stroke()
        }
      }
    },
    [noise2D]
  )

  const canvasRef = useCanvas({ draw, active })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      setMousePos({ x: e.clientX, y: e.clientY })

      let found: Milestone | null = null
      let minDist = Infinity
      for (const s of starsRef.current) {
        const d = Math.hypot(s.x - mx, s.y - my)
        const hitR = Math.max(s.r * 1.5, 12)
        if (d < hitR && d < minDist) {
          minDist = d
          found = s.milestone
        }
      }
      setHovered(found)
    },
    []
  )

  const handleMouseLeave = useCallback(() => setHovered(null), [])

  const hoveredEra = hovered ? eras.find(e => e.id === hovered.era) : null

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden"
    >
      {/* Canvas (no pointer events — scroll-safe) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ display: 'block' }}
      />
      {/* Transparent interaction overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ cursor: hovered ? 'pointer' : 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Title */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 pt-8 sm:pt-12 text-center pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold"
          style={{
            background:
              'linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #fbbf24 80%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          La Mappa dell&apos;Universo AI
        </h2>
        <p className="text-white/40 text-sm mt-2 font-mono tracking-wider">
          {milestones.length} MILESTONES &middot; 1950 &ndash; 2026
        </p>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && hoveredEra && (
          <motion.div
            key={hovered.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: mousePos.x + 16,
              top: mousePos.y - 8,
              maxWidth: 320,
            }}
          >
            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
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
              <h3 className="font-display font-semibold text-sm text-white mb-1">{hovered.name}</h3>
              <p className="text-white/60 text-xs leading-relaxed">{t(hovered.description, lang)}</p>
              {hovered.creator && (
                <p className="text-white/40 text-xs mt-2 font-mono italic">{hovered.creator}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 pb-6 sm:pb-8 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 px-4">
          {eras.map(era => (
            <div key={era.id} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: era.color }}
              />
              <span className="text-white/40 text-[10px] font-mono tracking-wide">
                {era.period}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
