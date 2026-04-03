import { useCallback, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createNoise2D } from 'simplex-noise'
import { useCanvas } from '../canvas/useCanvas'
import { useLang } from '../../hooks/useLang'
import type { Lang } from '../../hooks/useLang'

interface Props {
  active: boolean
  index: number
}

interface ModelNode {
  id: string
  name: string
  company: string
  year: number
  color: string
  description: { it: string; en: string }
  ancestors: string[] // ids of historical discoveries
}

interface DiscoveryNode {
  id: string
  name: string
  year: number
  color: string
  description: { it: string; en: string }
}

const DISCOVERIES: DiscoveryNode[] = [
  { id: 'neuron', name: 'Neurone Artificiale', year: 1943, color: '#7c3aed', description: { it: 'McCulloch & Pitts — il primo modello matematico di neurone', en: 'McCulloch & Pitts — the first mathematical neuron model' } },
  { id: 'info-theory', name: 'Teoria Informazione', year: 1948, color: '#7c3aed', description: { it: 'Shannon — la matematica della comunicazione digitale', en: 'Shannon — the mathematics of digital communication' } },
  { id: 'perceptron', name: 'Perceptron', year: 1958, color: '#f97316', description: { it: 'Rosenblatt — la prima rete neurale hardware', en: 'Rosenblatt — the first hardware neural network' } },
  { id: 'backprop', name: 'Backpropagation', year: 1986, color: '#38bdf8', description: { it: 'Rumelhart, Hinton & Williams — l\'algoritmo che addestra le reti', en: 'Rumelhart, Hinton & Williams — the algorithm that trains networks' } },
  { id: 'lenet', name: 'LeNet / CNN', year: 1989, color: '#38bdf8', description: { it: 'LeCun — reti convoluzionali per il riconoscimento visivo', en: 'LeCun — convolutional networks for visual recognition' } },
  { id: 'lstm', name: 'LSTM', year: 1997, color: '#34d399', description: { it: 'Hochreiter & Schmidhuber — memoria a lungo termine nelle reti', en: 'Hochreiter & Schmidhuber — long-term memory in networks' } },
  { id: 'imagenet', name: 'ImageNet', year: 2009, color: '#34d399', description: { it: 'Fei-Fei Li — 14M di immagini che hanno rivoluzionato il training', en: 'Fei-Fei Li — 14M images that revolutionized training' } },
  { id: 'alexnet', name: 'AlexNet', year: 2012, color: '#c084fc', description: { it: 'Krizhevsky, Sutskever & Hinton — il deep learning diventa reale', en: 'Krizhevsky, Sutskever & Hinton — deep learning becomes real' } },
  { id: 'gan', name: 'GAN', year: 2014, color: '#c084fc', description: { it: 'Goodfellow — reti che generano immagini dal nulla', en: 'Goodfellow — networks that generate images from nothing' } },
  { id: 'transformer', name: 'Transformer', year: 2017, color: '#c084fc', description: { it: 'Vaswani et al. — Attention Is All You Need', en: 'Vaswani et al. — Attention Is All You Need' } },
  { id: 'rlhf', name: 'RLHF', year: 2020, color: '#facc15', description: { it: 'Allineamento tramite feedback umano', en: 'Alignment through human feedback' } },
  { id: 'diffusion', name: 'Diffusion Models', year: 2020, color: '#facc15', description: { it: 'Generazione di immagini tramite denoising progressivo', en: 'Image generation through progressive denoising' } },
  { id: 'scaling', name: 'Scaling Laws', year: 2020, color: '#facc15', description: { it: 'Kaplan et al. — piu\' dati e parametri = piu\' intelligenza', en: 'Kaplan et al. — more data and parameters = more intelligence' } },
]

