"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/auth-utils"
import { API_URLS } from "@/lib/api-urls"

interface AppHeaderProps {
  user: User
  onLogout: () => void
}

export default function AppHeader({ user, onLogout }: AppHeaderProps) {
  if (!user || typeof user !== 'object' || !user.designation) return null;

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const menuItems = [
    { label: "Change Theme", onClick: () => {} },
    { label: "Generate QRCodes", onClick: () => router.push("/qrcodes") },
    { label: "Add Person (Step 1)", onClick: () => router.push("/person/add") },
    { label: "Show All Person", onClick: () => router.push("/person/all") },
    { label: "Show Assigned Persons", onClick: () => router.push("/person/assigned") },
    { label: "Add Location(Step 2)", onClick: () => router.push("/location/add") },
    { label: "Show Locations", onClick: () => router.push("/location/all") },
    { label: "Assign Person To Location(Step 3)", onClick: () => router.push("/person/assign") },
    { label: "Show Person-Location", onClick: () => router.push("/person-location") },
    { label: "Add Designation", onClick: () => router.push("/designation/add") },
    { label: "Reports", onClick: () => router.push("/reports") },
    { label: "Show Designations", onClick: () => router.push("/designation/all") },
    { label: "Add Holiday", onClick: () => router.push("/holiday/add") },
    { label: "Change Company", onClick: () => router.push("/company/change") },
    { label: "Change Profile", onClick: () => router.push("/profile/edit") },
    { label: "Change Logo", onClick: () => router.push("/logo/change") },
    { label: "About", onClick: () => router.push("/about") },
    { label: "Log Out", onClick: onLogout },
  ]

  const filteredMenuItems = menuItems.filter((item) => {
    if (user.designation !== "Buisnness Owner") {
      const adminOptions = [
        "Add Person (Step 1)",
        "Add Location(Step 2)",
        "Assign Person To Location(Step 3)",
        "Add Designation",
        "Show Designations",
        "Add Holiday",
        "Change Company",
        "Change Logo",
      ]
      if (adminOptions.includes(item.label)) {
        return false
      }
    }
    return true
  })

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="flex h-14 items-center px-4 bg-primary">
        <div className="flex items-center mr-auto">
          <Link
            href={`/dashboard/${user.designation === "Buisnness Owner" ? "owner" : user.designation === "Staff" ? "staff" : "student"}`}
            className="font-bold text-xl text-primary-foreground"
          >
            RealSchool
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-primary-foreground hover:bg-primary/90"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </Button>

          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/90">
            <Lock size={20} />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/90">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card">
              <SheetHeader>
                <SheetTitle className="text-foreground">Menu</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 py-4">
                {filteredMenuItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left text-foreground hover:bg-muted"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-2 bg-background border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 py-2 text-sm rounded-md border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      {/* User Info Bar */}
      <div className="flex items-center p-4 bg-card border-b">
        <Avatar className="h-12 w-12">
          {user.profileImage ? (
            <AvatarImage
              src={
                user.profileImage.startsWith("http")
                  ? user.profileImage
                  : `${API_URLS.GET_IMAGE_URL}${user.profileImage}`
              }
              alt={user.name}
            />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground">{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>

        <div className="ml-3">
          <p className="font-medium text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.designation}</p>
          <p className="text-sm text-muted-foreground">My Assigned Persons</p>
          <p className="text-sm text-muted-foreground">Attendance: {user.attendance || "0/0"}</p>
        </div>

        <Avatar className="h-12 w-12 ml-auto">
          {user.profileImage ? (
            <AvatarImage
              src={
                user.profileImage.startsWith("http")
                  ? user.profileImage
                  : `${API_URLS.GET_IMAGE_URL}${user.profileImage}`
              }
              alt={user.name}
            />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground">{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>
      </div>
    </header>
  )
}
