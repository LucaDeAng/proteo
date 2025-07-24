/**
 * Advanced Conversation Memory System for Proteo Marine Assistant
 * Sistema Avanzato di Memoria Conversazionale per Assistente Marino Proteo
 */

export interface ConversationTurn {
  id: string
  timestamp: Date
  userMessage: string
  assistantResponse: string
  context: {
    detectedParameters: string[]
    dataUsed: string[]
    citations: string[]
    confidence: number
  }
  userFeedback?: 'positive' | 'negative' | 'neutral'
  metadata: {
    sessionDuration: number
    queryType: 'data' | 'education' | 'navigation' | 'mer_project'
    userProfile?: UserProfile
  }
}

export interface UserProfile {
  id: string
  interests: string[]
  expertiseLevel: 'tourist' | 'student' | 'researcher' | 'professional'
  preferredTopics: string[]
  frequentQueries: string[]
  locationContext?: string
  language: 'it' | 'en'
  lastActive: Date
}

export interface ConversationSession {
  sessionId: string
  userId?: string
  startTime: Date
  endTime?: Date
  turns: ConversationTurn[]
  summary: string
  keyTopics: string[]
  userSatisfaction?: number
  totalQueries: number
}

export interface MemorySearchResult {
  relevantTurns: ConversationTurn[]
  patterns: string[]
  suggestions: string[]
  confidence: number
}

class ConversationMemoryService {
  private sessions: Map<string, ConversationSession> = new Map()
  private userProfiles: Map<string, UserProfile> = new Map()
  private readonly MAX_MEMORY_TURNS = 50
  private readonly RELEVANCE_THRESHOLD = 0.3

  /**
   * Initialize new conversation session
   * Inizializza nuova sessione conversazionale
   */
  initializeSession(userId?: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session: ConversationSession = {
      sessionId,
      userId,
      startTime: new Date(),
      turns: [],
      summary: '',
      keyTopics: [],
      totalQueries: 0
    }

    this.sessions.set(sessionId, session)
    return sessionId
  }

