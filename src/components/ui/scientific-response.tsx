/**
 * Scientific Response Component with Citations, Sources, and Visualizations
 * Componente Risposta Scientifica con Citazioni, Fonti e Visualizzazioni
 */

"use client";

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  Database,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Copy,
  Lightbulb
} from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface ScientificResponseProps {
  content: string
  sources: DataSourceInfo[]
  citations: CitationInfo[]
  suggestions: string[]
  visualizations?: VisualizationData[]
  confidence: number
  metadata: ResponseMetadata
  onSuggestionClick?: (suggestion: string) => void
  onVisualizationClick?: (viz: VisualizationData) => void
}

export interface DataSourceInfo {
  id: string
  name: string
  type: 'realtime' | 'historical' | 'publication' | 'project'
  reliability: number
  lastUpdated: string
  url?: string
}

export interface CitationInfo {
  id: string
  text: string
  source: string
  url?: string
  type: 'data' | 'publication' | 'report' | 'website'
}

export interface VisualizationData {
  type: 'chart' | 'map' | 'timeseries' | 'comparison'
  title: string
  data: any[]
  config: Record<string, any>
}

export interface ResponseMetadata {
  processingTime: number
  dataSourcesUsed: number
  knowledgeNodesAccessed: number
  queryComplexity: 'simple' | 'moderate' | 'complex'
  cacheHit: boolean
}

export function ScientificResponse({
  content,
  sources,
  citations,
  suggestions,
  visualizations = [],
  confidence,
  metadata,
  onSuggestionClick,
  onVisualizationClick
}: ScientificResponseProps) {
  const [showSources, setShowSources] = useState(false)

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600 bg-green-50 border-green-200'
    if (conf >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }


  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <div className="scientific-response space-y-3">
      {/* Simplified Main Response */}
      <div className="bg-gradient-to-r from-ocean-50 to-cyan-50 rounded-lg border border-ocean-200 p-4">
        {/* Content with inline metadata */}
        <div className="prose prose-sm max-w-none mb-3">
          <div 
            className="text-gray-800 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatScientificContent(content) }}
          />
        </div>

        {/* Compact reliability indicator */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-2 py-1 rounded-full font-medium",
              getConfidenceColor(confidence)
            )}>
              {confidence >= 0.8 ? '✓' : '⚠'} {Math.round(confidence * 100)}% affidabile
            </span>
            <span>{metadata.dataSourcesUsed} fonti • {metadata.processingTime}ms</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => copyToClipboard(content)}
            title="Copia risposta"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copia
          </Button>
        </div>
      </div>

      {/* Compact Sources and Citations */}
      {(sources.length > 0 || citations.length > 0) && (
        <div className="bg-white rounded-lg border border-ocean-100 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ocean-700 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Fonti e Riferimenti ({sources.length + citations.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setShowSources(!showSources)}
            >
              {showSources ? 'Nascondi' : 'Mostra'}
              {showSources ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </div>

          <AnimatePresence>
            {showSources && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {/* Compact source list */}
                {sources.map((source, index) => (
                  <div key={source.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-ocean-600 font-bold">{index + 1}</span>
                      <span className="font-medium">{source.name}</span>
                      <span className="text-gray-500">({Math.round(source.reliability * 100)}%)</span>
                    </div>
                    {source.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => window.open(source.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Compact citations */}
                {citations.map((citation, index) => (
                  <div key={citation.id} className="flex items-start gap-2 py-2 px-3 bg-blue-50 rounded text-xs">
                    <span className="text-blue-600 font-bold min-w-4">{sources.length + index + 1}</span>
                    <div className="flex-1">
                      <p className="text-gray-800">{citation.text}</p>
                      <p className="text-blue-600 font-medium mt-1">{citation.source}</p>
                    </div>
                    {citation.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => window.open(citation.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Compact Visualizations */}
      {visualizations.length > 0 && (
        <div className="bg-white rounded-lg border border-ocean-100 p-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-ocean-600" />
            <span className="text-sm font-medium text-ocean-700">
              Visualizzazioni ({visualizations.length})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {visualizations.map((viz) => (
              <button
                key={viz.title}
                className="p-3 bg-gradient-to-r from-ocean-50 to-cyan-50 rounded border border-ocean-100 hover:border-ocean-200 transition-colors text-left"
                onClick={() => onVisualizationClick?.(viz)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ocean-800 text-sm">{viz.title}</p>
                    <p className="text-xs text-ocean-600 capitalize">
                      {viz.type} • {viz.data.length} dati
                    </p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-ocean-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-ocean-50 to-cyan-50 rounded-lg border border-ocean-200 p-3">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-ocean-600" />
            <span className="text-sm font-medium text-ocean-700">
              Continua la conversazione
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 bg-white hover:bg-ocean-50 border border-ocean-100 hover:border-ocean-200 rounded-full text-sm text-ocean-700 transition-colors"
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Format scientific content with proper markdown and highlighting
 * Formatta contenuto scientifico con markdown e highlighting appropriati
 */
function formatScientificContent(content: string): string {
  let formatted = content

  // Bold scientific terms
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-ocean-800">$1</strong>')
  
  // Highlight numerical values with units
  formatted = formatted.replace(/(\d+(?:\.\d+)?)\s*([°C|µg\/L|mg\/L|PSU|m|%])/g, 
    '<span class="font-semibold text-ocean-600 bg-ocean-50 px-1 rounded">$1 $2</span>')
  
  // Format section headers
  formatted = formatted.replace(/^(📊|🔬|💡|🧠|📚|🔍)\s*\*\*(.*?)\*\*:/gm, 
    '<h3 class="text-lg font-semibold text-ocean-700 mt-4 mb-2">$1 $2:</h3>')
  
  // Format bullet points
  formatted = formatted.replace(/^[•·-]\s*(.*?)$/gm, 
    '<li class="ml-4 text-gray-700">$1</li>')
  
  // Wrap lists
  formatted = formatted.replace(/(<li.*?<\/li>\s*)+/g, '<ul class="space-y-1 mb-3">$&</ul>')
  
  // Format links (basic)
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" class="text-ocean-600 hover:text-ocean-800 underline">$1 <span class="text-xs">↗</span></a>')
  
  // Add paragraph breaks
  formatted = formatted.replace(/\n\n/g, '</p><p class="mb-3">')
  formatted = `<p class="mb-3">${formatted}</p>`

  return formatted
}


export default ScientificResponse