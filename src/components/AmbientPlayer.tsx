import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Audio player that tries to load an MP3 from /audio/ambient.mp3.
 * If the file doesn't exist, it stays hidden.
 *
 * To use: download a cosmic ambient track (e.g. from Pixabay)
 * and save it as public/audio/ambient.mp3
 */
export function AmbientPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.src = import.meta.env.BASE_URL + 'audio/ambient.mp3'
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'auto'

    audio.addEventListener('canplaythrough', () => {
      setAvailable(true)
      audioRef.current = audio
    })

    // If file doesn't exist, silently hide the player
    audio.addEventListener('error', () => {
      setAvailable(false)
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [playing])

  if (!available) return null

  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 cursor-pointer group transition-all hover:bg-white/10"
      aria-label={playing ? 'Mute audio' : 'Play audio'}
    >
      <div className="flex items-end gap-[2px] h-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-[2px] rounded-full"
            style={{ backgroundColor: playing ? 'rgba(168, 85, 247, 0.9)' : 'rgba(255,255,255,0.25)' }}
            animate={
              playing
                ? {
                    height: [3, 7 + i * 2, 3],
                    transition: { duration: 0.5 + i * 0.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 },
                  }
                : { height: 4 }
            }
          />
        ))}
      </div>
      <span className="text-[10px] font-mono text-white/30 group-hover:text-white/50 transition-colors uppercase tracking-wider">
        {playing ? 'on' : 'off'}
      </span>
    </button>
  )
}
