import { apiClient, type ApiResponse } from "../lib/api-client"
import type { Order } from "../data/mockData"

export const ordersService = {
  getAll: (): Promise<ApiResponse<Order[]>> => {
    return apiClient.get<Order[]>("/admin/orders")
  },

  getById: (id: string | number): Promise<ApiResponse<Order>> => {
    return apiClient.get<Order>(`/admin/orders/${id}`)
  },
}

