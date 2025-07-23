"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Droplets, 
  BarChart3, 
  User, 
  Settings, 
  Menu, 
  X 
} from "lucide-react"

export function DashboardNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Droplets className="h-5 w-5" />,
    },
    {
      name: "Statistics",
      href: "/statistics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-screen flex-col w-64 border-r bg-white">
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl">HydroTracker</span>
          </Link>
        </div>
        
        <div className="flex flex-col flex-1 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b bg-white sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl">HydroTracker</span>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        {mobileMenuOpen && (
          <div className="p-4 border-t">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </nav>
          </div>
        )}
      </div>
    </>
  )
}