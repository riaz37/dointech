// User types
export interface User {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Task types
export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUser: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  dueDate: string;
  createdBy: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  assignedUser: string;
  dueDate: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedUser?: string;
  dueDate?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  assignedUser?: string;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface TaskStats {
  [TaskStatus.PENDING]: number;
  [TaskStatus.IN_PROGRESS]: number;
  [TaskStatus.COMPLETED]: number;
  total: number;
}

// API Response types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
