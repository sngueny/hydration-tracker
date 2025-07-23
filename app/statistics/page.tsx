"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Calendar, BarChart3, Clock } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface StatisticsData {
  dailyAverage: number
  weeklyAverage: number
  monthlyAverage: number
  bestDay: { date: string; amount: number }
  worstDay: { date: string; amount: number }
  currentStreak: number
  longestStreak: number
  totalIntake: number
  goalAchievementRate: number
  peakHours: Array<{ hour: number; count: number }>
  weeklyData: Array<{ date: string; amount: number; goal: number }>
  monthlyData: Array<{ month: string; amount: number; goal: number }>
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState("week")

  useEffect(() => {
    fetchStatistics()
  }, [timePeriod])

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stats/detailed?period=${timePeriod}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    } finally {
      setLoading(false)
    }
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

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p>No statistics available</p>
        </div>
      </DashboardLayout>
    )
  }

  const formatAmount = (amount: number) => {
    return `${Math.round(amount)}ml`
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "bg-green-100 text-green-800"
    if (streak >= 3) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
            <p className="text-gray-600">Analyze your hydration patterns and progress</p>
          </div>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Daily Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(stats.dailyAverage)}</div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {stats.dailyAverage >= 2000 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span>vs 2000ml goal</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goal Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.goalAchievementRate)}%</div>
              <div className="text-sm text-gray-600">of days goal met</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak} days</div>
              <Badge className={getStreakColor(stats.currentStreak)}>
                {stats.currentStreak >= 7 ? "Great!" : stats.currentStreak >= 3 ? "Good" : "Keep going"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.totalIntake / 1000)}L</div>
              <div className="text-sm text-gray-600">in selected period</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Intake Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Intake Trend</CardTitle>
              <CardDescription>Your water consumption over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${Math.round(value)}ml`, "Intake"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                    <Line type="monotone" dataKey="goal" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Peak Hydration Hours</CardTitle>
              <CardDescription>When you drink water most often</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value} entries`, "Count"]}
                      labelFormatter={(hour) => `${hour}:00`}
                    />
                    <Bar dataKey="count" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best and Worst Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="h-5 w-5" />
                Best Day
              </CardTitle>
              <CardDescription>Your highest water intake day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-2">{formatAmount(stats.bestDay.amount)}</div>
              <div className="text-sm text-gray-600">{new Date(stats.bestDay.date).toLocaleDateString()}</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Excellent hydration!</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <TrendingDown className="h-5 w-5" />
                Lowest Day
              </CardTitle>
              <CardDescription>Room for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700 mb-2">{formatAmount(stats.worstDay.amount)}</div>
              <div className="text-sm text-gray-600">{new Date(stats.worstDay.date).toLocaleDateString()}</div>
              <Badge className="mt-2 bg-orange-100 text-orange-800">Let's improve this!</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
            <CardDescription>Personalized tips based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.dailyAverage < 2000 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Increase Daily Intake</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Your daily average is {formatAmount(stats.dailyAverage)}. Try to increase by{" "}
                    {formatAmount(2000 - stats.dailyAverage)} to reach the recommended 2000ml daily goal.
                  </p>
                </div>
              )}

              {stats.currentStreak < 3 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Build Consistency</span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    Your current streak is {stats.currentStreak} days. Try to maintain consistent daily hydration to
                    build a longer streak.
                  </p>
                </div>
              )}

              {stats.peakHours.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Optimal Timing</span>
                  </div>
                  <p className="text-sm text-green-800">
                    You're most active with hydration around {stats.peakHours[0]?.hour}:00. Consider setting reminders
                    during less active hours.
                  </p>
                </div>
              )}

              {stats.goalAchievementRate >= 80 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Great Progress!</span>
                  </div>
                  <p className="text-sm text-purple-800">
                    You're achieving your goal {Math.round(stats.goalAchievementRate)}% of the time. Keep up the
                    excellent work!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
