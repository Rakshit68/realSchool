"use client"
import LoginForm from "@/components/login-form"
import { useAuth } from "@/lib/auth-utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (user) return null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <LoginForm />
    </main>
  )
}
