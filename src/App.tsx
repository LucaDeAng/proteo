import { useEffect } from 'react'
import { Header } from './components/Header'
import { ProteoChat } from './components/ProteoChat'
import { WavyBackground } from './components/ui/wavy-background'
import { dataUpdater } from './services/dataUpdater'

/**
 * Main App component with marine gradient background
 * Componente App principale con sfondo gradient marino
 */
function App() {
  // Initialize marine data updates / Inizializza aggiornamenti dati marini
  useEffect(() => {
    dataUpdater.start()
    
    return () => {
      dataUpdater.stop()
    }
  }, [])

  return (
    <WavyBackground
      className=""
      containerClassName="min-h-screen"
      colors={[
        "#0ea5e9", // sky-500 - bright ocean blue
        "#0284c7", // sky-600 - deeper ocean
        "#0369a1", // sky-700 - deep sea blue
        "#38bdf8", // sky-400 - light ocean
        "#22d3ee", // cyan-400 - tropical water
        "#06b6d4", // cyan-500 - turquoise
        "#0891b2", // cyan-600 - teal
      ]}
      waveWidth={50}
      backgroundFill="rgb(240 249 255)" // sky-50
      blur={10}
      speed="slow"
      waveOpacity={0.3}
    >
      <Header />
      
      <main className="relative z-10 py-8">
        <div className="container mx-auto">
          <ProteoChat />
        </div>
      </main>
    </WavyBackground>
  )
}

export default App