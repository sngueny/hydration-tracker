"use client"

import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Droplets } from "lucide-react"

interface ReminderSettings {
  enabled: boolean
  interval: number // in minutes
  startTime: string
  endTime: string
}

export function NotificationSystem() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: false,
    interval: 60, // Default: 1 hour
    startTime: "08:00",
    endTime: "22:00",
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("reminderSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Request notification permission if not already granted
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    let reminderInterval: NodeJS.Timeout | null = null

    if (settings.enabled) {
      reminderInterval = setInterval(() => {
        const now = new Date()
        const currentTime = now.getHours() * 60 + now.getMinutes()
        
        const [startHours, startMinutes] = settings.startTime.split(":").map(Number)
        const [endHours, endMinutes] = settings.endTime.split(":").map(Number)
        
        const startTimeMinutes = startHours * 60 + startMinutes
        const endTimeMinutes = endHours * 60 + endMinutes
        
        // Check if current time is within the reminder window
        if (currentTime >= startTimeMinutes && currentTime <= endTimeMinutes) {
          showReminder()
        }
      }, settings.interval * 60 * 1000) // Convert minutes to milliseconds
    }

    return () => {
      if (reminderInterval) {
        clearInterval(reminderInterval)
      }
    }
  }, [settings])

  const showReminder = () => {
    // Show toast notification
    toast({
      title: "Hydration Reminder",
      description: "It's time to drink some water! 💧",
      duration: 10000, // 10 seconds
    })

    // Show system notification if permission is granted
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("Hydration Reminder", {
        body: "It's time to drink some water! 💧",
        icon: "/droplet.png", // You'll need to add this icon to your public folder
      })
    }
  }

  return <Toaster />
}