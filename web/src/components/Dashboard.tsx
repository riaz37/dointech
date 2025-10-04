'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTaskStats, useTasks } from '@/hooks/useTasks'
import { useAuth } from '@/hooks/useAuth'
import { TaskStatus, Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '@/types'
import { ModernCard, CardContent, CardHeader, CardTitle } from '@/components/ui/ModernCard'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { Select } from '@/components/ui/Select'
import { TaskForm } from '@/components/TaskForm'
import { CheckCircle, Clock, AlertCircle, BarChart3, Plus, X, Filter } from 'lucide-react'

export function Dashboard() {
  const { user } = useAuth()
  const { stats, loading, error } = useTaskStats(user?._id)
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<TaskFilters>({
    status: undefined,
    dueDateFrom: '',
    dueDateTo: '',
  })

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      await createTask(taskData)
      setShowTaskForm(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleUpdateTask = async (taskData: UpdateTaskRequest) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData)
        setEditingTask(null)
        setShowTaskForm(false)
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleCancelForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  // Filter tasks based on current filters and search
  const filteredTasks = useMemo(() => {
    if (!tasks) return []

    return tasks.filter(task => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesSearch = 
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search) ||
          task.assignedUser.firstName.toLowerCase().includes(search) ||
          task.assignedUser.lastName.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status && task.status !== filters.status) {
        return false
      }

      // Date range filters
      if (filters.dueDateFrom) {
        const taskDate = new Date(task.dueDate)
        const fromDate = new Date(filters.dueDateFrom)
        if (taskDate < fromDate) return false
      }

      if (filters.dueDateTo) {
        const taskDate = new Date(task.dueDate)
        const toDate = new Date(filters.dueDateTo)
        if (taskDate > toDate) return false
      }

      return true
    })
  }, [tasks, searchTerm, filters])

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      status: undefined,
      dueDateFrom: '',
      dueDateTo: '',
    })
  }

  const hasActiveFilters = searchTerm || Object.values(filters).some(value => value !== undefined && value !== '')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-slate-300">{error || 'Failed to load statistics'}</p>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending',
      value: stats[TaskStatus.PENDING],
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'In Progress',
      value: stats[TaskStatus.IN_PROGRESS],
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed',
      value: stats[TaskStatus.COMPLETED],
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header with Action Buttons */}
      <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm text-white p-6 rounded-xl border border-white/20 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-blue-100">
            Here&apos;s an overview of your task management activity
          </p>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-xl border border-white/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <ModernButton
                onClick={handleCancelForm}
                variant="ghost"
                size="sm"
                icon={<X className="w-4 h-4" />}
              />
            </div>
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? 
                (data: CreateTaskRequest | UpdateTaskRequest) => handleUpdateTask(data as UpdateTaskRequest) :
                (data: CreateTaskRequest | UpdateTaskRequest) => handleCreateTask(data as CreateTaskRequest)
              }
              onCancel={handleCancelForm}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <ModernCard key={stat.title} hover glow>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor} backdrop-blur-sm`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </ModernCard>
          )
        })}
      </div>

      {/* Task List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
            </div>

            {/* Always Visible Search Bar */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 max-w-md">
                <ModernInput
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  glow
                />
              </div>
              <div className="flex gap-2">
                <ModernButton
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<Filter className="w-4 h-4" />}
                  size="sm"
                  variant="secondary"
                  glow
                >
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </ModernButton>
                <ModernButton
                  onClick={() => setShowTaskForm(true)}
                  icon={<Plus className="w-4 h-4" />}
                  size="sm"
                  glow
                  gradient
                >
                  Add Task
                </ModernButton>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <Select
                  label="Status"
                  options={[
                    { value: '', label: 'All Statuses' },
                    ...Object.values(TaskStatus).map(status => ({
                      value: status,
                      label: status,
                    })),
                  ]}
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                />

                {/* Due Date From */}
                <ModernInput
                  label="From Date"
                  type="date"
                  value={filters.dueDateFrom || ''}
                  onChange={(e) => handleFilterChange('dueDateFrom', e.target.value)}
                  glow
                />

                {/* Due Date To */}
                <ModernInput
                  label="To Date"
                  type="date"
                  value={filters.dueDateTo || ''}
                  onChange={(e) => handleFilterChange('dueDateTo', e.target.value)}
                  glow
                />
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <ModernButton
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                  >
                    Clear All Filters
                  </ModernButton>
                </div>
              )}
            </motion.div>
          )}
          {/* Task Count */}
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>
              Showing {filteredTasks.length} of {tasks?.length || 0} tasks
              {(searchTerm || Object.values(filters).some(v => v)) && ' (filtered)'}
            </span>
            {(searchTerm || Object.values(filters).some(v => v)) && (
              <span className="text-blue-400">
                {filteredTasks.length === 0 ? 'No tasks match your search/filters' : 'Filtered results'}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.slice(0, 10).map((task) => (
                <ModernCard key={task._id} hover glow>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                        <p className="text-sm text-slate-300 mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className={`px-2 py-1 rounded-full ${
                            task.status === TaskStatus.COMPLETED ? 'bg-green-500/20 text-green-400' :
                            task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {task.status}
                          </span>
                          {task.assignedUser && (
                            <span>Assigned to: {task.assignedUser.firstName} {task.assignedUser.lastName}</span>
                          )}
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ModernButton
                          onClick={() => handleEditTask(task)}
                          size="sm"
                          variant="secondary"
                        >
                          Edit
                        </ModernButton>
                        <ModernButton
                          onClick={() => handleDeleteTask(task._id)}
                          size="sm"
                          variant="danger"
                        >
                          Delete
                        </ModernButton>
                      </div>
                    </div>
                  </CardContent>
                </ModernCard>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">
                  {(searchTerm || Object.values(filters).some(v => v))
                    ? 'No tasks match your search/filters' 
                    : 'No tasks found. Create your first task!'
                  }
                </p>
                {(searchTerm || Object.values(filters).some(v => v)) && (
                  <button 
                    onClick={clearFilters}
                    className="text-blue-400 hover:text-blue-300 mt-2 cursor-pointer"
                  >
                    Clear search & filters
                  </button>
                )}
              </div>
            )}
            {filteredTasks && filteredTasks.length > 10 && (
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Showing 10 of {filteredTasks.length} filtered tasks. 
                  <button 
                    onClick={() => window.location.href = '/tasks'}
                    className="text-blue-400 hover:text-blue-300 ml-1 cursor-pointer"
                  >
                    View all tasks
                  </button>
                </p>
              </div>
            )}
          </div>
        </motion.div>
    </div>
  )
}
