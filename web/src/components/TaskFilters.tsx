'use client'

import React from 'react'
import { TaskStatus, TaskFilters as ITaskFilters } from '@/types'
import { useUsers } from '@/hooks/useTasks'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { Select } from '@/components/ui/Select'
import { Search, Filter, X } from 'lucide-react'
import { TaskFiltersProps } from '@/types/components'

export function TaskFilters({ filters, onFiltersChange, onClearFilters }: TaskFiltersProps) {
  const { users } = useUsers()

  const handleFilterChange = (key: keyof ITaskFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    })
  }

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.values(TaskStatus).map(status => ({
      value: status,
      label: status,
    })),
  ]

  const userOptions = [
    { value: '', label: 'All Users' },
    ...users.map(user => ({
      value: user._id,
      label: `${user.firstName} ${user.lastName}`,
    })),
  ]

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <ModernButton
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </ModernButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <ModernInput
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
            glow
          />
        </div>

        <Select
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full"
        />

        <Select
          options={userOptions}
          value={filters.assignedUser || ''}
          onChange={(e) => handleFilterChange('assignedUser', e.target.value)}
          className="w-full"
        />

        <div className="flex gap-2">
          <ModernInput
            type="date"
            placeholder="From date"
            value={filters.dueDateFrom ? filters.dueDateFrom.split('T')[0] : ''}
            onChange={(e) => handleFilterChange('dueDateFrom', e.target.value ? `${e.target.value}T00:00:00` : '')}
            className="flex-1"
            glow
          />
          <ModernInput
            type="date"
            placeholder="To date"
            value={filters.dueDateTo ? filters.dueDateTo.split('T')[0] : ''}
            onChange={(e) => handleFilterChange('dueDateTo', e.target.value ? `${e.target.value}T23:59:59` : '')}
            className="flex-1"
            glow
          />
        </div>
      </div>
    </div>
  )
}
