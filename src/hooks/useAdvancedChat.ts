/**
 * Advanced Chat Hook with Memory, RAG, and Scientific Features
 * Hook Chat Avanzato con Memoria, RAG e Funzionalità Scientifiche
 */

import { useState, useCallback, useEffect } from 'react'
import { Message } from '@/components/MessageBubble'
import { advancedApiClient, AdvancedApiResponse } from '@/api/advancedClient'

export interface AdvancedMessage extends Message {
  sources?: any[]
  citations?: any[]
  suggestions?: string[]
  visualizations?: any[]
  confidence?: number
  metadata?: any
}

export interface ChatMetrics {
  totalMessages: number
  avgConfidence: number
  sourcesUsed: number
  suggestionsOffered: number
  processingTime: number
}

export interface ChatSession {
  sessionId: string
  startTime: Date
  userId?: string
  metrics: ChatMetrics
}

/**
 * Advanced chat hook with enhanced features
 * Hook chat avanzato con funzionalità migliorate
 */
export const useAdvancedChat = (userId?: string) => {
  const [messages, setMessages] = useState<AdvancedMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [lastResponse, setLastResponse] = useState<AdvancedApiResponse | null>(null)

  // Initialize session on first load
  useEffect(() => {
    const newSession: ChatSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date(),
      userId,
      metrics: {
        totalMessages: 0,
        avgConfidence: 0,
        sourcesUsed: 0,
        suggestionsOffered: 0,
        processingTime: 0
      }
    }
    setSession(newSession)

    // Check system health on init
    checkSystemHealth()
  }, [userId])

  /**
   * Send message with advanced processing
   * Invia messaggio con elaborazione avanzata
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !session) return

    // Create user message
    const userMessage: AdvancedMessage = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    // Optimistic UI update
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const allMessages = [...messages, userMessage]
      const startTime = Date.now()
      
      // Call advanced API
      const response = await advancedApiClient.sendMessage(allMessages, userId)
      const processingTime = Date.now() - startTime

      // Create enhanced bot message
      const botMessage: AdvancedMessage = {
        id: `bot-${Date.now()}`,
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        sources: response.sources,
        citations: response.citations,
        suggestions: response.suggestions,
        visualizations: response.visualizations,
        confidence: response.confidence,
        metadata: response.metadata,
        dataType: response.confidence > 0.7 ? 'real' : 'demo',
        containsData: response.sources.length > 0
      }

      setMessages(prev => [...prev, botMessage])
      setLastResponse(response)

      // Update session metrics
      updateSessionMetrics(response, processingTime)

    } catch (error) {
      console.error('Advanced chat error:', error)
      
      // Create error message
      const errorMessage: AdvancedMessage = {
        id: `error-${Date.now()}`,
        content: `🌊 Mi dispiace, si è verificato un errore nel sistema avanzato. 

Il sistema sta passando alla modalità base. Per assistenza tecnica, contatta il supporto ISPRA.

💡 **Suggerimento**: Riprova con una domanda più specifica come "temperatura mare Adriatico oggi".`,
        sender: 'bot',
        timestamp: new Date(),
        confidence: 0.3,
        suggestions: [
          'Riprova con una domanda più specifica',
          'Controlla lo stato del sistema',
          'Contatta il supporto tecnico'
        ]
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, session, userId])

  /**
   * Handle suggestion click
   * Gestisci click suggerimento
   */
  const handleSuggestionClick = useCallback(async (suggestion: string) => {
    await sendMessage(suggestion)
  }, [sendMessage])

  /**
   * Handle visualization click
   * Gestisci click visualizzazione
   */
  const handleVisualizationClick = useCallback((visualization: any) => {
    // This would open a modal or navigate to detailed view
    console.log('Opening visualization:', visualization)
    
    // For now, just log the visualization data
    // In a real implementation, this might:
    // - Open a modal with interactive charts
    // - Navigate to a dedicated visualization page
    // - Download the data as CSV/JSON
  }, [])

  /**
   * Update session metrics
   * Aggiorna metriche sessione
   */
  const updateSessionMetrics = useCallback((response: AdvancedApiResponse, processingTime: number) => {
    if (!session) return

    setSession(prev => {
      if (!prev) return prev

      const newMetrics = {
        totalMessages: prev.metrics.totalMessages + 1,
        avgConfidence: (prev.metrics.avgConfidence * prev.metrics.totalMessages + response.confidence) / (prev.metrics.totalMessages + 1),
        sourcesUsed: prev.metrics.sourcesUsed + response.sources.length,
        suggestionsOffered: prev.metrics.suggestionsOffered + response.suggestions.length,
        processingTime: (prev.metrics.processingTime * prev.metrics.totalMessages + processingTime) / (prev.metrics.totalMessages + 1)
      }

      return {
        ...prev,
        metrics: newMetrics
      }
    })
  }, [session])

  /**
   * Check system health
   * Controlla stato sistema
   */
  const checkSystemHealth = useCallback(async () => {
    try {
      const health = await advancedApiClient.healthCheck()
      setSystemHealth(health)
    } catch (error) {
      console.error('Health check failed:', error)
      setSystemHealth({ overall: false, error: 'Health check failed' })
    }
  }, [])

  /**
   * Clear conversation
   * Cancella conversazione
   */
  const clearMessages = useCallback(() => {
    setMessages([])
    setLastResponse(null)
    
    if (userId) {
      advancedApiClient.clearSession(userId)
    }

    // Reset session metrics
    if (session) {
      setSession(prev => prev ? {
        ...prev,
        metrics: {
          totalMessages: 0,
          avgConfidence: 0,
          sourcesUsed: 0,
          suggestionsOffered: 0,
          processingTime: 0
        }
      } : null)
    }
  }, [userId, session])

  /**
   * Export conversation data
   * Esporta dati conversazione
   */
  const exportConversation = useCallback(() => {
    if (!session) return null

    const exportData = {
      session,
      messages: messages.map(msg => ({
        ...msg,
        // Remove large data objects for export
        visualizations: msg.visualizations?.length || 0,
        sources: msg.sources?.length || 0,
        citations: msg.citations?.length || 0
      })),
      systemHealth,
      exportTimestamp: new Date().toISOString()
    }

    // Create downloadable JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proteo-conversation-${session.sessionId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return exportData
  }, [session, messages, systemHealth])

  /**
   * Get conversation summary
   * Ottieni riassunto conversazione
   */
  const getConversationSummary = useCallback(() => {
    if (!session || messages.length === 0) return null

    const botMessages = messages.filter(msg => msg.sender === 'bot')
    const userMessages = messages.filter(msg => msg.sender === 'user')
    
    const avgConfidence = botMessages.reduce((sum, msg) => sum + (msg.confidence || 0), 0) / botMessages.length
    const totalSources = botMessages.reduce((sum, msg) => sum + (msg.sources?.length || 0), 0)
    const totalSuggestions = botMessages.reduce((sum, msg) => sum + (msg.suggestions?.length || 0), 0)

    return {
      sessionDuration: Date.now() - session.startTime.getTime(),
      totalExchanges: userMessages.length,
      avgConfidence: Math.round(avgConfidence * 100),
      totalSources,
      totalSuggestions,
      systemHealth: systemHealth?.overall,
      lastActivity: messages[messages.length - 1]?.timestamp
    }
  }, [session, messages, systemHealth])

  /**
   * Get system analytics
   * Ottieni analisi sistema
   */
  const getSystemAnalytics = useCallback(async () => {
    try {
      return await advancedApiClient.getSystemAnalytics()
    } catch (error) {
      console.error('Failed to get system analytics:', error)
      return null
    }
  }, [])

  /**
   * Refresh system health
   * Aggiorna stato sistema
   */
  const refreshHealth = useCallback(async () => {
    setIsLoading(true)
    try {
      await checkSystemHealth()
    } finally {
      setIsLoading(false)
    }
  }, [checkSystemHealth])

  return {
    // Core chat functionality
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    
    // Advanced features
    handleSuggestionClick,
    handleVisualizationClick,
    lastResponse,
    
    // Session management
    session,
    
    // System monitoring
    systemHealth,
    checkSystemHealth,
    refreshHealth,
    
    // Analytics and export
    getConversationSummary,
    getSystemAnalytics,
    exportConversation,
    
    // Computed properties
    hasAdvancedFeatures: Boolean(systemHealth?.overall),
    confidenceLevel: session?.metrics.avgConfidence || 0,
    totalSources: session?.metrics.sourcesUsed || 0
  }
}