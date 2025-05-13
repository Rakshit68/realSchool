"use client"
import { useAuth, type User } from "@/lib/auth-utils"
import { useRouter } from "next/navigation"
import React from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) return null

  return <div className="flex flex-col min-h-screen">{children}</div>
}
