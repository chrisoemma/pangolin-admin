import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Author {
  id: number
  name: string
  email?: string | null
  bio?: string | null
  created_at?: string
  updated_at?: string
  // Allow additional backend fields without breaking the UI
  [key: string]: any
}

export const authorsService = {
  getAll: (): Promise<ApiResponse<Author[]>> => {
    return apiClient.get<Author[]>("/admin/authors")
  },

  getById: (id: number | string): Promise<ApiResponse<Author>> => {
    return apiClient.get<Author>(`/admin/authors/${id}`)
  },

  create: (data: Partial<Author>): Promise<ApiResponse<Author>> => {
    return apiClient.post<Author>("/admin/authors", data)
  },

  update: (id: number | string, data: Partial<Author>): Promise<ApiResponse<Author>> => {
    return apiClient.put<Author>(`/admin/authors/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/authors/${id}`)
  },
}


