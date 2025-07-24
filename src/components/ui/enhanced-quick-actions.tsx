"use client";

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Thermometer,
  Waves,
  Microscope,
  Droplets,
  Activity,
  FileText,
  Copy,
  TrendingUp,
  MapPin,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Filter,
  Star
} from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface EnhancedQuickAction {
  id: string
  label: string
  labelEn: string
  icon: React.ReactNode
  prompt: string
  category: string
  priority: 'high' | 'medium' | 'low'
  description?: string
  keywords?: string[]
}

const ENHANCED_MARINE_ACTIONS: EnhancedQuickAction[] = [
  {
    id: 'temp-current',
    label: 'Temperatura Attuale',
    labelEn: 'Current Temperature',
    icon: <Thermometer className="h-4 w-4" />,
    prompt: 'Qual è la temperatura attuale del mare nelle diverse zone del Mediterraneo italiano?',
    category: 'realtime',
    priority: 'high',
    description: 'Dati temperatura in tempo reale',
    keywords: ['temperatura', 'mare', 'mediterraneo']
  },
  {
    id: 'chlorophyll-levels',
    label: 'Livelli Clorofilla',
    labelEn: 'Chlorophyll Levels',
    icon: <Microscope className="h-4 w-4" />,
    prompt: 'Mostrami i livelli di clorofilla attuali nel Mediterraneo e spiegami cosa significano per l\'ecosistema',
    category: 'biology',
    priority: 'high',
    description: 'Analisi biologica delle acque',
    keywords: ['clorofilla', 'fitoplancton', 'produttività']
  },
  {
    id: 'wave-conditions',
    label: 'Condizioni Mare',
    labelEn: 'Sea Conditions',
    icon: <Waves className="h-4 w-4" />,
    prompt: 'Come sono le condizioni del moto ondoso oggi nelle coste italiane?',
    category: 'realtime',
    priority: 'high',
    description: 'Moto ondoso e condizioni meteo marine',
    keywords: ['onde', 'moto ondoso', 'meteo marino']
  },
  {
    id: 'water-quality',
    label: 'Qualità Acque',
    labelEn: 'Water Quality',
    icon: <Droplets className="h-4 w-4" />,
    prompt: 'Analizza la qualità delle acque costiere italiane: pH, ossigeno disciolto e parametri chimico-fisici',
    category: 'quality',
    priority: 'high',
    description: 'Parametri chimico-fisici delle acque',
    keywords: ['qualità', 'ph', 'ossigeno', 'inquinamento']
  },
  {
    id: 'trends-analysis',
    label: 'Trend Temporali',
    labelEn: 'Temporal Trends',
    icon: <TrendingUp className="h-4 w-4" />,
    prompt: 'Mostrami i trend degli ultimi mesi per temperatura e clorofilla nel Mediterraneo',
    category: 'analysis',
    priority: 'medium',
    description: 'Analisi dei trend temporali',
    keywords: ['trend', 'storico', 'analisi temporale']
  },
  {
    id: 'biodiversity-status',
    label: 'Stato Biodiversità',
    labelEn: 'Biodiversity Status',
    icon: <Activity className="h-4 w-4" />,
    prompt: 'Qual è lo stato attuale della biodiversità marina nel Mediterraneo italiano?',
    category: 'conservation',
    priority: 'medium',
    description: 'Monitoraggio specie marine',
    keywords: ['biodiversità', 'specie', 'conservazione']
  },
  {
    id: 'ispra-navigation',
    label: 'Navigare ISPRA',
    labelEn: 'Navigate ISPRA',
    icon: <FileText className="h-4 w-4" />,
    prompt: 'Come posso navigare nel sito ISPRA per trovare dati marini specifici e dataset?',
    category: 'navigation',
    priority: 'medium',
    description: 'Guida ai dati ISPRA',
    keywords: ['ispra', 'dati', 'dataset', 'navigazione']
  },
  {
    id: 'mer-project',
    label: 'Progetto MER',
    labelEn: 'MER Project',
    icon: <MapPin className="h-4 w-4" />,
    prompt: 'Spiegami il progetto MER e come contribuisce al monitoraggio marino italiano',
    category: 'education',
    priority: 'medium',
    description: 'Informazioni sul progetto MER',
    keywords: ['mer', 'progetto', 'monitoraggio', 'ricerca']
  },
  {
    id: 'marine-curiosity',
    label: 'Curiosità Marine',
    labelEn: 'Marine Facts',
    icon: <Lightbulb className="h-4 w-4" />,
    prompt: 'Raccontami una curiosità interessante sugli ecosistemi marini mediterranei',
    category: 'education',
    priority: 'low',
    description: 'Fatti interessanti sul mare',
    keywords: ['curiosità', 'ecosistemi', 'mediterraneo']
  },
  {
    id: 'publications',
    label: 'Pubblicazioni',
    labelEn: 'Publications',
    icon: <Copy className="h-4 w-4" />,
    prompt: 'Dove posso trovare le pubblicazioni scientifiche ISPRA più recenti sul settore marino?',
    category: 'navigation',
    priority: 'low',
    description: 'Ricerca bibliografica',
    keywords: ['pubblicazioni', 'ricerca', 'papers', 'bibliografia']
  }
]

