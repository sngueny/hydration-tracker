"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Droplets } from "lucide-react"

interface WaterEntry {
  _id: string
  amount: number
  unit: "ml" | "oz"
  timestamp: string
}

interface User {
  id: string
  email: string
}

export default function WaterTracker() {
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<WaterEntry[]>([])
  const [amount, setAmount] = useState("")
  const [unit, setUnit] = useState<"ml" | "oz">("ml")
  const [loading, setLoading] = useState(false)

  // Auth states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUser()
      fetchEntries()
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      localStorage.removeItem("token")
    }
  }

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/water/today", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error("Error fetching entries:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        setUser(data.user)
        fetchEntries()
        setEmail("")
        setPassword("")
      } else {
        const error = await response.json()
        alert(error.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed")
    }
    setAuthLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        setUser(data.user)
        setEmail("")
        setPassword("")
      } else {
        const error = await response.json()
        alert(error.message || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("Signup failed")
    }
    setAuthLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setEntries([])
  }

  const addWaterEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return

    setLoading(true)
    try {
      const response = await fetch("/api/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          unit,
        }),
      })

      if (response.ok) {
        const newEntry = await response.json()
        setEntries([...entries, newEntry])
        setAmount("")
      } else {
        alert("Failed to add entry")
      }
    } catch (error) {
      console.error("Error adding entry:", error)
      alert("Failed to add entry")
    }
    setLoading(false)
  }

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/water/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        setEntries(entries.filter((entry) => entry._id !== id))
      } else {
        alert("Failed to delete entry")
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
      alert("Failed to delete entry")
    }
  }

  const getTotalIntake = () => {
    return entries.reduce((total, entry) => {
      const amountInMl = entry.unit === "oz" ? entry.amount * 29.5735 : entry.amount
      return total + amountInMl
    }, 0)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Droplets className="h-12 w-12 text-blue-500" />
            </div>
            <CardTitle>Water Intake Tracker</CardTitle>
            <CardDescription>Track your daily hydration goals</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Water Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Water Intake</CardTitle>
              <CardDescription>Log your water consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addWaterEntry} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={unit} onValueChange={(value: "ml" | "oz") => setUnit(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Intake</CardTitle>
              <CardDescription>
                Total: {Math.round(getTotalIntake())} ml ({Math.round(getTotalIntake() / 29.5735)} oz)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No entries for today</p>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div key={entry._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">
                          {entry.amount} {entry.unit}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
