/**
 * Scientific Response Component with Citations, Sources, and Visualizations
 * Componente Risposta Scientifica con Citazioni, Fonti e Visualizzazioni
 */

"use client";

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  BookOpen,
  Database,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Share,
  Lightbulb
} from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { DataBadge } from './data-badge'
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
  const [showCitations, setShowCitations] = useState(false)

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600 bg-green-50 border-green-200'
    if (conf >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'realtime': return <Database className="h-4 w-4" />
      case 'historical': return <Clock className="h-4 w-4" />
      case 'publication': return <BookOpen className="h-4 w-4" />
      case 'project': return <TrendingUp className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
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
    <div className="scientific-response space-y-4">
      {/* Main Response Content */}
      <Card className="marine-glass border-ocean-200 hover:border-ocean-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ocean-500 rounded-full animate-pulse" />
              <CardTitle className="text-ocean-700 text-lg">Risposta Scientifica</CardTitle>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Confidence Indicator */}
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium border",
                getConfidenceColor(confidence)
              )}>
                {confidence >= 0.8 ? (
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                )}
                {Math.round(confidence * 100)}% affidabile
              </div>

              {/* Complexity Badge */}
              <DataBadge 
                type={metadata.cacheHit ? 'cached' : 'real'} 
                compact 
                className="text-xs"
              />

              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => copyToClipboard(content)}
                  title="Copia risposta"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  title="Condividi"
                >
                  <Share className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Response Content */}
          <div className="prose prose-sm max-w-none">
            <div 
              className="text-gray-800 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatScientificContent(content) }}
            />
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {metadata.processingTime}ms
            </span>
            <span className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              {metadata.dataSourcesUsed} fonti
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {metadata.knowledgeNodesAccessed} nodi KB
            </span>
            <span className="capitalize">{metadata.queryComplexity}</span>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      {sources.length > 0 && (
        <Card className="border-ocean-200">
          <CardHeader className="pb-2">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => setShowSources(!showSources)}
            >
              <CardTitle className="text-sm font-medium text-ocean-700 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Fonti Dati ({sources.length})
              </CardTitle>
              {showSources ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>

          <AnimatePresence>
            {showSources && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-2">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-ocean-600">
                          {getSourceIcon(source.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800">{source.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="capitalize">{source.type}</span>
                            <span>•</span>
                            <span>
                              {Math.round(source.reliability * 100)}% affidabile
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(source.lastUpdated).toLocaleString('it-IT')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {source.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => window.open(source.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Scientific Citations */}
      {citations.length > 0 && (
        <Card className="border-ocean-200">
          <CardHeader className="pb-2">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => setShowCitations(!showCitations)}
            >
              <CardTitle className="text-sm font-medium text-ocean-700 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Citazioni Scientifiche ({citations.length})
              </CardTitle>
              {showCitations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>

          <AnimatePresence>
            {showCitations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-3">
                  {citations.map((citation, index) => (
                    <div
                      key={citation.id}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-blue-600 bg-blue-200 rounded px-1.5 py-0.5 mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {citation.text}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-blue-600 font-medium">
                              {citation.source}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {citation.type}
                              </span>
                              {citation.url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-blue-600 hover:text-blue-800"
                                  onClick={() => window.open(citation.url, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Data Visualizations */}
      {visualizations.length > 0 && (
        <Card className="border-ocean-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-ocean-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Visualizzazioni Dati ({visualizations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visualizations.map((viz) => (
              <div
                key={viz.title}
                className="p-4 bg-gradient-to-r from-ocean-50 to-cyan-50 rounded-lg border border-ocean-100 hover:border-ocean-200 transition-colors cursor-pointer"
                onClick={() => onVisualizationClick?.(viz)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-ocean-800">{viz.title}</h4>
                    <p className="text-sm text-ocean-600 capitalize">
                      {viz.type} • {viz.data.length} punti dati
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVisualizationIcon(viz.type)}
                    <ExternalLink className="h-4 w-4 text-ocean-500" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Follow-up Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-ocean-200 bg-gradient-to-r from-ocean-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-ocean-700 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggerimenti per Approfondire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-3 h-auto bg-white hover:bg-ocean-50 border border-ocean-100 hover:border-ocean-200"
                  onClick={() => onSuggestionClick?.(suggestion)}
                >
                  <span className="text-sm text-ocean-700">{suggestion}</span>
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
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

/**
 * Get icon for visualization type
 * Ottieni icona per tipo visualizzazione
 */
function getVisualizationIcon(type: string) {
  switch (type) {
    case 'map':
      return <MapPin className="h-4 w-4 text-ocean-500" />
    case 'timeseries':
      return <TrendingUp className="h-4 w-4 text-ocean-500" />
    case 'chart':
      return <TrendingUp className="h-4 w-4 text-ocean-500" />
    case 'comparison':
      return <TrendingUp className="h-4 w-4 text-ocean-500" />
    default:
      return <TrendingUp className="h-4 w-4 text-ocean-500" />
  }
}

export default ScientificResponse