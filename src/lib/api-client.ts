// src/lib/apiClient.ts

const getApiUrl = () => {
  // Production
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_API_URL ||
      "https://pro-api.pangolinelearning.com/api/v1"
    )
  }

  // Development
  return import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
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

  /* =========================
     Token helpers
  ========================= */

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  setToken(token: string): void {
    if (typeof window === "undefined") return

    localStorage.setItem("auth_token", token)

    // 30 days expiry
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000
    localStorage.setItem("auth_token_expires", expiresAt.toString())
  }

  getToken(): string | null {
    return this.getStoredToken()
  }

  removeToken(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_token_expires")
    localStorage.removeItem("auth_user")
  }

  isTokenExpired(): boolean {
    if (typeof window === "undefined") return true

    const expiresAt = localStorage.getItem("auth_token_expires")
    if (!expiresAt) return true

    return Date.now() > Number(expiresAt)
  }

  /* =========================
     User helpers
  ========================= */

  setUserData(user: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(user))
    }
  }

  getUserData(): any | null {
    if (typeof window === "undefined") return null

    const raw = localStorage.getItem("auth_user")
    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  /* =========================
     Core request handler
  ========================= */

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getStoredToken()
    const url = `${this.baseURL}${endpoint}`

    const isFormData = options.body instanceof FormData

    const headers: HeadersInit = {
      Accept: "application/json",
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        // 🚫 NO credentials: 'include'
      })

      const contentType = response.headers.get("content-type")
      const data =
        contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text()

      if (!response.ok) {
        return {
          status: false,
          message: data?.message || "An error occurred",
          errors: data?.errors,
          error: data?.error || "REQUEST_FAILED",
        }
      }

      return {
        status: true,
        message: data?.message || "Success",
        ...data,
      }
    } catch (error) {
      return {
        status: false,
        message:
          error instanceof Error
            ? error.message
            : "Network error occurred",
        error:
          error instanceof Error ? error.message : "NETWORK_ERROR",
      }
    }
  }

  /* =========================
     HTTP methods
  ========================= */

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const body =
      data instanceof FormData
        ? data
        : data
        ? JSON.stringify(data)
        : undefined

    return this.request<T>(endpoint, {
      method: "POST",
      body,
    })
  }

  put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const body =
      data instanceof FormData
        ? data
        : data
        ? JSON.stringify(data)
        : undefined

    return this.request<T>(endpoint, {
      method: "PUT",
      body,
    })
  }

  patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
