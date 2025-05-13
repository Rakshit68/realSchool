"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/app-header"
import AuthGuard from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-utils"
import { API_URLS } from "@/lib/api-urls"
import { toast } from "sonner"

export default function StaffDashboardPage() {
  const { user, loading, logout } = useAuth()
  const [staffData, setStaffData] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(true)

  const fetchStaffData = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${API_URLS.GET_STAFF}?pIsLogo=0&pCompanyId=${user.companyId}&pStaffId=${user.staffId}`
      )

      if (response.ok) {
        const data = await response.json()
        setStaffData(data)
      } else {
        toast.error("Error", {
          description: "Failed to fetch staff data",
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
      fetchStaffData()
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
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 flex flex-col items-center">
            {dataLoading ? (
              <p>Loading staff data...</p>
            ) : (
              <>
                <div className="w-32 h-32 relative mb-4">
                  {user.profileImage ? (
                    <Image
                      src={
                        user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `${API_URLS.GET_IMAGE_URL}${user.profileImage}`
                      }
                      alt={user.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {user.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-center">
                  {user.name}-{user.staffId}
                </h2>
                <p className="text-muted-foreground text-center mb-4">Staff</p>

                <p className="text-lg font-medium mb-6">{user.mobile}</p>

                <div className="w-full space-y-2 mb-6">
                  <p className="text-green-600">In Time: {staffData?.inTime || "-"}</p>
                  <p className="text-red-600">Out Time: {staffData?.outTime || "-"}</p>
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
