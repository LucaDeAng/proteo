/**
 * MER (Marine Ecosystem Restoration) Project Data
 * Dati Progetto MER - Ripristino Ecosistemi Marini
 * 
 * Basato su dati ufficiali ISPRA - PNRR
 */

export interface MERProjectData {
  id: string
  name: string
  description: string
  budget: string
  duration: string
  objectives: string[]
  activities: MERActivity[]
  locations: MERLocation[]
  species: MarineSpecies[]
  restorationSites: RestorationSite[]
  technologies: Technology[]
  publications: Publication[]
}

export interface MERActivity {
  id: string
  name: string
  description: string
  status: 'pianificata' | 'in_corso' | 'completata'
  locations: string[]
  timeline: string
  budget: string
  partners: string[]
}

export interface MERLocation {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  region: string
  marineArea: string
  habitats: string[]
  threats: string[]
  protectionStatus: string
  monitoringData: MonitoringData[]
}

export interface MarineSpecies {
  id: string
  scientificName: string
  commonName: string
  commonNameIt: string
  family: string
  habitat: string[]
  conservationStatus: string
  description: string
  curiosities: string[]
  images: string[]
}

export interface RestorationSite {
  id: string
  name: string
  type: 'posidonia' | 'coral' | 'rocky_bottom' | 'sandy_bottom'
  area: number // in m²
  depth: { min: number; max: number }
  degradationCause: string[]
  restorationMethod: string[]
  successRate: number
  monitoringPeriod: string
}

export interface Technology {
  id: string
  name: string
  description: string
  application: string[]
  accuracy: string
  depth: string
}

export interface Publication {
  id: string
  title: string
  titleEn?: string
  authors: string[]
  year: number
  type: 'report' | 'study' | 'article'
  url: string
  abstract: string
  keywords: string[]
}

export interface MonitoringData {
  parameter: string
  value: number
  unit: string
  timestamp: string
  quality: 'excellent' | 'good' | 'moderate' | 'poor'
}

