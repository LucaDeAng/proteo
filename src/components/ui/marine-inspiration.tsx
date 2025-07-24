"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import { MARINE_QUOTES } from '@/data/merProjectData'

interface MarineInspirationProps {
  className?: string
  autoRotate?: boolean
  interval?: number
}

// Curated marine images with evocative Mediterranean scenes
const MARINE_IMAGES = [
  {
    id: 'posidonia-meadow',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
    alt: 'Prateria di Posidonia nel Mediterraneo',
    caption: 'Praterie di Posidonia oceanica - Il polmone verde del Mediterraneo'
  },
  {
    id: 'mediterranean-blue',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop&crop=center',
    alt: 'Acque cristalline del Mediterraneo',
    caption: 'Le acque cristalline del Mar Mediterraneo italiano'
  },
  {
    id: 'coral-ecosystem',
    url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&crop=center',
    alt: 'Ecosistema marino mediterraneo',
    caption: 'Biodiversità marina del Mediterraneo'
  },
  {
    id: 'coastal-landscape',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
    alt: 'Costa italiana al tramonto',
    caption: 'Le coste italiane custodiscono tesori marini unici'
  },
  {
    id: 'underwater-light',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center',
    alt: 'Luce sottomarina',
    caption: 'La magia della luce sottomarina nelle profondità marine'
  }
]

export function MarineInspiration({ 
  className, 
  autoRotate = true, 
  interval = 8000 
}: MarineInspirationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!autoRotate || isHovered) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MARINE_IMAGES.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoRotate, interval, isHovered])

  const currentImage = MARINE_IMAGES[currentIndex]
  const currentQuote = MARINE_QUOTES[currentIndex % MARINE_QUOTES.length]

  return (
    <div 
      className={cn(
        "relative w-full h-96 rounded-xl overflow-hidden group cursor-pointer",
        "bg-gradient-to-br from-ocean-400 to-ocean-600",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Parallax Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Wave Animation Overlay */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(56, 189, 248, 0.3) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
        {/* Image Caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <p className="text-sm font-medium text-blue-200 mb-1">
            🌊 Ecosistemi Marini Italiani
          </p>
          <h3 className="text-lg font-semibold text-white leading-tight">
            {currentImage.caption}
          </h3>
        </motion.div>

        {/* Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <blockquote className="text-white/90 italic text-sm leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-blue-200 text-xs font-medium mt-2 block">
              — {currentQuote.author}
            </cite>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {MARINE_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Vai all'immagine ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-ocean-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Corner Marine Icon */}
      <div className="absolute top-4 right-4 text-white/60">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🐠
        </motion.div>
      </div>
    </div>
  )
}

// Quick Marine Facts Component
interface MarineFactCardProps {
  title: string
  description: string
  icon: string
  className?: string
}

export function MarineFactCard({ title, description, icon, className }: MarineFactCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "bg-gradient-to-br from-ocean-50 to-blue-50 rounded-lg p-4 border border-ocean-200",
        "hover:shadow-lg transition-all duration-300 cursor-pointer",
        "hover:border-ocean-300",
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <span className="text-2xl" role="img" aria-label="icona marina">
          {icon}
        </span>
        <div>
          <h4 className="font-semibold text-ocean-800 text-sm mb-1">
            {title}
          </h4>
          <p className="text-ocean-600 text-xs leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Marine Curiosities Grid
export function MarineCuriositiesGrid() {
  const curiosities = [
    {
      title: "Polmone Verde",
      description: "Le praterie di Posidonia producono 14L di ossigeno/giorno per m²",
      icon: "🌱"
    },
    {
      title: "Biodiversità Unica", 
      description: "Il Mediterraneo ospita il 7% delle specie marine mondiali",
      icon: "🐟"
    },
    {
      title: "Gigante Longevo",
      description: "La Pinna nobilis può vivere 50 anni e raggiungere 120cm",
      icon: "🐚"
    },
    {
      title: "Montagne Nascoste",
      description: "90+ montagne sottomarine nel Mediterraneo italiano",
      icon: "⛰️"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {curiosities.map((curiosity, index) => (
        <motion.div
          key={curiosity.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MarineFactCard {...curiosity} />
        </motion.div>
      ))}
    </div>
  )
}