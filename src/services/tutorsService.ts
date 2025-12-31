import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Tutor {
  id: number
  name: string
  email?: string
  phone?: string
  profile_image?: string
  created_at?: string
  updated_at?: string
}

export const tutorsService = {
  getAll: (): Promise<ApiResponse<Tutor[]>> => {
    return apiClient.get<Tutor[]>("/admin/tutors")
  },

  getById: (id: number | string): Promise<ApiResponse<Tutor>> => {
    return apiClient.get<Tutor>(`/admin/tutors/${id}`)
  },

  create: (data: Partial<Tutor>): Promise<ApiResponse<Tutor>> => {
    return apiClient.post<Tutor>("/admin/tutors", data)
  },

  update: (id: number | string, data: Partial<Tutor>): Promise<ApiResponse<Tutor>> => {
    return apiClient.put<Tutor>(`/admin/tutors/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/tutors/${id}`)
  },
}

