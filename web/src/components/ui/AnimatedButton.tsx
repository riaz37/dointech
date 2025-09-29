'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { animations, transitions } from '@/lib/theme'

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading, 
    icon,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden'
    
    const variants = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25',
      secondary: 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-900 hover:from-secondary-200 hover:to-secondary-300 border border-secondary-300',
      danger: 'bg-gradient-to-r from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 shadow-lg shadow-error-500/25',
      outline: 'border-2 border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 hover:border-primary-400',
      ghost: 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 py-2 gap-2',
      lg: 'h-12 px-6 text-lg gap-2.5',
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        variants={animations.buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={transitions.smooth}
        disabled={disabled || loading}
        {...props}
      >
        {/* Background shimmer effect */}
        <motion.div
          className="absolute inset-0 -top-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 w-0"
          whileHover={{
            width: '100%',
            transition: { duration: 0.6, ease: 'easeOut' }
          }}
        />
        
        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitions.fast}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              variants={animations.loadingVariants}
              animate="animate"
            />
          </motion.div>
        )}
        
        {/* Content */}
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: loading ? 0 : 1 }}
          transition={transitions.fast}
        >
          {icon && (
            <motion.span
              className="flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={transitions.fast}
            >
              {icon}
            </motion.span>
          )}
          {children}
        </motion.div>
      </motion.button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

export { AnimatedButton }
