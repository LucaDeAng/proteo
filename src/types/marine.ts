/**
 * TypeScript type definitions for marine data
 * Definizioni tipi TypeScript per dati marini
 */

export interface MarineStation {
  id: string
  name: string
  nameEn: string
  latitude: number
  longitude: number
  depth?: number
  region: 'Adriatico_Nord' | 'Adriatico_Sud' | 'Tirreno' | 'Ionio' | 'Sicily_Channel'
  status: 'active' | 'maintenance' | 'offline'
}

export interface MarineParameter {
  id: string
  name: string
  nameEn: string
  unit: string
  description: string
  range: {
    min: number
    max: number
    optimal?: {
      min: number
      max: number
    }
  }
}

export interface MarineReading {
  stationId: string
  parameterId: string
  value: number
  quality: 'good' | 'uncertain' | 'bad' | 'missing'
  timestamp: Date
  source: string
  processingLevel: 'raw' | 'quality_controlled' | 'processed'
}

export interface WaterQualityIndex {
  overall: number // 0-100 scale
  parameters: {
    temperature: number
    ph: number
    dissolvedOxygen: number
    turbidity: number
    chlorophyll: number
    bacteria: number
  }
  classification: 'excellent' | 'good' | 'moderate' | 'poor' | 'bad'
  timestamp: Date
  location: string
}

export interface WaveData {
  stationId: string
  significantHeight: number // meters
  maxHeight: number // meters
  period: number // seconds
  direction: number // degrees from North
  timestamp: Date
  quality: 'good' | 'uncertain' | 'bad'
}

export interface TideData {
  stationId: string
  level: number // meters above reference
  prediction: number // predicted level
  residual: number // observed - predicted
  timestamp: Date
  quality: 'good' | 'uncertain' | 'bad'
}

export interface ChlorophyllData {
  latitude: number
  longitude: number
  concentration: number // mg/m³
  satellite: string
  processingDate: Date
  cloudCover: number // percentage
  quality: 'high' | 'medium' | 'low'
}

export interface MarineAlert {
  id: string
  type: 'high_temperature' | 'algae_bloom' | 'pollution' | 'storm' | 'low_oxygen'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
  description: string
  descriptionEn: string
  startTime: Date
  endTime?: Date
  isActive: boolean
  source: string
}

export interface APIResponse<T> {
  success: boolean
  data: T
  metadata: {
    timestamp: Date
    source: string
    version: string
    recordCount?: number
  }
  errors?: string[]
}