import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { MessageBubble } from './MessageBubble'
import { ProteoChatInput, FileWithPreview, PastedContent } from './ui/proteo-chat-input'
import { MarineInspiration } from './ui/marine-inspiration'
import { MarineDataDashboard } from './ui/marine-data-dashboard'
import EnhancedQuickActions from './ui/enhanced-quick-actions'
import { useChat } from '@/hooks/useChat'

/**
 * Main chat interface component for Proteo
 * Componente principale interfaccia chat per Proteo
 */
export const ProteoChat: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, sendMessage } = useChat()
  const [showInspiration, setShowInspiration] = useState(messages.length === 0)
  const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false)

  // Auto-scroll to bottom when new messages arrive
  // Auto-scroll in fondo quando arrivano nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowInspiration(messages.length === 0)
  }, [messages])

  const handleSendMessage = async (
    message: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[]
  ) => {
    if (!message.trim() && files.length === 0 && pastedContent.length === 0) return
    
    // For now, just send the text message
    // In the future, we can enhance to handle files and pasted content
    let fullMessage = message
    
    if (pastedContent.length > 0) {
      fullMessage += '\n\nPasted content:\n' + pastedContent.map(p => p.content).join('\n\n')
    }
    
    if (files.length > 0) {
      fullMessage += '\n\nFiles attached:\n' + files.map(f => f.file.name).join(', ')
    }
    
    await sendMessage(fullMessage)
  }


  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 p-2 sm:p-4">
      {/* Marine Data Dashboard */}
      <MarineDataDashboard 
        isCollapsed={isDashboardCollapsed}
        onToggle={setIsDashboardCollapsed}
        className="rounded-xl shadow-sm"
      />

      {/* Hero Section with Marine Inspiration */}
      {showInspiration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Marine Inspiration Gallery */}
          <MarineInspiration className="mb-6" />
        </motion.div>
      )}

      {/* Messages Display Area */}
      <Card className={`flex flex-col bg-white/95 backdrop-blur-sm border-2 border-ocean-200 transition-all duration-500 marine-glass ${
        showInspiration ? 'h-[300px] sm:h-[350px]' : 'h-[400px] sm:h-[500px]'
      }`}>
        <CardHeader className="pb-4 border-b border-ocean-100 flex-shrink-0">
          <CardTitle className="text-ocean-700 flex items-center gap-3 text-lg">
            💬 Chat con Proteo
            <Sparkles className="h-4 w-4 text-ocean-500" />
            <span className="text-xs font-normal text-gray-500 ml-2">
              Ecosistemi Marini Italiani & MER
            </span>
          </CardTitle>
        </CardHeader>
      
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages area / Area messaggi */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 custom-scrollbar">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ 
                      rotateY: [0, 180, 360],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    🌊
                  </motion.div>
                  <h3 className="text-lg font-semibold text-ocean-700 mb-3">
                    Esplora i Mari Italiani con Proteo
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto mb-4">
                    Scopri dati scientifici, progetti di conservazione e curiosità sugli ecosistemi marini del Mediterraneo.
                  </p>
                  <div className="flex justify-center items-center gap-4 text-xs text-ocean-500">
                    <span className="flex items-center gap-1">
                      🔬 Dati ISPRA
                    </span>
                    <span className="flex items-center gap-1">
                      🌱 Progetto MER
                    </span>
                    <span className="flex items-center gap-1">
                      🐟 Biodiversità
                    </span>
                  </div>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    index={index}
                  />
                ))
              )}
            </AnimatePresence>
            
            {/* Loading indicator / Indicatore caricamento */}
            {isLoading && (
              <motion.div 
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center">
                  <Loader2 className="h-3 w-3 text-white animate-spin" />
                </div>
                <div className="bg-white rounded-xl px-3 py-2 border border-ocean-100">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-ocean-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-ocean-400 rounded-full animate-bounce" style={{ animationDelay: '.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-ocean-400 rounded-full animate-bounce" style={{ animationDelay: '.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Chat Input with Better Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-ocean-200 overflow-hidden marine-glass">
        <EnhancedQuickActions
          onActionClick={async (prompt) => {
            await sendMessage(prompt)
          }}
          disabled={isLoading}
          compact={false}
        />
        <div className="p-2 sm:p-4">
          <ProteoChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Chiedimi informazioni sui dati marini ISPRA, carica file o seleziona un'azione rapida sopra..."
            maxFiles={5}
            maxFileSize={10 * 1024 * 1024} // 10MB
            showQuickActions={false}
          />
        </div>
      </div>

      {/* Enhanced Footer with Marine Theme */}
      <motion.div 
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex justify-center items-center gap-6 text-sm text-ocean-600">
          <span className="flex items-center gap-1">
            🌊 MER Project 2022-2026
          </span>
          <span className="flex items-center gap-1">
            🔬 ISPRA Data
          </span>
          <span className="flex items-center gap-1">
            🤖 RAG + AI
          </span>
        </div>
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          <strong>Proteo</strong> utilizza dati ufficiali ISPRA e il progetto MER per fornirti informazioni accurate sui mari italiani. 
          Le risposte sono generate da intelligenza artificiale - verifica sempre le informazioni critiche.
        </p>
        <div className="text-xs text-ocean-400">
          💚 Contribuisci alla conservazione marina • 🏛️ Supporta ISPRA • 🌍 Proteggi il Mediterraneo
        </div>
      </motion.div>
    </div>
  )
}