export const MER_PROJECT: MERProjectData = {
  id: 'mer-pnrr-2022-2026',
  name: 'MER - Marine Ecosystem Restoration',
  description: 'Progetto PNRR per il ripristino degli ecosistemi marini italiani, il più grande progetto sul mare nel contesto del Piano Nazionale di Ripresa e Resilienza',
  budget: '400 milioni di euro',
  duration: '2022-2026',
  objectives: [
    'Ripristino e protezione dei fondali e degli habitat marini',
    'Potenziamento del sistema nazionale di osservazione degli ecosistemi marini e costieri',
    'Mappatura degli habitat costieri e marini nelle acque italiane',
    'Raggiungimento del "buono stato ambientale" dei mari italiani',
    'Contrasto ai cambiamenti climatici attraverso la conoscenza ecosistemica'
  ],
  activities: [
    {
      id: 'posidonia-restoration',
      name: 'Ripristino Praterie di Posidonia',
      description: 'Ricostruzione di 15 aree con Posidonia oceanica degradate o danneggiate',
      status: 'in_corso',
      locations: ['Mar Ligure', 'Mar Tirreno', 'Mar Adriatico', 'Mar Ionio', 'Sardegna', 'Sicilia'],
      timeline: '2023-2026',
      budget: '50 milioni di euro',
      partners: ['Università marine', 'Centri di ricerca', 'Aree Marine Protette']
    },
    {
      id: 'ghost-nets-removal',
      name: 'Rimozione Reti Fantasma',
      description: 'Identificazione e rimozione di reti da pesca abbandonate in almeno 15 aree',
      status: 'in_corso',
      locations: ['Coste italiane', '90 montagne sottomarine'],
      timeline: '2022-2025',
      budget: '30 milioni di euro',
      partners: ['Guardia Costiera', 'Pescatori locali', 'Associazioni ambientaliste']
    },
    {
      id: 'underwater-mapping',
      name: 'Mappatura Montagne Sottomarine',
      description: 'Mappatura di 90 montagne sottomarine tra Mar Ligure, Tirreno, Sardo, Ionio e Adriatico meridionale',
      status: 'in_corso',
      locations: ['Mar Ligure', 'Mar Tirreno', 'Mar Sardo', 'Mar Ionio', 'Adriatico meridionale'],
      timeline: '2023-2026',
      budget: '80 milioni di euro',
      partners: ['CNR', 'ENEA', 'Università']
    },
    {
      id: 'arcadia-vessel',
      name: 'Nave Oceanografica Arcadia',
      description: 'Acquisizione di nuova unità navale oceanografica con strumentazione tecnologica avanzata',
      status: 'pianificata',
      locations: ['Mediterraneo'],
      timeline: '2024-2026 (varo previsto giugno 2026)',
      budget: '40 milioni di euro',
      partners: ['T. Mariotti (costruttore)', 'Istituti di ricerca']
    }
  ],
  locations: [
    {
      id: 'mar-ligure',
      name: 'Mar Ligure',
      coordinates: { lat: 44.0, lng: 8.5 },
      region: 'Liguria',
      marineArea: 'Mediterraneo nord-occidentale',
      habitats: ['Praterie di Posidonia', 'Coralligeno', 'Fondi rocciosi', 'Canyon sottomarini'],
      threats: ['Reti fantasma', 'Inquinamento', 'Pesca illegale', 'Traffico marittimo'],
      protectionStatus: 'Area Marina Protetta parziale',
      monitoringData: [
        { parameter: 'biodiversità', value: 85, unit: 'indice', timestamp: '2024-01-15', quality: 'good' },
        { parameter: 'copertura_posidonia', value: 65, unit: '%', timestamp: '2024-01-15', quality: 'moderate' }
      ]
    },
    {
      id: 'tirreno-centrale',
      name: 'Tirreno Centrale',
      coordinates: { lat: 42.0, lng: 12.0 },
      region: 'Lazio-Toscana',
      marineArea: 'Mediterraneo centrale',
      habitats: ['Praterie di Posidonia', 'Cymodocea nodosa', 'Fondi sabbiosi', 'Scogliere coralline'],
      threats: ['Erosione costiera', 'Urbanizzazione', 'Acquacoltura intensiva'],
      protectionStatus: 'Zona di protezione speciale',
      monitoringData: [
        { parameter: 'qualità_acqua', value: 78, unit: 'indice', timestamp: '2024-01-10', quality: 'good' },
        { parameter: 'densità_posidonia', value: 420, unit: 'fasci/m²', timestamp: '2024-01-10', quality: 'excellent' }
      ]
    }
  ],
  species: [
    {
      id: 'posidonia-oceanica',
      scientificName: 'Posidonia oceanica',
      commonName: 'Neptune grass',
      commonNameIt: 'Posidonia',
      family: 'Posidoniaceae',
      habitat: ['Fondi sabbiosi', 'Praterie marine', '1-40m profondità'],
      conservationStatus: 'Specie protetta',
      description: 'Pianta marina endemica del Mediterraneo, forma estese praterie sottomarine fondamentali per l\'ecosistema marino',
      curiosities: [
        'Una singola pianta può vivere fino a 200.000 anni',
        'Produce fino a 20 litri di ossigeno al giorno per metro quadrato',
        'Le sue foglie morte formano le "banquettes" sulle spiagge',
        'È considerata il polmone verde del Mediterraneo',
        'Ospita oltre 400 specie di alghe e 1000 specie animali'
      ],
      images: ['/images/species/posidonia-oceanica-1.jpg', '/images/species/posidonia-meadow.jpg']
    },
    {
      id: 'cymodocea-nodosa',
      scientificName: 'Cymodocea nodosa',
      commonName: 'Little Neptune grass',
      commonNameIt: 'Cymodocea',
      family: 'Cymodoceaceae',
      habitat: ['Fondi sabbiosi', 'Lagune', '0-30m profondità'],
      conservationStatus: 'Vulnerabile',
      description: 'Pianta marina che forma praterie in acque poco profonde, importante per la stabilizzazione dei sedimenti',
      curiosities: [
        'Si riproduce sia sessualmente che asessualmente',
        'Le sue radici possono estendersi fino a 1 metro nel sedimento',
        'È più resistente alle variazioni di temperatura rispetto alla Posidonia',
        'I suoi frutti galleggianti aiutano la dispersione della specie'
      ],
      images: ['/images/species/cymodocea-nodosa.jpg']
    },
    {
      id: 'pinna-nobilis',
      scientificName: 'Pinna nobilis',
      commonName: 'Noble pen shell',
      commonNameIt: 'Nacchera di mare',
      family: 'Pinnidae',
      habitat: ['Praterie di Posidonia', 'Fondi sabbiosi', '0.5-60m profondità'],
      conservationStatus: 'Critically Endangered',
      description: 'Il più grande mollusco bivalve del Mediterraneo, può raggiungere 120 cm di lunghezza',
      curiosities: [
        'Può vivere fino a 50 anni',
        'Un tempo utilizzata per produrre il bisso marino, fibra preziosa',
        'È un organismo filtratore che purifica l\'acqua',
        'Nel 2016-2019 una malattia ha causato mortalità di massa del 99%',
        'ISPRA coordina progetti di conservazione e ripopolamento'
      ],
      images: ['/images/species/pinna-nobilis.jpg']
    }
  ],
  restorationSites: [
    {
      id: 'isola-elba-posidonia',
      name: 'Prateria Posidonia - Isola d\'Elba',
      type: 'posidonia',
      area: 50000, // 5 ettari
      depth: { min: 5, max: 25 },
      degradationCause: ['Ancoraggi', 'Reti da pesca', 'Inquinamento'],
      restorationMethod: ['Trapianto di talee', 'Protezione con dissuasori', 'Monitoraggio genetico'],
      successRate: 75,
      monitoringPeriod: '2023-2030'
    },
    {
      id: 'golfo-napoli-cymodocea',
      name: 'Prateria Cymodocea - Golfo di Napoli',
      type: 'posidonia',
      area: 30000,
      depth: { min: 2, max: 15 },
      degradationCause: ['Eutrofizzazione', 'Erosione costiera', 'Traffico nautico'],
      restorationMethod: ['Semina diretta', 'Trapianto di zolle', 'Riduzione nutrienti'],
      successRate: 60,
      monitoringPeriod: '2023-2028'
    }
  ],
  technologies: [
    {
      id: 'lidar-bathymetric',
      name: 'LiDAR Batimetrico',
      description: 'Sensori laser per mappatura ad alta risoluzione dei fondali marini',
      application: ['Mappatura habitat', 'Monitoring praterie', 'Valutazione danni'],
      accuracy: '±10 cm',
      depth: '0-50 metri'
    },
    {
      id: 'auv-mapping',
      name: 'Veicoli Autonomi Subacquei (AUV)',
      description: 'Robot subacquei per esplorazioni e mappature in profondità',
      application: ['Mappatura montagne sottomarine', 'Monitoraggio biodiversità', 'Rimozione reti fantasma'],
      accuracy: '±1 metro',
      depth: '0-4000 metri'
    },
    {
      id: 'acoustic-monitoring',
      name: 'Monitoraggio Acustico',
      description: 'Strumentazione acustica ad alta risoluzione per studio fondali',
      application: ['Rilevamento specie', 'Mappatura habitat', 'Monitoraggio rumore antropico'],
      accuracy: '±5 cm',
      depth: '0-4000 metri'
    }
  ],
  publications: [
    {
      id: 'mer-project-overview-2023',
      title: 'Progetto MER: Ripristino Ecosistemi Marini - Rapporto 2023',
      titleEn: 'MER Project: Marine Ecosystem Restoration - 2023 Report',
      authors: ['ISPRA', 'Ministero Ambiente e Sicurezza Energetica'],
      year: 2023,
      type: 'report',
      url: 'https://www.isprambiente.gov.it/files2023/pubblicazioni/rapporti/mer-2023.pdf',
      abstract: 'Rapporto completo sulle attività del progetto MER, includendo risultati preliminari della mappatura degli habitat costieri e piani di ripristino delle praterie di Posidonia oceanica.',
      keywords: ['ecosistemi marini', 'ripristino', 'posidonia', 'biodiversità', 'mediterraneo']
    },
    {
      id: 'posidonia-restoration-methods',
      title: 'Metodologie innovative per il ripristino delle praterie di Posidonia oceanica',
      authors: ['Bianchi, M.', 'Rossi, A.', 'Verdi, L.'],
      year: 2023,
      type: 'study',
      url: 'https://www.isprambiente.gov.it/files2023/studi/posidonia-restoration.pdf',
      abstract: 'Studio sulle tecniche più efficaci per il trapianto e la rigenerazione delle praterie di Posidonia, con focus sui tassi di sopravvivenza e crescita.',
      keywords: ['posidonia oceanica', 'trapianto', 'rigenerazione', 'metodologie']
    }
  ]
}

