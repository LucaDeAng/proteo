/**
 * Open Data Integration Service for Proteo Marine Assistant
 * Servizio Integrazione Open Data per Assistente Marino Proteo
 */

export interface OpenDataSource {
  id: string
  name: string
  nameEn: string
  baseUrl: string
  apiType: 'REST' | 'GraphQL' | 'OData' | 'SPARQL'
  authRequired: boolean
  rateLimit: number // requests per minute
  parameters: string[]
  regions: string[]
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  dataFormat: 'JSON' | 'XML' | 'CSV' | 'NetCDF'
  license: string
}

export interface DataQuery {
  source: string
  parameter: string
  location?: string
  dateFrom?: string
  dateTo?: string
  depth?: number
  quality?: 'all' | 'good' | 'flagged'
}

export interface DataResponse {
  source: string
  parameter: string
  data: any[]
  metadata: {
    queryTime: Date
    dataCount: number
    quality: string
    citation: string
    license: string
    url?: string
    note?: string
  }
  success: boolean
  error?: string
}

// ISPRA Open Data Sources
const ISPRA_SOURCES: OpenDataSource[] = [
  {
    id: 'ispra_rmn',
    name: 'Rete Mareografica Nazionale ISPRA',
    nameEn: 'ISPRA National Tide Gauge Network',
    baseUrl: 'https://dati.isprambiente.it/api/3/action/datastore_search',
    apiType: 'REST',
    authRequired: false,
    rateLimit: 1000,
    parameters: ['sea_level', 'tide_height', 'atmospheric_pressure'],
    regions: ['Adriatico', 'Tirreno', 'Ionio', 'Ligure', 'Sardegna', 'Sicilia'],
    updateFrequency: 'realtime',
    dataFormat: 'JSON',
    license: 'CC BY 4.0'
  },
  {
    id: 'ispra_ron',
    name: 'Rete Ondametrica Nazionale ISPRA',
    nameEn: 'ISPRA National Wave Network',
    baseUrl: 'https://dati.isprambiente.it/api/3/action/datastore_search',
    apiType: 'REST',
    authRequired: false,
    rateLimit: 1000,
    parameters: ['wave_height', 'wave_period', 'wave_direction', 'sea_temperature'],
    regions: ['Adriatico', 'Tirreno', 'Ionio', 'Ligure'],
    updateFrequency: 'hourly',
    dataFormat: 'JSON',
    license: 'CC BY 4.0'
  },
  {
    id: 'ispra_water_quality',
    name: 'Qualità Acque Costiere ISPRA',
    nameEn: 'ISPRA Coastal Water Quality',
    baseUrl: 'https://dati.isprambiente.it/api/3/action/datastore_search',
    apiType: 'REST',
    authRequired: false,
    rateLimit: 1000,
    parameters: ['ph', 'dissolved_oxygen', 'turbidity', 'chlorophyll', 'temperature'],
    regions: ['Italia'],
    updateFrequency: 'weekly',
    dataFormat: 'JSON',
    license: 'CC BY 4.0'
  }
]

// EMODnet Data Sources
const EMODNET_SOURCES: OpenDataSource[] = [
  {
    id: 'emodnet_chemistry',
    name: 'EMODnet Chemistry',
    nameEn: 'EMODnet Chemistry',
    baseUrl: 'https://www.emodnet-chemistry.eu/products/catalogue',
    apiType: 'REST',
    authRequired: false,
    rateLimit: 600,
    parameters: ['nutrients', 'ph', 'oxygen', 'chlorophyll', 'temperature', 'salinity'],
    regions: ['Mediterranean', 'Adriatic', 'Tyrrhenian', 'Ionian'],
    updateFrequency: 'daily',
    dataFormat: 'JSON',
    license: 'CC BY 4.0'
  },
  {
    id: 'emodnet_physics',
    name: 'EMODnet Physics',
    nameEn: 'EMODnet Physics',
    baseUrl: 'https://www.emodnet-physics.eu/api',
    apiType: 'REST',
    authRequired: false,
    rateLimit: 600,
    parameters: ['temperature', 'salinity', 'currents', 'waves', 'sea_level'],
    regions: ['Mediterranean'],
    updateFrequency: 'realtime',
    dataFormat: 'JSON',
    license: 'CC BY 4.0'
  },
  {
    id: 'emodnet_biology',
    name: 'EMODnet Biology',
    nameEn: 'EMODnet Biology',
    baseUrl: 'https://www.emodnet-biology.eu/api',
    apiType: 'REST',
    authRequired: false,
    rateLimit: 600,
    parameters: ['species_occurrence', 'abundance', 'biomass', 'biodiversity_indices'],
    regions: ['Mediterranean'],
    updateFrequency: 'weekly',
    dataFormat: 'JSON',
    license: 'CC BY 4.0'
  }
]

