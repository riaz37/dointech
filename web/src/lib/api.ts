import axios, { AxiosInstance, AxiosError } from 'axios'
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  TaskStats,
  ApiError 
} from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          this.clearToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )

    // Warm up the backend on initialization
    this.warmUpBackend()
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  // Health check method
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get<{ status: string; timestamp: string }>('/health')
    return response.data
  }

  // Warm up backend to prevent cold start delays
  private async warmUpBackend(): Promise<void> {
    try {
      // Only warm up in production
      if (process.env.NODE_ENV === 'production') {
        console.log('🔥 Warming up backend...')
        await this.checkHealth()
        console.log('✅ Backend warmed up successfully')
      }
    } catch (error) {
      console.warn('⚠️ Backend warm-up failed:', error)
      // Don't throw error, just log it
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', credentials)
    this.setToken(response.data.accessToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await this.client.post<User>('/auth/register', userData)
    return response.data
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/auth/profile')
    return response.data
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.client.get<User[]>('/auth/users')
    return response.data
  }

  logout(): void {
    this.clearToken()
  }

  // Task endpoints
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value))
        }
      })
    }

    const response = await this.client.get<Task[]>(`/tasks?${params.toString()}`)
    return response.data
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.client.get<Task>(`/tasks/${id}`)
    return response.data
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await this.client.post<Task>('/tasks', taskData)
    return response.data
  }

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await this.client.patch<Task>(`/tasks/${id}`, taskData)
    return response.data
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(`/tasks/${id}`)
    return response.data
  }

  async getTaskStats(userId?: string): Promise<TaskStats> {
    const params = userId ? `?userId=${userId}` : ''
    const response = await this.client.get<TaskStats>(`/tasks/stats${params}`)
    return response.data
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  // Helper method to get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }
}

export const apiClient = new ApiClient()
export default apiClient
