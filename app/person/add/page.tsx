"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AuthGuard from "@/components/auth-guard"
import AppHeader from "@/components/app-header"
import { withAuth, type User } from "@/lib/auth-utils"
import { API_URLS } from "@/lib/api-urls"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-utils"

interface AddPersonProps {
  user: User
}

function AddPerson({ user }: AddPersonProps) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    designation: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(API_URLS.ADDSTAFF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          companyId: user.companyId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Person added successfully")
        router.push("/person/all")
      } else {
        toast.error("Failed to add person", {
          description: data.message || "Please try again later.",
        })
      }
    } catch (error) {
      toast.error("Connection Error", {
        description: "Unable to connect to the server.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center">Add Person</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={formData.designation}
                  onValueChange={(value) => handleSelectChange("designation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Person"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AddPersonPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) return null

  return (
    <AuthGuard>
      <AppHeader user={user} onLogout={() => { localStorage.removeItem("user"); window.location.href = "/"; }} />
      <AddPerson user={user} />
    </AuthGuard>
  )
}
