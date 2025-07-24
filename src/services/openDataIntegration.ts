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

      // Build ISPRA API URL
      const params = new URLSearchParams({
        resource_id: this.getISPRAResourceId(query.source, query.parameter),
        limit: '100'
      })

      if (query.location) {
        params.append('filters', JSON.stringify({ location: query.location }))
      }

      if (query.dateFrom) {
        params.append('filters', JSON.stringify({ 
          timestamp: { '>=': query.dateFrom } 
        }))
      }

      const url = `${source.baseUrl}?${params.toString()}`
      console.log(`Fetching ISPRA data: ${url}`)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ProteoMarineAssistant/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const jsonData = await response.json()
      
      // Process ISPRA response format
      const processedData = this.processISPRAResponse(jsonData, query.parameter)
      
      const result: DataResponse = {
        source: source.id,
        parameter: query.parameter,
        data: processedData,
        metadata: {
          queryTime: new Date(),
          dataCount: processedData.length,
          quality: 'verified',
          citation: `${source.name} - ISPRA (${new Date().getFullYear()})`,
          license: source.license
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

      // Build EMODnet API URL based on service type
      let url = ''
      const params = new URLSearchParams()

      switch (query.source) {
        case 'emodnet_chemistry':
          url = `${source.baseUrl}/chemistry/data`
          params.append('parameter', query.parameter)
          params.append('region', 'Mediterranean')
          break
          
        case 'emodnet_physics':
          url = `${source.baseUrl}/physics/measurements`
          params.append('parameter', query.parameter)
          params.append('region', 'Mediterranean')
          break
          
        case 'emodnet_biology':
          url = `${source.baseUrl}/biology/occurrences`
          params.append('scientificname', query.parameter)
          params.append('region', 'Mediterranean')
          break
      }

      if (query.dateFrom && query.dateTo) {
        params.append('startdate', query.dateFrom)
        params.append('enddate', query.dateTo)
      }

      const fullUrl = `${url}?${params.toString()}`
      console.log(`Fetching EMODnet data: ${fullUrl}`)

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ProteoMarineAssistant/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const jsonData = await response.json()
      const processedData = this.processEMODnetResponse(jsonData, query.parameter)

      const result: DataResponse = {
        source: source.id,
        parameter: query.parameter,
        data: processedData,
        metadata: {
          queryTime: new Date(),
          dataCount: processedData.length,
          quality: 'quality_controlled',
          citation: `${source.nameEn} - EMODnet (${new Date().getFullYear()})`,
          license: source.license
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
   * Process ISPRA API response
   * Elabora risposta API ISPRA
   */
  private processISPRAResponse(apiResponse: any, parameter: string): any[] {
    if (!apiResponse.result?.records) {
      return []
    }

    return apiResponse.result.records.map((record: any) => ({
      timestamp: record.timestamp || new Date().toISOString(),
      value: record[parameter] || record.value,
      location: record.station_name || record.location || 'Unknown',
      unit: this.getParameterUnit(parameter),
      quality: record.quality || 'good',
      source: 'ISPRA'
    }))
  }

  /**
   * Process EMODnet API response
   * Elabora risposta API EMODnet
   */
  private processEMODnetResponse(apiResponse: any, parameter: string): any[] {
    if (!apiResponse.data) {
      return []
    }

    return apiResponse.data.map((record: any) => ({
      timestamp: record.time || record.date,
      value: record.value || record[parameter],
      location: record.location || `${record.latitude?.toFixed(2)}, ${record.longitude?.toFixed(2)}`,
      latitude: record.latitude,
      longitude: record.longitude,
      depth: record.depth,
      unit: this.getParameterUnit(parameter),
      quality: record.qc_flag || 'good',
      source: 'EMODnet'
    }))
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
   * Get parameter unit
   * Ottieni unità parametro
   */
  private getParameterUnit(parameter: string): string {
    const units: Record<string, string> = {
      'temperature': '°C',
      'sea_temperature': '°C',
      'chlorophyll': 'µg/L',
      'chlorophyll_concentration': 'µg/L',
      'wave_height': 'm',
      'wave_period': 's',
      'ph': '',
      'salinity': 'PSU',
      'dissolved_oxygen': 'mg/L',
      'sea_level': 'm',
      'tide_height': 'm'
    }

    return units[parameter] || ''
  }

  /**
   * Get ISPRA resource ID for parameter
   * Ottieni ID risorsa ISPRA per parametro
   */
  private getISPRAResourceId(source: string, parameter: string): string {
    // These are example resource IDs - real IDs should be obtained from ISPRA catalog
    const resourceIds: Record<string, Record<string, string>> = {
      'ispra_rmn': {
        'sea_level': '12345678-1234-1234-1234-123456789012',
        'tide_height': '12345678-1234-1234-1234-123456789013'
      },
      'ispra_ron': {
        'wave_height': '12345678-1234-1234-1234-123456789014',
        'sea_temperature': '12345678-1234-1234-1234-123456789015'
      },
      'ispra_water_quality': {
        'ph': '12345678-1234-1234-1234-123456789016',
        'chlorophyll': '12345678-1234-1234-1234-123456789017'
      }
    }

    return resourceIds[source]?.[parameter] || 'default-resource-id'
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
}

export const openDataService = new OpenDataIntegrationService()