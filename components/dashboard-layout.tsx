"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Home, List, TrendingUp, Settings } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    title: "Water Entries",
    url: "/entries",
    icon: <List className="h-4 w-4 mr-2" />,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: <TrendingUp className="h-4 w-4 mr-2" />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: <Settings className="h-4 w-4 mr-2" />,
  },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth")
      return
    }

    // Verify token validity with the server
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          // Token is invalid
          localStorage.removeItem("token")
          router.push("/auth")
        }
      } catch (error) {
        console.error("Error verifying authentication:", error)
        localStorage.removeItem("token")
        router.push("/auth")
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Router will redirect, this prevents flash of content
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNavbar />
      <main className="flex-1 md:ml-64 md:pl-0 pl-0">
        {children}
      </main>
    </div>
  )
}
