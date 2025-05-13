"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AuthGuard from "@/components/auth-guard"
import AppHeader from "@/components/app-header"
import { useAuth, User } from "@/lib/auth-utils"
import { API_URLS } from "@/lib/api-urls"
import { toast } from "sonner"

interface AssignPersonProps {
  user: User
}

function AssignPerson({ user }: AssignPersonProps) {
  const [persons, setPersons] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [selectedPerson, setSelectedPerson] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const fetchData = async () => {
    try {
      const personsResponse = await fetch(
        `${API_URLS.GET_STAFF}?pIsLogo=0&pCompanyId=${user.companyId}&pStaffId=`
      )
      const locationsResponse = await fetch(
        `${API_URLS.GET_LOCATION_URL}?pCompanyId=${user.companyId}`
      )

      if (personsResponse.ok && locationsResponse.ok) {
        const personsData = await personsResponse.json()
        const locationsData = await locationsResponse.json()
        setPersons(Array.isArray(personsData) ? personsData : [])
        setLocations(Array.isArray(locationsData) ? locationsData : [])
      } else {
        toast.error("Failed to fetch data")
      }
    } catch (error) {
      toast.error("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(API_URLS.ADD_STAFF_LOCATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId: selectedPerson,
          locationId: selectedLocation,
          companyId: user.companyId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Person assigned to location successfully")
        router.push("/person-location")
      } else {
        toast.error(data.message || "Failed to assign person to location")
      }
    } catch (error) {
      toast.error("Failed to connect to server")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center">Assign Person to Location</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Loading data...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="person">Select Person</Label>
                  <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a person" />
                    </SelectTrigger>
                    <SelectContent>
                      {persons.map((person) => (
                        <SelectItem key={person.staffId} value={person.staffId}>
                          {person.staffName} ({person.designation})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Select Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.locationId} value={location.locationId}>
                          {location.locationName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting || !selectedPerson || !selectedLocation}
                >
                  {submitting ? "Assigning..." : "Assign Person to Location"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AssignPersonPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) return null

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <AppHeader user={user} onLogout={() => { localStorage.removeItem("user"); window.location.href = "/"; }} />
        <AssignPerson user={user} />
      </div>
    </AuthGuard>
  )
}
