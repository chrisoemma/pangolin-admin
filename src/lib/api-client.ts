// Determine API URL based on environment
const getApiUrl = () => {
  // Check if we're in production
  if (import.meta.env.PROD) {
    // In production, use the production API
    return import.meta.env.VITE_API_URL || "https://pro-api.pangolinelearning.com/api/v1"
  }
  // In development, use localhost or env variable
  return import.meta.env.VITE_API_URL || "http://localhost:8000"
}

const API_URL = getApiUrl()

export interface ApiResponse<T = any> {
  status: boolean
  message: string
  data?: T
  token?: string
  errors?: Record<string, string[]>
  error?: string
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_URL
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  // Token management methods
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
      const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      localStorage.setItem("auth_token_expires", expirationTime.toString())
    }
  }

  getToken(): string | null {
    return this.getStoredToken()
  }

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_token_expires")
      localStorage.removeItem("auth_user")
    }
  }

  isTokenExpired(): boolean {
    if (typeof window === "undefined") return true
    const expirationTime = localStorage.getItem("auth_token_expires")
    if (!expirationTime) return true
    return Date.now() > parseInt(expirationTime, 10)
  }

  setUserData(user: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(user))
    }
  }

  getUserData(): any | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("auth_user")
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getStoredToken()
    const url = `${this.baseURL}${endpoint}`

    // Don't set Content-Type for FormData - browser will set it with boundary
    const isFormData = options.body instanceof FormData
    
    const headers: HeadersInit = {
      ...(!isFormData && { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include credentials (cookies) for CORS
        mode: 'cors', // Explicitly set CORS mode
      })

      // Handle CORS errors - if response is not ok and status is 0, it's likely a CORS issue
      if (!response.ok && response.status === 0) {
        return {
          status: false,
          message: "CORS Error: Unable to connect to the API server. Please check your backend CORS configuration.",
          error: "CORS_ERROR",
        }
      }

      // Try to parse JSON, but handle cases where response might not be JSON
      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // If not JSON, try to get text
        const text = await response.text()
        try {
          data = JSON.parse(text)
        } catch {
          return {
            status: false,
            message: text || "An error occurred",
            error: "INVALID_RESPONSE",
          }
        }
      }

      if (!response.ok) {
        return {
          status: false,
          message: data.message || "An error occurred",
          errors: data.errors,
          error: data.error,
        }
      }

      return {
        status: true,
        message: data.message || "Success",
        ...data,
      }
    } catch (error) {
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          status: false,
          message: "CORS Error: Unable to connect to the API server. Please ensure the backend allows requests from this domain.",
          error: "CORS_ERROR",
        }
      }
      
      return {
        status: false,
        message: error instanceof Error ? error.message : "Network error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Generic methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined)
    return this.request<T>(endpoint, {
      method: "POST",
      body,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined)
    return this.request<T>(endpoint, {
      method: "PUT",
      body,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()

