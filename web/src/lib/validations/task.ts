import { z } from 'zod'
import { TaskStatus } from '@/types'

// Task validation schemas that match backend DTOs exactly

// Create Task Schema - matches CreateTaskDto
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .trim(),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .trim(),
  
  status: z.nativeEnum(TaskStatus, {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid status value',
  }),
  
  assignedUser: z
    .string()
    .min(1, 'Assigned user is required')
    .trim(),
  
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((date) => {
      // Validate that it's a valid date string
      const parsedDate = new Date(date)
      return !isNaN(parsedDate.getTime())
    }, 'Invalid date format'),
})

// Update Task Schema - matches UpdateTaskDto (all fields optional)
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must not be empty')
    .trim()
    .optional(),
  
  description: z
    .string()
    .min(1, 'Description must not be empty')
    .trim()
    .optional(),
  
  status: z.nativeEnum(TaskStatus, {
    invalid_type_error: 'Invalid status value',
  }).optional(),
  
  assignedUser: z
    .string()
    .min(1, 'Assigned user must not be empty')
    .trim()
    .optional(),
  
  dueDate: z
    .string()
    .min(1, 'Due date must not be empty')
    .refine((date) => {
      // Validate that it's a valid date string
      const parsedDate = new Date(date)
      return !isNaN(parsedDate.getTime())
    }, 'Invalid date format')
    .optional(),
})

// Form validation schema (for UI forms)
export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
  
  status: z.nativeEnum(TaskStatus, {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid status value',
  }),
  
  assignedUser: z
    .string()
    .min(1, 'Assigned user is required'),
  
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((date) => {
      // Validate that it's a valid date string
      const parsedDate = new Date(date)
      return !isNaN(parsedDate.getTime())
    }, 'Invalid date format')
    .refine((date) => {
      // Validate that the date is not in the past
      const parsedDate = new Date(date)
      const now = new Date()
      return parsedDate >= now
    }, 'Due date must be in the future'),
})

// Type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskFormInput = z.infer<typeof taskFormSchema>
