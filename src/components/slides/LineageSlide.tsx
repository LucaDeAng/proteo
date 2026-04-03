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
  category: string
  categoryColor: string
  description: { it: string; en: string }
  ancestors: string[]
}

interface DiscoveryNode {
  id: string
  name: string
  year: number
  color: string
  description: { it: string; en: string }
  tier: 'foundation' | 'bridge' | 'technique'
}

// ── DISCOVERIES ──────────────────────────────────────────
// Reduced to 10 key discoveries — only those that DIFFERENTIATE models
const DISCOVERIES: DiscoveryNode[] = [
  { id: 'backprop', name: 'Backprop', year: 1986, color: '#64748b', tier: 'foundation',
    description: { it: "L'algoritmo che addestra tutte le reti neurali", en: 'The algorithm that trains all neural networks' } },
  { id: 'vae', name: 'VAE', year: 2013, color: '#a78bfa', tier: 'foundation',
    description: { it: 'Spazio latente per la generazione', en: 'Latent space for generation' } },
  { id: 'transformer', name: 'Transformer', year: 2017, color: '#f59e0b', tier: 'foundation',
    description: { it: 'Attention Is All You Need — l\'architettura universale', en: 'Attention Is All You Need — the universal architecture' } },
  { id: 'moe', name: 'MoE', year: 2017, color: '#06b6d4', tier: 'foundation',
    description: { it: 'Mixture of Experts — attivazione sparsa, piu\' efficienza', en: 'Mixture of Experts — sparse activation, more efficiency' } },
  { id: 'scaling', name: 'Scaling Laws', year: 2020, color: '#facc15', tier: 'foundation',
    description: { it: 'Piu\' compute e dati = piu\' intelligenza', en: 'More compute and data = more intelligence' } },
  { id: 'diffusion', name: 'Diffusion', year: 2020, color: '#e879f9', tier: 'foundation',
    description: { it: 'Generazione iterativa tramite denoising', en: 'Iterative generation through denoising' } },
  { id: 'vit', name: 'ViT', year: 2020, color: '#34d399', tier: 'foundation',
    description: { it: 'Vision Transformer — patch visive come token', en: 'Vision Transformer — visual patches as tokens' } },
  { id: 'rlhf', name: 'RLHF', year: 2020, color: '#fb923c', tier: 'foundation',
    description: { it: 'Allineamento AI con feedback umano', en: 'AI alignment with human feedback' } },
  { id: 'clip', name: 'CLIP', year: 2021, color: '#f472b6', tier: 'technique',
    description: { it: 'Allineamento testo-immagine per il conditioning', en: 'Text-image alignment for conditioning' } },
  { id: 'dit', name: 'DiT', year: 2023, color: '#fb923c', tier: 'technique',
    description: { it: 'Diffusion + Transformer — sostituisce U-Net', en: 'Diffusion + Transformer — replaces U-Net' } },
]

// ── MODELS ──────────────────────────────────────────────
// Ancestors = DIRECT technical dependencies that differentiate this model.
const CATEGORY_COLORS: Record<string, string> = {
  'LLM': '#3b82f6',
  'LLM MoE': '#06b6d4',
  'Multimodal': '#10b981',
  'Image Gen': '#d946ef',
  'Video Gen': '#ec4899',
  'Diffusion LLM': '#f97316',
}