  /**
   * Add conversation turn to memory
   * Aggiungi turno conversazionale alla memoria
   */
  addConversationTurn(
    sessionId: string,
    userMessage: string,
    assistantResponse: string,
    context: any,
    _metadata: any
  ): void {
    const session = this.sessions.get(sessionId)
    if (!session) return

    const turn: ConversationTurn = {
      id: `turn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(),
      userMessage,
      assistantResponse,
      context: {
        detectedParameters: this.extractParameters(userMessage),
        dataUsed: context.sources?.map((s: any) => s.name) || [],
        citations: this.extractCitations(assistantResponse),
        confidence: context.confidence || 0.5
      },
      metadata: {
        sessionDuration: Date.now() - session.startTime.getTime(),
        queryType: this.classifyQuery(userMessage),
        userProfile: session.userId ? this.userProfiles.get(session.userId) : undefined
      }
    }

    session.turns.push(turn)
    session.totalQueries++

    // Update user profile if available
    if (session.userId) {
      this.updateUserProfile(session.userId, turn)
    }

    // Maintain memory limit
    this.pruneMemoryIfNeeded(session)

    // Update session summary
    this.updateSessionSummary(session)
  }

  /**
   * Search conversation memory for relevant context
   * Cerca nella memoria conversazionale per contesto rilevante
   */
  searchMemory(query: string, sessionId: string, limit: number = 5): MemorySearchResult {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return { relevantTurns: [], patterns: [], suggestions: [], confidence: 0 }
    }

    const queryEmbedding = this.createSimpleEmbedding(query)
    const scoredTurns = session.turns.map(turn => ({
      turn,
      score: this.calculateRelevanceScore(query, turn, queryEmbedding)
    }))

    const relevantTurns = scoredTurns
      .filter(item => item.score > this.RELEVANCE_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.turn)

    const patterns = this.identifyConversationPatterns(session.turns)
    const suggestions = this.generateProactiveSuggestions(relevantTurns, patterns)

    return {
      relevantTurns,
      patterns,
      suggestions,
      confidence: relevantTurns.length > 0 ? 0.8 : 0.2
    }
  }

  /**
   * Get enhanced context for current query
   * Ottieni contesto migliorato per query corrente
   */
  getEnhancedContext(_query: string, sessionId: string): string {
    const memoryResult = this.searchMemory(_query, sessionId)
    const session = this.sessions.get(sessionId)
    
    let context = `MEMORIA CONVERSAZIONALE PROTEO:\n\n`
    
    // Add session context
    if (session) {
      context += `Sessione corrente: ${session.totalQueries} domande, temi principali: ${session.keyTopics.join(', ')}\n\n`
    }

    // Add relevant previous conversations
    if (memoryResult.relevantTurns.length > 0) {
      context += `CONVERSAZIONI PRECEDENTI RILEVANTI:\n`
      memoryResult.relevantTurns.forEach((turn, i) => {
        const timeAgo = this.getTimeAgo(turn.timestamp)
        context += `${i + 1}. ${timeAgo}: "${turn.userMessage}" → Parametri: ${turn.context.detectedParameters.join(', ')}\n`
      })
      context += '\n'
    }

    // Add conversation patterns
    if (memoryResult.patterns.length > 0) {
      context += `PATTERN IDENTIFICATI:\n`
      memoryResult.patterns.forEach(pattern => {
        context += `- ${pattern}\n`
      })
      context += '\n'
    }

    // Add proactive suggestions
    if (memoryResult.suggestions.length > 0) {
      context += `SUGGERIMENTI PROATTIVI DA CONSIDERARE:\n`
      memoryResult.suggestions.forEach(suggestion => {
        context += `- ${suggestion}\n`
      })
      context += '\n'
    }

    context += `ISTRUZIONI MEMORIA:\n`
    context += `- Usa il contesto conversazionale per dare risposte più pertinenti e personali\n`
    context += `- Riferisciti a discussioni precedenti quando appropriato\n`
    context += `- Suggerisci approfondimenti basati sui pattern identificati\n`
    context += `- Mantieni coerenza con le informazioni già fornite\n`

    return context
  }

  /**
   * Update user profile based on interaction
   * Aggiorna profilo utente basato sull'interazione
   */
  private updateUserProfile(userId: string, turn: ConversationTurn): void {
    let profile = this.userProfiles.get(userId)
    
    if (!profile) {
      profile = {
        id: userId,
        interests: [],
        expertiseLevel: 'tourist',
        preferredTopics: [],
        frequentQueries: [],
        language: 'it',
        lastActive: new Date()
      }
    }

    // Update interests based on detected parameters
    turn.context.detectedParameters.forEach(param => {
      if (!profile!.interests.includes(param)) {
        profile!.interests.push(param)
      }
    })

    // Update expertise level based on query complexity
    if (turn.metadata.queryType === 'data' && turn.context.confidence > 0.8) {
      if (profile.expertiseLevel === 'tourist') {
        profile.expertiseLevel = 'student'
      } else if (profile.expertiseLevel === 'student') {
        profile.expertiseLevel = 'researcher'
      }
    }

    // Update frequent queries
    const queryType = turn.metadata.queryType
    if (!profile.frequentQueries.includes(queryType)) {
      profile.frequentQueries.push(queryType)
    }

    profile.lastActive = new Date()
    this.userProfiles.set(userId, profile)
  }

  /**
   * Extract marine parameters from user message
   * Estrai parametri marini dal messaggio utente
   */
  private extractParameters(message: string): string[] {
    const marineParams = [
      'temperatura', 'temperature', 'clorofilla', 'chlorophyll',
      'onde', 'waves', 'ph', 'salinità', 'salinity', 'ossigeno', 'oxygen',
      'biodiversità', 'biodiversity', 'posidonia', 'pinna', 'marea', 'tide',
      'inquinamento', 'pollution', 'qualità', 'quality', 'conservazione'
    ]

    const messageLower = message.toLowerCase()
    return marineParams.filter(param => messageLower.includes(param))
  }

  /**
   * Extract citations from assistant response
   * Estrai citazioni dalla risposta dell'assistente
   */
  private extractCitations(response: string): string[] {
    const citations = []
    
    // Look for ISPRA references
    if (response.includes('ISPRA')) citations.push('ISPRA')
    if (response.includes('Copernicus')) citations.push('Copernicus Marine Service')
    if (response.includes('EMODnet')) citations.push('EMODnet')
    if (response.includes('MER')) citations.push('Progetto MER')
    
    return citations
  }

  /**
   * Classify query type
   * Classifica tipo di query
   */
  private classifyQuery(message: string): 'data' | 'education' | 'navigation' | 'mer_project' {
    const messageLower = message.toLowerCase()
    
    if (messageLower.includes('mer') || messageLower.includes('progetto') || messageLower.includes('ripristino')) {
      return 'mer_project'
    }
    
    if (messageLower.includes('come') || messageLower.includes('dove') || messageLower.includes('navigare')) {
      return 'navigation'
    }
    
    if (messageLower.includes('curiosità') || messageLower.includes('impara') || messageLower.includes('specie')) {
      return 'education'
    }
    
    return 'data'
  }

  /**
   * Calculate relevance score between query and conversation turn
   * Calcola punteggio rilevanza tra query e turno conversazionale
   */
  private calculateRelevanceScore(_query: string, turn: ConversationTurn, queryEmbedding: number[]): number {
    const turnEmbedding = this.createSimpleEmbedding(turn.userMessage + ' ' + turn.assistantResponse)
    const similarity = this.cosineSimilarity(queryEmbedding, turnEmbedding)
    
    // Boost score for recent turns
    const ageBoost = Math.max(0, 1 - (Date.now() - turn.timestamp.getTime()) / (24 * 60 * 60 * 1000))
    
    // Boost score for high-confidence turns
    const confidenceBoost = turn.context.confidence
    
    return similarity * 0.7 + ageBoost * 0.2 + confidenceBoost * 0.1
  }

  /**
   * Identify conversation patterns
   * Identifica pattern conversazionali
   */
  private identifyConversationPatterns(turns: ConversationTurn[]): string[] {
    const patterns = []
    
    // Pattern: Repeated parameter queries
    const paramCounts = new Map<string, number>()
    turns.forEach(turn => {
      turn.context.detectedParameters.forEach(param => {
        paramCounts.set(param, (paramCounts.get(param) || 0) + 1)
      })
    })
    
    paramCounts.forEach((count, param) => {
      if (count >= 3) {
        patterns.push(`Interesse ricorrente per ${param}`)
      }
    })
    
    // Pattern: Increasing complexity
    const recentTurns = turns.slice(-5)
    if (recentTurns.length >= 3) {
      const avgConfidence = recentTurns.reduce((sum, turn) => sum + turn.context.confidence, 0) / recentTurns.length
      if (avgConfidence > 0.7) {
        patterns.push('Domande sempre più specifiche e tecniche')
      }
    }
    
    // Pattern: Topic progression
    const recentTopics = recentTurns.map(turn => turn.metadata.queryType)
    if (recentTopics.includes('education') && recentTopics.includes('data')) {
      patterns.push('Progressione da apprendimento generale a dati specifici')
    }
    
    return patterns
  }

  /**
   * Generate proactive suggestions based on context
   * Genera suggerimenti proattivi basati sul contesto
   */
  private generateProactiveSuggestions(relevantTurns: ConversationTurn[], patterns: string[]): string[] {
    const suggestions = []
    
    // Suggest related parameters
    const seenParams = new Set<string>()
    relevantTurns.forEach(turn => {
      turn.context.detectedParameters.forEach(param => seenParams.add(param))
    })
    
    if (seenParams.has('temperatura')) {
      suggestions.push('Potresti essere interessato anche ai dati di salinità correlati')
    }
    
    if (seenParams.has('clorofilla')) {
      suggestions.push('I dati di qualità delle acque potrebbero fornire un quadro più completo')
    }
    
    if (seenParams.has('posidonia')) {
      suggestions.push('Il progetto MER ha informazioni dettagliate sul ripristino delle praterie')
    }
    
    // Suggest based on patterns
    patterns.forEach(pattern => {
      if (pattern.includes('tecnice')) {
        suggestions.push('Potrei fornirti anche link a pubblicazioni scientifiche ISPRA')
      }
      
      if (pattern.includes('apprendimento')) {
        suggestions.push('Ci sono curiosità marine affascinanti che potrebbero interessarti')
      }
    })
    
    return suggestions.slice(0, 3) // Limit suggestions
  }

  /**
   * Simple embedding creation (production should use proper embeddings)
   * Creazione embedding semplice (produzione dovrebbe usare embedding appropriati)
   */
  private createSimpleEmbedding(text: string): number[] {
    const keywords = [
      'temperatura', 'clorofilla', 'onde', 'ph', 'salinità', 'biodiversità',
      'posidonia', 'conservazione', 'mer', 'ispra', 'qualità', 'inquinamento'
    ]
    
    const textLower = text.toLowerCase()
    return keywords.map(keyword => textLower.split(keyword).length - 1)
  }

  /**
   * Calculate cosine similarity
   * Calcola similarità coseno
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0
    return dotProduct / (magnitudeA * magnitudeB)
  }

  /**
   * Get human-readable time ago
   * Ottieni tempo fa leggibile
   */
  private getTimeAgo(timestamp: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'ora'
    if (diffMins < 60) return `${diffMins} min fa`
    
    const diffHours = Math.round(diffMins / 60)
    if (diffHours < 24) return `${diffHours} ore fa`
    
    const diffDays = Math.round(diffHours / 24)
    return `${diffDays} giorni fa`
  }

  /**
   * Prune memory if it exceeds limits
   * Elimina memoria se supera i limiti
   */
  private pruneMemoryIfNeeded(session: ConversationSession): void {
    if (session.turns.length > this.MAX_MEMORY_TURNS) {
      // Keep most recent and highest-confidence turns
      const sortedTurns = session.turns.sort((a, b) => {
        const scoreA = a.context.confidence + (a.timestamp.getTime() / 1000000000)
        const scoreB = b.context.confidence + (b.timestamp.getTime() / 1000000000)
        return scoreB - scoreA
      })
      
      session.turns = sortedTurns.slice(0, this.MAX_MEMORY_TURNS)
    }
  }

  /**
   * Update session summary
   * Aggiorna riassunto sessione
   */
  private updateSessionSummary(session: ConversationSession): void {
    const paramCounts = new Map<string, number>()
    const topicCounts = new Map<string, number>()
    
    session.turns.forEach(turn => {
      turn.context.detectedParameters.forEach(param => {
        paramCounts.set(param, (paramCounts.get(param) || 0) + 1)
      })
      
      const topic = turn.metadata.queryType
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1)
    })
    
    // Update key topics
    session.keyTopics = Array.from(paramCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([param]) => param)
    
    // Create summary
    const topParam = session.keyTopics[0]
    const topTopic = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0]
    
    session.summary = `Sessione focalizzata su ${topParam || 'dati marini'} con ${session.totalQueries} domande di tipo ${topTopic || 'generale'}`
  }

  /**
   * Get session analytics
   * Ottieni analisi sessione
   */
  getSessionAnalytics(sessionId: string): any {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const avgConfidence = session.turns.reduce((sum, turn) => sum + turn.context.confidence, 0) / session.turns.length
    const uniqueParams = new Set(session.turns.flatMap(turn => turn.context.detectedParameters))
    
    return {
      sessionId,
      duration: session.endTime ? 
        session.endTime.getTime() - session.startTime.getTime() : 
        Date.now() - session.startTime.getTime(),
      totalQueries: session.totalQueries,
      avgConfidence,
      uniqueParameters: Array.from(uniqueParams),
      keyTopics: session.keyTopics,
      summary: session.summary
    }
  }

  /**
   * Export conversation data
   * Esporta dati conversazione
   */
  exportConversationData(sessionId: string): any {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    return {
      session,
      analytics: this.getSessionAnalytics(sessionId),
      exportTimestamp: new Date().toISOString()
    }
  }
}

export const conversationMemory = new ConversationMemoryService()