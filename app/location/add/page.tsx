"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AppHeader from "@/components/app-header"
import AuthGuard from "@/components/auth-guard"
import { withAuth, type User } from "@/lib/auth-utils"
import { API_URLS } from "@/lib/api-urls"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-utils"

interface AddLocationProps {
  user: User
}

function AddLocation({ user }: AddLocationProps) {
  const [locationName, setLocationName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(API_URLS.ADD_LOCATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationName,
          companyId: user.companyId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Location added successfully")
        router.push("/location/all")
      } else {
        toast.error("Error", {
          description: data.message || "Failed to add location",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to connect to server",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">Add Location</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="locationName">Location Name</Label>
              <Input
                id="locationName"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add Location"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default function AddLocationPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) return null

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <AppHeader user={user} onLogout={() => { localStorage.removeItem("user"); window.location.href = "/"; }} />
        <AddLocation user={user} />
      </div>
    </AuthGuard>
  )
}
