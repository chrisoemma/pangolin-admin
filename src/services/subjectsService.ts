import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Subject {
  id: number
  name: string
  department_id: number
  semester_id?: number
  year_of_study_id?: number
  code?: string
  description?: string
  created_at?: string
  updated_at?: string
  department?: {
    id: number
    name: string
    faculty_id: number
    created_by?: number | null
    updated_by?: number | null
    deleted_by?: number | null
    deleted_at?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  semester?: {
    id: number
    name: string
    created_at?: string | null
    updated_at?: string | null
  }
  year_of_study?: {
    id: number
    name: string
    created_at?: string | null
    updated_at?: string | null
  }
  topics?: Array<{
    id: number
    name: string
    subject_id: number
    created_at?: string | null
    updated_at?: string | null
    deleted_at?: string | null
  }>
}

export const subjectsService = {
  getAll: (departmentId?: number): Promise<ApiResponse<Subject[]>> => {
    const url = departmentId ? `/admin/subjects?department_id=${departmentId}` : "/admin/subjects"
    return apiClient.get<Subject[]>(url)
  },

  getById: (id: number | string): Promise<ApiResponse<Subject>> => {
    return apiClient.get<Subject>(`/admin/subjects/${id}`)
  },

  create: (data: Partial<Subject>): Promise<ApiResponse<Subject>> => {
    return apiClient.post<Subject>("/admin/subjects", data)
  },

  update: (id: number | string, data: Partial<Subject>): Promise<ApiResponse<Subject>> => {
    return apiClient.put<Subject>(`/admin/subjects/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/subjects/${id}`)
  },
}

