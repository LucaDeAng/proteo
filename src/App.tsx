import { useState, useCallback } from 'react'
import { useActiveSlide } from './hooks/useActiveSlide'
import { LangContext, type Lang } from './hooks/useLang'
import { NavDots } from './components/NavDots'
import { LangToggle } from './components/LangToggle'
import { AmbientPlayer } from './components/AmbientPlayer'
import { YearCounter } from './components/YearCounter'
import { TimelineBar } from './components/TimelineBar'
import { SlideProgress } from './components/SlideProgress'
import { CursorGlow } from './components/CursorGlow'
import { Preloader } from './components/Preloader'
import HeroSlide from './components/slides/HeroSlide'
import VoidSlide from './components/slides/VoidSlide'
import BigBangSlide from './components/slides/BigBangSlide'
import FirstStarsSlide from './components/slides/FirstStarsSlide'
import IceAgeSlide from './components/slides/IceAgeSlide'
import CambrianSlide from './components/slides/CambrianSlide'
import IntelligenceSlide from './components/slides/IntelligenceSlide'
import SingularitySlide from './components/slides/SingularitySlide'
import LineageSlide from './components/slides/LineageSlide'
import HorizonSlide from './components/slides/HorizonSlide'
import NumbersSlide from './components/slides/NumbersSlide'
import GalaxyMapSlide from './components/slides/GalaxyMapSlide'
import CreditsSlide from './components/slides/CreditsSlide'

const TOTAL_SLIDES = 13

function App() {
  const { activeSlide, scrollToSlide, containerRef } = useActiveSlide(TOTAL_SLIDES)
  const [lang, setLang] = useState<Lang>('it')
  const [loaded, setLoaded] = useState(false)
  const toggleLang = useCallback(() => setLang((l) => (l === 'it' ? 'en' : 'it')), [])

  return (
    <LangContext.Provider value={{ lang, toggle: toggleLang }}>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      <CursorGlow />
      <LangToggle />
      <AmbientPlayer />
      <NavDots active={activeSlide} total={TOTAL_SLIDES} onNavigate={scrollToSlide} />
      <YearCounter activeSlide={activeSlide} />
      <TimelineBar activeSlide={activeSlide} totalSlides={TOTAL_SLIDES} />
      <SlideProgress activeSlide={activeSlide} totalSlides={TOTAL_SLIDES} />

      <div ref={containerRef} className="scroll-container">
        <HeroSlide index={0} active={activeSlide === 0} />
        <VoidSlide index={1} active={activeSlide === 1} />
        <BigBangSlide index={2} active={activeSlide === 2} />
        <FirstStarsSlide index={3} active={activeSlide === 3} />
        <IceAgeSlide index={4} active={activeSlide === 4} />
        <CambrianSlide index={5} active={activeSlide === 5} />
        <IntelligenceSlide index={6} active={activeSlide === 6} />
        <SingularitySlide index={7} active={activeSlide === 7} />
        <LineageSlide index={8} active={activeSlide === 8} />
        <HorizonSlide index={9} active={activeSlide === 9} />
        <NumbersSlide index={10} active={activeSlide === 10} />
        <GalaxyMapSlide index={11} active={activeSlide === 11} />
        <CreditsSlide index={12} active={activeSlide === 12} />
      </div>
    </LangContext.Provider>
  )
}

export default App
