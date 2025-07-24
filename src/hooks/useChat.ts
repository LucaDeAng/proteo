import { useState, useCallback } from 'react'
import { Message } from '@/components/MessageBubble'
import { apiClient } from '@/api/client'

/**
 * Custom hook for chat functionality with optimistic UI updates
 * Hook personalizzato per funzionalità chat con aggiornamenti UI ottimistici
 */
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // Create user message / Crea messaggio utente
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    // Optimistic UI update / Aggiornamento UI ottimistico
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call API with all messages for context / Chiama API con tutti i messaggi per contesto  
      const allMessages = [...messages, userMessage]
      const response = await apiClient.sendMessage(allMessages)

      // Create bot response message / Crea messaggio risposta bot
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: response,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Error message / Messaggio di errore
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: '🌊 Mi dispiace, si è verificato un errore. Riprova tra poco.\n\n*Sorry, an error occurred. Please try again shortly.*',
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  }
}