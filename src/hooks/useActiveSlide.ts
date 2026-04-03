import { useState, useEffect, useCallback, useRef } from 'react'

export function useActiveSlide(totalSlides: number) {
  const [activeSlide, setActiveSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToSlide = useCallback((index: number) => {
    const container = containerRef.current
    if (!container) return
    const slides = container.querySelectorAll<HTMLElement>('[data-slide]')
    slides[index]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = Number(entry.target.getAttribute('data-slide'))
            if (!isNaN(idx)) setActiveSlide(idx)
          }
        }
      },
      { root: container, threshold: 0.5 }
    )

    const slides = container.querySelectorAll('[data-slide]')
    slides.forEach((s) => observer.observe(s))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        if (activeSlide < totalSlides - 1) scrollToSlide(activeSlide + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (activeSlide > 0) scrollToSlide(activeSlide - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeSlide, totalSlides, scrollToSlide])

  return { activeSlide, scrollToSlide, containerRef }
}
