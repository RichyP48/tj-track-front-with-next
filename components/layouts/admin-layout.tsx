"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { MainHeader } from "./main-header"
import { Spinner } from "@/components/ui/spinner"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("MANAGER")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen">
      <MainHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 p-6">{children}</main>
      </div>
    </div>
  )
}
