import { apiClient, type ApiResponse } from "../lib/api-client"

export interface YearOfStudy {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export const yearOfStudyService = {
  getAll: (): Promise<ApiResponse<YearOfStudy[]>> => {
    return apiClient.get<YearOfStudy[]>("/admin/year-of-studies")
  },

  getById: (id: number | string): Promise<ApiResponse<YearOfStudy>> => {
    return apiClient.get<YearOfStudy>(`/admin/year-of-studies/${id}`)
  },

  create: (data: Partial<YearOfStudy>): Promise<ApiResponse<YearOfStudy>> => {
    return apiClient.post<YearOfStudy>("/admin/year-of-studies", data)
  },

  update: (id: number | string, data: Partial<YearOfStudy>): Promise<ApiResponse<YearOfStudy>> => {
    return apiClient.put<YearOfStudy>(`/admin/year-of-studies/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/year-of-studies/${id}`)
  },
}

