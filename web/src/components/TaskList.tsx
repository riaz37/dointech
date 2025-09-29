'use client'

import React, { useState } from 'react'
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '@/types'
import { useTasks } from '@/hooks/useTasks'
import { TaskCard } from '@/components/TaskCard'
import { TaskForm } from '@/components/TaskForm'
import { TaskFilters } from '@/components/TaskFilters'
import { Button } from '@/components/ui/Button'
import { Plus, AlertCircle } from 'lucide-react'

export function TaskList() {
  const {
    tasks,
    loading,
    error,
    filters,
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
    refreshTasks,
  } = useTasks()

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    setFormLoading(true)
    try {
      await createTask(taskData)
      setShowForm(false)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateTask = async (taskData: UpdateTaskRequest) => {
    if (!editingTask) return
    
    setFormLoading(true)
    try {
      await updateTask(editingTask._id, taskData)
      setEditingTask(null)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTask(taskId, { status })
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(false)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const clearFilters = () => {
    updateFilters({})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refreshTasks}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Button
          onClick={() => setShowForm(true)}
          disabled={showForm || !!editingTask}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />

      {/* Task Form */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelForm}
          loading={formLoading}
        />
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No tasks found</p>
            <p>Create your first task to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
