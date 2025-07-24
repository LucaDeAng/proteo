/**
 * ISPRA Website Navigation and Content Data
 * Dati navigazione e contenuti sito web ISPRA
 */

export interface WebsiteSection {
  id: string
  name: string
  nameEn: string
  url: string
  description: string
  descriptionEn: string
  subsections?: string[]
  keywords: string[]
}

export interface WebsiteNavigationHelp {
  intent: string
  intentEn: string
  response: string
  responseEn: string
  suggestedSections: string[]
}

export const ISPRA_WEBSITE_SECTIONS: WebsiteSection[] = [
  {
    id: 'home',
    name: 'Home',
    nameEn: 'Home',
    url: 'https://www.isprambiente.gov.it',
    description: 'Pagina principale con notizie e accesso rapido ai servizi',
    descriptionEn: 'Main page with news and quick access to services',
    keywords: ['home', 'notizie', 'news', 'principale']
  },
  {
    id: 'istituto',
    name: 'Istituto',
    nameEn: 'Institute',
    url: 'https://www.isprambiente.gov.it/it/istituto',
    description: 'Informazioni sull\'istituto, organizzazione, missione e struttura',
    descriptionEn: 'Information about the institute, organization, mission and structure',
    keywords: ['istituto', 'institute', 'organizzazione', 'missione', 'struttura']
  },
  {
    id: 'attivita',
    name: 'Attività',
    nameEn: 'Activities',
    url: 'https://www.isprambiente.gov.it/it/attivita',
    description: 'Attività di ricerca e monitoraggio ambientale, incluso il settore marino',
    descriptionEn: 'Research and environmental monitoring activities, including marine sector',
    subsections: ['Mare', 'Clima', 'Biodiversità', 'Suolo', 'Aria', 'Rifiuti'],
    keywords: ['attività', 'activities', 'ricerca', 'research', 'monitoraggio', 'monitoring', 'mare', 'marine']
  },
  {
    id: 'dati-indicatori',
    name: 'Dati e Indicatori',
    nameEn: 'Data and Indicators',
    url: 'https://www.isprambiente.gov.it/it/servizi/accesso-ai-dati-ambientali',
    description: 'Accesso ai dati ambientali, indicatori, banche dati e sistemi informativi',
    descriptionEn: 'Access to environmental data, indicators, databases and information systems',
    subsections: ['IdroGEO', 'EcoAtl@nte', 'Sistema Informativo Nazionale Ambientale'],
    keywords: ['dati', 'data', 'indicatori', 'indicators', 'database', 'informazioni', 'information']
  },
  {
    id: 'pubblicazioni',
    name: 'Pubblicazioni',
    nameEn: 'Publications',
    url: 'https://www.isprambiente.gov.it/it/pubblicazioni',
    description: 'Rapporti, studi, pubblicazioni scientifiche e documentazione tecnica',
    descriptionEn: 'Reports, studies, scientific publications and technical documentation',
    keywords: ['pubblicazioni', 'publications', 'rapporti', 'reports', 'studi', 'studies', 'documenti']
  },
  {
    id: 'servizi',
    name: 'Servizi',
    nameEn: 'Services',
    url: 'https://www.isprambiente.gov.it/it/servizi',
    description: 'Servizi ambientali, software, moduli e strumenti per l\'ambiente',
    descriptionEn: 'Environmental services, software, modules and environmental tools',
    subsections: ['Moduli e Software', 'Servizi per l\'Ambiente'],
    keywords: ['servizi', 'services', 'software', 'strumenti', 'tools', 'ambiente']
  },
  {
    id: 'eventi',
    name: 'Eventi',
    nameEn: 'Events',
    url: 'https://www.isprambiente.gov.it/it/eventi',
    description: 'Conferenze, seminari, workshop e eventi di divulgazione scientifica',
    descriptionEn: 'Conferences, seminars, workshops and scientific dissemination events',
    keywords: ['eventi', 'events', 'conferenze', 'conferences', 'seminari', 'workshop']
  }
]

