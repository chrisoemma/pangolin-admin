import { apiClient, type ApiResponse } from "../lib/api-client"

export interface Faculty {
  id: number
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface Department {
  id: number
  name: string
  faculty_id: number
  faculty?: Faculty
  description?: string
  created_at?: string
  updated_at?: string
}

export interface YearOfStudy {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface Subject {
  id: number
  name: string
  department_id: number
  department?: Department
  year_of_study_id?: number
  yearOfStudy?: YearOfStudy
  description?: string
  created_at?: string
  updated_at?: string
}

export interface Topic {
  id: number
  name: string
  subject_id: number
  subject?: Subject
  description?: string
  created_at?: string
  updated_at?: string
}

export interface Subtopic {
  id: number
  name: string
  topic_id: number
  topic?: Topic
  description?: string
  order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export const masterDataService = {
  // Faculties
  getFaculties: (): Promise<ApiResponse<Faculty[]>> => {
    return apiClient.get<Faculty[]>("/admin/faculties")
  },

  // Departments
  getDepartments: (facultyId?: number): Promise<ApiResponse<Department[]>> => {
    const url = facultyId ? `/admin/departments?faculty_id=${facultyId}` : "/admin/departments"
    return apiClient.get<Department[]>(url)
  },

  // Subjects
  getSubjects: (departmentId?: number): Promise<ApiResponse<Subject[]>> => {
    const url = departmentId ? `/admin/subjects?department_id=${departmentId}` : "/admin/subjects"
    return apiClient.get<Subject[]>(url)
  },

  // Topics
  getTopics: (subjectId?: number, search?: string): Promise<ApiResponse<Topic[]>> => {
    let url = "/admin/topics"
    const params: string[] = []
    if (subjectId) params.push(`subject_id=${subjectId}`)
    if (search) params.push(`search=${encodeURIComponent(search)}`)
    if (params.length > 0) url += `?${params.join("&")}`
    return apiClient.get<Topic[]>(url)
  },

  // Subtopics
  getSubtopics: (topicId: number, search?: string): Promise<ApiResponse<Subtopic[]>> => {
    let url = `/admin/topics/${topicId}/subtopics`
    if (search) url += `?search=${encodeURIComponent(search)}`
    return apiClient.get<Subtopic[]>(url)
  },
}

