"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Target, Droplets, Edit, Save, X } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
  joinDate: string
  dailyGoal: number
  totalEntries: number
  totalIntake: number
  longestStreak: number
  currentStreak: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    dailyGoal: 2000,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || "",
          dailyGoal: data.dailyGoal || 2000,
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setEditing(false)
      } else {
        alert("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      dailyGoal: profile?.dailyGoal || 2000,
    })
    setEditing(false)
  }

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return { text: "Hydration Master", color: "bg-purple-100 text-purple-800" }
    if (streak >= 14) return { text: "Consistent Drinker", color: "bg-blue-100 text-blue-800" }
    if (streak >= 7) return { text: "Week Warrior", color: "bg-green-100 text-green-800" }
    if (streak >= 3) return { text: "Getting Started", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Beginner", color: "bg-gray-100 text-gray-800" }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p>Profile not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const streakBadge = getStreakBadge(profile.currentStreak)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
          {!editing ? (
            <Button onClick={() => setEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {(profile.name || profile.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{profile.name || "User"}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                    <Badge className={streakBadge.color}>{streakBadge.text}</Badge>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    {editing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{profile.name || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{profile.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Member Since</Label>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(profile.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyGoal">Daily Goal (ml)</Label>
                    {editing ? (
                      <Input
                        id="dailyGoal"
                        type="number"
                        value={formData.dailyGoal}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dailyGoal: Number(e.target.value) }))}
                        min="500"
                        max="5000"
                        step="250"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span>{profile.dailyGoal}ml</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>Hydration achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Total Entries</span>
                  </div>
                  <span className="font-semibold">{profile.totalEntries}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Total Intake</span>
                  </div>
                  <span className="font-semibold">{Math.round(profile.totalIntake / 1000)}L</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Current Streak</span>
                  </div>
                  <span className="font-semibold">{profile.currentStreak} days</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Longest Streak</span>
                  </div>
                  <span className="font-semibold">{profile.longestStreak} days</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your hydration milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.totalEntries >= 100 && (
                  <Badge className="w-full justify-center bg-gold-100 text-gold-800">
                    🏆 Century Club (100+ entries)
                  </Badge>
                )}
                {profile.longestStreak >= 30 && (
                  <Badge className="w-full justify-center bg-purple-100 text-purple-800">🔥 30-Day Streak Master</Badge>
                )}
                {profile.longestStreak >= 7 && (
                  <Badge className="w-full justify-center bg-green-100 text-green-800">📅 Week Warrior</Badge>
                )}
                {profile.totalIntake >= 100000 && (
                  <Badge className="w-full justify-center bg-blue-100 text-blue-800">💧 100L Club</Badge>
                )}
                {profile.totalEntries < 10 && profile.longestStreak < 3 && (
                  <div className="text-center text-gray-500 text-sm py-4">Keep tracking to unlock achievements!</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
