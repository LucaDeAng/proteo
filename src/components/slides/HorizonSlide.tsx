import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { createNoise2D } from 'simplex-noise'
import { useCanvas } from '../canvas/useCanvas'
import { useLang } from '../../hooks/useLang'

interface Props {
  active: boolean
  index: number
}

interface FutureStar {
  x: number
  y: number
  r: number
  color: string
  phase: number
  flickerSpeed: number
  label: string
  labelEn: string
}

const FUTURE_THEMES: Omit<FutureStar, 'x' | 'y' | 'phase'>[] = [
  { r: 14, color: '#facc15', flickerSpeed: 1.2, label: 'AGI', labelEn: 'AGI' },
  { r: 11, color: '#c084fc', flickerSpeed: 0.9, label: 'Agenti Autonomi', labelEn: 'Autonomous Agents' },
  { r: 12, color: '#34d399', flickerSpeed: 1.5, label: 'AI + Scienza', labelEn: 'AI + Science' },
  { r: 10, color: '#38bdf8', flickerSpeed: 1.1, label: 'AI Embodied', labelEn: 'Embodied AI' },
  { r: 9, color: '#f97316', flickerSpeed: 1.8, label: 'Quantum + AI', labelEn: 'Quantum + AI' },
  { r: 11, color: '#ec4899', flickerSpeed: 1.3, label: 'AI Creativa', labelEn: 'Creative AI' },
  { r: 8, color: '#a3e635', flickerSpeed: 2.0, label: 'Open Source Globale', labelEn: 'Global Open Source' },
  { r: 10, color: '#fbbf24', flickerSpeed: 1.0, label: 'Governance AI', labelEn: 'AI Governance' },
  { r: 9, color: '#67e8f9', flickerSpeed: 1.6, label: 'Brain-Computer', labelEn: 'Brain-Computer' },
  { r: 12, color: '#f472b6', flickerSpeed: 0.8, label: 'Coscienza Artificiale?', labelEn: 'Artificial Consciousness?' },
]

