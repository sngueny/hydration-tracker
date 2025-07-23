"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Droplets } from "lucide-react"

interface WaterEntry {
  _id: string
  amount: number
  unit: "ml" | "oz"
  timestamp: string
}

interface AddWaterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEntryAdded: (entry: WaterEntry) => void
}

export function AddWaterDialog({ open, onOpenChange, onEntryAdded }: AddWaterDialogProps) {
  const [amount, setAmount] = useState<number>(250)
  const [unit, setUnit] = useState<"ml" | "oz">("ml")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount, unit }),
      })

      if (response.ok) {
        const newEntry = await response.json()
        onEntryAdded(newEntry)
        onOpenChange(false)
        setAmount(250) // Reset to default
        setUnit("ml") // Reset to default
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to add water entry")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Error adding water entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Add Water Intake
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Unit</Label>
              <RadioGroup value={unit} onValueChange={(value) => setUnit(value as "ml" | "oz")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ml" id="ml" />
                  <Label htmlFor="ml">Milliliters (ml)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oz" id="oz" />
                  <Label htmlFor="oz">Fluid Ounces (oz)</Label>
                </div>
              </RadioGroup>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
