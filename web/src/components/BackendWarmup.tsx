'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'

export function BackendWarmup() {
  const [isWarmingUp, setIsWarmingUp] = useState(true)
  const [warmupStatus, setWarmupStatus] = useState<string>('')

  useEffect(() => {
    const warmUpBackend = async () => {
      try {
        setWarmupStatus('🔥 Warming up backend...')
        
        // Make multiple health check requests to ensure backend is fully warmed up
        const promises = Array.from({ length: 3 }, () => 
          apiClient.checkHealth().catch(() => null)
        )
        
        await Promise.allSettled(promises)
        
        setWarmupStatus('✅ Backend ready!')
        setIsWarmingUp(false)
        
        // Clear status after 2 seconds
        setTimeout(() => setWarmupStatus(''), 2000)
      } catch (error) {
        console.warn('Backend warm-up failed:', error)
        setWarmupStatus('⚠️ Backend warm-up failed')
        setIsWarmingUp(false)
        
        // Clear status after 3 seconds
        setTimeout(() => setWarmupStatus(''), 3000)
      }
    }

    // Only warm up in production
    if (process.env.NODE_ENV === 'production') {
      warmUpBackend()
    } else {
      setIsWarmingUp(false)
    }
  }, [])

  // Don't render anything in development
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {isWarmingUp && (
        <div className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          {warmupStatus}
        </div>
      )}
    </div>
  )
}
