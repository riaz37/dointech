'use client'

import React from 'react'
import { ModernCard } from '@/components/ui/ModernCard'
import { ModernButton } from '@/components/ui/ModernButton'
import { CheckCircle, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react'
import { ModernTaskCardProps } from '@/types/components'

export function ModernTaskCard({ task, onUpdate, onDelete }: ModernTaskCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }


  return (
    <ModernCard hover glow className="group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-slate-300 text-sm line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(task.status)}
            <span className="text-sm text-slate-400">
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="mb-4">
            <span className="text-xs text-slate-400">Due:</span>
            <span className="text-sm text-slate-300 ml-1">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2">
          <ModernButton
            variant="ghost"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => onUpdate(task)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Edit
          </ModernButton>
          <ModernButton
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(task._id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </ModernButton>
        </div>
      </div>
    </ModernCard>
  )
}
