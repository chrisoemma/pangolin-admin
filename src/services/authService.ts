import { apiClient, type ApiResponse } from "../lib/api-client"

export interface LoginData {
  email: string
  password: string
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  isActive: boolean
}

export interface AuthResponse {
  user: AdminUser
  token: string
}

export const authService = {
  login: (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>("/auth/admin/login", data)
  },

  logout: (): Promise<ApiResponse> => {
    return apiClient.post("/auth/logout")
  },
}