export const MARINE_SPECIFIC_NAVIGATION: WebsiteNavigationHelp[] = [
  {
    intent: 'Trovare dati marini',
    intentEn: 'Find marine data',
    response: '🌊 Per accedere ai dati marini ISPRA:\n\n1. **Dati e Indicatori** - Sezione principale per dataset ambientali\n2. **Attività > Mare** - Ricerche e monitoraggio marino\n3. **Rete Mareografica Nazionale (RMN)** - Dati livelli mare\n4. **Rete Ondametrica Nazionale (RON)** - Dati moto ondoso\n\nPuoi anche usare il portale dati.isprambiente.it per l\'accesso diretto.',
    responseEn: '🌊 To access ISPRA marine data:\n\n1. **Data and Indicators** - Main section for environmental datasets\n2. **Activities > Marine** - Marine research and monitoring\n3. **National Tide Gauge Network (RMN)** - Sea level data\n4. **National Wave Network (RON)** - Wave motion data\n\nYou can also use the dati.isprambiente.it portal for direct access.',
    suggestedSections: ['dati-indicatori', 'attivita']
  },
  {
    intent: 'Cercare pubblicazioni marine',
    intentEn: 'Search marine publications',
    response: '📚 Per trovare pubblicazioni marine:\n\n1. **Pubblicazioni** - Sezione principale con rapporti e studi\n2. Filtra per argomento "Mare" o "Marine"\n3. Cerca rapporti su biodiversità marina, qualità acque, ecosistemi\n4. **Annuario dei dati ambientali** - Contiene sezioni marine\n\nI principali argomenti includono: MER (Marine Ecosystem Restoration), Aree Marine Protette, specie marine.',
    responseEn: '📚 To find marine publications:\n\n1. **Publications** - Main section with reports and studies\n2. Filter by "Marine" or "Sea" topics\n3. Search for reports on marine biodiversity, water quality, ecosystems\n4. **Environmental Data Yearbook** - Contains marine sections\n\nMain topics include: MER (Marine Ecosystem Restoration), Marine Protected Areas, marine species.',
    suggestedSections: ['pubblicazioni']
  },
  {
    intent: 'Contattare esperti marini',
    intentEn: 'Contact marine experts',
    response: '👥 Per contattare esperti ISPRA:\n\n1. **Istituto > Organizzazione** - Struttura organizzativa\n2. **URP (Ufficio Relazioni Pubbliche)** - Contatti generali\n3. Email PEC: protocollo.ispra@ispra.legalmail.it\n4. **Eventi** - Partecipa a seminari e workshop marini\n\nPer richieste specifiche su dati marini, usa i contatti nella sezione Servizi.',
    responseEn: '👥 To contact ISPRA experts:\n\n1. **Institute > Organization** - Organizational structure\n2. **Public Relations Office** - General contacts\n3. PEC Email: protocollo.ispra@ispra.legalmail.it\n4. **Events** - Participate in marine seminars and workshops\n\nFor specific marine data requests, use contacts in the Services section.',
    suggestedSections: ['istituto', 'eventi', 'servizi']
  }
]

export const WEBSITE_QUICK_ACTIONS = [
  {
    id: 'nav-data',
    label: 'Come accedere ai dati marini',
    labelEn: 'How to access marine data',
    icon: '🗂️',
    prompt: 'Come posso navigare nel sito ISPRA per trovare dati marini e di monitoraggio?',
    category: 'navigation'
  },
  {
    id: 'nav-publications',
    label: 'Trova pubblicazioni marine',
    labelEn: 'Find marine publications',
    icon: '📖',
    prompt: 'Dove trovo le pubblicazioni scientifiche ISPRA sul settore marino?',
    category: 'navigation'
  },
  {
    id: 'nav-services',
    label: 'Servizi e strumenti disponibili',
    labelEn: 'Available services and tools',
    icon: '🛠️',
    prompt: 'Quali servizi e strumenti offre ISPRA per il monitoraggio marino?',
    category: 'navigation'
  },
  {
    id: 'nav-contacts',
    label: 'Contatti esperti marini',
    labelEn: 'Marine experts contacts',
    icon: '📞',
    prompt: 'Come posso contattare gli esperti ISPRA per questioni marine specifiche?',
    category: 'navigation'
  }
]

export const ISPRA_WEBSITE_CONTEXT = `
ISPRA (Istituto Superiore per la Protezione e la Ricerca Ambientale) è l'ente nazionale italiano per la protezione ambientale e la ricerca.

STRUTTURA SITO WEB:
- Homepage: Notizie, accessi rapidi, informazioni principali
- Istituto: Organizzazione, missione, struttura operativa
- Attività: Ricerca ambientale divisa per settori (Mare, Clima, Biodiversità, etc.)
- Dati e Indicatori: Accesso a dataset, banche dati, sistemi informativi
- Pubblicazioni: Rapporti scientifici, studi, documentazione tecnica
- Servizi: Software, moduli, strumenti per l'ambiente
- Eventi: Conferenze, seminari, workshop scientifici

SETTORE MARINO:
- Rete Mareografica Nazionale (RMN): monitoraggio livelli mare
- Rete Ondametrica Nazionale (RON): monitoraggio moto ondoso
- Progetto MER: Marine Ecosystem Restoration
- Aree Marine Protette: monitoraggio e gestione
- Biodiversità marina: studi su specie e ecosistemi
- Qualità acque: parametri chimico-fisici e biologici

ACCESSO DATI:
- Portale dati.isprambiente.it per dataset aperti
- Sistema Informativo Nazionale Ambientale
- IdroGEO per dati idrogeologici
- EcoAtl@nte per dati ecologici

CONTATTI:
- Email PEC: protocollo.ispra@ispra.legalmail.it
- URP per relazioni pubbliche
- Esperti settoriali nelle diverse attività
`