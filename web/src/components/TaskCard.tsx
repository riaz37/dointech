'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Task, TaskStatus } from '@/types'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { formatDate, getTaskStatusColor, isOverdue, getDaysUntilDue, getInitials } from '@/lib/utils'
import { Calendar, User, Edit3, Trash2, Clock, CheckCircle } from 'lucide-react'
import { animations, transitions } from '@/lib/theme'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  showActions?: boolean
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, showActions = true }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate)
  const daysUntil = getDaysUntilDue(task.dueDate)
  
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus !== task.status) {
      onStatusChange(task._id, newStatus)
    }
  }

  return (
    <AnimatedCard 
      className={`${overdue && task.status !== TaskStatus.COMPLETED ? 'border-error-300 bg-error-50/30' : ''}`}
      gradient={task.status === TaskStatus.COMPLETED}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.h3 
              className="text-lg font-semibold text-secondary-900 mb-2 flex items-center gap-2"
              layoutId={`task-title-${task._id}`}
            >
              {task.status === TaskStatus.COMPLETED && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={transitions.bounce}
                >
                  <CheckCircle className="w-5 h-5 text-success-600" />
                </motion.div>
              )}
              {task.title}
            </motion.h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTaskStatusColor(task.status)}`}>
                {task.status}
              </span>
              {overdue && task.status !== TaskStatus.COMPLETED && (
                <span className="inline-flex items-center text-red-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Overdue
                </span>
              )}
              {!overdue && task.status !== TaskStatus.COMPLETED && (
                <span className="inline-flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {daysUntil === 0 ? 'Due today' : `${daysUntil} days left`}
                </span>
              )}
            </div>
          </div>
          {showActions && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transitions.default, delay: 0.2 }}
            >
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={() => onEdit(task)}
                icon={<Edit3 className="w-4 h-4" />}
              />
              <AnimatedButton
                variant="danger"
                size="sm"
                onClick={() => onDelete(task._id)}
                icon={<Trash2 className="w-4 h-4" />}
              />
            </motion.div>
          )}
        </div>

        <motion.p 
          className="text-secondary-700 mb-4 line-clamp-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transitions.default, delay: 0.1 }}
        >
          {task.description}
        </motion.p>

        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {getInitials(task.assignedUser.firstName, task.assignedUser.lastName)}
                </div>
                <span>{task.assignedUser.firstName} {task.assignedUser.lastName}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </div>

          {showActions && (
            <motion.div 
              className="flex items-center gap-2 pt-4 border-t border-secondary-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transitions.default, delay: 0.3 }}
            >
              <span className="text-sm text-secondary-600 mr-2">Status:</span>
              <div className="flex gap-1">
                {Object.values(TaskStatus).map((status, index) => (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...transitions.default, delay: 0.4 + (index * 0.1) }}
                  >
                    <AnimatedButton
                      variant={task.status === status ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handleStatusChange(status)}
                      className="text-xs"
                    >
                      {status}
                    </AnimatedButton>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedCard>
  )
}
