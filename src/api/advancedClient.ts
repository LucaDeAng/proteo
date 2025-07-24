/**
 * Advanced API Client with Memory, RAG, and Multi-Source Integration
 * Client API Avanzato con Memoria, RAG e Integrazione Multi-Fonte
 */

import { Message } from '@/components/MessageBubble'
import { conversationMemory } from '@/services/conversationMemory'
import { advancedRAG, RAGResult } from '@/services/advancedRAG'
import { openDataService } from '@/services/openDataIntegration'

export interface AdvancedApiResponse {
  content: string
  sources: DataSourceInfo[]
  citations: CitationInfo[]
  suggestions: string[]
  visualizations?: VisualizationData[]
  confidence: number
  sessionId: string
  metadata: ResponseMetadata
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
  conversationTurns: number
  queryComplexity: 'simple' | 'moderate' | 'complex'
  cacheHit: boolean
}

class AdvancedApiClient {
  private baseUrl: string
  private sessionCache: Map<string, string> = new Map()
  private fallbackPrompts: string[]

  constructor() {
    this.baseUrl = import.meta.env.VITE_LLM_API_URL || 'https://api.openai.com/v1/chat/completions'
    
    this.fallbackPrompts = [
      'PROTEO MARINE ASSISTANT - SISTEMA AVANZATO',
      'Sei Proteo, il più avanzato assistente marino AI per l\'Italia.',
      'Integri dati real-time da ISPRA, EMODnet, Copernicus con knowledge graph scientifico.',
      '',
      'CAPACITÀ PRINCIPALI:',
      '- Accesso dati marini in tempo reale da fonti ufficiali',
      '- Knowledge graph con specie, parametri, progetti, relazioni ecologiche',
      '- Memoria conversazionale per personalizzazione risposta',
      '- Citazioni scientifiche e fonti verificate',
      '- Suggerimenti proattivi basati su contesto',
      '- Visualizzazioni dati interattive quando appropriate',
      '',
      'STILE RISPOSTA:',
      '- Sempre in italiano con precisione scientifica',
      '- Emoji marine appropriate (🌊🐚🔬🌡️📊💡)',
      '- Struttura: Dati → Analisi → Interpretazione → Suggerimenti',
      '- Include sempre fonti e affidabilità',
      '- Bilancia rigore scientifico con accessibilità',
      '',
      'FONTI PRIORITARIE:',
      '1. ISPRA (Istituto Superiore Protezione Ricerca Ambientale)',
      '2. EMODnet (European Marine Observation Data Network)',
      '3. Copernicus Marine Service',
      '4. Progetto MER (Marine Ecosystem Restoration)',
      '5. Pubblicazioni scientifiche peer-reviewed',
      '',
      'Fornisci sempre risposte accurate, citate e contestualizzate.'
    ]
  }

  /**
   * Send message with advanced processing
   * Invia messaggio con elaborazione avanzata
   */
  async sendMessage(messages: Message[], userId?: string): Promise<AdvancedApiResponse> {
    const startTime = Date.now()
    
    try {
      // Get or create session
      const sessionId = this.getOrCreateSession(messages, userId)
      const lastMessage = messages[messages.length - 1]
      const userQuery = lastMessage?.content || ''

      console.log(`🚀 Advanced processing started for: "${userQuery}"`)

      // Step 1: Process with Advanced RAG
      const ragResult = await advancedRAG.processQuery(userQuery, sessionId, userId)

      // Step 2: Update conversation memory
      conversationMemory.addConversationTurn(
        sessionId,
        userQuery,
        ragResult.answer,
        {
          sources: ragResult.sources,
          confidence: ragResult.confidence,
          citations: ragResult.citations
        },
        {
          processingTime: Date.now() - startTime,
          ragNodesUsed: ragResult.relatedNodes.length
        }
      )

      // Step 3: Enhance with LLM if API key available
      let enhancedContent = ragResult.answer
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY

      if (apiKey && ragResult.confidence < 0.9) {
        console.log('🧠 Enhancing response with LLM...')
        enhancedContent = await this.enhanceWithLLM(userQuery, ragResult, messages, apiKey)
      }

      // Step 4: Build response
      const response: AdvancedApiResponse = {
        content: enhancedContent,
        sources: this.mapDataSources(ragResult.sources),
        citations: this.mapCitations(ragResult.citations),
        suggestions: ragResult.followUpSuggestions || [],
        visualizations: ragResult.visualizations ? this.mapVisualizations(ragResult.visualizations) : undefined,
        confidence: ragResult.confidence,
        sessionId,
        metadata: {
          processingTime: Date.now() - startTime,
          dataSourcesUsed: ragResult.sources.length,
          knowledgeNodesAccessed: ragResult.relatedNodes.length,
          conversationTurns: messages.length,
          queryComplexity: this.assessQueryComplexity(userQuery),
          cacheHit: false
        }
      }

      console.log(`✅ Advanced processing completed in ${response.metadata.processingTime}ms`)
      return response

    } catch (error) {
      console.error('❌ Advanced API processing failed:', error)
      return this.fallbackResponse(messages, error)
    }
  }

