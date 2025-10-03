import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters as ITaskFilters, TaskStatus } from './index'

// TaskForm component interfaces
export interface TaskFormProps {
  task?: Task | null
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

// TaskCard component interfaces
export interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  showActions?: boolean
}

// ModernTaskCard component interfaces
export interface ModernTaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

// TaskFilters component interfaces
export interface TaskFiltersProps {
  filters: ITaskFilters
  onFiltersChange: (filters: ITaskFilters) => void
  onClearFilters: () => void
}

// ModernLayout component interfaces
export interface ModernLayoutProps {
  children: React.ReactNode
}

// PageTransition component interfaces
export interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}
