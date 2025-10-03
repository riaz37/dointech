'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { LoginRequest } from '@/types'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { ModernCard } from '@/components/ui/ModernCard'
import { PageTransition } from '@/components/ui/PageTransition'
import { User, Lock, LogIn } from 'lucide-react'
import { animations, transitions } from '@/lib/theme'

export function LoginForm() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>()

  const onSubmit = async (data: LoginRequest) => {
    try {
      setLoading(true)
      setError(null)
      await login(data)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <ModernCard className="w-full max-w-md mx-auto" gradient glow>
        <div className="p-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitions.default}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={transitions.bounce}
            >
              <LogIn className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-300 mt-2">Sign in to your account</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg"
            >
              <motion.p 
                className="text-error-700 text-sm flex items-center gap-2"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  ⚠️
                </motion.span>
                {error}
              </motion.p>
            </motion.div>
          )}

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            variants={animations.containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={animations.itemVariants}>
              <ModernInput
                label="Username"
                icon={<User className="w-4 h-4" />}
                {...register('username', { required: 'Username is required' })}
                error={errors.username?.message}
                placeholder="Enter your username"
                glow
              />
            </motion.div>

            <motion.div variants={animations.itemVariants}>
              <ModernInput
                label="Password"
                type="password"
                icon={<Lock className="w-4 h-4" />}
                {...register('password', { required: 'Password is required' })}
                error={errors.password?.message}
                placeholder="Enter your password"
                glow
              />
            </motion.div>

            <motion.div variants={animations.itemVariants}>
              <ModernButton
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
                icon={<LogIn className="w-4 h-4" />}
                glow
                gradient
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </ModernButton>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.p 
            className="mt-6 text-center text-sm text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transitions.default, delay: 0.5 }}
          >
            Don&apos;t have an account?{' '}
            <motion.a 
              href="/register" 
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign up
            </motion.a>
          </motion.p>
        </div>
      </ModernCard>
    </PageTransition>
  )
}
