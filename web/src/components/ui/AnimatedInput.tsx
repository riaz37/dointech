'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { transitions } from '@/lib/theme'

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value.length > 0)
      props.onBlur?.(e)
    }

    return (
      <div className="relative w-full">
        <motion.div
          className="relative"
          initial={false}
          animate={{ 
            scale: isFocused ? 1.02 : 1,
          }}
          transition={transitions.fast}
        >
          {/* Input field */}
          <motion.input
            ref={ref}
            type={type}
            className={cn(
              'flex h-12 w-full rounded-lg border-2 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm transition-all duration-200',
              'placeholder:text-secondary-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              icon ? 'pl-12' : 'pl-4',
              label ? 'pt-6 pb-2' : 'py-3',
              error 
                ? 'border-error-300 focus:border-error-500 focus:ring-2 focus:ring-error-200' 
                : 'border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Animated icon */}
          {icon && (
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
              animate={{ 
                color: isFocused ? '#3b82f6' : '#94a3b8',
                scale: isFocused ? 1.1 : 1,
              }}
              transition={transitions.fast}
            >
              {icon}
            </motion.div>
          )}

          {/* Floating label */}
          {label && (
            <motion.label
              className="absolute left-4 text-secondary-500 pointer-events-none origin-left"
              animate={{
                y: isFocused || hasValue ? -8 : 6,
                scale: isFocused || hasValue ? 0.85 : 1,
                color: error ? '#ef4444' : isFocused ? '#3b82f6' : '#64748b',
              }}
              transition={transitions.fast}
            >
              {label}
            </motion.label>
          )}

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={false}
            animate={{
              boxShadow: isFocused 
                ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
                : '0 0 0 0px rgba(59, 130, 246, 0.1)',
            }}
            transition={transitions.fast}
          />
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: error ? 1 : 0, 
            y: error ? 0 : -10 
          }}
          transition={transitions.fast}
          className="mt-1"
        >
          {error && (
            <motion.p 
              className="text-sm text-error-600 flex items-center gap-1"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              transition={transitions.fast}
            >
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                ⚠️
              </motion.span>
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    )
  }
)

AnimatedInput.displayName = 'AnimatedInput'

export { AnimatedInput }
