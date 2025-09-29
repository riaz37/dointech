'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { LoginRequest } from '@/types'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { AnimatedInput } from '@/components/ui/AnimatedInput'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <AnimatedCard className="w-full max-w-md mx-auto" gradient>
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
            <h1 className="text-2xl font-bold text-secondary-900">Welcome Back</h1>
            <p className="text-secondary-600 mt-2">Sign in to your account</p>
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
              <AnimatedInput
                label="Username"
                icon={<User className="w-4 h-4" />}
                {...register('username', { required: 'Username is required' })}
                error={errors.username?.message}
                placeholder="Enter your username"
              />
            </motion.div>

            <motion.div variants={animations.itemVariants}>
              <AnimatedInput
                label="Password"
                type="password"
                icon={<Lock className="w-4 h-4" />}
                {...register('password', { required: 'Password is required' })}
                error={errors.password?.message}
                placeholder="Enter your password"
              />
            </motion.div>

            <motion.div variants={animations.itemVariants}>
              <AnimatedButton
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
                icon={<LogIn className="w-4 h-4" />}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </AnimatedButton>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.p 
            className="mt-6 text-center text-sm text-secondary-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transitions.default, delay: 0.5 }}
          >
            Don't have an account?{' '}
            <motion.a 
              href="/register" 
              className="text-primary-600 font-medium hover:text-primary-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign up
            </motion.a>
          </motion.p>
        </div>
      </AnimatedCard>
    </PageTransition>
  )
}
