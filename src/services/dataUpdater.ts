/**
 * Background service for updating marine data cache
 * Servizio background per aggiornare cache dati marini
 */

import { ragService } from './ragService'
import { MARINE_DATA_SOURCES } from '@/data/marineDataSources'

class DataUpdater {
  private updateInterval: number = 15 * 60 * 1000 // 15 minutes
  private intervalId: number | null = null

  /**
   * Start automatic data updates
   * Avvia aggiornamenti dati automatici
   */
  start(): void {
    console.log('🔄 Starting marine data updater...')
    
    // Initial update / Aggiornamento iniziale
    this.updateData()
    
    // Schedule periodic updates / Programma aggiornamenti periodici
    this.intervalId = window.setInterval(() => {
      this.updateData()
    }, this.updateInterval)
  }

  /**
   * Stop automatic data updates
   * Ferma aggiornamenti dati automatici
   */
  stop(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId)
      this.intervalId = null
      console.log('⏹️ Marine data updater stopped')
    }
  }

  /**
   * Manually trigger data update
   * Attiva manualmente aggiornamento dati
   */
  async updateData(): Promise<void> {
    try {
      console.log('📊 Updating marine data cache...')
      
      await ragService.updateDataCache()
      
      // Log update statistics / Log statistiche aggiornamento
      const updateTime = new Date().toISOString()
      const sourcesCount = MARINE_DATA_SOURCES.length
      
      console.log(`✅ Marine data updated at ${updateTime} (${sourcesCount} sources)`)
      
      // In production, you might want to:
      // - Log to monitoring service
      // - Update UI status indicators
      // - Send notifications on failures
      // In produzione, potresti voler:
      // - Loggare su servizio monitoraggio
      // - Aggiornare indicatori stato UI
      // - Inviare notifiche su errori
      
    } catch (error) {
      console.error('❌ Failed to update marine data:', error)
      
      // In production: retry logic, error reporting
      // In produzione: logica retry, segnalazione errori
    }
  }

  /**
   * Get update status information
   * Ottieni informazioni stato aggiornamento
   */
  getStatus(): {
    isRunning: boolean
    interval: number
    lastUpdate: string | null
  } {
    return {
      isRunning: this.intervalId !== null,
      interval: this.updateInterval,
      lastUpdate: localStorage.getItem('lastMarineDataUpdate')
    }
  }

  /**
   * Set update interval
   * Imposta intervallo aggiornamento
   */
  setUpdateInterval(minutes: number): void {
    this.updateInterval = minutes * 60 * 1000
    
    if (this.intervalId) {
      this.stop()
      this.start()
    }
    
    console.log(`🔄 Update interval set to ${minutes} minutes`)
  }
}

export const dataUpdater = new DataUpdater()

// Auto-start in browser environment / Auto-avvio in ambiente browser
if (typeof window !== 'undefined') {
  // Start updates when the page loads / Avvia aggiornamenti quando la pagina si carica
  window.addEventListener('load', () => {
    dataUpdater.start()
  })
  
  // Stop updates when page unloads / Ferma aggiornamenti quando la pagina si scarica
  window.addEventListener('beforeunload', () => {
    dataUpdater.stop()
  })
}