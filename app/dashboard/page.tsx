"use client"

import { useAuth } from "@/lib/auth-utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/")
      } else {
        // Route to specific dashboard based on user role
        if (user.designation === "Buisnness Owner") {
          router.replace("/dashboard/owner")
        } else if (user.designation === "Staff") {
          router.replace("/dashboard/staff")
        } else {
          router.replace("/dashboard/student")
        }
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-muted-foreground">Please wait while we direct you to your dashboard.</p>
      </div>
    </div>
  )
}
