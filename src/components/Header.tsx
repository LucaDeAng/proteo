import React from 'react'
import { motion } from 'framer-motion'
import { Waves } from 'lucide-react'
import { ProteusIcon } from './ui/proteus-icon'

/**
 * Header component with Proteo branding and marine theme
 * Componente Header con branding Proteo e tema marino
 */
export const Header: React.FC = () => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-ocean-500 to-cyan-500 text-white shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="relative bg-white/20 rounded-full p-2"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <ProteusIcon className="text-white drop-shadow-lg" size={36} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold font-serif">
                Proteo
              </h1>
              <p className="text-ocean-100 text-sm">
                Assistente marino ISPRA/MER
              </p>
            </div>
          </div>
          
          <motion.div
            className="hidden md:flex items-center space-x-2 text-ocean-100"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Waves className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-medium">
              Monitoraggio marino in tempo reale
            </span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}