const MODELS: ModelNode[] = [
  { id: 'gpt4', name: 'GPT-4', company: 'OpenAI', year: 2023,
    color: '#10b981', category: 'LLM MoE', categoryColor: CATEGORY_COLORS['LLM MoE'],
    description: { it: 'Multimodale, ragionamento avanzato, probabile MoE', en: 'Multimodal, advanced reasoning, likely MoE' },
    ancestors: ['transformer', 'rlhf', 'scaling', 'moe', 'vit'] },
  { id: 'claude', name: 'Claude Opus 4', company: 'Anthropic', year: 2025,
    color: '#f59e0b', category: 'LLM', categoryColor: CATEGORY_COLORS['LLM'],
    description: { it: 'AI sicura, Constitutional AI, ragionamento esteso', en: 'Safe AI, Constitutional AI, extended reasoning' },
    ancestors: ['transformer', 'rlhf', 'scaling'] },
  { id: 'gemini', name: 'Gemini', company: 'Google', year: 2023,
    color: '#3b82f6', category: 'Multimodal', categoryColor: CATEGORY_COLORS['Multimodal'],
    description: { it: 'Nativo multimodale, MoE, dalla culla di Transformer', en: 'Natively multimodal, MoE, from the cradle of Transformer' },
    ancestors: ['transformer', 'vit', 'moe', 'scaling', 'rlhf'] },
  { id: 'llama', name: 'Llama 3', company: 'Meta', year: 2024,
    color: '#8b5cf6', category: 'LLM', categoryColor: CATEGORY_COLORS['LLM'],
    description: { it: 'Dense Transformer, open source', en: 'Dense Transformer, open source' },
    ancestors: ['transformer', 'scaling', 'rlhf'] },
  { id: 'mistral', name: 'Mixtral', company: 'Mistral', year: 2024,
    color: '#ef4444', category: 'LLM MoE', categoryColor: CATEGORY_COLORS['LLM MoE'],
    description: { it: 'Sparse MoE, 8 esperti top-2', en: 'Sparse MoE, 8 experts top-2' },
    ancestors: ['transformer', 'moe', 'scaling'] },
  { id: 'sd3', name: 'SD 3', company: 'Stability', year: 2024,
    color: '#d946ef', category: 'Image Gen', categoryColor: CATEGORY_COLORS['Image Gen'],
    description: { it: 'Diffusion Transformer per immagini', en: 'Diffusion Transformer for images' },
    ancestors: ['diffusion', 'dit', 'clip', 'vae'] },
  { id: 'sora', name: 'Sora', company: 'OpenAI', year: 2024,
    color: '#ec4899', category: 'Video Gen', categoryColor: CATEGORY_COLORS['Video Gen'],
    description: { it: 'Spacetime DiT, patch 3D', en: 'Spacetime DiT, 3D patches' },
    ancestors: ['diffusion', 'dit', 'vit', 'clip'] },
  { id: 'mercury', name: 'Mercury', company: 'Inception', year: 2025,
    color: '#f97316', category: 'Diffusion LLM', categoryColor: CATEGORY_COLORS['Diffusion LLM'],
    description: { it: 'LLM a diffusione, token in parallelo, 10x', en: 'Diffusion LLM, parallel tokens, 10x' },
    ancestors: ['transformer', 'diffusion', 'scaling'] },
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

  // Position discoveries in a SINGLE row, evenly spaced with good padding
  const discoveryPositions = useMemo(() => {
    const all = DISCOVERIES
    const pad = 0.08
    return all.map((d, i) => ({
      ...d,
      fx: pad + (i / Math.max(all.length - 1, 1)) * (1 - pad * 2),
      fy: 0.72,
    }))
  }, [])

  // Position models with generous padding so nothing clips
  const modelPositions = useMemo(() => {
    const pad = 0.08
    return MODELS.map((m, i) => ({
      ...m,
      fx: pad + (i / (MODELS.length - 1)) * (1 - pad * 2),
      fy: 0.22,
    }))
  }, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    // Subtle nebula
    const cx = w / 2, cy = h / 2
    const nebGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.6)
    nebGrad.addColorStop(0, 'rgba(80, 40, 150, 0.03)')
    nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = nebGrad
    ctx.fillRect(0, 0, w, h)

    // Row labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.font = '8px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('MODELLI ATTUALI', w * 0.5, h * 0.22 - 28)
    ctx.fillText('SCOPERTE FONDAMENTALI', w * 0.5, h * 0.72 - 18)

    // Draw connections
    const isAnyHovered = hoveredModel !== null || hoveredDiscovery !== null

    for (const model of modelPositions) {
      const mx = model.fx * w
      const my = model.fy * h
      const isModelHovered = hoveredModel === model.id

      for (const ancId of model.ancestors) {
        const disc = discoveryPositions.find(d => d.id === ancId)
        if (!disc) continue

        const dx = disc.fx * w
        const dy = disc.fy * h
        const isDiscHovered = hoveredDiscovery === ancId
        const isHighlighted = isModelHovered || isDiscHovered

        let alpha = 0.06
        if (isAnyHovered) alpha = isHighlighted ? 0.45 : 0.015

        const [r, g, b] = hexToRgb(model.color)
        const midY = (my + dy) / 2 + noise2D(model.fx * 8 + disc.fx * 8, t * 0.08) * 10

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.lineWidth = isHighlighted ? 1.8 : 0.6
        ctx.beginPath()
        ctx.moveTo(mx, my + 12)
        ctx.quadraticCurveTo((mx + dx) / 2, midY, dx, dy - 6)
        ctx.stroke()

        // Pulse on highlighted lines
        if (isHighlighted) {
          const pulseT = ((t * 0.4 + model.fx * 3 + disc.fx * 2) % 1)
          const pBT = 1 - pulseT
          const px = mx * pBT * pBT + ((mx + dx) / 2) * 2 * pBT * pulseT + dx * pulseT * pulseT
          const py = (my + 12) * pBT * pBT + midY * 2 * pBT * pulseT + (dy - 6) * pulseT * pulseT
          const pg = ctx.createRadialGradient(px, py, 0, px, py, 6)
          pg.addColorStop(0, `rgba(255, 255, 255, 0.5)`)
          pg.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
          ctx.fillStyle = pg
          ctx.beginPath()
          ctx.arc(px, py, 6, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Draw discovery nodes
    for (const disc of discoveryPositions) {
      const dx = disc.fx * w, dy = disc.fy * h
      const isHighlighted = hoveredDiscovery === disc.id ||
        (hoveredModel !== null && modelPositions.find(m => m.id === hoveredModel)?.ancestors.includes(disc.id))
      const nodeAlpha = isAnyHovered ? (isHighlighted ? 1 : 0.12) : 0.5
      const [r, g, b] = hexToRgb(disc.color)
      const nodeR = isHighlighted ? 6 : 4

      if (isHighlighted) {
        const glGrad = ctx.createRadialGradient(dx, dy, 0, dx, dy, 18)
        glGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`)
        glGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glGrad
        ctx.beginPath()
        ctx.arc(dx, dy, 18, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(dx, dy, nodeR, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${nodeAlpha})`
      ctx.fill()

      ctx.fillStyle = `rgba(255, 255, 255, ${isHighlighted ? 0.85 : nodeAlpha * 0.55})`
      ctx.font = `${isHighlighted ? '10' : '8'}px "Inter", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(disc.name, dx, dy - nodeR - 5)
      ctx.font = '7px "JetBrains Mono", monospace'
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${nodeAlpha * 0.6})`
      ctx.fillText(String(disc.year), dx, dy + nodeR + 10)
    }

    // Draw model nodes
    for (const model of modelPositions) {
      const mx = model.fx * w, my = model.fy * h
      const isHighlighted = hoveredModel === model.id ||
        (hoveredDiscovery !== null && model.ancestors.includes(hoveredDiscovery))
      const nodeAlpha = isAnyHovered ? (isHighlighted ? 1 : 0.12) : 0.8
      const [r, g, b] = hexToRgb(model.color)
      const nodeR = isHighlighted ? 12 : 9

      // Glow
      const glR = nodeR * 2.5
      const glGrad = ctx.createRadialGradient(mx, my, 0, mx, my, glR)
      const glA = isHighlighted ? 0.2 : 0.06
      glGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glA * nodeAlpha})`)
      glGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = glGrad
      ctx.beginPath()
      ctx.arc(mx, my, glR, 0, Math.PI * 2)
      ctx.fill()

      // Body
      const bGrad = ctx.createRadialGradient(mx, my, 0, mx, my, nodeR)
      bGrad.addColorStop(0, `rgba(255, 255, 255, ${0.6 * nodeAlpha})`)
      bGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.7 * nodeAlpha})`)
      bGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${0.2 * nodeAlpha})`)
      ctx.fillStyle = bGrad
      ctx.beginPath()
      ctx.arc(mx, my, nodeR, 0, Math.PI * 2)
      ctx.fill()

      // Category badge
      const [cr, cg, cb] = hexToRgb(model.categoryColor)
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${isHighlighted ? 0.7 : nodeAlpha * 0.4})`
      ctx.font = '7px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(model.category, mx, my - nodeR - 22)

      // Name + company
      ctx.fillStyle = `rgba(255, 255, 255, ${isHighlighted ? 0.95 : nodeAlpha * 0.75})`
      ctx.font = `bold ${isHighlighted ? '12' : '10'}px "Space Grotesk", sans-serif`
      ctx.fillText(model.name, mx, my - nodeR - 10)
    }
  }, [hoveredModel, hoveredDiscovery, modelPositions, discoveryPositions, noise2D])

  const canvasRef = useCanvas({ draw, active })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const w = rect.width, h = rect.height

    let foundModel: string | null = null
    let foundDisc: string | null = null
    let tipData: typeof tooltip = null

    for (const model of modelPositions) {
      if (Math.hypot(mx - model.fx * w, my - model.fy * h) < 18) {
        foundModel = model.id
        tipData = { x: e.clientX, y: e.clientY, text: `${model.name} (${model.company}, ${model.year})`, sub: model.description[lang as Lang], color: model.color }
        break
      }
    }
    if (!foundModel) {
      for (const disc of discoveryPositions) {
        if (Math.hypot(mx - disc.fx * w, my - disc.fy * h) < 12) {
          foundDisc = disc.id
          tipData = { x: e.clientX, y: e.clientY, text: `${disc.name} (${disc.year})`, sub: disc.description[lang as Lang], color: disc.color }
          break
        }
      }
    }

    setHoveredModel(foundModel)
    setHoveredDiscovery(foundDisc)
    setTooltip(tipData)
  }, [modelPositions, discoveryPositions, lang])

  const handleMouseLeave = useCallback(() => {
    setHoveredModel(null); setHoveredDiscovery(null); setTooltip(null)
  }, [])

  return (
    <section data-slide={index} className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" style={{ display: 'block' }} />
      <div className="absolute inset-0 z-10 cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />

      {/* Title */}
      <div className="absolute top-4 left-0 right-0 z-20 text-center pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-lg sm:text-xl md:text-2xl font-bold"
          style={{ background: 'linear-gradient(135deg, #fff 0%, #c084fc 50%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          {lang === 'it' ? "L'Albero della Conoscenza" : 'The Tree of Knowledge'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white/25 text-[10px] mt-1 font-mono"
        >
          {lang === 'it' ? 'Hover per esplorare le dipendenze tecniche' : 'Hover to explore technical dependencies'}
        </motion.p>
      </div>

      {/* Category legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-4 flex-wrap px-4 pointer-events-none"
      >
        {Object.entries(CATEGORY_COLORS).map(([cat, col]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col }} />
            <span className="text-[9px] text-white/30 font-mono">{cat}</span>
          </div>
        ))}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className="fixed z-50 pointer-events-none p-3 rounded-lg max-w-xs"
            style={{ left: tooltip.x + 16, top: tooltip.y - 8, background: 'rgba(10, 5, 30, 0.9)', backdropFilter: 'blur(16px)', border: `1px solid ${tooltip.color}33` }}
          >
            <p className="font-display font-semibold text-sm text-white">{tooltip.text}</p>
            <p className="text-xs text-white/50 mt-1">{tooltip.sub}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
