import { motion } from 'framer-motion'

interface AudioToggleProps {
  muted: boolean
  onToggle: () => void
}

export function AudioToggle({ muted, onToggle }: AudioToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 cursor-pointer group"
      aria-label={muted ? 'Enable audio' : 'Mute audio'}
    >
      {/* Sound bars animation */}
      <div className="flex items-end gap-[2px] h-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-[2px] rounded-full"
            style={{ backgroundColor: muted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}
            animate={
              muted
                ? { height: 4 }
                : { height: [4, 8 + i * 3, 4], transition: { duration: 0.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut' } }
            }
          />
        ))}
      </div>
      <span className="text-xs font-mono text-white/40 group-hover:text-white/60 transition-colors">
        {muted ? 'OFF' : 'ON'}
      </span>
    </button>
  )
}
