'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '@/types'
import { useUsers } from '@/hooks/useTasks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { formatDateInput } from '@/lib/utils'

interface TaskFormProps {
  task?: Task | null
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  assignedUser: string
  dueDate: string
}

export function TaskForm({ task, onSubmit, onCancel, loading = false }: TaskFormProps) {
  const { users, loading: usersLoading } = useUsers()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      assignedUser: '',
      dueDate: '',
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        assignedUser: task.assignedUser._id,
        dueDate: formatDateInput(task.dueDate),
      })
    } else {
      reset({
        title: '',
        description: '',
        status: TaskStatus.PENDING,
        assignedUser: '',
        dueDate: formatDateInput(new Date()),
      })
    }
  }, [task, reset])

  const onFormSubmit = async (data: TaskFormData) => {
    try {
      setSubmitError(null)
      await onSubmit(data)
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'An error occurred')
    }
  }

  const statusOptions = Object.values(TaskStatus).map(status => ({
    value: status,
    label: status,
  }))

  const userOptions = users.map(user => ({
    value: user._id,
    label: `${user.firstName} ${user.lastName} (${user.username})`,
  }))

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="Title"
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
          placeholder="Enter task title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
            placeholder="Enter task description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Status"
            {...register('status', { required: 'Status is required' })}
            options={statusOptions}
            error={errors.status?.message}
          />

          <Select
            label="Assigned User"
            {...register('assignedUser', { required: 'Assigned user is required' })}
            options={userOptions}
            error={errors.assignedUser?.message}
            disabled={usersLoading}
          />
        </div>

        <Input
          label="Due Date"
          type="datetime-local"
          {...register('dueDate', { required: 'Due date is required' })}
          error={errors.dueDate?.message}
        />

        <div className="flex items-center gap-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
