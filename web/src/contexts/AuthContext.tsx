'use client'

import { useState, useEffect, createContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on app start
    const initAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const currentUser = apiClient.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
          } else {
            // Fetch fresh user data
            const userData = await apiClient.getProfile()
            setUser(userData)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        apiClient.logout()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials)
      setUser(response.user)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      await apiClient.register(userData)
      // After successful registration, redirect to login
      router.push('/login')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
    router.push('/login')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