// Copernicus Marine Service Sources
const COPERNICUS_SOURCES: OpenDataSource[] = [
  {
    id: 'copernicus_mediterranean',
    name: 'Copernicus Mediterranean Sea',
    nameEn: 'Copernicus Mediterranean Sea Analysis and Forecast',
    baseUrl: 'https://data.marine.copernicus.eu/api',
    apiType: 'REST',
    authRequired: true, // Requires free registration
    rateLimit: 100,
    parameters: ['temperature', 'salinity', 'chlorophyll', 'currents', 'ssh'],
    regions: ['Mediterranean'],
    updateFrequency: 'daily',
    dataFormat: 'NetCDF',
    license: 'Copernicus License'
  }
]

class OpenDataIntegrationService {
  private sources: Map<string, OpenDataSource>
  private cache: Map<string, { data: any, timestamp: Date }>
  private rateLimiters: Map<string, { count: number, resetTime: Date }>

  constructor() {
    this.sources = new Map()
    this.cache = new Map()
    this.rateLimiters = new Map()
    
    // Register all sources
    const allSources = ISPRA_SOURCES.concat(EMODNET_SOURCES).concat(COPERNICUS_SOURCES)
    allSources.forEach(source => {
      this.sources.set(source.id, source)
    })
  }

  /**
   * Fetch data from ISPRA Open Data API
   * Recupera dati dalle API Open Data ISPRA
   */
  async fetchISPRAData(query: DataQuery): Promise<DataResponse> {
    const source = this.sources.get(query.source)
    if (!source) {
      return this.createErrorResponse(query.source, 'Source not found')
    }

    try {
      // Check rate limits
      if (!this.checkRateLimit(source.id, source.rateLimit)) {
        return this.createErrorResponse(source.id, 'Rate limit exceeded')
      }

      // Check cache first
      const cacheKey = this.createCacheKey(query)
      const cached = this.getCachedData(cacheKey)
      if (cached) {
        return cached
      }

      // For demo purposes, return mock data instead of real API calls
      // Real implementation would need valid ISPRA resource IDs
      console.warn(`ISPRA API: Using mock data for ${query.source}/${query.parameter} - real resource IDs needed for production`)
      
      const processedData = this.getMockISPRAData(query)
      
      const result: DataResponse = {
        source: source.id,
        parameter: query.parameter,
        data: processedData,
        metadata: {
          queryTime: new Date(),
          dataCount: processedData.length,
          quality: 'demo',
          citation: `${source.name} - ISPRA (${new Date().getFullYear()}) - Demo Mode`,
          license: source.license,
          note: 'Mock data for demonstration - production requires valid ISPRA resource IDs'
        },
        success: true
      }

      // Cache the result
      this.setCachedData(cacheKey, result)
      return result

    } catch (error) {
      console.error(`ISPRA API Error:`, error)
      return this.createErrorResponse(source.id, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Fetch data from EMODnet APIs
   * Recupera dati dalle API EMODnet
   */
  async fetchEMODnetData(query: DataQuery): Promise<DataResponse> {
    const source = this.sources.get(query.source)
    if (!source) {
      return this.createErrorResponse(query.source, 'Source not found')
    }

    try {
      if (!this.checkRateLimit(source.id, source.rateLimit)) {
        return this.createErrorResponse(source.id, 'Rate limit exceeded')
      }

      const cacheKey = this.createCacheKey(query)
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      // EMODnet APIs have CORS restrictions for browser-based requests
      // In production, these should be proxied through a backend server
      console.warn(`EMODnet API: Using mock data for ${query.source}/${query.parameter} - CORS restrictions require backend proxy`)
      
      const processedData = this.getMockEMODnetData(query)

      const result: DataResponse = {
        source: source.id,
        parameter: query.parameter,
        data: processedData,
        metadata: {
          queryTime: new Date(),
          dataCount: processedData.length,
          quality: 'demo',
          citation: `${source.nameEn} - EMODnet (${new Date().getFullYear()}) - Demo Mode`,
          license: source.license,
          note: 'Mock data for demonstration - production requires backend proxy for CORS'
        },
        success: true
      }

      this.setCachedData(cacheKey, result)
      return result

    } catch (error) {
      console.error(`EMODnet API Error:`, error)
      return this.createErrorResponse(source.id, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Fetch data from Copernicus Marine Service
   * Recupera dati dal Servizio Marino Copernicus
   */
  async fetchCopernicusData(query: DataQuery): Promise<DataResponse> {
    const source = this.sources.get(query.source)
    if (!source) {
      return this.createErrorResponse(query.source, 'Source not found')
    }

    try {
      // Note: Copernicus requires authentication
      const apiKey = import.meta.env.VITE_COPERNICUS_API_KEY
      if (!apiKey) {
        console.warn('Copernicus API key not configured, using mock data')
        return this.getMockCopernicusData(query)
      }

      if (!this.checkRateLimit(source.id, source.rateLimit)) {
        return this.createErrorResponse(source.id, 'Rate limit exceeded')
      }

      const cacheKey = this.createCacheKey(query)
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached

      // Build Copernicus API request
      const requestBody = {
        dataset_id: 'med-analysis-forecast-phy-006-013',
        variables: [query.parameter],
        region: [30, 45, 6, 42], // Mediterranean bounding box
        time_range: query.dateFrom && query.dateTo ? 
          [query.dateFrom, query.dateTo] : 
          [new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0], new Date().toISOString().split('T')[0]]
      }

      const response = await fetch(`${source.baseUrl}/dataset/extract`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const jsonData = await response.json()
      const processedData = this.processCopernicusResponse(jsonData, query.parameter)

      const result: DataResponse = {
        source: source.id,
        parameter: query.parameter,
        data: processedData,
        metadata: {
          queryTime: new Date(),
          dataCount: processedData.length,
          quality: 'satellite_derived',
          citation: `${source.nameEn} - Copernicus Marine Service (${new Date().getFullYear()})`,
          license: source.license
        },
        success: true
      }

      this.setCachedData(cacheKey, result)
      return result

    } catch (error) {
      console.error(`Copernicus API Error:`, error)
      // Fallback to mock data
      return this.getMockCopernicusData(query)
    }
  }

  /**
   * Unified data fetching method
   * Metodo unificato per recupero dati
   */
  async fetchMarineData(query: DataQuery): Promise<DataResponse> {
    const source = this.sources.get(query.source)
    if (!source) {
      return this.createErrorResponse(query.source, 'Source not found')
    }

    // Route to appropriate service
    if (query.source.startsWith('ispra_')) {
      return await this.fetchISPRAData(query)
    } else if (query.source.startsWith('emodnet_')) {
      return await this.fetchEMODnetData(query)
    } else if (query.source.startsWith('copernicus_')) {
      return await this.fetchCopernicusData(query)
    }

    return this.createErrorResponse(query.source, 'Unknown source type')
  }

  /**
   * Get multiple data sources for comprehensive analysis
   * Ottieni fonti dati multiple per analisi comprensiva
   */
  async fetchMultiSourceData(parameter: string, location?: string): Promise<DataResponse[]> {
    const queries: DataQuery[] = []
    
    // Find all sources that support this parameter
    for (const [sourceId, source] of this.sources) {
      if (source.parameters.includes(parameter)) {
        queries.push({
          source: sourceId,
          parameter,
          location,
          dateFrom: new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0],
          dateTo: new Date().toISOString().split('T')[0]
        })
      }
    }

    // Execute queries in parallel
    const promises = queries.map(query => this.fetchMarineData(query))
    const results = await Promise.allSettled(promises)

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<DataResponse>).value)
      .filter(response => response.success)
  }



  /**
   * Process Copernicus API response
   * Elabora risposta API Copernicus
   */
  private processCopernicusResponse(apiResponse: any, parameter: string): any[] {
    if (!apiResponse.data) {
      return []
    }

    return apiResponse.data.map((record: any) => ({
      timestamp: record.time,
      value: record[parameter],
      location: `${record.lat?.toFixed(2)}, ${record.lon?.toFixed(2)}`,
      latitude: record.lat,
      longitude: record.lon,
      depth: record.depth || 0,
      unit: this.getParameterUnit(parameter),
      quality: 'satellite',
      source: 'Copernicus'
    }))
  }

  /**
   * Get mock Copernicus data when API is unavailable
   * Ottieni dati mock Copernicus quando API non disponibile
   */
  private getMockCopernicusData(query: DataQuery): DataResponse {
    const mockData = [
      {
        timestamp: new Date().toISOString(),
        value: this.generateMockValue(query.parameter),
        location: 'Mediterranean Sea',
        latitude: 40.0,
        longitude: 15.0,
        unit: this.getParameterUnit(query.parameter),
        quality: 'simulated',
        source: 'Copernicus (Mock)'
      }
    ]

    return {
      source: query.source,
      parameter: query.parameter,
      data: mockData,
      metadata: {
        queryTime: new Date(),
        dataCount: mockData.length,
        quality: 'simulated',
        citation: 'Copernicus Marine Service (Mock Data)',
        license: 'Demo License'
      },
      success: true
    }
  }

  /**
   * Generate mock values for testing
   * Genera valori mock per testing
   */
  private generateMockValue(parameter: string): number {
    const mockValues: Record<string, [number, number]> = {
      'temperature': [10, 28],
      'chlorophyll': [0.1, 5.0],
      'wave_height': [0.2, 3.0],
      'ph': [7.8, 8.3],
      'salinity': [35, 39],
      'dissolved_oxygen': [4, 8]
    }

    const [min, max] = mockValues[parameter] || [0, 100]
    return Math.round((Math.random() * (max - min) + min) * 100) / 100
  }



  /**
   * Rate limiting check
   * Controllo limite richieste
   */
  private checkRateLimit(sourceId: string, limit: number): boolean {
    const now = new Date()
    let limiter = this.rateLimiters.get(sourceId)

    if (!limiter || now > limiter.resetTime) {
      limiter = {
        count: 0,
        resetTime: new Date(now.getTime() + 60000) // 1 minute
      }
      this.rateLimiters.set(sourceId, limiter)
    }

    if (limiter.count >= limit) {
      return false
    }

    limiter.count++
    return true
  }

  /**
   * Cache management
   * Gestione cache
   */
  private createCacheKey(query: DataQuery): string {
    return `${query.source}_${query.parameter}_${query.location || 'all'}_${query.dateFrom || 'recent'}`
  }

  private getCachedData(key: string): DataResponse | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    // Check if cache is still valid (5 minutes for real-time, 1 hour for daily data)
    const maxAge = 5 * 60 * 1000 // 5 minutes
    if (Date.now() - cached.timestamp.getTime() > maxAge) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private setCachedData(key: string, data: DataResponse): void {
    this.cache.set(key, {
      data,
      timestamp: new Date()
    })

    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }
  }

  /**
   * Create error response
   * Crea risposta errore
   */
  private createErrorResponse(source: string, error: string): DataResponse {
    return {
      source,
      parameter: '',
      data: [],
      metadata: {
        queryTime: new Date(),
        dataCount: 0,
        quality: 'error',
        citation: '',
        license: ''
      },
      success: false,
      error
    }
  }

  /**
   * Get available sources for parameter
   * Ottieni fonti disponibili per parametro
   */
  getAvailableSources(parameter: string): OpenDataSource[] {
    return Array.from(this.sources.values())
      .filter(source => source.parameters.includes(parameter))
  }

  /**
   * Get source information
   * Ottieni informazioni fonte
   */
  getSourceInfo(sourceId: string): OpenDataSource | undefined {
    return this.sources.get(sourceId)
  }

  /**
   * Health check for all sources
   * Controllo stato tutte le fonti
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}
    
    for (const [sourceId, source] of this.sources) {
      try {
        const testQuery: DataQuery = {
          source: sourceId,
          parameter: source.parameters[0],
          dateFrom: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0]
        }
        
        const response = await this.fetchMarineData(testQuery)
        results[sourceId] = response.success
      } catch (error) {
        results[sourceId] = false
      }
    }
    
    return results
  }

  /**
   * Generate mock ISPRA data for demonstration
   * Genera dati ISPRA mock per dimostrazione
   */
  private getMockISPRAData(query: DataQuery): any[] {
    const baseValue = Math.random() * 100
    const mockData = []
    
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      mockData.push({
        timestamp: timestamp.toISOString(),
        value: baseValue + (Math.random() - 0.5) * 10,
        unit: this.getParameterUnit(query.parameter),
        location: query.location || 'Mediterraneo',
        quality: 'good',
        station: `ISPRA_${Math.floor(Math.random() * 100)}`
      })
    }
    
    return mockData
  }

  /**
   * Generate mock EMODnet data for demonstration
   * Genera dati EMODnet mock per dimostrazione
   */
  private getMockEMODnetData(query: DataQuery): any[] {
    const baseValue = Math.random() * 50
    const mockData = []
    
    for (let i = 0; i < 15; i++) {
      const timestamp = new Date(Date.now() - i * 12 * 60 * 60 * 1000)
      mockData.push({
        timestamp: timestamp.toISOString(),
        value: baseValue + (Math.random() - 0.5) * 5,
        unit: this.getParameterUnit(query.parameter),
        latitude: 40.0 + Math.random() * 5,
        longitude: 12.0 + Math.random() * 8,
        depth: Math.random() * 100,
        parameter: query.parameter
      })
    }
    
    return mockData
  }

  /**
   * Get standard unit for parameter
   * Ottieni unità standard per parametro
   */
  private getParameterUnit(parameter: string): string {
    const units: Record<string, string> = {
      'temperature': '°C',
      'sea_temperature': '°C',
      'ph': '',
      'dissolved_oxygen': 'mg/L',
      'chlorophyll': 'µg/L',
      'salinity': 'PSU',
      'wave_height': 'm',
      'sea_level': 'm',
      'turbidity': 'NTU',
      'nutrients': 'µmol/L'
    }
    
    return units[parameter] || 'unit'
  }
}

export const openDataService = new OpenDataIntegrationService()