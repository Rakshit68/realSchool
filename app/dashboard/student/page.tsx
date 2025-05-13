"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/app-header"
import AuthGuard from "@/components/auth-guard"
import { useAuth, type User } from "@/lib/auth-utils"
import { API_URLS } from "@/lib/api-urls"
import { toast } from "sonner"

export default function StudentDashboardPage() {
  const { user, loading, logout } = useAuth()
  const [studentData, setStudentData] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(true)

  const fetchStudentData = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(
        `${API_URLS.GET_STUDENT_URL}?pCompanyId=${user.companyId}&pStudentId=${user.staffId}`,
      )

      if (response.ok) {
        const data = await response.json()
        setStudentData(data)
      } else {
        toast.error("Error", {
          description: "Failed to fetch student data",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to connect to server",
      })
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchStudentData()
    }
  }, [user])

  const handleUpdate = () => {
    toast("Update", {
      description: "Profile update functionality will be implemented here",
    })
  }

  const handleAttendance = () => {
    toast("Attendance", {
      description: "Attendance marking functionality will be implemented here",
    })
  }

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AuthGuard>
      <AppHeader user={user} onLogout={logout} />
      <main className="flex-1 p-4">
        <Card className="max-w-md mx-auto bg-card text-card-foreground">
          <CardContent className="p-6 flex flex-col items-center">
            {dataLoading ? (
              <p className="text-muted-foreground">Loading student data...</p>
            ) : (
              <>
                <div className="w-32 h-32 relative mb-4 rounded-md overflow-hidden">
                  {user.profileImage ? (
                    <Image
                      src={
                        user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `${API_URLS.GET_IMAGE_URL}${user.profileImage}`
                      }
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {user.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-center text-foreground">
                  {user.name}-{user.staffId}
                </h2>
                <p className="text-muted-foreground text-center mb-4">Student</p>

                <p className="text-lg font-medium mb-6 text-foreground">{user.mobile}</p>

                <div className="w-full space-y-2 mb-6">
                  <p className="text-green-600">In Time: {studentData?.inTime || "-"}</p>
                  <p className="text-red-600">Out Time: {studentData?.outTime || "-"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button onClick={handleUpdate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    UPDATE
                  </Button>
                  <Button onClick={handleAttendance} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    ATTENDANCE
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </AuthGuard>
  )
}
