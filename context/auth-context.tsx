"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { ProfileResponse } from "@/lib/types"

interface AuthContextType {
  user: ProfileResponse | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, user: ProfileResponse) => void
  logout: () => void
  updateUser: (user: ProfileResponse) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ProfileResponse | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("tj_track_token")
    const storedUser = localStorage.getItem("tj_track_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("tj_track_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((newToken: string, newUser: ProfileResponse) => {
    localStorage.setItem("tj_track_token", newToken)
    localStorage.setItem("tj_track_user", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("tj_track_token")
    localStorage.removeItem("tj_track_user")
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser: ProfileResponse) => {
    localStorage.setItem("tj_track_user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
