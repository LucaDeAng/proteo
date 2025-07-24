import React from 'react'
import { motion } from 'framer-motion'

/**
 * Proteus SVG Icon - Ancient Sea God
 * Icona SVG Proteo - Antico Dio del Mare
 * 
 * Simple, visible representation of Proteus as the Old Man of the Sea
 */
export const ProteusIcon: React.FC<{ 
  className?: string
  size?: number
}> = ({ className = "", size = 32 }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      fill="currentColor"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Ocean waves at base */}
      <motion.path
        d="M4 36 Q12 32 20 36 T36 36 T44 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.8"
        animate={{ 
          d: [
            "M4 36 Q12 32 20 36 T36 36 T44 36",
            "M4 38 Q12 34 20 38 T36 38 T44 38",
            "M4 36 Q12 32 20 36 T36 36 T44 36"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Second wave */}
      <motion.path
        d="M4 40 Q16 38 28 40 T44 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        animate={{ 
          d: [
            "M4 40 Q16 38 28 40 T44 40",
            "M4 42 Q16 40 28 42 T44 42",
            "M4 40 Q16 38 28 40 T44 40"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Proteus head - main circular form */}
      <circle
        cx="24"
        cy="20"
        r="10"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Flowing beard */}
      <motion.path
        d="M16 26 Q20 32 24 30 Q28 32 32 26 Q30 36 24 34 Q18 36 16 26"
        fill="currentColor"
        opacity="0.8"
        animate={{ 
          d: [
            "M16 26 Q20 32 24 30 Q28 32 32 26 Q30 36 24 34 Q18 36 16 26",
            "M16 27 Q20 33 24 31 Q28 33 32 27 Q30 37 24 35 Q18 37 16 27",
            "M16 26 Q20 32 24 30 Q28 32 32 26 Q30 36 24 34 Q18 36 16 26"
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Eyes */}
      <circle cx="20" cy="18" r="1.5" fill="white" />
      <circle cx="28" cy="18" r="1.5" fill="white" />
      <circle cx="20" cy="18" r="0.8" fill="#1e293b" />
      <circle cx="28" cy="18" r="0.8" fill="#1e293b" />

      {/* Crown/divine marking */}
      <motion.path
        d="M16 14 Q20 10 24 12 Q28 10 32 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Trident symbol */}
      <motion.g
        animate={{ 
          rotate: [0, 2, -2, 0],
          x: [0, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="38" y1="12" x2="38" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
        <path d="M35 15 L38 12 L41 15" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      </motion.g>

      {/* Seals - small companions */}
      <motion.ellipse
        cx="10"
        cy="32"
        rx="3"
        ry="1.5"
        fill="currentColor"
        opacity="0.6"
        animate={{ 
          cx: [10, 12, 10],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.ellipse
        cx="38"
        cy="34"
        rx="2.5"
        ry="1.2"
        fill="currentColor"
        opacity="0.6"
        animate={{ 
          cx: [38, 36, 38],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Mystical aura */}
      <motion.circle
        cx="24"
        cy="20"
        r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
        animate={{ 
          r: [15, 17, 15],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  )
}