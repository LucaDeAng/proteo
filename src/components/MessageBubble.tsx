import React from 'react'
import { motion } from 'framer-motion'
import { User, Shell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DataBadge, DataConfidenceIndicator } from './ui/data-badge'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  role?: 'user' | 'assistant' | 'system'
  dataType?: 'real' | 'simulated' | 'cached' | 'demo'
  confidence?: number
  containsData?: boolean
}

interface MessageBubbleProps {
  message: Message
  index: number
}

// Data detection utilities
const detectMarineData = (content: string) => {
  const dataPatterns = [
    /\d+[\.,]\d*\s*(°C|C°)/gi, // Temperature
    /\d+[\.,]\d*\s*(µg\/L|ug\/L|mg\/L)/gi, // Concentrations
    /\d+[\.,]\d*\s*m\/s/gi, // Speed
    /pH\s*:?\s*\d+[\.,]\d*/gi, // pH
    /\d+[\.,]\d*\s*m(?!\w)/gi, // Wave height
    /\d+[\.,]\d*\s*PSU/gi, // Salinity
    /salinità|temperatura|clorofilla|ossigeno|ph|onde|correnti/gi // Keywords
  ]
  
  return dataPatterns.some(pattern => pattern.test(content))
}

const extractDataValues = (content: string) => {
  const values = []
  const tempMatch = content.match(/(\d+[\.,]\d*)\s*(°C|C°)/i)
  const chlorMatch = content.match(/(\d+[\.,]\d*)\s*(µg\/L|ug\/L)/i)
  const phMatch = content.match(/pH\s*:?\s*(\d+[\.,]\d*)/i)
  const waveMatch = content.match(/(\d+[\.,]\d*)\s*m(?!\w)/i)
  
  if (tempMatch) values.push({ type: 'temperature', value: tempMatch[1], unit: tempMatch[2] })
  if (chlorMatch) values.push({ type: 'chlorophyll', value: chlorMatch[1], unit: chlorMatch[2] })
  if (phMatch) values.push({ type: 'ph', value: phMatch[1], unit: '' })
  if (waveMatch) values.push({ type: 'waves', value: waveMatch[1], unit: 'm' })
  
  return values
}

/**
 * Message bubble component with animations and marine styling
 * Componente bolla messaggio con animazioni e stile marino
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index }) => {
  const isBot = message.sender === 'bot' || message.role === 'assistant'
  
  // Enhanced data detection
  const containsData = message.containsData ?? detectMarineData(message.content)
  const dataValues = containsData ? extractDataValues(message.content) : []
  const isDemo = message.content.toLowerCase().includes('demo') || 
                 message.content.toLowerCase().includes('simulat') ||
                 message.content.toLowerCase().includes('mock')
  const dataType = message.dataType ?? (isDemo ? 'demo' : containsData ? 'real' : undefined)
  
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
      
      <div className="flex-1 max-w-[85%]">
        {/* Data Badge for bot messages with data */}
        {isBot && containsData && dataType && (
          <div className="mb-2 flex items-center gap-2">
            <DataBadge 
              type={dataType} 
              timestamp={message.timestamp.toISOString()}
            />
            {message.confidence && (
              <DataConfidenceIndicator confidence={message.confidence} />
            )}
          </div>
        )}
        
        {/* Data Values Preview */}
        {isBot && dataValues.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {dataValues.map((data, idx) => (
              <div 
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-ocean-50 border border-ocean-200 rounded-full text-xs font-medium text-ocean-700"
              >
                <span className="capitalize">{data.type}:</span>
                <span className="font-semibold">{data.value}{data.unit}</span>
              </div>
            ))}
          </div>
        )}
        
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-md",
            isBot 
              ? "bg-white text-gray-800 border border-ocean-100 rounded-tl-md" 
              : "bg-gradient-to-br from-ocean-500 to-ocean-600 text-white rounded-tr-md"
          )}
          role="log"
          aria-label={`Messaggio da ${isBot ? 'Proteo' : 'utente'}`}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <time 
              className={cn(
                "text-xs",
                isBot ? "text-gray-500" : "text-ocean-100"
              )}
              dateTime={message.timestamp.toISOString()}
            >
              {message.timestamp.toLocaleTimeString('it-IT', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </time>
            
            {/* Message status indicators */}
            {isBot && containsData && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>Dati marini</span>
              </div>
            )}
          </div>
        </div>
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