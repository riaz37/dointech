'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskStatus } from '@/types'
import { useUsers } from '@/hooks/useTasks'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { Select } from '@/components/ui/Select'
import { formatDateInput } from '@/lib/utils'
import { taskFormSchema, TaskFormInput } from '@/lib/validations/task'
import { TaskFormProps } from '@/types/components'

export function TaskForm({ task, onSubmit, onCancel, loading = false }: TaskFormProps) {
  const { users, loading: usersLoading } = useUsers()
  const [submitError, setSubmitError] = useState<string | null>(null)



  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || TaskStatus.PENDING,
      assignedUser: task?.assignedUser?._id || '',
      dueDate: task?.dueDate ? formatDateInput(task.dueDate) : formatDateInput(new Date()),
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
    }
  }, [task, reset])

  const onFormSubmit = async (data: TaskFormInput) => {
    try {
      setSubmitError(null)
      await onSubmit(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      setSubmitError(err.response?.data?.message || 'An error occurred')
    }
  }

  const statusOptions = Object.values(TaskStatus).map(status => ({
    value: status,
    label: status,
  }))

  const userOptions = users.map(user => ({
    value: user._id,
    label: user.username || 'No Username',
  }))

  return (
    <div className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <ModernInput
          label="Title"
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
          placeholder="Enter task title"
          glow
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="flex w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
            placeholder="Enter task description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
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

        <ModernInput
          label="Due Date"
          type="datetime-local"
          {...register('dueDate', { required: 'Due date is required' })}
          error={errors.dueDate?.message}
          glow
        />

        <div className="flex items-center gap-4 pt-6">
          <ModernButton
            type="submit"
            loading={loading}
            disabled={loading}
            glow
            gradient
            size="lg"
          >
            {task ? 'Update Task' : 'Create Task'}
          </ModernButton>
          <ModernButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            glow
            size="lg"
          >
            Cancel
          </ModernButton>
        </div>
      </form>
    </div>
  )
}
