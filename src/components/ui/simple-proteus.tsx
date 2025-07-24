import React from 'react'

/**
 * Simple Proteus Icon for testing visibility
 */
export const SimpleProteusIcon: React.FC<{ 
  className?: string
  size?: number
}> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      {/* Simple bearded face */}
      <circle cx="12" cy="10" r="6" fill="currentColor" />
      
      {/* Beard */}
      <path d="M8 14 Q10 18 12 16 Q14 18 16 14 Q15 20 12 18 Q9 20 8 14" fill="currentColor" />
      
      {/* Eyes */}
      <circle cx="10" cy="9" r="1" fill="white" />
      <circle cx="14" cy="9" r="1" fill="white" />
      
      {/* Wave at bottom */}
      <path d="M2 20 Q6 18 10 20 T18 20 T22 20" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}