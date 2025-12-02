import apiClient from "./axios"
import type { AuthRequest, ProfileRequest, ProfileResponse, ResetPasswordRequest } from "@/lib/types"

export const authApi = {
  // Login
  login: async (data: AuthRequest) => {
    const response = await apiClient.post("/login", data)
    return response.data
  },

  // Register
  register: async (data: ProfileRequest) => {
    const response = await apiClient.post("/register", data)
    return response.data
  },

  // Send OTP for email verification
  sendOtp: async (email: string) => {
    const response = await apiClient.post("/send-otp", email)
    return response.data
  },

  // Verify OTP
  verifyOtp: async (data: Record<string, unknown>) => {
    const response = await apiClient.post("/verify-otp", data)
    return response.data
  },

  // Verify registration with OTP
  verifyRegistration: async (data: Record<string, unknown>) => {
    const response = await apiClient.post("/register-otp", data)
    return response.data
  },

  // Send reset password OTP
  sendResetOtp: async (email: string) => {
    const response = await apiClient.post(`/send-reset-otp?email=${encodeURIComponent(email)}`)
    return response.data
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post("/reset-password", data)
    return response.data
  },

  // Check if authenticated
  isAuthenticated: async (email: string): Promise<boolean> => {
    const response = await apiClient.get(`/is-authenticated?email=${encodeURIComponent(email)}`)
    return response.data
  },

  // Get profile
  getProfile: async (email: string): Promise<ProfileResponse> => {
    const response = await apiClient.get(`/profile?email=${encodeURIComponent(email)}`)
    return response.data
  },
}
