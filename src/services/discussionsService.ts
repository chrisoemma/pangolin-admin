import { apiClient, type ApiResponse } from "../lib/api-client"

export interface DiscussionSession {
  id?: number
  date: string // Format: "YYYY-MM-DD"
  start_time: string // Format: "HH:mm"
  end_time: string // Format: "HH:mm"
  venue_id?: number | null
  venue?: {
    id: number
    name: string
    description?: string | null
  } | null
}

export interface DiscussionSubtopic {
  id: number
  name: string
  description?: string
  order: number
  is_covered: boolean
}

export interface Discussion {
  id: string
  title: string
  professor: string
  topic: string
  subject?: string
  year?: string
  department?: string
  faculty?: string
  description?: string
  schedule: string
  startDate: string
  endDate: string
  maxStudents: number
  enrolledStudents: number
  price: number
  status: 'draft' | 'published' | 'archived' | 'completed'
  createdAt: string
  updatedAt?: string
  subtopics?: DiscussionSubtopic[]
  sessions?: DiscussionSession[]
}

// Backend returns { success: true, data: Discussion[], pagination: {...} }
// ApiClient spreads this, so response will have: { status: true, data: Discussion[], pagination: {...} }

export interface CreateDiscussionData {
  title: string
  description?: string
  tutor_id: number
  max_students: number
  price: number
  status: 'draft' | 'published' | 'archived' | 'completed'
  topic_id?: number
  new_topic?: {
    name: string
    subject_id: number
    description?: string
  }
  subtopics?: Array<{
    id?: number
    name?: string
    description?: string
  }>
  sessions?: Array<{
    date: string // Format: "YYYY-MM-DD"
    start_time: string // Format: "HH:mm"
    end_time: string // Format: "HH:mm"
    venue_id?: number | null
  }>
}

export const discussionsService = {
  // Admin index - get all discussions for admin panel
  getAll: (params?: {
    search?: string
    status?: string
    tutor_id?: number
    topic_id?: number
    per_page?: number
    page?: number
  }): Promise<ApiResponse<Discussion[]>> => {
    let url = "/admin/discussions/"
    const queryParams: string[] = []
    if (params?.search) queryParams.push(`search=${encodeURIComponent(params.search)}`)
    if (params?.status) queryParams.push(`status=${params.status}`)
    if (params?.tutor_id) queryParams.push(`tutor_id=${params.tutor_id}`)
    if (params?.topic_id) queryParams.push(`topic_id=${params.topic_id}`)
    if (params?.per_page) queryParams.push(`per_page=${params.per_page}`)
    if (params?.page) queryParams.push(`page=${params.page}`)
    if (queryParams.length > 0) url += `?${queryParams.join("&")}`
    return apiClient.get<Discussion[]>(url)
  },

  // Get single discussion for admin
  getById: (id: string | number): Promise<ApiResponse<Discussion>> => {
    return apiClient.get<Discussion>(`/admin/discussions/${id}`)
  },

  // Create discussion
  create: (data: CreateDiscussionData): Promise<ApiResponse<Discussion>> => {
    return apiClient.post<Discussion>("/admin/discussions", data)
  },

  // Update discussion
  update: (id: string | number, data: Partial<CreateDiscussionData>): Promise<ApiResponse<Discussion>> => {
    return apiClient.put<Discussion>(`/admin/discussions/${id}`, data)
  },

  // Delete discussion
  delete: (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/discussions/${id}`)
  },

  // Update status
  updateStatus: (id: string | number, status: 'draft' | 'published' | 'archived' | 'completed'): Promise<ApiResponse<{ status: string }>> => {
    return apiClient.patch<{ status: string }>(`/admin/discussions/${id}/status`, { status })
  },

  // Get enrolled students for a discussion
  getEnrollments: (id: string | number): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>(`/admin/discussions/${id}/enrollments`)
  },

  // Enroll students in a discussion
  enrollStudents: (id: string | number, studentIds: number[]): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/admin/discussions/${id}/enrollments`, { student_ids: studentIds })
  },
}

