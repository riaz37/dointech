'use client'

import { motion } from 'framer-motion'
import { AnimatedCard } from './AnimatedCard'
import { transitions } from '@/lib/theme'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'primary' | 'success' | 'warning' | 'error'
  delay?: number
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-50',
    icon: 'text-primary-600',
    accent: 'bg-primary-600',
  },
  success: {
    bg: 'bg-success-50',
    icon: 'text-success-600',
    accent: 'bg-success-600',
  },
  warning: {
    bg: 'bg-warning-50',
    icon: 'text-warning-600',
    accent: 'bg-warning-600',
  },
  error: {
    bg: 'bg-error-50',
    icon: 'text-error-600',
    accent: 'bg-error-600',
  },
}

export function AnimatedStatCard({ title, value, icon, color, delay = 0 }: StatCardProps) {
  const classes = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...transitions.default, delay }}
    >
      <AnimatedCard className="relative overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.p 
                className="text-sm font-medium text-secondary-600 mb-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transitions.default, delay: delay + 0.1 }}
              >
                {title}
              </motion.p>
              <motion.div
                className="text-3xl font-bold text-secondary-900"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...transitions.bounce, delay: delay + 0.2 }}
              >
                <CountUpAnimation value={value} delay={delay + 0.3} />
              </motion.div>
            </div>
            <motion.div
              className={`p-3 rounded-full ${classes.bg}`}
              initial={{ opacity: 0, rotate: -180, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ ...transitions.bounce, delay: delay + 0.4 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className={`w-6 h-6 ${classes.icon}`}>
                {icon}
              </div>
            </motion.div>
          </div>
          
          {/* Animated accent line */}
          <motion.div
            className={`h-1 ${classes.accent} rounded-full mt-4`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ ...transitions.default, delay: delay + 0.5 }}
          />
        </div>
        
        {/* Background decoration */}
        <motion.div
          className={`absolute top-0 right-0 w-32 h-32 ${classes.bg} rounded-full -translate-y-16 translate-x-16 opacity-20`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...transitions.default, delay: delay + 0.6 }}
        />
      </AnimatedCard>
    </motion.div>
  )
}

function CountUpAnimation({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.span
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ ...transitions.bounce, delay }}
      >
        <AnimatedNumber value={value} delay={delay} />
      </motion.span>
    </motion.span>
  )
}

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <motion.span
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ delay }}
      onAnimationComplete={() => {
        // Start counting animation
        const element = document.getElementById(`count-${delay}`)
        if (element) {
          let current = 0
          const increment = value / 30
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              element.textContent = value.toString()
              clearInterval(timer)
            } else {
              element.textContent = Math.floor(current).toString()
            }
          }, 50)
        }
      }}
    >
      <span id={`count-${delay}`}>0</span>
    </motion.span>
  )
}

export function AnimatedProgressBar({ 
  value, 
  max, 
  color = 'primary', 
  delay = 0,
  label 
}: { 
  value: number
  max: number
  color?: 'primary' | 'success' | 'warning' | 'error'
  delay?: number
  label?: string
}) {
  const percentage = Math.round((value / max) * 100)
  const classes = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transitions.default, delay }}
      className="space-y-2"
    >
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-secondary-700">{label}</span>
          <span className="text-sm text-secondary-500">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full ${classes.accent} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ ...transitions.default, delay: delay + 0.2, duration: 1 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: delay + 0.5,
              repeatDelay: 3,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
