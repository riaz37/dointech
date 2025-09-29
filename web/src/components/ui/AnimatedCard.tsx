'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { animations, transitions } from '@/lib/theme'

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  gradient?: boolean
  delay?: number
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, hover = true, gradient = false, delay = 0, ...props }, ref) => {
    const baseClasses = 'rounded-xl border border-secondary-200 bg-white/80 backdrop-blur-sm relative overflow-hidden'
    
    const gradientClasses = gradient 
      ? 'bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 border-primary-200/50' 
      : ''

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, gradientClasses, className)}
        variants={hover ? animations.cardVariants : undefined}
        initial="rest"
        whileHover={hover ? "hover" : undefined}
        whileTap={hover ? "tap" : undefined}
        transition={transitions.smooth}
        style={{ 
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
        }}
        {...props}
      >
        {/* Gradient overlay on hover */}
        {hover && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={transitions.default}
          />
        )}
        
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
            backgroundSize: '200% 1px',
            backgroundPosition: '-100% 0',
            backgroundRepeat: 'no-repeat',
          }}
          whileHover={{
            opacity: 1,
            backgroundPosition: '100% 0',
            transition: { duration: 0.8, ease: 'easeOut' }
          }}
        />
        
        {/* Content with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            ...transitions.default, 
            delay: delay * 0.1 
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    )
  }
)

AnimatedCard.displayName = 'AnimatedCard'

export { AnimatedCard }
