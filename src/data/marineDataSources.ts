/**
 * ISPRA Marine Data Sources Configuration
 * Configurazione fonti dati marine ISPRA
 */

export interface DataSource {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  apiEndpoint?: string
  downloadUrl?: string
  dataFormat: string[]
  updateFrequency: string
  parameters: string[]
  coverage: string
  license: string
}

export const MARINE_DATA_SOURCES: DataSource[] = [
  {
    id: 'rmn',
    name: 'Rete Mareografica Nazionale',
    nameEn: 'National Tide Gauge Network',
    description: 'Dati di livello del mare e maree dalle stazioni mareografiche italiane',
    descriptionEn: 'Sea level and tide data from Italian tide gauge stations',
    apiEndpoint: 'https://dati.isprambiente.it/api/rmn',
    downloadUrl: 'https://dati.isprambiente.it/dataset/rmn',
    dataFormat: ['JSON', 'CSV', 'XML'],
    updateFrequency: 'real-time',
    parameters: ['sea_level', 'tide_height', 'timestamp', 'station_id'],
    coverage: 'Italian coasts',
    license: 'CC BY 4.0'
  },
  {
    id: 'ron',
    name: 'Rete Ondametrica Nazionale',
    nameEn: 'National Wave Network',
    description: 'Dati di moto ondoso e parametri meteomarini',
    descriptionEn: 'Wave motion and meteomarine parameters data',
    apiEndpoint: 'https://dati.isprambiente.it/api/ron',
    downloadUrl: 'https://dati.isprambiente.it/dataset/ron',
    dataFormat: ['JSON', 'CSV', 'NetCDF'],
    updateFrequency: 'hourly',
    parameters: ['wave_height', 'wave_period', 'wave_direction', 'temperature'],
    coverage: 'Italian seas',
    license: 'CC BY 4.0'
  },
  {
    id: 'ostreopsis',
    name: 'Monitoraggio Ostreopsis ovata',
    nameEn: 'Ostreopsis ovata Monitoring',
    description: 'Monitoraggio della microalga marina Ostreopsis ovata',
    descriptionEn: 'Monitoring of marine microalgae Ostreopsis ovata',
    downloadUrl: 'https://dati.isprambiente.it/dataset/ostreopsis',
    dataFormat: ['CSV', 'Excel'],
    updateFrequency: 'seasonal',
    parameters: ['cell_concentration', 'sampling_date', 'location', 'depth'],
    coverage: 'Mediterranean Italian coasts',
    license: 'CC BY 4.0'
  },
  {
    id: 'bathw',
    name: 'Acque di Balneazione',
    nameEn: 'Bathing Waters',
    description: 'Qualità delle acque di balneazione costiere',
    descriptionEn: 'Coastal bathing water quality',
    downloadUrl: 'https://dati.isprambiente.it/dataset/bathw',
    dataFormat: ['CSV', 'JSON'],
    updateFrequency: 'seasonal',
    parameters: ['water_quality', 'bacteria_count', 'ph', 'temperature'],
    coverage: 'Italian bathing areas',
    license: 'CC BY 4.0'
  },
  {
    id: 'chlorophyll',
    name: 'Clorofilla Satellitare',
    nameEn: 'Satellite Chlorophyll',
    description: 'Concentrazione di clorofilla da dati satellitari',
    descriptionEn: 'Chlorophyll concentration from satellite data',
    apiEndpoint: 'https://marine.copernicus.eu/api/chlorophyll',
    dataFormat: ['NetCDF', 'JSON'],
    updateFrequency: 'daily',
    parameters: ['chlorophyll_concentration', 'lat', 'lon', 'date'],
    coverage: 'Mediterranean Sea',
    license: 'Copernicus'
  }
]

export const QUICK_QUESTIONS = [
  {
    id: 'temperature',
    question: 'Qual è la temperatura del mare oggi?',
    questionEn: 'What is today\'s sea temperature?',
    category: 'temperature',
    icon: '🌡️'
  },
  {
    id: 'chlorophyll',
    question: 'Livelli di clorofilla nel Mediterraneo',
    questionEn: 'Chlorophyll levels in Mediterranean',
    category: 'biology',
    icon: '🌱'
  },
  {
    id: 'waves',
    question: 'Condizioni del moto ondoso',
    questionEn: 'Wave conditions',
    category: 'waves',
    icon: '🌊'
  },
  {
    id: 'mer-project',
    question: 'Raccontami del progetto MER',
    questionEn: 'Tell me about the MER project',
    category: 'conservation',
    icon: '🏗️'
  },
  {
    id: 'posidonia',
    question: 'Curiosità sulla Posidonia oceanica',
    questionEn: 'Posidonia oceanica curiosities',
    category: 'species',
    icon: '🌿'
  },
  {
    id: 'pinna-nobilis',
    question: 'La storia della Pinna nobilis',
    questionEn: 'The story of Pinna nobilis',
    category: 'species',
    icon: '🐚'
  },
  {
    id: 'quality',
    question: 'Qualità delle acque costiere',
    questionEn: 'Coastal water quality',
    category: 'quality',
    icon: '💧'
  },
  {
    id: 'biodiversity',
    question: 'Stato della biodiversità marina',
    questionEn: 'Marine biodiversity status',
    category: 'biodiversity',
    icon: '🐟'
  },
  {
    id: 'ghost-nets',
    question: 'Cosa sono le reti fantasma?',
    questionEn: 'What are ghost nets?',
    category: 'conservation',
    icon: '🕸️'
  },
  {
    id: 'curiosities',
    question: 'Dimmi una curiosità marina',
    questionEn: 'Tell me a marine curiosity',
    category: 'education',
    icon: '💡'
  }
]

export const SAMPLE_MARINE_DATA = {
  temperature: {
    "2024-01-20": {
      "Adriatico_Nord": 12.4,
      "Adriatico_Sud": 14.2,
      "Tirreno": 15.8,
      "Ionio": 16.1,
      "Sicily_Channel": 17.3
    }
  },
  chlorophyll: {
    "2024-01-20": {
      "Adriatico_Nord": 1.8,
      "Adriatico_Sud": 1.2,
      "Tirreno": 0.9,
      "Ionio": 0.7,
      "Sicily_Channel": 0.8
    }
  },
  waves: {
    "2024-01-20": {
      "stations": [
        { name: "Venezia", height: 0.8, period: 4.2, direction: "NE" },
        { name: "Ancona", height: 1.2, period: 5.1, direction: "E" },
        { name: "Napoli", height: 0.6, period: 3.8, direction: "W" }
      ]
    }
  }
}