  /**
   * Enhance RAG result with LLM for better natural language
   * Migliora risultato RAG con LLM per linguaggio più naturale  
   */
  private async enhanceWithLLM(
    query: string, 
    ragResult: RAGResult, 
    messages: Message[],
    apiKey: string
  ): Promise<string> {
    try {
      const enhancementPrompt = this.buildEnhancementPrompt(query, ragResult)
      
      const openAIMessages = [
        { role: 'system', content: this.fallbackPrompts.join('\n') },
        { role: 'system', content: enhancementPrompt },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ]

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: openAIMessages,
          temperature: 0.7,
          max_tokens: 1200,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content
      }

      return ragResult.answer

    } catch (error) {
      console.error('LLM enhancement failed:', error)
      return ragResult.answer
    }
  }

  /**
   * Build enhancement prompt for LLM
   * Costruisci prompt miglioramento per LLM
   */
  private buildEnhancementPrompt(query: string, ragResult: RAGResult): string {
    let prompt = `MIGLIORAMENTO RISPOSTA MARINA:\n\n`
    
    prompt += `DOMANDA UTENTE: "${query}"\n\n`
    
    prompt += `DATI E ANALISI DISPONIBILI:\n`
    prompt += `${ragResult.answer}\n\n`
    
    if (ragResult.sources.length > 0) {
      prompt += `FONTI VERIFICATE:\n`
      ragResult.sources.forEach(source => {
        prompt += `- ${source.name} (affidabilità: ${Math.round(source.reliability * 100)}%)\n`
      })
      prompt += '\n'
    }

    if (ragResult.citations.length > 0) {
      prompt += `CITAZIONI SCIENTIFICHE:\n`
      ragResult.citations.slice(0, 3).forEach(cite => {
        prompt += `- ${cite.text}\n`
      })
      prompt += '\n'
    }

    prompt += `ISTRUZIONI:\n`
    prompt += `1. Riscrivi la risposta in forma più naturale e conversazionale\n`
    prompt += `2. Mantieni TUTTI i dati numerici e le citazioni esistenti\n`
    prompt += `3. Aggiungi context educativo dove appropriato\n`
    prompt += `4. Usa emoji marine per rendere più accattivante\n`
    prompt += `5. Termina con un invito all'approfondimento\n`
    prompt += `6. Mantieni rigorosamente la struttura delle fonti\n\n`

    prompt += `NOTA: Non inventare dati, usa solo quelli forniti.`

    return prompt
  }

  /**
   * Get or create conversation session
   * Ottieni o crea sessione conversazionale
   */
  private getOrCreateSession(messages: Message[], userId?: string): string {
    const cacheKey = userId || 'anonymous'
    
    let sessionId = this.sessionCache.get(cacheKey)
    
    if (!sessionId || messages.length === 1) {
      sessionId = conversationMemory.initializeSession(userId)
      this.sessionCache.set(cacheKey, sessionId)
    }
    
    return sessionId
  }

  /**
   * Map RAG data sources to API format
   * Mappa fonti dati RAG a formato API
   */
  private mapDataSources(sources: any[]): DataSourceInfo[] {
    return sources.map(source => ({
      id: source.id,
      name: source.name,
      type: source.type,
      reliability: source.reliability || 0.8,
      lastUpdated: source.timestamp?.toISOString() || new Date().toISOString(),
      url: source.url
    }))
  }

  /**
   * Map RAG citations to API format
   * Mappa citazioni RAG a formato API
   */
  private mapCitations(citations: any[]): CitationInfo[] {
    return citations.map(cite => ({
      id: cite.id,
      text: cite.text,
      source: cite.source,
      url: cite.url,
      type: cite.type
    }))
  }

  /**
   * Map RAG visualizations to API format
   * Mappa visualizzazioni RAG a formato API
   */
  private mapVisualizations(visualizations: any[]): VisualizationData[] {
    return visualizations.map(viz => ({
      type: viz.type,
      title: viz.title,
      data: viz.data,
      config: viz.config
    }))
  }

  /**
   * Assess query complexity
   * Valuta complessità query
   */
  private assessQueryComplexity(query: string): 'simple' | 'moderate' | 'complex' {
    const queryLower = query.toLowerCase()
    let complexity = 0

    // Check for multiple parameters
    const parameters = ['temperatura', 'clorofilla', 'ph', 'salinità', 'onde', 'ossigeno']
    const paramCount = parameters.filter(p => queryLower.includes(p)).length
    complexity += paramCount

    // Check for comparison words
    if (queryLower.includes('confronta') || queryLower.includes('vs') || queryLower.includes('differenza')) {
      complexity += 2
    }

    // Check for temporal aspects
    if (queryLower.includes('trend') || queryLower.includes('andamento') || queryLower.includes('negli anni')) {
      complexity += 2
    }

    // Check for scientific terms
    const scientificTerms = ['posidonia', 'pinna nobilis', 'cymodocea', 'fitoplancton']
    const sciCount = scientificTerms.filter(t => queryLower.includes(t)).length
    complexity += sciCount

    if (complexity >= 4) return 'complex'
    if (complexity >= 2) return 'moderate'
    return 'simple'
  }

  /**
   * Create fallback response when advanced processing fails
   * Crea risposta fallback quando elaborazione avanzata fallisce
   */
  private fallbackResponse(messages: Message[], error: any): AdvancedApiResponse {
    console.warn('Using fallback response due to error:', error)

    const lastMessage = messages[messages.length - 1]
    const sessionId = this.getOrCreateSession(messages)

    return {
      content: `🌊 **Risposta Base Proteo**

Mi dispiace, il sistema avanzato ha riscontrato un problema temporaneo. 

Per la tua domanda: "${lastMessage?.content || 'query'}"

Posso comunque fornirti alcune informazioni di base:
- I nostri sistemi monitorano costantemente le acque italiane
- Dati disponibili da ISPRA, EMODnet e Copernicus
- Progetti di conservazione marina attivi (MER)

💡 **Suggerimento**: Riprova con una domanda più specifica come:
- "Temperatura del mare Adriatico oggi"
- "Livelli clorofilla nel Tirreno"
- "Progetti di conservazione Posidonia"

Per assistenza tecnica, contatta il supporto ISPRA.`,
      sources: [{
        id: 'fallback',
        name: 'Sistema Base Proteo',
        type: 'realtime' as const,
        reliability: 0.5,
        lastUpdated: new Date().toISOString()
      }],
      citations: [],
      suggestions: [
        'Riprova con una domanda più specifica',
        'Esplora i progetti di conservazione marina',
        'Chiedi informazioni su una singola area marina'
      ],
      confidence: 0.3,
      sessionId,
      metadata: {
        processingTime: 100,
        dataSourcesUsed: 0,
        knowledgeNodesAccessed: 0,
        conversationTurns: messages.length,
        queryComplexity: 'simple',
        cacheHit: false
      }
    }
  }

  /**
   * Health check for advanced systems
   * Controllo stato sistemi avanzati
   */
  async healthCheck(): Promise<{
    overall: boolean
    systems: Record<string, boolean>
    details: Record<string, any>
  }> {
    const results = {
      overall: true,
      systems: {} as Record<string, boolean>,
      details: {} as Record<string, any>
    }

    try {
      // Check OpenAI API
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (apiKey) {
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          })
          results.systems.openai = response.ok
        } catch {
          results.systems.openai = false
        }
      } else {
        results.systems.openai = false
        results.details.openai = 'API key not configured'
      }

      // Check Open Data Services
      const dataHealthChecks = await openDataService.healthCheck()
      results.systems.openData = Object.values(dataHealthChecks).some(Boolean)
      results.details.openData = dataHealthChecks

      // Check Knowledge Graph
      const kgStats = advancedRAG.getKnowledgeGraphStats()
      results.systems.knowledgeGraph = kgStats.nodes > 0 && kgStats.relations > 0
      results.details.knowledgeGraph = kgStats

      // Check Conversation Memory
      results.systems.conversationMemory = true // Always available locally
      results.details.conversationMemory = 'Local memory active'

      // Overall health
      const systemsHealthy = Object.values(results.systems).filter(Boolean).length
      const totalSystems = Object.keys(results.systems).length
      results.overall = systemsHealthy >= Math.ceil(totalSystems * 0.6) // 60% systems must be healthy

      results.details.summary = `${systemsHealthy}/${totalSystems} systems operational`

    } catch (error) {
      console.error('Health check failed:', error)
      results.overall = false
      results.details.error = error instanceof Error ? error.message : 'Unknown error'
    }

    return results
  }

  /**
   * Get system analytics
   * Ottieni analisi sistema
   */
  getSystemAnalytics(): any {
    return {
      knowledgeGraph: advancedRAG.getKnowledgeGraphStats(),
      activeSessions: this.sessionCache.size,
      cacheSize: this.sessionCache.size,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Export conversation data for analysis
   * Esporta dati conversazione per analisi
   */
  exportConversationData(sessionId: string): any {
    return conversationMemory.exportConversationData(sessionId)
  }

  /**
   * Clear session data
   * Cancella dati sessione
   */
  clearSession(userId?: string): void {
    const cacheKey = userId || 'anonymous'
    this.sessionCache.delete(cacheKey)
  }
}

export const advancedApiClient = new AdvancedApiClient()