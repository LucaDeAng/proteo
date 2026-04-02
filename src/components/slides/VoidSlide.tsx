import { useCallback, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'
import { SlideWrapper, SlideTag, SlideTitle, SlideBody, MilestoneCard } from '../SlideWrapper'
import { useCanvas } from '../canvas/useCanvas'
import { eras, milestones, t } from '../../data/aiHistory'
import { useLang } from '../../hooks/useLang'

interface VoidSlideProps {
  active: boolean
  index: number
}

const SYMBOLS = ['∑', '∫', 'λ', '0', '1', '∞', 'Σ', 'π', '∂', '∀', '∃', '⊃', '≡', 'Ω', 'φ', '∈', '⊂', '∝']

interface SymbolParticle {
  x: number
  y: number
  symbol: string
  size: number
  alpha: number
  noiseOffsetX: number
  noiseOffsetY: number
  baseSpeed: number
  rotation: number
  rotationSpeed: number
}

export default function VoidSlide({ active, index }: VoidSlideProps) {
  const { lang } = useLang()
  const era = eras.find((e) => e.id === 'void')!
  const turingMachine = milestones.find((m) => m.id === 'turing-machine')!
  const lovelace = milestones.find((m) => m.id === 'lovelace')!

  const particlesRef = useRef<SymbolParticle[]>([])
  const initedRef = useRef(false)
  const noise2DRef = useRef<ReturnType<typeof createNoise2D> | null>(null)

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    if (!noise2DRef.current) {
      noise2DRef.current = createNoise2D()
    }
    const noise2D = noise2DRef.current

    // Initialize particles
    if (!initedRef.current || particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size: Math.random() * 14 + 10,
        alpha: Math.random() * 0.12 + 0.03,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
        baseSpeed: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      }))
      initedRef.current = true
    }

    // Dark purple-black background
    ctx.fillStyle = '#06001a'
    ctx.fillRect(0, 0, w, h)

    // Very subtle deep purple ambient glow at center
    const ambientGrad = ctx.createRadialGradient(w * 0.3, h * 0.5, 0, w * 0.3, h * 0.5, h * 0.7)
    ambientGrad.addColorStop(0, 'rgba(76, 29, 149, 0.08)')
    ambientGrad.addColorStop(1, 'rgba(76, 29, 149, 0)')
    ctx.fillStyle = ambientGrad
    ctx.fillRect(0, 0, w, h)

    // Second ambient glow - offset
    const ambientGrad2 = ctx.createRadialGradient(w * 0.7, h * 0.4, 0, w * 0.7, h * 0.4, h * 0.5)
    ambientGrad2.addColorStop(0, 'rgba(124, 58, 237, 0.04)')
    ambientGrad2.addColorStop(1, 'rgba(124, 58, 237, 0)')
    ctx.fillStyle = ambientGrad2
    ctx.fillRect(0, 0, w, h)

    // Draw symbol particles with simplex noise movement
    const slowT = t * 0.15

    for (const p of particlesRef.current) {
      // Use simplex noise for organic drifting
      const nx = noise2D(p.noiseOffsetX + slowT, p.noiseOffsetY) * p.baseSpeed
      const ny = noise2D(p.noiseOffsetY + slowT, p.noiseOffsetX) * p.baseSpeed

      p.x += nx
      p.y += ny
      p.rotation += p.rotationSpeed

      // Wrap edges with padding
      if (p.x < -30) p.x = w + 20
      if (p.x > w + 30) p.x = -20
      if (p.y < -30) p.y = h + 20
      if (p.y > h + 30) p.y = -20

      // Subtle pulsing alpha
      const pulse = Math.sin(t * 0.5 + p.noiseOffsetX) * 0.5 + 0.5
      const alpha = p.alpha * (0.6 + pulse * 0.4)

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)

      // Symbol glow
      ctx.shadowColor = 'rgba(124, 58, 237, 0.3)'
      ctx.shadowBlur = 8

      ctx.font = `${p.size}px "Courier New", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = `rgba(180, 140, 255, ${alpha})`
      ctx.fillText(p.symbol, 0, 0)

      ctx.shadowBlur = 0
      ctx.restore()
    }

    // Very faint connecting lines between nearby symbols (constellation effect)
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.02)'
    ctx.lineWidth = 0.5
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const a = particlesRef.current[i]
        const b = particlesRef.current[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const lineAlpha = (1 - dist / 150) * 0.03
          ctx.strokeStyle = `rgba(124, 58, 237, ${lineAlpha})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }
  }, [])

  const canvasRef = useCanvas({ draw, active })

  const canvasEl = (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ display: 'block' }}
    />
  )

  return (
    <SlideWrapper
      index={index}
      active={active}
      canvas={canvasEl}
      chapter={era.chapter}
      quote={t(era.quote.text, lang)}
      quoteAuthor={`${era.quote.author}, ${era.quote.year}`}
      stats={era.stats.map(s => ({ value: s.value, label: t(s.label, lang), color: era.glowColor }))}
    >
      <div className="pl-8 sm:pl-16 md:pl-24 pr-6 max-w-3xl">
        <SlideTag>{era.period}</SlideTag>
        <SlideTitle>
          <span
            style={{
              background: 'linear-gradient(135deg, #c084fc 0%, #7c3aed 50%, #4c1d95 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t(era.name, lang)}
          </span>
          <span className="text-white/30 ml-3 text-2xl sm:text-3xl md:text-4xl font-light italic">
            {t(era.cosmicName, lang)}
          </span>
        </SlideTitle>
        <SlideBody>{t(era.description, lang)}</SlideBody>

        <MilestoneCard
          year={turingMachine.year}
          name={turingMachine.name}
          description={t(turingMachine.description, lang)}
          color={era.glowColor}
        />
        <MilestoneCard
          year={lovelace.year}
          name={lovelace.name}
          description={t(lovelace.description, lang)}
          color={era.glowColor}
        />
      </div>
    </SlideWrapper>
  )
}
