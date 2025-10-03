'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { ModernButton } from '@/components/ui/ModernButton'
import { LogOut, User, Settings, Home } from 'lucide-react'
import { ModernLayoutProps } from '@/types/components'

export function ModernLayout({ children }: ModernLayoutProps) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <motion.nav 
        className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                TaskFlow
              </span>
            </motion.div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              
              <ModernButton
                variant="ghost"
                size="sm"
                icon={<Settings className="w-4 h-4" />}
                className="text-slate-300 hover:text-white"
              >
                Settings
              </ModernButton>
              
              <ModernButton
                variant="danger"
                size="sm"
                icon={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
              >
                Logout
              </ModernButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
