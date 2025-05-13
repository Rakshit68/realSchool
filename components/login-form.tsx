"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_URLS, buildUrl } from "@/lib/api-urls"
import { apiFetch } from "@/lib/utils"

export default function LoginForm() {
  const [username, setUsername] = useState("9798909930")
  const [password, setPassword] = useState("123456")
  const [companyId, setCompanyId] = useState("76")
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState("student")
  const router = useRouter()

  // Registration state
  const [regName, setRegName] = useState("")
  const [regPersonName, setRegPersonName] = useState("")
  const [regMobile, setRegMobile] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regLoading, setRegLoading] = useState(false)

  const validateUserData = (userData: any) => {
    const required = ['id', 'name', 'mobile', 'designation', 'companyId', 'staffId'];
    return required.every(field => userData[field]);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const params = {
        rMobileNo: username,
        rPassword: password
      }
      const response = await apiFetch(buildUrl(API_URLS.GUARD_LOGIN_URL, params))
      const data = await response.json()
      console.log('Login response:', data)

      if (data && data.length > 0) {
        const userData = data[0]
        const userInfo = {
          id: userData.id || userData.staffId || userData.studentId || userData.companyId || username,
          name: userData.rPersonName || userData.staffName || userData.studentName || userData.rName || username,
          mobile: userData.rMobileNo || userData.mobileNo || username,
          designation: userData.designation || userData.rDesignation || (userType === "student" ? "Student" : userType === "staff" ? "Staff" : "Buisnness Owner"),
          companyId: userData.companyId ? String(userData.companyId) : companyId,
          staffId: userData.staffId || userData.id || "",
          profileImage: userData.profileImage || "",
          attendance: userData.attendance || "",
        }

        if (!validateUserData(userInfo)) {
          console.error('Invalid user data:', userInfo)
          throw new Error("Invalid user data received from server")
        }

        localStorage.setItem("user", JSON.stringify(userInfo))
        
        if (userInfo.designation === "Buisnness Owner") {
          router.push("/dashboard/owner")
        } else if (userInfo.designation === "Staff") {
          router.push("/dashboard/staff")
        } else {
          router.push("/dashboard/student")
        }
      } else {
        toast.error("Invalid mobile number or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegLoading(true)
    try {
      const params = {
        rPassword: regPassword,
        rName: regName,
        rPersonName: regPersonName,
        rMobileNo: regMobile
      }
      
      const response = await apiFetch(buildUrl(API_URLS.REGISTER_URL, params))
      const data = await response.json()
      console.log('Registration response:', data)
      
      if (data && data.length > 0 && data[0].companyId) {
        toast.success("Company registered successfully! Please login.")
        // Prefill login form with registration details
        setUsername(regMobile)
        setPassword(regPassword)
        setRegName("")
        setRegPersonName("")
        setRegMobile("")
        setRegPassword("")
        // Switch to login tab
        document.querySelector('[data-state="login"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      } else {
        toast.error("Registration failed. Please try again.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      toast.error("Registration failed. Please try again.")
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary">RealSchool</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <select
                  id="userType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="owner">Business Owner</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Mobile Number</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your mobile number"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="regName">Company Name</Label>
                <Input
                  id="regName"
                  type="text"
                  placeholder="Enter company name"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPersonName">Owner Name</Label>
                <Input
                  id="regPersonName"
                  type="text"
                  placeholder="Enter owner name"
                  value={regPersonName}
                  onChange={e => setRegPersonName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regMobile">Mobile Number</Label>
                <Input
                  id="regMobile"
                  type="text"
                  placeholder="Enter mobile number"
                  value={regMobile}
                  onChange={e => setRegMobile(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPassword">Password</Label>
                <Input
                  id="regPassword"
                  type="password"
                  placeholder="Enter password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={regLoading}>
                {regLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} RealSchool. All rights reserved.
        </p>
      </CardFooter>
    </Card>
  )
}
