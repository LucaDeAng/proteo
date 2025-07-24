import { Message } from '@/components/MessageBubble'

/**
 * Mock responses for development and fallback
 * Risposte mock per sviluppo e fallback
 */
const mockResponses = [
  '🌱 Analisi clorofilla media: 1,8 µg/L nel Golfo di Napoli. Valori nella norma per il periodo stagionale corrente.\n\n*Average chlorophyll analysis: 1.8 µg/L in the Gulf of Naples. Values within normal range for current seasonal period.*',
  
  '🌊 Temperatura superficiale del mare: 22,4°C. Trend in linea con le medie storiche ISPRA degli ultimi 30 anni.\n\n*Sea surface temperature: 22.4°C. Trend consistent with ISPRA historical averages over the last 30 years.*',
  
  '🐟 Monitoraggio biodiversità: avvistati 3 esemplari di Caretta caretta nelle acque del Santuario Pelagos. Stato di conservazione buono.\n\n*Biodiversity monitoring: 3 Caretta caretta specimens spotted in Pelagos Sanctuary waters. Good conservation status.*',
  
  '⚗️ Analisi qualità acque: pH 8,1, ossigeno disciolto 6,2 mg/L. Parametri chimico-fisici ottimali per l\'ecosistema marino.\n\n*Water quality analysis: pH 8.1, dissolved oxygen 6.2 mg/L. Optimal chemical-physical parameters for marine ecosystem.*',
  
  '🌀 Correnti marine: velocità media 0,15 m/s direzione NE. Condizioni favorevoli per la dispersione dei nutrienti.\n\n*Marine currents: average speed 0.15 m/s NE direction. Favorable conditions for nutrient dispersion.*',
  
  '🔬 Campionamento microplastiche: rilevate 2,3 particelle/m³. Concentrazione sotto la soglia di allerta europea.\n\n*Microplastics sampling: 2.3 particles/m³ detected. Concentration below European alert threshold.*'
]

/**
 * Simulate API delay and return mock response
 * Simula ritardo API e restituisce risposta mock
 */
export const mockFetch = async (messages: Message[]): Promise<string> => {
  // Simulate network delay / Simula ritardo di rete
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  const lastMessage = messages[messages.length - 1]
  
  // Simple keyword-based responses / Risposte semplici basate su parole chiave
  const content = lastMessage?.content.toLowerCase() || ''
  
  if (content.includes('clorofilla') || content.includes('chlorophyll')) {
    return mockResponses[0]
  }
  
  if (content.includes('temperatura') || content.includes('temperature')) {
    return mockResponses[1]
  }
  
  if (content.includes('biodiversità') || content.includes('fauna') || content.includes('biodiversity')) {
    return mockResponses[2]
  }
  
  if (content.includes('qualità') || content.includes('ph') || content.includes('quality')) {
    return mockResponses[3]
  }
  
  if (content.includes('correnti') || content.includes('current')) {
    return mockResponses[4]
  }
  
  if (content.includes('plastica') || content.includes('plastic') || content.includes('inquinamento')) {
    return mockResponses[5]
  }
  
  // Default response / Risposta predefinita
  const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
  
  return `🐚 ${randomResponse}\n\n*Questa è una risposta dimostrativa. Per dati reali, configura VITE_OPENAI_API_KEY.\nThis is a demo response. For real data, configure VITE_OPENAI_API_KEY.*`
}