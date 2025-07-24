import React from 'react'
import { motion } from 'framer-motion'
import { User, Shell } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
  index: number
}

/**
 * Message bubble component with animations and marine styling
 * Componente bolla messaggio con animazioni e stile marino
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index }) => {
  const isBot = message.sender === 'bot'
  
  // Respect reduced motion preference / Rispetta preferenza movimento ridotto
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      x: isBot ? -20 : 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.4,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className={cn(
        "flex gap-3 mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
    >
      {isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center shadow-md">
            <Shell className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 shadow-md",
          isBot 
            ? "bg-white text-gray-800 border border-ocean-100" 
            : "bg-gradient-to-br from-ocean-500 to-ocean-600 text-white"
        )}
        role="log"
        aria-label={`Messaggio da ${isBot ? 'Proteo' : 'utente'}`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <time 
          className={cn(
            "text-xs mt-2 block",
            isBot ? "text-gray-500" : "text-ocean-100"
          )}
          dateTime={message.timestamp.toISOString()}
        >
          {message.timestamp.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </time>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-md">
            <User className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
        </div>
      )}
    </motion.div>
  )
}