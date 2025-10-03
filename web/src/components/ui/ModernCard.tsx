'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ModernCardProps } from '@/types/ui'

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, children, hover = true, glow = false, gradient = false }, ref) => {
    const baseClasses = 'rounded-xl border border-white/20 bg-white/10 backdrop-blur-md relative overflow-hidden shadow-2xl'
    const cursorClasses = hover ? 'cursor-pointer' : ''
    
    const glowClasses = glow ? 'glow' : ''
    const gradientClasses = gradient 
      ? 'bg-gradient-to-br from-white/20 via-blue-500/10 to-purple-500/10 border-white/30' 
      : ''

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, cursorClasses, glowClasses, gradientClasses, className)}
        whileHover={hover ? { 
          scale: 1.02, 
          y: -4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        } : undefined}
        whileTap={hover ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {gradient && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    )
  }
)

ModernCard.displayName = 'ModernCard'

// Card sub-components
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-300", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { ModernCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