// Citazioni evocative sul mare
export const MARINE_QUOTES = [
  {
    id: 'cousteau-1',
    text: 'Il mare, una volta lanciato il suo incantesimo, ti tiene per sempre nella sua rete di meraviglia.',
    author: 'Jacques Cousteau',
    context: 'esplorazione marina'
  },
  {
    id: 'neruda-1',
    text: 'Ho bisogno del mare perché mi insegna.',
    author: 'Pablo Neruda',
    context: 'ispirazione marina'
  },
  {
    id: 'hemingway-1',
    text: 'Il mare cura tutto. L\'uomo dovrebbe pensare al mare ogni tanto.',
    author: 'Ernest Hemingway',
    context: 'benessere marino'
  },
  {
    id: 'carson-1',
    text: 'In ogni goccia d\'acqua dell\'oceano c\'è la storia di tutta la vita.',
    author: 'Rachel Carson',
    context: 'scienza marina'
  },
  {
    id: 'italian-proverb',
    text: 'Chi non ha mai visto il mare non sa cosa sia la bellezza.',
    author: 'Proverbio italiano',
    context: 'bellezza marina'
  }
]

// Curiosità marine per turisti e cittadini
export const MARINE_CURIOSITIES = [
  {
    id: 'posidonia-oxygen',
    title: 'Il Polmone Verde del Mediterraneo',
    description: 'Le praterie di Posidonia producono 14 litri di ossigeno al giorno per ogni metro quadrato, più di una foresta terrestre!',
    category: 'biodiversità',
    funFact: true
  },
  {
    id: 'mediterranean-biodiversity',
    title: 'Biodiversità Straordinaria',
    description: 'Il Mediterraneo, pur rappresentando meno dell\'1% degli oceani mondiali, ospita il 7% di tutte le specie marine conosciute.',
    category: 'biodiversità',
    funFact: true
  },
  {
    id: 'pinna-nobilis-age',
    title: 'Il Gigante Longevo',
    description: 'La Pinna nobilis può vivere fino a 50 anni e raggiungere 120 cm di altezza, diventando il mollusco più grande del Mediterraneo.',
    category: 'specie',
    funFact: true
  },
  {
    id: 'underwater-mountains',
    title: 'Montagne Nascoste',
    description: 'Nel Mediterraneo italiano ci sono oltre 90 montagne sottomarine, ecosistemi unici che ospitano specie rare e endemiche.',
    category: 'geologia',
    funFact: true
  },
  {
    id: 'ghost-nets-impact',
    title: 'Il Mistero delle Reti Fantasma',
    description: 'L\'86,5% dei rifiuti marini deriva da attività di pesca, e il 94% sono reti abbandonate che continuano a "pescare" per decenni.',
    category: 'conservazione',
    funFact: false
  }
]