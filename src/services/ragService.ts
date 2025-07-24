import { MARINE_DATA_SOURCES, SAMPLE_MARINE_DATA, DataSource } from '@/data/marineDataSources'
import { ISPRA_WEBSITE_SECTIONS, MARINE_SPECIFIC_NAVIGATION, ISPRA_WEBSITE_CONTEXT } from '@/data/ispraWebsiteData'
import { MER_PROJECT, MARINE_QUOTES, MARINE_CURIOSITIES } from '@/data/merProjectData'

/**
 * RAG (Retrieval-Augmented Generation) Service for Marine Data
 * Servizio RAG per Dati Marini
 */

export interface MarineDataPoint {
  source: string
  parameter: string
  value: number | string
  unit: string
  location: string
  timestamp: string
  quality: 'good' | 'moderate' | 'poor'
}

export interface RetrievalResult {
  query: string
  relevantData: MarineDataPoint[]
  sources: DataSource[]
  context: string
  confidence: number
}

class RAGService {
  private dataCache: Map<string, any> = new Map()

  /**
   * Simple text embedding using word frequency (production should use OpenAI embeddings)
   * Embedding semplice usando frequenza parole (produzione dovrebbe usare embedding OpenAI)
   */
  private createEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/)
    const keywords = [
      // Marine data keywords
      'temperatura', 'temperature', 'clorofilla', 'chlorophyll', 
      'onde', 'waves', 'marea', 'tide', 'qualità', 'quality',
      'inquinamento', 'pollution', 'biodiversità', 'biodiversity',
      'ph', 'ossigeno', 'oxygen', 'salinità', 'salinity',
      // MER Project keywords
      'mer', 'marine', 'ecosystem', 'restoration', 'ripristino',
      'posidonia', 'praterie', 'meadows', 'reti', 'ghost', 'fantasma',
      'arcadia', 'nave', 'vessel', 'montagne', 'sottomarine', 'seamounts',
      'conservazione', 'conservation', 'specie', 'species', 'habitat',
      'pinna', 'nobilis', 'cymodocea', 'curiosità', 'curiosity',
      // Navigation keywords
      'navigare', 'navigate', 'sito', 'website', 'come', 'how',
      'dove', 'where', 'trovare', 'find', 'accedere', 'access',
      'pubblicazioni', 'publications', 'dati', 'data', 'servizi', 'services',
      'contatti', 'contacts', 'ispra', 'istituto', 'institute'
    ]
    
    return keywords.map(keyword => 
      words.filter(word => word.includes(keyword)).length
    )
  }

  /**
   * Calculate cosine similarity between embeddings
   * Calcola similarità coseno tra embedding
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0
    return dotProduct / (magnitudeA * magnitudeB)
  }

  /**
   * Check if query is about website navigation
   * Controlla se la query riguarda la navigazione del sito
   */
  private isNavigationQuery(query: string): boolean {
    const navigationKeywords = [
      'come', 'how', 'dove', 'where', 'navigare', 'navigate',
      'sito', 'website', 'trovare', 'find', 'accedere', 'access',
      'pubblicazioni', 'publications', 'contatti', 'contacts'
    ]
    
    const queryLower = query.toLowerCase()
    return navigationKeywords.some(keyword => queryLower.includes(keyword))
  }

  /**
   * Check if query is about MER project or species curiosities
   * Controlla se la query riguarda il progetto MER o curiosità sulle specie
   */
  private isMERQuery(query: string): boolean {
    const merKeywords = [
      'mer', 'marine ecosystem restoration', 'ripristino', 'progetto',
      'posidonia', 'specie', 'species', 'curiosità', 'curiosity',
      'conservazione', 'conservation', 'pinna nobilis', 'cymodocea',
      'reti fantasma', 'ghost nets', 'arcadia', 'montagne sottomarine'
    ]
    
    const queryLower = query.toLowerCase()
    return merKeywords.some(keyword => queryLower.includes(keyword))
  }

  /**
   * Get MER project information and curiosities
   * Ottieni informazioni progetto MER e curiosità
   */
  private getMERResponse(query: string): string {
    const queryLower = query.toLowerCase()
    let response = ''

    // Check for species-specific queries
    if (queryLower.includes('posidonia')) {
      const posidonia = MER_PROJECT.species.find(s => s.scientificName === 'Posidonia oceanica')
      if (posidonia) {
        response += `🌱 **${posidonia.commonNameIt} (${posidonia.scientificName})**\n\n`
        response += `${posidonia.description}\n\n`
        response += `**Curiosità affascinanti:**\n`
        posidonia.curiosities.forEach((curiosity, i) => {
          response += `${i + 1}. ${curiosity}\n`
        })
        response += '\n'
        // Add quick marine fact
        response += this.getQuickMarineFact()
      }
    }

    if (queryLower.includes('pinna') || queryLower.includes('nobilis')) {
      const pinna = MER_PROJECT.species.find(s => s.scientificName === 'Pinna nobilis')
      if (pinna) {
        response += `🐚 **${pinna.commonNameIt} (${pinna.scientificName})**\n\n`
        response += `${pinna.description}\n\n`
        response += `**Curiosità e conservazione:**\n`
        pinna.curiosities.forEach((curiosity, i) => {
          response += `${i + 1}. ${curiosity}\n`
        })
        response += '\n'
        // Add quick marine fact
        response += this.getQuickMarineFact()
      }
    }

    // Add general MER project info
    if (queryLower.includes('mer') || queryLower.includes('progetto') || queryLower.includes('ripristino')) {
      response += `🌊 **Progetto MER - Marine Ecosystem Restoration**\n\n`
      response += `${MER_PROJECT.description}\n\n`
      response += `**Budget:** ${MER_PROJECT.budget}\n`
      response += `**Durata:** ${MER_PROJECT.duration}\n\n`
      response += `**Obiettivi principali:**\n`
      MER_PROJECT.objectives.slice(0, 3).forEach((obj, i) => {
        response += `${i + 1}. ${obj}\n`
      })
      response += '\n'
      // Add quick marine fact
      response += this.getQuickMarineFact()
    }

    // Add marine curiosities
    if (queryLower.includes('curiosità') || queryLower.includes('curiosity')) {
      const randomCuriosity = MARINE_CURIOSITIES[Math.floor(Math.random() * MARINE_CURIOSITIES.length)]
      response += `💡 **${randomCuriosity.title}**\n${randomCuriosity.description}\n\n`
    }

    // Add inspiring quote
    const randomQuote = MARINE_QUOTES[Math.floor(Math.random() * MARINE_QUOTES.length)] 
    response += `💙 *"${randomQuote.text}"*\n— ${randomQuote.author}\n\n`

    // Add MER link
    response += `🔗 **Per saperne di più:**\n`
    response += `[Progetto MER - ISPRA](https://www.isprambiente.gov.it/en/projects/sea/pnrr-mer-marine-ecosystem-restoration)\n`
    response += `[Dati Marini ISPRA](https://dati.isprambiente.it)\n\n`

    return response
  }

  /**
   * Get a quick marine fact for responses
   * Ottieni un fatto marino veloce per le risposte
   */
  private getQuickMarineFact(): string {
    const facts = [
      `🌱 **Info Rapida:** Le praterie di Posidonia producono 14L di ossigeno al giorno per m²`,
      `🐟 **Lo Sapevi?** Il Mediterraneo ospita il 7% delle specie marine mondiali`,
      `🐚 **Gigante Marino:** La Pinna nobilis può vivere 50 anni e raggiungere 120cm`,
      `⛰️ **Tesori Nascosti:** 90+ montagne sottomarine nel Mediterraneo italiano`,
      `🕸️ **Problema Serio:** L'86,5% dei rifiuti marini deriva da attività di pesca`
    ]
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)]
    return `\n---\n${randomFact}\n---\n\n`
  }

  /**
   * Get website navigation help
   * Ottieni aiuto navigazione sito web
   */
  private getNavigationHelp(query: string): string {
    const queryLower = query.toLowerCase()
    
    // Find matching navigation help
    for (const help of MARINE_SPECIFIC_NAVIGATION) {
      const intentKeywords = help.intent.toLowerCase().split(' ')
      if (intentKeywords.some(keyword => queryLower.includes(keyword))) {
        return help.response
      }
    }
    
    // Default navigation response
    return `🌐 **Navigazione sito ISPRA:**\n\n${ISPRA_WEBSITE_CONTEXT}\n\n**Sezioni principali:**\n${ISPRA_WEBSITE_SECTIONS.map(section => 
      `• **${section.name}**: ${section.description}`
    ).join('\n')}\n\nPer assistenza specifica, fammi sapere cosa stai cercando!`
  }

  /**
   * Retrieve relevant marine data based on query
   * Recupera dati marini rilevanti basati sulla query
   */
  async retrieveRelevantData(query: string): Promise<RetrievalResult> {
    const queryEmbedding = this.createEmbedding(query)
    const relevantSources: DataSource[] = []
    const relevantData: MarineDataPoint[] = []

    // Check if this is a navigation query / Controlla se è una query di navigazione
    if (this.isNavigationQuery(query)) {
      const navigationHelp = this.getNavigationHelp(query)
      return {
        query,
        relevantData: [],
        sources: [],
        context: navigationHelp,
        confidence: 0.9
      }
    }

    // Check if this is a MER project query / Controlla se è una query sul progetto MER
    if (this.isMERQuery(query)) {
      const merResponse = this.getMERResponse(query)
      return {
        query,
        relevantData: [],
        sources: [],
        context: merResponse,
        confidence: 0.95
      }
    }

    // Find relevant data sources / Trova fonti dati rilevanti
    for (const source of MARINE_DATA_SOURCES) {
      const sourceText = `${source.name} ${source.nameEn} ${source.description} ${source.parameters.join(' ')}`
      const sourceEmbedding = this.createEmbedding(sourceText)
      const similarity = this.cosineSimilarity(queryEmbedding, sourceEmbedding)

      if (similarity > 0.1) {
        relevantSources.push(source)
      }
    }

    // Generate sample data based on query context / Genera dati campione basati sul contesto query
    const currentDate = new Date().toISOString().split('T')[0]
    
    if (query.toLowerCase().includes('temperatura') || query.toLowerCase().includes('temperature')) {
      const tempData = (SAMPLE_MARINE_DATA.temperature as any)[currentDate] || (SAMPLE_MARINE_DATA.temperature as any)["2024-01-20"]
      Object.entries(tempData).forEach(([location, value]) => {
        relevantData.push({
          source: 'ron',
          parameter: 'sea_temperature',
          value: value as number,
          unit: '°C',
          location,
          timestamp: currentDate,
          quality: 'good'
        })
      })
    }

    if (query.toLowerCase().includes('clorofilla') || query.toLowerCase().includes('chlorophyll')) {
      const chlorData = (SAMPLE_MARINE_DATA.chlorophyll as any)[currentDate] || (SAMPLE_MARINE_DATA.chlorophyll as any)["2024-01-20"]
      Object.entries(chlorData).forEach(([location, value]) => {
        relevantData.push({
          source: 'chlorophyll',
          parameter: 'chlorophyll_concentration',
          value: value as number,
          unit: 'µg/L',
          location,
          timestamp: currentDate,
          quality: 'good'
        })
      })
    }

    if (query.toLowerCase().includes('onde') || query.toLowerCase().includes('wave')) {
      const waveData = (SAMPLE_MARINE_DATA.waves as any)[currentDate] || (SAMPLE_MARINE_DATA.waves as any)["2024-01-20"]
      waveData.stations.forEach((station: any) => {
        relevantData.push({
          source: 'ron',
          parameter: 'wave_height',
          value: station.height,
          unit: 'm',
          location: station.name,
          timestamp: currentDate,
          quality: 'good'
        })
      })
    }

    // Build context for LLM / Costruisci contesto per LLM
    const context = this.buildContext(relevantData, relevantSources, query)
    const confidence = relevantData.length > 0 ? 0.8 : 0.3

    return {
      query,
      relevantData,
      sources: relevantSources,
      context,
      confidence
    }
  }

  /**
   * Build context string for LLM prompt
   * Costruisci stringa di contesto per prompt LLM
   */
  private buildContext(data: MarineDataPoint[], sources: DataSource[], query: string): string {
    let context = 'CONTESTO PROTEO - ASSISTENTE MARINO ITALIANO:\n\n'
    
    // Add personality and purpose
    context += 'Sei Proteo, un assistente virtuale esperto di ecosistemi marini italiani. '
    context += 'Il tuo compito è aiutare turisti e cittadini a scoprire le meraviglie del mare italiano '
    context += 'con informazioni scientifiche accurate ma accessibili, sempre in italiano.\n\n'
    
    if (data.length > 0) {
      context += 'DATI MARINI ATTUALI:\n'
      const groupedData = this.groupDataByParameter(data)
      
      Object.entries(groupedData).forEach(([parameter, points]) => {
        context += `${parameter.toUpperCase()}:\n`
        points.forEach(point => {
          context += `- ${point.location}: ${point.value} ${point.unit} (${point.timestamp})\n`
        })
        context += '\n'
      })
    }

    if (sources.length > 0) {
      context += 'FONTI DATI ISPRA:\n'
      sources.forEach(source => {
        context += `- ${source.name}: ${source.description}\n`
      })
      context += '\n'
    }

    // Add MER project context when relevant
    const queryLower = query.toLowerCase()
    if (queryLower.includes('mer') || queryLower.includes('ripristino') || 
        queryLower.includes('conservazione') || queryLower.includes('progetto')) {
      context += 'PROGETTO MER - MARINE ECOSYSTEM RESTORATION:\n'
      context += `Budget: ${MER_PROJECT.budget} (2022-2026)\n`
      context += 'Obiettivi: Ripristino praterie Posidonia, rimozione reti fantasma, mappatura habitat marini\n\n'
    }

    // Add species information when relevant
    if (queryLower.includes('specie') || queryLower.includes('posidonia') || 
        queryLower.includes('pinna') || queryLower.includes('biodiversità')) {
      context += 'SPECIE MARINE ITALIANE PRINCIPALI:\n'
      MER_PROJECT.species.slice(0, 2).forEach(species => {
        context += `- ${species.commonNameIt} (${species.scientificName}): ${species.description}\n`
      })
      context += '\n'
    }

    // Add marine quick facts for educational value
    context += 'QUICK MARINE FACTS (da includere quando appropriato):\n'
    MARINE_CURIOSITIES.slice(0, 2).forEach(curiosity => {
      context += `- ${curiosity.title}: ${curiosity.description}\n`
    })
    context += '\n'

    context += 'ISTRUZIONI:\n'
    context += '- Rispondi sempre in italiano con tono amichevole e divulgativo\n'
    context += '- Includi curiosità interessanti e dati scientifici quando pertinenti\n'
    context += '- Per turisti: focus su bellezza, conservazione, cosa possono vedere/fare\n'
    context += '- Per cittadini: focus su protezione ambientale, progetti locali, come contribuire\n'
    context += '- Usa emoji marine appropriati per rendere la risposta più accattivante\n'
    context += '- Cita sempre le fonti ISPRA quando usi dati ufficiali\n'
    
    return context
  }

  /**
   * Group data points by parameter
   * Raggruppa punti dati per parametro
   */
  private groupDataByParameter(data: MarineDataPoint[]): Record<string, MarineDataPoint[]> {
    return data.reduce((groups, point) => {
      const param = point.parameter
      if (!groups[param]) groups[param] = []
      groups[param].push(point)
      return groups
    }, {} as Record<string, MarineDataPoint[]>)
  }

  /**
   * Fetch real-time data from ISPRA APIs (stubbed for now)
   * Recupera dati real-time dalle API ISPRA (stub per ora)
   */
  async fetchRealTimeData(sourceId: string): Promise<MarineDataPoint[]> {
    // This would make actual API calls to ISPRA endpoints
    // Questo farebbe chiamate API reali agli endpoint ISPRA
    
    console.log(`Fetching real-time data from ${sourceId}...`)
    
    // Simulate API delay / Simula ritardo API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return sample data for now / Restituisci dati campione per ora
    return []
  }

  /**
   * Update marine data cache
   * Aggiorna cache dati marini
   */
  async updateDataCache(): Promise<void> {
    console.log('Updating marine data cache...')
    
    for (const source of MARINE_DATA_SOURCES) {
      if (source.apiEndpoint) {
        // In production, this would fetch from real APIs
        // In produzione, questo recupererebbe da API reali
        const data = await this.fetchRealTimeData(source.id)
        this.dataCache.set(source.id, data)
      }
    }
  }
}

export const ragService = new RAGService()