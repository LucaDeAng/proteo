import { Message } from '@/components/MessageBubble'
import { mockFetch } from './mock'
import { ragService } from '@/services/ragService'

/**
 * API client for OpenAI communication
 * Client API per comunicazione OpenAI
 */
class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_LLM_API_URL || 'https://api.openai.com/v1/chat/completions'
  }

  /**
   * Send message to OpenAI API with RAG enhancement
   * Invia messaggio all'API OpenAI con miglioramento RAG
   */
  async sendMessage(messages: Message[]): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    
    // Get the last user message for RAG retrieval / Ottieni ultimo messaggio utente per recupero RAG
    const lastMessage = messages[messages.length - 1]
    const userQuery = lastMessage?.content || ''

    // Use mock if no API key configured / Usa mock se nessuna API key configurata
    if (!apiKey) {
      console.warn('VITE_OPENAI_API_KEY not configured, using enhanced mock response with RAG')
      
      // Enhanced mock with RAG data / Mock migliorato con dati RAG
      try {
        const ragResult = await ragService.retrieveRelevantData(userQuery)
        if (ragResult.confidence > 0.5) {
          return this.formatRAGResponse(ragResult)
        }
      } catch (error) {
        console.error('RAG service error:', error)
      }
      
      return mockFetch(messages)
    }

    try {
      // Retrieve relevant marine data using RAG / Recupera dati marini rilevanti usando RAG
      const ragResult = await ragService.retrieveRelevantData(userQuery)
      
      const systemPrompt = import.meta.env.VITE_SYSTEM_PROMPT || 
        `Sei Proteo, assistente AI per il monitoraggio marino ISPRA/MER. 
        Hai accesso a dati marini reali da ISPRA e altre fonti ufficiali.
        
        ISTRUZIONI:
        - Rispondi in italiano con dati tecnici precisi
        - Usa emoji marine appropriate (🌊🐚🐟🌡️🔬)
        - Includi sempre traduzione chiave in inglese
        - Cita le fonti dei dati (ISPRA, Copernicus, etc.)
        - Mantieni tono professionale ma accessibile
        - Se disponibili, usa i dati reali forniti nel contesto
        
        Fornisci risposte accurate basate sui dati marini del Mediterraneo.`

      // Build enhanced messages with RAG context / Costruisci messaggi migliorati con contesto RAG
      const openAIMessages = [
        { role: 'system', content: systemPrompt },
        ...(ragResult.confidence > 0.5 ? [
          { 
            role: 'system', 
            content: `CONTESTO DATI MARINI:\n${ragResult.context}\n\nUsa questi dati per rispondere alla domanda dell'utente.` 
          }
        ] : []),
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
          max_tokens: 1000,
          stream: false
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI API')
      }
      
      return data.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API call failed:', error)
      
      // Fallback to enhanced mock with RAG / Fallback a mock migliorato con RAG
      console.warn('API failed, falling back to enhanced mock response')
      
      try {
        const ragResult = await ragService.retrieveRelevantData(userQuery)
        if (ragResult.confidence > 0.5) {
          return this.formatRAGResponse(ragResult)
        }
      } catch (ragError) {
        console.error('RAG fallback failed:', ragError)
      }
      
      return mockFetch(messages)
    }
  }

  /**
   * Format RAG response for enhanced mock mode
   * Formatta risposta RAG per modalità mock migliorata
   */
  private formatRAGResponse(ragResult: any): string {
    let response = '🔬 **Dati ISPRA aggiornati** / *Updated ISPRA data*\n\n'
    
    if (ragResult.relevantData.length > 0) {
      const dataByParameter = ragResult.relevantData.reduce((acc: any, point: any) => {
        if (!acc[point.parameter]) acc[point.parameter] = []
        acc[point.parameter].push(point)
        return acc
      }, {})

      Object.entries(dataByParameter).forEach(([parameter, points]: [string, any]) => {
        const parameterName = this.getParameterDisplayName(parameter)
        response += `**${parameterName}:**\n`
        
        points.forEach((point: any) => {
          response += `• ${point.location}: ${point.value} ${point.unit}\n`
        })
        response += '\n'
      })
    }

    if (ragResult.sources.length > 0) {
      response += `📊 **Fonti dati** / *Data sources*: ${ragResult.sources.map((s: any) => s.nameEn).join(', ')}\n\n`
    }

    response += '*I dati sono simulati per dimostrazione. Configura VITE_OPENAI_API_KEY per risposte IA complete.*\n'
    response += '*Data is simulated for demonstration. Configure VITE_OPENAI_API_KEY for complete AI responses.*'

    return response
  }

  /**
   * Get display name for parameter
   * Ottieni nome visualizzazione per parametro
   */
  private getParameterDisplayName(parameter: string): string {
    const names: Record<string, string> = {
      'sea_temperature': '🌡️ Temperatura marina / Sea temperature',
      'chlorophyll_concentration': '🌱 Concentrazione clorofilla / Chlorophyll concentration',
      'wave_height': '🌊 Altezza onde / Wave height',
      'water_quality': '💧 Qualità acque / Water quality'
    }
    return names[parameter] || parameter
  }

  /**
   * Health check for OpenAI API
   * Controllo stato API OpenAI
   */
  async healthCheck(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) return false

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json' 
        }
      })
      
      return response.ok
    } catch {
      return false
    }
  }
}

export const apiClient = new ApiClient()