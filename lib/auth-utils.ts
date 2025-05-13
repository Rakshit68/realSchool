"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { ReactElement, ComponentType, JSXElementConstructor } from "react"

export type UserRole = "Buisnness Owner" | "Staff" | "Student"

export interface User {
  id: string
  name: string
  mobile: string
  designation: UserRole
  companyId: string
  staffId: string
  profileImage?: string
  attendance?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        // Validate user data shape
        if (
          userData &&
          userData.id &&
          userData.name &&
          userData.mobile &&
          userData.designation &&
          userData.companyId &&
          userData.staffId
        ) {
          setUser(userData)
        } else {
          console.error("Invalid user data structure")
          localStorage.removeItem("user")
          setUser(null)
        }
      }
    } catch (e) {
      console.error("Error parsing user data:", e)
      localStorage.removeItem("user")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return { user, loading, logout }
}

type WithAuthProps = {
  user: User
}

export function withAuth<P extends WithAuthProps>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
): React.ComponentType<Omit<P, keyof WithAuthProps>> {
  return function AuthenticatedComponent(props: Omit<P, keyof WithAuthProps>) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push("/")
          return
        }

        if (allowedRoles && !allowedRoles.includes(user.designation)) {
          // Redirect based on role if accessing unauthorized page
          if (user.designation === "Buisnness Owner") {
            router.push("/dashboard/owner")
          } else if (user.designation === "Staff") {
            router.push("/dashboard/staff")
          } else {
            router.push("/dashboard/student")
          }
        }
      }
    }, [loading, user, router])

    if (loading) {
      return React.createElement("div", { 
        className: "flex items-center justify-center min-h-screen" 
      }, React.createElement("div", { 
        className: "text-center" 
      }, [
        React.createElement("h2", { 
          key: "title",
          className: "text-xl font-semibold mb-2" 
        }, "Loading..."),
        React.createElement("p", { 
          key: "subtitle",
          className: "text-muted-foreground" 
        }, "Please wait while we verify your access.")
      ]))
    }

    if (!user) return null

    if (allowedRoles && !allowedRoles.includes(user.designation)) {
      return null
    }

    return React.createElement(Component, { ...props, user } as P)
  }
}
