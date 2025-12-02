import apiClient from "./axios"
import type { ProfileResponse } from "@/lib/types"

export const adminApi = {
  // Get all users
  getAllUsers: async (): Promise<ProfileResponse[]> => {
    const response = await apiClient.get("/admin/all-users")
    return response.data
  },

  // Get pending users
  getPendingUsers: async (): Promise<ProfileResponse[]> => {
    const response = await apiClient.get("/admin/pending-users")
    return response.data
  },

  // Approve user
  approveUser: async (userId: string, data?: string): Promise<unknown> => {
    const response = await apiClient.post(`/admin/approve-user/${userId}`, data)
    return response.data
  },

  // Reject user
  rejectUser: async (userId: string, data?: string): Promise<unknown> => {
    const response = await apiClient.post(`/admin/reject-user/${userId}`, data)
    return response.data
  },

  // Test endpoint
  test: async (): Promise<unknown> => {
    const response = await apiClient.get("/admin/test")
    return response.data
  },
}

export const ecommerceApi = {
  getStats: async (): Promise<Record<string, unknown>> => {
    const response = await apiClient.get("/ecommerce/stats")
    return response.data
  },
}
