import { apiClient, type ApiResponse } from "../lib/api-client"
import type { Book } from "../data/mockData"

export interface CreateBookData {
  title: string
  author: string
  topic: string
  description?: string
  hardCopyPrice: number
  softCopyAvailable: boolean
  softCopyPrice?: number
  coverImage?: File | null
  softCopyPdf?: File | null
}

export interface UpdateBookData extends Partial<CreateBookData> {}

export const booksService = {
  getAll: (): Promise<ApiResponse<Book[]>> => {
    return apiClient.get<Book[]>("/admin/books")
  },

  getById: (id: string | number): Promise<ApiResponse<Book>> => {
    return apiClient.get<Book>(`/admin/books/${id}`)
  },

  create: (data: CreateBookData): Promise<ApiResponse<Book>> => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("author", data.author)
    formData.append("topic", data.topic)
    if (data.description) formData.append("description", data.description)
    formData.append("hardCopyPrice", data.hardCopyPrice.toString())
    formData.append("softCopyAvailable", data.softCopyAvailable.toString())
    if (data.softCopyPrice !== undefined) {
      formData.append("softCopyPrice", data.softCopyPrice.toString())
    }
    if (data.coverImage) formData.append("coverImage", data.coverImage)
    if (data.softCopyPdf) formData.append("softCopyPdf", data.softCopyPdf)

    return apiClient.post<Book>("/admin/books", formData)
  },

  update: (id: string | number, data: UpdateBookData): Promise<ApiResponse<Book>> => {
    const formData = new FormData()
    if (data.title) formData.append("title", data.title)
    if (data.author) formData.append("author", data.author)
    if (data.topic) formData.append("topic", data.topic)
    if (data.description !== undefined) formData.append("description", data.description || "")
    if (data.hardCopyPrice !== undefined) formData.append("hardCopyPrice", data.hardCopyPrice.toString())
    if (data.softCopyAvailable !== undefined) formData.append("softCopyAvailable", data.softCopyAvailable.toString())
    if (data.softCopyPrice !== undefined) formData.append("softCopyPrice", data.softCopyPrice.toString())
    if (data.coverImage) formData.append("coverImage", data.coverImage)
    if (data.softCopyPdf) formData.append("softCopyPdf", data.softCopyPdf)

    return apiClient.put<Book>(`/admin/books/${id}`, formData)
  },

  delete: (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/books/${id}`)
  },
}

