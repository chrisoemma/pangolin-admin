import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Faculty {
  id: number
  name: string
  university_id?: number
  description?: string
  created_at?: string
  updated_at?: string
}

export const facultiesService = {
  getAll: (): Promise<ApiResponse<Faculty[]>> => {
    return apiClient.get<Faculty[]>("/admin/faculties")
  },

  getById: (id: number | string): Promise<ApiResponse<Faculty>> => {
    return apiClient.get<Faculty>(`/admin/faculties/${id}`)
  },

  create: (data: Partial<Faculty>): Promise<ApiResponse<Faculty>> => {
    return apiClient.post<Faculty>("/admin/faculties", data)
  },

  update: (id: number | string, data: Partial<Faculty>): Promise<ApiResponse<Faculty>> => {
    return apiClient.put<Faculty>(`/admin/faculties/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/faculties/${id}`)
  },
}

