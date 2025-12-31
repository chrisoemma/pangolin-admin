import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Department {
  id: number
  name: string
  faculty_id: number
  description?: string
  created_at?: string
  updated_at?: string
  faculty?: {
    id: number
    name: string
    created_at?: string | null
    updated_at?: string | null
  }
}

export const departmentsService = {
  getAll: (facultyId?: number): Promise<ApiResponse<Department[]>> => {
    const url = facultyId ? `/admin/departments?faculty_id=${facultyId}` : "/admin/departments"
    return apiClient.get<Department[]>(url)
  },

  getById: (id: number | string): Promise<ApiResponse<Department>> => {
    return apiClient.get<Department>(`/admin/departments/${id}`)
  },

  create: (data: Partial<Department>): Promise<ApiResponse<Department>> => {
    return apiClient.post<Department>("/admin/departments", data)
  },

  update: (id: number | string, data: Partial<Department>): Promise<ApiResponse<Department>> => {
    return apiClient.put<Department>(`/admin/departments/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/departments/${id}`)
  },
}