const MODELS: ModelNode[] = [
  { id: 'gpt4', name: 'GPT-4', company: 'OpenAI', year: 2023, color: '#10b981',
    description: { it: 'Multimodale, ragionamento avanzato', en: 'Multimodal, advanced reasoning' },
    ancestors: ['neuron', 'info-theory', 'perceptron', 'backprop', 'lstm', 'transformer', 'scaling', 'rlhf'] },
  { id: 'claude', name: 'Claude Opus 4', company: 'Anthropic', year: 2025, color: '#f59e0b',
    description: { it: 'AI sicura con ragionamento esteso', en: 'Safe AI with extended reasoning' },
    ancestors: ['neuron', 'info-theory', 'backprop', 'transformer', 'scaling', 'rlhf'] },
  { id: 'gemini', name: 'Gemini', company: 'Google', year: 2023, color: '#3b82f6',
    description: { it: 'Nativo multimodale da Google', en: 'Natively multimodal by Google' },
    ancestors: ['neuron', 'info-theory', 'backprop', 'lenet', 'imagenet', 'alexnet', 'transformer', 'scaling'] },
  { id: 'llama', name: 'Llama 3', company: 'Meta', year: 2024, color: '#8b5cf6',
    description: { it: 'Open source, prestazioni top', en: 'Open source, top performance' },
    ancestors: ['neuron', 'info-theory', 'backprop', 'transformer', 'scaling', 'rlhf'] },
  { id: 'mistral', name: 'Mixtral', company: 'Mistral', year: 2024, color: '#ef4444',
    description: { it: 'Mixture of Experts, ultra efficiente', en: 'Mixture of Experts, ultra efficient' },
    ancestors: ['neuron', 'info-theory', 'backprop', 'transformer', 'scaling'] },
  { id: 'sd3', name: 'Stable Diffusion 3', company: 'Stability', year: 2024, color: '#ec4899',
    description: { it: 'Generazione immagini open source', en: 'Open source image generation' },
    ancestors: ['neuron', 'backprop', 'lenet', 'imagenet', 'alexnet', 'gan', 'diffusion'] },
  { id: 'sora', name: 'Sora', company: 'OpenAI', year: 2024, color: '#10b981',
    description: { it: 'Generazione video da testo', en: 'Video generation from text' },
    ancestors: ['neuron', 'backprop', 'lenet', 'gan', 'transformer', 'diffusion', 'scaling'] },
]

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

