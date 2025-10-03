'use client'

import { motion } from 'framer-motion'
import { animations, transitions } from '@/lib/theme'
import { PageTransitionProps } from '@/types/components'

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      variants={animations.pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={transitions.default}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <motion.div
      className={className}
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ 
  children, 
  className,
  delay = 0 
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      variants={animations.itemVariants}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}
