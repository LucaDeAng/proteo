"use client";

import { AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DataBadgeProps {
  type: 'real' | 'simulated' | 'cached' | 'demo'
  timestamp?: string
  className?: string
  compact?: boolean
}

export function DataBadge({ type, timestamp, className, compact = false }: DataBadgeProps) {
  const config = {
    real: {
      icon: CheckCircle,
      label: compact ? 'ISPRA' : 'Dati Reali ISPRA',
      bg: 'bg-green-50 border-green-200 hover:bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500'
    },
    simulated: {
      icon: AlertTriangle,
      label: compact ? 'Demo' : 'Dati Simulati',
      bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
      text: 'text-amber-700',
      dot: 'bg-amber-500'
    },
    demo: {
      icon: AlertTriangle,
      label: compact ? 'Demo' : 'Dati Demo',
      bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
      text: 'text-amber-700',
      dot: 'bg-amber-500'
    },
    cached: {
      icon: Clock,
      label: compact ? 'Cache' : 'Dati Cache',
      bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500'
    }
  }

  const { icon: Icon, label, bg, text, dot } = config[type]

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border text-xs font-medium transition-colors",
        compact ? "px-2 py-0.5" : "px-2.5 py-1",
        bg, text, className
      )}
      title={`${label}${timestamp ? ` - Aggiornato: ${new Date(timestamp).toLocaleString('it-IT')}` : ''}`}
    >
      {!compact && <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dot)} />}
      <Icon className={cn(compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
      <span>{label}</span>
      {timestamp && !compact && (
        <span className="text-xs opacity-70 ml-1">
          {new Date(timestamp).toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      )}
    </div>
  )
}

export function DataConfidenceIndicator({ 
  confidence, 
  className 
}: { 
  confidence: number
  className?: string 
}) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'bg-green-500'
    if (conf >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }


  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <Database className="w-3 h-3 text-gray-500" />
        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-300", getConfidenceColor(confidence))}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-600">
        {Math.round(confidence * 100)}%
      </span>
    </div>
  )
}