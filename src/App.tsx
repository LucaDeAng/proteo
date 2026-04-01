import { useActiveSlide } from './hooks/useActiveSlide'
import { NavDots } from './components/NavDots'
import HeroSlide from './components/slides/HeroSlide'
import VoidSlide from './components/slides/VoidSlide'
import BigBangSlide from './components/slides/BigBangSlide'
import FirstStarsSlide from './components/slides/FirstStarsSlide'
import IceAgeSlide from './components/slides/IceAgeSlide'
import CambrianSlide from './components/slides/CambrianSlide'
import IntelligenceSlide from './components/slides/IntelligenceSlide'
import SingularitySlide from './components/slides/SingularitySlide'
import GalaxyMapSlide from './components/slides/GalaxyMapSlide'

const TOTAL_SLIDES = 9

function App() {
  const { activeSlide, scrollToSlide, containerRef } = useActiveSlide(TOTAL_SLIDES)

  return (
    <>
      <NavDots active={activeSlide} total={TOTAL_SLIDES} onNavigate={scrollToSlide} />

      <div ref={containerRef} className="scroll-container">
        <HeroSlide index={0} active={activeSlide === 0} />
        <VoidSlide index={1} active={activeSlide === 1} />
        <BigBangSlide index={2} active={activeSlide === 2} />
        <FirstStarsSlide index={3} active={activeSlide === 3} />
        <IceAgeSlide index={4} active={activeSlide === 4} />
        <CambrianSlide index={5} active={activeSlide === 5} />
        <IntelligenceSlide index={6} active={activeSlide === 6} />
        <SingularitySlide index={7} active={activeSlide === 7} />
        <GalaxyMapSlide index={8} active={activeSlide === 8} />
      </div>
    </>
  )
}

export default App
