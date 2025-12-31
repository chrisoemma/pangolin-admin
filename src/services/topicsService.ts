import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Topic {
  id: number
  name: string
  subject_id: number
  description?: string
  created_at?: string
  updated_at?: string
}

export const topicsService = {
  getAll: (subjectId?: number): Promise<ApiResponse<Topic[]>> => {
    const url = subjectId ? `/admin/topics?subject_id=${subjectId}` : "/admin/topics"
    return apiClient.get<Topic[]>(url)
  },

  getById: (id: number | string): Promise<ApiResponse<Topic>> => {
    return apiClient.get<Topic>(`/admin/topics/${id}`)
  },

  create: (data: Partial<Topic>): Promise<ApiResponse<Topic>> => {
    return apiClient.post<Topic>("/admin/topics", data)
  },

  update: (id: number | string, data: Partial<Topic>): Promise<ApiResponse<Topic>> => {
    return apiClient.put<Topic>(`/admin/topics/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/topics/${id}`)
  },
}