export default function LineageSlide({ active, index }: Props) {
  const { lang } = useLang()
  const noise2D = useMemo(() => createNoise2D(), [])
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const [hoveredDiscovery, setHoveredDiscovery] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string; sub: string; color: string } | null>(null)

  // Pre-calculate positions
  const modelPositions = useMemo(() => {
    return MODELS.map((m, i) => ({
      ...m,
      fx: (i + 0.5) / MODELS.length, // fractional x (0-1)
      fy: 0.12, // top area
    }))
  }, [])

  const discoveryPositions = useMemo(() => {
    return DISCOVERIES.map((d, i) => ({
      ...d,
      fx: (i + 0.5) / DISCOVERIES.length,
      fy: 0.82, // bottom area
    }))
  }, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    // Subtle ambient nebula
    const cx = w / 2, cy = h / 2
    const nebGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.6)
    nebGrad.addColorStop(0, 'rgba(100, 50, 180, 0.04)')
    nebGrad.addColorStop(0.5, 'rgba(50, 30, 120, 0.02)')
    nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = nebGrad
    ctx.fillRect(0, 0, w, h)

    // Draw connections first (behind nodes)
    for (const model of modelPositions) {
      const mx = model.fx * w
      const my = model.fy * h
      const isModelHovered = hoveredModel === model.id
      const isAnyHovered = hoveredModel !== null || hoveredDiscovery !== null

      for (const ancId of model.ancestors) {
        const disc = discoveryPositions.find(d => d.id === ancId)
        if (!disc) continue

        const dx = disc.fx * w
        const dy = disc.fy * h
        const isDiscHovered = hoveredDiscovery === ancId
        const isLineHighlighted = isModelHovered || isDiscHovered

        // Determine alpha
        let alpha = 0.08
        if (isAnyHovered) {
          alpha = isLineHighlighted ? 0.5 : 0.02
        }

        // Bezier curve
        const midY = (my + dy) / 2 + noise2D(model.fx * 10 + disc.fx * 10, t * 0.1) * 15
        const [r, g, b] = hexToRgb(model.color)

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.lineWidth = isLineHighlighted ? 2 : 0.8
        ctx.beginPath()
        ctx.moveTo(mx, my)
        ctx.quadraticCurveTo((mx + dx) / 2, midY, dx, dy)
        ctx.stroke()

        // Traveling pulse on highlighted lines
        if (isLineHighlighted) {
          const pulseT = ((t * 0.5 + model.fx * 3 + disc.fx * 2) % 1)
          const pulseBT = 1 - pulseT
          const px = mx * pulseBT * pulseBT + ((mx + dx) / 2) * 2 * pulseBT * pulseT + dx * pulseT * pulseT
          const py = my * pulseBT * pulseBT + midY * 2 * pulseBT * pulseT + dy * pulseT * pulseT

          const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 8)
          pulseGrad.addColorStop(0, `rgba(255, 255, 255, 0.6)`)
          pulseGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
          ctx.fillStyle = pulseGrad
          ctx.beginPath()
          ctx.arc(px, py, 8, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Draw discovery nodes (bottom)
    for (const disc of discoveryPositions) {
      const dx = disc.fx * w
      const dy = disc.fy * h
      const isHighlighted = hoveredDiscovery === disc.id ||
        (hoveredModel !== null && modelPositions.find(m => m.id === hoveredModel)?.ancestors.includes(disc.id))
      const isAnyHovered = hoveredModel !== null || hoveredDiscovery !== null
      const nodeAlpha = isAnyHovered ? (isHighlighted ? 1 : 0.15) : 0.6
      const [r, g, b] = hexToRgb(disc.color)
      const nodeR = isHighlighted ? 7 : 5

      // Glow
      if (isHighlighted) {
        const glowGrad = ctx.createRadialGradient(dx, dy, 0, dx, dy, 25)
        glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`)
        glowGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(dx, dy, 25, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(dx, dy, nodeR, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${nodeAlpha})`
      ctx.fill()

      // Label
      ctx.fillStyle = `rgba(255, 255, 255, ${isHighlighted ? 0.9 : nodeAlpha * 0.6})`
      ctx.font = `${isHighlighted ? '11' : '9'}px "Inter", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(disc.name, dx, dy + nodeR + 14)
      ctx.font = '8px "JetBrains Mono", monospace'
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${nodeAlpha * 0.7})`
      ctx.fillText(String(disc.year), dx, dy + nodeR + 26)
    }

    // Draw model nodes (top)
    for (const model of modelPositions) {
      const mx = model.fx * w
      const my = model.fy * h
      const isHighlighted = hoveredModel === model.id ||
        (hoveredDiscovery !== null && model.ancestors.includes(hoveredDiscovery))
      const isAnyHovered = hoveredModel !== null || hoveredDiscovery !== null
      const nodeAlpha = isAnyHovered ? (isHighlighted ? 1 : 0.15) : 0.8
      const [r, g, b] = hexToRgb(model.color)
      const nodeR = isHighlighted ? 14 : 10

      // Outer glow
      const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, nodeR * 3)
      const glowA = isHighlighted ? 0.25 : 0.08
      glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowA * nodeAlpha})`)
      glowGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(mx, my, nodeR * 3, 0, Math.PI * 2)
      ctx.fill()

      // Node body
      const bodyGrad = ctx.createRadialGradient(mx, my, 0, mx, my, nodeR)
      bodyGrad.addColorStop(0, `rgba(255, 255, 255, ${0.7 * nodeAlpha})`)
      bodyGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.8 * nodeAlpha})`)
      bodyGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${0.3 * nodeAlpha})`)
      ctx.fillStyle = bodyGrad
      ctx.beginPath()
      ctx.arc(mx, my, nodeR, 0, Math.PI * 2)
      ctx.fill()

      // Label
      ctx.fillStyle = `rgba(255, 255, 255, ${isHighlighted ? 0.95 : nodeAlpha * 0.8})`
      ctx.font = `bold ${isHighlighted ? '13' : '11'}px "Space Grotesk", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(model.name, mx, my - nodeR - 10)
      ctx.font = '9px "Inter", sans-serif'
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${nodeAlpha * 0.7})`
      ctx.fillText(model.company, mx, my - nodeR - 24)
    }
  }, [hoveredModel, hoveredDiscovery, modelPositions, discoveryPositions, noise2D])

  const canvasRef = useCanvas({ draw, active })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const w = rect.width, h = rect.height

    let foundModel: string | null = null
    let foundDisc: string | null = null
    let tipData: typeof tooltip = null

    // Check models
    for (const model of modelPositions) {
      const px = model.fx * w, py = model.fy * h
      if (Math.hypot(mx - px, my - py) < 18) {
        foundModel = model.id
        tipData = {
          x: e.clientX, y: e.clientY,
          text: model.name,
          sub: model.description[lang as Lang],
          color: model.color,
        }
        break
      }
    }

    // Check discoveries
    if (!foundModel) {
      for (const disc of discoveryPositions) {
        const px = disc.fx * w, py = disc.fy * h
        if (Math.hypot(mx - px, my - py) < 14) {
          foundDisc = disc.id
          tipData = {
            x: e.clientX, y: e.clientY,
            text: `${disc.name} (${disc.year})`,
            sub: disc.description[lang as Lang],
            color: disc.color,
          }
          break
        }
      }
    }

    setHoveredModel(foundModel)
    setHoveredDiscovery(foundDisc)
    setTooltip(tipData)
  }, [modelPositions, discoveryPositions, lang])

  const handleMouseLeave = useCallback(() => {
    setHoveredModel(null)
    setHoveredDiscovery(null)
    setTooltip(null)
  }, [])

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden"
    >
      {/* Title */}
      <div className="absolute top-6 left-0 right-0 z-20 text-center pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-xl sm:text-2xl md:text-3xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {lang === 'it' ? "L'Albero della Conoscenza" : 'The Tree of Knowledge'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-white/30 text-xs mt-1.5 font-mono"
        >
          {lang === 'it' ? 'Passa il mouse per esplorare le connessioni' : 'Hover to explore the connections'}
        </motion.p>
      </div>

      {/* Axis labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute left-4 top-[10%] z-20 pointer-events-none"
      >
        <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest writing-mode-vertical"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          {lang === 'it' ? 'MODELLI ATTUALI' : 'CURRENT MODELS'}
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute left-4 bottom-[12%] z-20 pointer-events-none"
      >
        <span className="text-white/20 text-[10px] font-mono uppercase tracking-widest"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          {lang === 'it' ? 'SCOPERTE FONDAMENTALI' : 'KEY DISCOVERIES'}
        </span>
      </motion.div>

      {/* Canvas (no pointer events — scroll-safe) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ display: 'block' }}
      />
      {/* Transparent interaction overlay */}
      <div
        className="absolute inset-0 z-10 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className="fixed z-50 pointer-events-none p-3 rounded-lg max-w-xs"
            style={{
              left: tooltip.x + 16,
              top: tooltip.y - 8,
              background: 'rgba(10, 5, 30, 0.9)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${tooltip.color}33`,
            }}
          >
            <p className="font-display font-semibold text-sm text-white">{tooltip.text}</p>
            <p className="text-xs text-white/50 mt-1">{tooltip.sub}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
