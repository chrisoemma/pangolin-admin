import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Venue {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export const venuesService = {
  getAll: (): Promise<ApiResponse<Venue[]>> => {
    return apiClient.get<Venue[]>("/admin/venues")
  },

  getById: (id: number | string): Promise<ApiResponse<Venue>> => {
    return apiClient.get<Venue>(`/admin/venues/${id}`)
  },

  create: (data: Partial<Venue>): Promise<ApiResponse<Venue>> => {
    return apiClient.post<Venue>("/admin/venues", data)
  },

  update: (id: number | string, data: Partial<Venue>): Promise<ApiResponse<Venue>> => {
    return apiClient.put<Venue>(`/admin/venues/${id}`, data)
  },

  delete: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/venues/${id}`)
  },
}
