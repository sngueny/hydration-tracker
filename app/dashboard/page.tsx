"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard-layout";

// Keep the NotificationSystem component
export function NotificationSystem() {
  return <Toaster position="top-right" />;
}

// Define types for better type safety
interface WaterEntry {
  _id: string;
  amount: number;
  unit: "ml" | "oz";
  timestamp: string;
}

interface User {
  id: string;
  email: string;
}

// Add a default export component for the dashboard page
export default function Dashboard() {
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<"ml" | "oz">("ml");
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
      fetchEntries();
    } else {
      // Redirect to login if no token
      window.location.href = "/";
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/water/today", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const addWaterEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    setLoading(true);
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
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries([newEntry, ...entries]); // Add new entry to the beginning
        setAmount("");
      } else {
        alert("Failed to add entry");
      }
    } catch (error) {
      console.error("Error adding entry:", error);
      alert("Failed to add entry");
    }
    setLoading(false);
  };

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/water/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setEntries(entries.filter((entry) => entry._id !== id));
      } else {
        alert("Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry");
    }
  };

  const getTotalIntake = () => {
    return entries.reduce((total, entry) => {
      const amountInMl = entry.unit === "oz" ? entry.amount * 29.5735 : entry.amount;
      return total + amountInMl;
    }, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load your dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <NotificationSystem />
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

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
    </DashboardLayout>
  );
}