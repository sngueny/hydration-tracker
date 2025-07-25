"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Droplets, Calendar } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { AddWaterDialog } from "./add-water-dialog"

interface WaterEntry {
  _id: string
  amount: number
  unit: "ml" | "oz"
  timestamp: string
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<WaterEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [totalToday, setTotalToday] = useState(0)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/water/today", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
        setTotalToday(data.total || 0)
      }
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEntryAdded = (newEntry: WaterEntry) => {
    setEntries(prev => [newEntry, ...prev])
    setTotalToday(prev => prev + (newEntry.unit === "oz" ? newEntry.amount * 29.5735 : newEntry.amount))
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/water/${entryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const deletedEntry = entries.find(entry => entry._id === entryId)
        if (deletedEntry) {
          setEntries(prev => prev.filter(entry => entry._id !== entryId))
          setTotalToday(prev => prev - (deletedEntry.unit === "oz" ? deletedEntry.amount * 29.5735 : deletedEntry.amount))
        }
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatAmount = (amount: number, unit: string) => {
    return `${amount}${unit}`
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Water Entries</h1>
            <p className="text-gray-600">Track and manage your daily water intake</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              Today's Progress
            </CardTitle>
            <CardDescription>Your water intake for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{Math.round(totalToday)}ml</div>
                <div className="text-sm text-gray-600">
                  {Math.round((totalToday / 2000) * 100)}% of daily goal
                </div>
              </div>
              <div className="w-32 h-32 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${Math.min((totalToday / 2000) * 251.2, 251.2)} 251.2`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700">
                    {Math.round((totalToday / 2000) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entries List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Entries ({entries.length})
            </CardTitle>
            <CardDescription>All water intake entries for today</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-8">
                <Droplets className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No entries yet today</p>
                <Button onClick={() => setDialogOpen(true)} variant="outline">
                  Add your first entry
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Droplets className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {formatAmount(entry.amount, entry.unit)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatTime(entry.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {entry.unit === "oz" ? "Ounces" : "Milliliters"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
      </div>

      <AddWaterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onEntryAdded={handleEntryAdded}
      />
    </DashboardLayout>
  )
}