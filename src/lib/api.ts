const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // 応募者関連API
  async getApplicants() {
    return this.request('/applicants')
  }

  async getApplicant(id: string) {
    return this.request(`/applicants/${id}`)
  }

  // イベント関連API
  async getEvents() {
    return this.request('/events')
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`)
  }

  // ヘルスチェック
  async healthCheck() {
    return this.request('/health')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
