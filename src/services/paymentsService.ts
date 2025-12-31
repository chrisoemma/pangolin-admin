import { apiClient, type ApiResponse } from "../lib/api-client"
import type { Payment } from "../data/mockData"

export const paymentsService = {
  getAll: (): Promise<ApiResponse<Payment[]>> => {
    return apiClient.get<Payment[]>("/admin/payments")
  },

  getById: (id: string | number): Promise<ApiResponse<Payment>> => {
    return apiClient.get<Payment>(`/admin/payments/${id}`)
  },
}