export default function HorizonSlide({ active, index }: Props) {
  const { lang } = useLang()
  const noise2D = useMemo(() => createNoise2D(), [])

  const stars = useMemo<FutureStar[]>(() => {
    // Arrange in a gentle arc across the screen
    return FUTURE_THEMES.map((theme, i) => {
      const angle = -Math.PI * 0.15 + (i / (FUTURE_THEMES.length - 1)) * Math.PI * 0.3
      const spread = 0.35
      return {
        ...theme,
        x: 0.5 + Math.cos(angle + Math.PI / 2) * spread * (0.7 + (i % 3) * 0.15),
        y: 0.35 + Math.sin(angle) * 0.2 + (i % 2) * 0.08,
        phase: i * 1.7,
      }
    })
  }, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    // Background
    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    // Horizon glow at bottom — the future is dawning
    const horizonGrad = ctx.createLinearGradient(0, h * 0.6, 0, h)
    horizonGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
    horizonGrad.addColorStop(0.5, 'rgba(100, 50, 180, 0.04)')
    horizonGrad.addColorStop(0.8, 'rgba(250, 200, 50, 0.03)')
    horizonGrad.addColorStop(1, 'rgba(250, 200, 50, 0.06)')
    ctx.fillStyle = horizonGrad
    ctx.fillRect(0, 0, w, h)

    // Forming nebulae — matter condensing
    for (let i = 0; i < 5; i++) {
      const nx = w * (0.15 + i * 0.18) + noise2D(i * 3.7, t * 0.03) * 80
      const ny = h * (0.3 + (i % 2) * 0.15) + noise2D(i * 3.7 + 50, t * 0.025) * 60
      const nr = 100 + noise2D(i * 2.1, t * 0.02) * 40
      const hue = 260 + i * 25
      const nebGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr)
      nebGrad.addColorStop(0, `hsla(${hue}, 60%, 40%, ${0.04 + noise2D(i, t * 0.05) * 0.02})`)
      nebGrad.addColorStop(0.6, `hsla(${hue}, 50%, 30%, 0.015)`)
      nebGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = nebGrad
      ctx.fillRect(0, 0, w, h)
    }

    // Future stars — flickering, uncertain, forming
    for (const star of stars) {
      const sx = star.x * w
      const sy = star.y * h

      // Irregular flicker — not stable like historical stars
      const flicker1 = Math.sin(t * star.flickerSpeed + star.phase) * 0.5 + 0.5
      const flicker2 = Math.sin(t * star.flickerSpeed * 1.7 + star.phase * 2.3) * 0.5 + 0.5
      const flicker = flicker1 * 0.6 + flicker2 * 0.4 // combined irregular pulse
      const alpha = 0.15 + flicker * 0.65

      const hex = star.color
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)

      // Outer nebula cloud around each star — it's still forming
      const cloudR = star.r * 5 + noise2D(star.phase, t * 0.1) * star.r * 2
      const cloudGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, cloudR)
      cloudGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.06 * alpha})`)
      cloudGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.02 * alpha})`)
      cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = cloudGrad
      ctx.beginPath()
      ctx.arc(sx, sy, cloudR, 0, Math.PI * 2)
      ctx.fill()

      // Star core — flickering
      const coreR = star.r * (0.5 + flicker * 0.5)
      const coreGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, coreR)
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.5 * alpha})`)
      coreGrad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${0.6 * alpha})`)
      coreGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(sx, sy, coreR, 0, Math.PI * 2)
      ctx.fill()

      // Label below star
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + flicker * 0.3})`
      ctx.font = '10px "Space Grotesk", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(lang === 'it' ? star.label : star.labelEn, sx, sy + star.r * 2 + 16)
    }

    // Connecting filaments between nearby future themes — forming constellations
    ctx.lineWidth = 0.5
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const a = stars[i], b = stars[j]
        const ax = a.x * w, ay = a.y * h
        const bx = b.x * w, by = b.y * h
        const dist = Math.hypot(ax - bx, ay - by)
        if (dist < w * 0.22) {
          const flickA = Math.sin(t * a.flickerSpeed + a.phase) * 0.5 + 0.5
          const flickB = Math.sin(t * b.flickerSpeed + b.phase) * 0.5 + 0.5
          const lineAlpha = (1 - dist / (w * 0.22)) * 0.08 * (flickA + flickB) / 2
          ctx.strokeStyle = `rgba(200, 180, 255, ${lineAlpha})`
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          const midX = (ax + bx) / 2 + noise2D(i + j * 10, t * 0.08) * 20
          const midY = (ay + by) / 2 + noise2D(i * 10 + j, t * 0.08) * 20
          ctx.quadraticCurveTo(midX, midY, bx, by)
          ctx.stroke()
        }
      }
    }
  }, [stars, noise2D, lang])

  const canvasRef = useCanvas({ draw, active })

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ display: 'block' }}
      />

      {/* Bottom text overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end items-center pb-16 px-8 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-mono text-xs tracking-[0.3em] uppercase text-white/30 mb-4"
        >
          {lang === 'it' ? 'Oltre la singolarita' : 'Beyond the singularity'}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4"
          style={{
            background: 'linear-gradient(135deg, #c084fc 0%, #facc15 50%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {lang === 'it' ? "L'Orizzonte" : 'The Horizon'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-white/40 text-sm sm:text-base text-center max-w-lg leading-relaxed"
        >
          {lang === 'it'
            ? 'Le stelle del futuro stanno ancora formandosi. AGI, agenti autonomi, AI cosciente — sono nebulose che si condensano. Non sappiamo quali si accenderanno. Ma l\'universo dell\'intelligenza continua ad espandersi.'
            : 'The stars of the future are still forming. AGI, autonomous agents, conscious AI — they are nebulae condensing. We don\'t know which ones will ignite. But the universe of intelligence keeps expanding.'
          }
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="text-white/20 text-xs font-mono mt-6 italic"
        >
          {lang === 'it' ? '"Il futuro e\' gia\' qui, solo non e\' distribuito uniformemente."' : '"The future is already here — it\'s just not evenly distributed."'}
          <span className="ml-2 not-italic">— William Gibson</span>
        </motion.p>
      </div>
    </section>
  )
}