const CATEGORIES = {
  realtime: { label: 'Tempo Reale', icon: <Activity className="h-4 w-4" />, color: 'green' },
  biology: { label: 'Biologia Marina', icon: <Microscope className="h-4 w-4" />, color: 'blue' },
  quality: { label: 'Qualità Acque', icon: <Droplets className="h-4 w-4" />, color: 'cyan' },
  analysis: { label: 'Analisi Dati', icon: <TrendingUp className="h-4 w-4" />, color: 'purple' },
  conservation: { label: 'Conservazione', icon: <Activity className="h-4 w-4" />, color: 'emerald' },
  navigation: { label: 'Navigazione', icon: <FileText className="h-4 w-4" />, color: 'orange' },
  education: { label: 'Educazione', icon: <Lightbulb className="h-4 w-4" />, color: 'yellow' }
}

interface EnhancedQuickActionsProps {
  onActionClick: (prompt: string) => void
  disabled?: boolean
  className?: string
  compact?: boolean
}

export function EnhancedQuickActions({
  onActionClick,
  disabled = false,
  className,
  compact = false
}: EnhancedQuickActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const highPriorityActions = ENHANCED_MARINE_ACTIONS.filter(action => action.priority === 'high')
  const filteredActions = selectedCategory 
    ? ENHANCED_MARINE_ACTIONS.filter(action => action.category === selectedCategory)
    : isExpanded ? ENHANCED_MARINE_ACTIONS : highPriorityActions

  const categoryKeys = Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>

  return (
    <div className={cn("border-b border-ocean-200 bg-gradient-to-r from-ocean-50 to-cyan-50", className)}>
      {/* Category Filters */}
      {!compact && (
        <div className="px-4 py-2 border-b border-ocean-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="h-7 px-3 text-xs flex-shrink-0"
            >
              <Filter className="h-3 w-3 mr-1" />
              Tutti
            </Button>
            {categoryKeys.map((key) => {
              const category = CATEGORIES[key]
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                  className="h-7 px-3 text-xs flex-shrink-0"
                >
                  {category.icon}
                  <span className="ml-1 hidden sm:inline">{category.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ocean-700 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Azioni Rapide
            {selectedCategory && (
              <span className="text-xs text-ocean-500">
                • {CATEGORIES[selectedCategory as keyof typeof CATEGORIES].label}
              </span>
            )}
          </h3>
          
          {!selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2 text-xs text-ocean-600 hover:text-ocean-800"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Meno
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Altro
                </>
              )}
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory || 'all'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
          >
            {filteredActions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onActionClick={onActionClick}
                disabled={disabled}
                compact={compact}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {!selectedCategory && !isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-3"
          >
            <p className="text-xs text-ocean-500">
              Mostra solo azioni prioritarie • {filteredActions.length} di {ENHANCED_MARINE_ACTIONS.length} azioni
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Action Card Component
interface ActionCardProps {
  action: EnhancedQuickAction
  onActionClick: (prompt: string) => void
  disabled: boolean
  compact: boolean
}

function ActionCard({ action, onActionClick, disabled, compact }: ActionCardProps) {
  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥'
      case 'medium': return '⭐'
      case 'low': return '💡'
      default: return ''
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        disabled={disabled}
        onClick={() => onActionClick(action.prompt)}
        className={cn(
          "h-auto p-3 text-left border-ocean-200 hover:border-ocean-400 hover:bg-ocean-50 transition-all group",
          compact && "p-2"
        )}
      >
        <div className="flex items-start gap-2 w-full">
          <div className="flex-shrink-0 text-ocean-600 group-hover:text-ocean-700">
            {action.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className={cn(
                "font-medium text-ocean-700 group-hover:text-ocean-800 truncate",
                compact ? "text-xs" : "text-sm"
              )}>
                {action.label}
              </span>
              <span className="text-xs opacity-60">
                {getPriorityIndicator(action.priority)}
              </span>
            </div>
            
            {!compact && action.description && (
              <p className="text-xs text-ocean-600 line-clamp-2 leading-relaxed">
                {action.description}
              </p>
            )}
          </div>
        </div>
      </Button>
    </motion.div>
  )
}

export default EnhancedQuickActions