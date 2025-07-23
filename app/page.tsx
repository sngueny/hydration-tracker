"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, BarChart3, Target, Bell, Smartphone, X } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [helpFormData, setHelpFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [helpFormSubmitted, setHelpFormSubmitted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleHelpFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHelpFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleHelpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Help form submitted:", helpFormData)
    setHelpFormSubmitted(true)
    
    // Reset form after 3 seconds and close dialog
    setTimeout(() => {
      setHelpFormSubmitted(false)
      setHelpDialogOpen(false)
      setHelpFormData({
        name: "",
        email: "",
        message: ""
      })
    }, 3000)
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HydroTracker</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Badge variant="secondary" className="mb-4">
            🎉 Track your hydration journey
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stay Hydrated,
            <span className="text-blue-600"> Stay Healthy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your daily water intake, set personalized goals, and build healthy hydration habits with our intuitive
            water tracking app.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8">
                Start Tracking Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">See It In Action</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get a glimpse of how HydroTracker helps you maintain optimal hydration levels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Dashboard Preview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Dashboard</CardTitle>
              </div>
              <CardDescription>Track your daily progress at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today's Goal</span>
                  <span className="font-semibold">2000ml</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <div className="text-sm text-gray-600">1500ml / 2000ml (75%)</div>
              </div>
            </CardContent>
          </Card>

          {/* Water Entry Preview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Quick Entry</CardTitle>
              </div>
              <CardDescription>Log your water intake instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-100 rounded border"></div>
                  <div className="w-16 h-10 bg-gray-100 rounded border"></div>
                </div>
                <Button className="w-full" size="sm">
                  Add Entry
                </Button>
                <div className="text-xs text-gray-500">Recent: 250ml - 2:30 PM</div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Preview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Statistics</CardTitle>
              </div>
              <CardDescription>Analyze your hydration patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weekly Average</span>
                  <span className="font-semibold">1850ml</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Best Day</span>
                  <span className="font-semibold">2400ml</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Streak</span>
                  <span className="font-semibold">7 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive features to help you build and maintain healthy hydration habits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Reminders</h3>
              <p className="text-sm text-gray-600">Get personalized notifications to stay on track</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-sm text-gray-600">Visualize your progress with charts and insights</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Custom Goals</h3>
              <p className="text-sm text-gray-600">Set personalized hydration targets</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-sm text-gray-600">Access anywhere, anytime on any device</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Hydration Journey?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users who have improved their health through better hydration habits.
        </p>
        <Link href="/auth">
          <Button size="lg" className="text-lg px-8">
            Get Started Today
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="h-6 w-6" />
                <span className="text-xl font-bold">HydroTracker</span>
              </div>
              <p className="text-gray-400 text-sm">Your personal hydration companion for a healthier lifestyle.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Water Tracking</li>
                <li>Smart Reminders</li>
                <li>Progress Analytics</li>
                <li>Goal Setting</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button 
                    onClick={() => setHelpDialogOpen(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li><a href="mailto:support@hydrotracker.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a 
                    href="https://twitter.com/hydration-tracker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href="https://facebook.com/hydration-tracker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a 
                    href="https://instagram.com/hydration-tracker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a 
                    href="https://hydrotracker.com/newsletter" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 HydroTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Help Center Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Help Center</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          {helpFormSubmitted ? (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your message has been sent successfully. We'll respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleHelpFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={helpFormData.name} 
                  onChange={handleHelpFormChange} 
                  placeholder="Your name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={helpFormData.email} 
                  onChange={handleHelpFormChange} 
                  placeholder="your.email@example.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={helpFormData.message} 
                  onChange={handleHelpFormChange} 
                  placeholder="Describe your issue or question..." 
                  rows={4} 
                  required 
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setHelpDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}