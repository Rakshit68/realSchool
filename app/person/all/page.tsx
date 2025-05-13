"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2 } from "lucide-react"
import AuthGuard from "@/components/auth-guard"
import AppHeader from "@/components/app-header"
import { withAuth, type User } from "@/lib/auth-utils"
import { API_URLS } from "@/lib/api-urls"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-utils"

interface AllPersonsProps {
  user: User
}

function AllPersons({ user }: AllPersonsProps) {
  const [persons, setPersons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPersons = async () => {
    try {
      const response = await fetch(`${API_URLS.GET_STAFF}?pIsLogo=0&pCompanyId=${user.companyId}&pStaffId=`)

      if (response.ok) {
        const data = await response.json()
        setPersons(Array.isArray(data) ? data : [])
      } else {
        toast.error("Failed to fetch persons")
      }
    } catch (error) {
      toast.error("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPersons()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleDelete = async (staffId: string) => {
    try {
      const response = await fetch(`${API_URLS.DEL_STAFF_URL}?pCompanyId=${user.companyId}&pStaffId=${staffId}`)

      if (response.ok) {
        toast.success("Person deleted successfully")
        fetchPersons()
      } else {
        toast.error("Failed to delete person")
      }
    } catch (error) {
      toast.error("Failed to connect to server")
    }
  }

  const filteredPersons = persons.filter(
    (person) =>
      person.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || person.mobileNo.includes(searchTerm),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AppHeader user={user} onLogout={handleLogout} />

      <main className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">All Persons</CardTitle>
            <div className="mt-2">
              <Input
                placeholder="Search by name or mobile"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Loading persons...</p>
            ) : filteredPersons.length === 0 ? (
              <p className="text-center py-4">No persons found</p>
            ) : (
              <div className="space-y-4">
                {filteredPersons.map((person) => (
                  <div key={person.staffId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        {person.profileImage ? (
                          <AvatarImage src={`${API_URLS.GET_IMAGE_URL}${person.profileImage}`} alt={person.staffName} />
                        ) : null}
                        <AvatarFallback>{getInitials(person.staffName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{person.staffName}</p>
                        <p className="text-sm text-muted-foreground">
                          {person.mobileNo} • {person.designation}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDelete(person.staffId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AllPersonsPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) return null

  return (
    <AuthGuard>
      <AppHeader user={user} onLogout={() => { localStorage.removeItem("user"); window.location.href = "/"; }} />
      <AllPersons user={user} />
    </AuthGuard>
  )
}
