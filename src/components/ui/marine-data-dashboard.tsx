"use client";

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown, 
  Thermometer, 
  Waves, 
  Microscope, 
  Droplets,
  Activity,
  RefreshCw
} from 'lucide-react'
import { Button } from './button'
import { DataBadge, DataConfidenceIndicator } from './data-badge'
import { cn } from '@/lib/utils'

interface MarineDashboardProps {
  isCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
  data?: MarineData
  className?: string
}

export interface MarineDataPoint {
  value: number
  unit: string
  status: 'real' | 'simulated' | 'cached' | 'demo'
  confidence?: number
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  timestamp?: string
  location?: string
}

export interface MarineData {
  temperature: MarineDataPoint
  waves: MarineDataPoint & { period?: number; direction?: string }
  chlorophyll: MarineDataPoint
  ph: MarineDataPoint
  salinity?: MarineDataPoint
  oxygen?: MarineDataPoint
  lastUpdate?: string
}

export function MarineDataDashboard({ 
  isCollapsed = false, 
  onToggle, 
  data,
  className 
}: MarineDashboardProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const toggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    onToggle?.(newState)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  // Enhanced mock data with realistic marine parameters
  const marineData: MarineData = data || {
    temperature: { 
      value: 22.4, 
      unit: '°C', 
      status: 'demo',
      confidence: 0.85,
      trend: 'up',
      trendValue: '+0.2°C',
      timestamp: new Date().toISOString(),
      location: 'Golfo di Napoli'
    },
    waves: { 
      value: 0.8, 
      unit: 'm', 
      status: 'demo',
      period: 4.2, 
      direction: 'NE',
      confidence: 0.92,
      trend: 'stable',
      timestamp: new Date().toISOString()
    },
    chlorophyll: { 
      value: 1.2, 
      unit: 'µg/L', 
      status: 'demo',
      confidence: 0.75,
      trend: 'up',
      trendValue: '+5%',
      timestamp: new Date().toISOString()
    },
    ph: { 
      value: 8.1, 
      unit: '', 
      status: 'demo',
      confidence: 0.88,
      trend: 'stable',
      timestamp: new Date().toISOString()
    },
    salinity: {
      value: 38.2,
      unit: 'PSU',
      status: 'demo',
      confidence: 0.90,
      trend: 'stable'
    },
    oxygen: {
      value: 6.4,
      unit: 'mg/L',
      status: 'demo',
      confidence: 0.82,
      trend: 'down',
      trendValue: '-0.1'
    },
    lastUpdate: new Date().toISOString()
  }

  return (
    <motion.div 
      className={cn(
        "bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200",
        className
      )}
      initial={false}
      animate={{ 
        height: collapsed ? 'auto' : 'auto',
        opacity: 1 
      }}
    >
      {/* Toggle Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/30 transition-colors" onClick={toggleCollapsed}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-ocean-700">
              Dati Marini in Tempo Reale
            </span>
          </div>
          {marineData.lastUpdate && (
            <span className="text-xs text-ocean-600 hidden sm:inline">
              Ultimo aggiornamento: {new Date(marineData.lastUpdate).toLocaleTimeString('it-IT')}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 hover:bg-ocean-100"
            onClick={(e) => {
              e.stopPropagation()
              handleRefresh()
            }}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-ocean-600", isRefreshing && "animate-spin")} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-ocean-100">
            {collapsed ? 
              <ChevronDown className="h-4 w-4 text-ocean-600" /> : 
              <ChevronUp className="h-4 w-4 text-ocean-600" />
            }
          </Button>
        </div>
      </div>

      {/* Data Cards */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-4 pb-4"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Temperature Card */}
              <DataCard
                icon={<Thermometer className="h-4 w-4" />}
                title="Temperatura"
                data={marineData.temperature}
                subtitle={marineData.temperature.location}
              />
              
              {/* Waves Card */}
              <DataCard
                icon={<Waves className="h-4 w-4" />}
                title="Moto Ondoso"
                data={marineData.waves}
                subtitle={`${marineData.waves.direction} • ${marineData.waves.period}s`}
              />
              
              {/* Chlorophyll Card */}
              <DataCard
                icon={<Microscope className="h-4 w-4" />}
                title="Clorofilla"
                data={marineData.chlorophyll}
              />
              
              {/* pH Card */}
              <DataCard
                icon={<Droplets className="h-4 w-4" />}
                title="pH"
                data={marineData.ph}
              />
            </div>

            {/* Extended data on larger screens */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-3 mt-3">
              {marineData.salinity && (
                <DataCard
                  icon={<Droplets className="h-4 w-4" />}
                  title="Salinità"
                  data={marineData.salinity}
                  compact
                />
              )}
              
              {marineData.oxygen && (
                <DataCard
                  icon={<Activity className="h-4 w-4" />}
                  title="Ossigeno Disciolto"
                  data={marineData.oxygen}
                  compact
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Enhanced Data Card Component
interface DataCardProps {
  icon: React.ReactNode
  title: string
  data: MarineDataPoint
  subtitle?: string
  compact?: boolean
  onClick?: () => void
}

function DataCard({ icon, title, data, subtitle, compact = false, onClick }: DataCardProps) {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      case 'stable': return '→'
      default: return ''
    }
  }

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/80 backdrop-blur-sm rounded-lg border border-ocean-200 hover:border-ocean-300 hover:shadow-md transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className={cn("p-3", compact && "p-2")}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-ocean-600">
            {icon}
            <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DataBadge type={data.status} compact />
          </div>
        </div>
        
        {/* Value */}
        <div className={cn("font-bold text-gray-800 mb-1", compact ? "text-lg" : "text-xl")}>
          {data.value}{data.unit}
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <div className={cn("text-gray-500 mb-1", compact ? "text-xs" : "text-sm")}>
            {subtitle}
          </div>
        )}
        
        {/* Trend and Confidence */}
        <div className="flex items-center justify-between">
          {data.trend && (
            <div className={cn("font-medium", compact ? "text-xs" : "text-sm", getTrendColor(data.trend))}>
              {getTrendIcon(data.trend)} {data.trendValue || data.trend}
            </div>
          )}
          
          {data.confidence && (
            <DataConfidenceIndicator 
              confidence={data.confidence} 
              className={compact ? "scale-75 origin-right" : ""}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export { DataCard }