import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Semester {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export const semestersService = {
  getAll: (): Promise<ApiResponse<Semester[]>> => {
    return apiClient.get<Semester[]>("/admin/semesters")
  },

  getById: (id: number | string): Promise<ApiResponse<Semester>> => {
    return apiClient.get<Semester>(`/admin/semesters/${id}`)
  },

  create: (data: Partial<Semester>): Promise<ApiResponse<Semester>> => {
    return apiClient.post<Semester>("/admin/semesters", data)
  },

  update: (id: number | string, data: Partial<Semester>): Promise<ApiResponse<Semester>> => {
    return apiClient.put<Semester>(`/admin/semesters/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/semesters/${id}`)
  },
}

