import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Student {
  id: number
  first_name: string
  last_name?: string | null
  full_name: string
  email: string
  phone?: string | null
  status: string
  faculty?: {
    id: number
    name: string
  } | null
  user?: {
    id: number
    status: string
    email_verified: boolean
    phone_verified: boolean
    email_verified_at: string | null
    phone_verified_at: string | null
  } | null
  created_at?: string
  updated_at?: string
  // For backward compatibility with existing code
  enrolledAt?: string
  name?: string
}

export interface StudentsResponse {
  students?: Student[]
  total?: number
  page?: number
  per_page?: number
}

export const studentsService = {
  getAll: (): Promise<ApiResponse<StudentsResponse | Student[]>> => {
    return apiClient.get<StudentsResponse | Student[]>("/students")
  },

  getById: (id: number): Promise<ApiResponse<Student>> => {
    return apiClient.get<Student>(`/students/${id}`)
  },
}

