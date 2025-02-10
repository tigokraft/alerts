"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import TimeKeeper from "react-timekeeper"

// Extend your Alert interface to include soundId (optional)
interface Alert {
  id: number
  name: string
  time: string
  repeat: "none" | "daily" | "specific"
  days?: string
  active: boolean
  soundId?: number
}

// Define a Sound interface matching your Prisma model
interface Sound {
  id: number
  name: string
  fileUrl: string
}

interface RepeatOption {
  label: string
  value: "none" | "daily" | "specific"
}

const DAYS_OF_WEEK = [
  { label: "Sun", value: "Sunday" },
  { label: "Mon", value: "Monday" },
  { label: "Tue", value: "Tuesday" },
  { label: "Wed", value: "Wednesday" },
  { label: "Thu", value: "Thursday" },
  { label: "Fri", value: "Friday" },
  { label: "Sat", value: "Saturday" },
]

export default function AlertsClient() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({})
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [repeatOptions, setRepeatOptions] = useState<RepeatOption[]>([
    { label: "Don't Repeat", value: "none" },
    { label: "Daily", value: "daily" },
    { label: "Specific Days", value: "specific" },
  ])
  const [sounds, setSounds] = useState<Sound[]>([])

  // Fetch alerts on mount
  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then(setAlerts)
      .catch((err) => console.error("Error fetching alerts:", err))
  }, [])

  // Fetch available sounds on mount
  useEffect(() => {
    fetch("/api/sounds")
      .then((res) => res.json())
      .then(setSounds)
      .catch((err) => console.error("Error fetching sounds:", err))
  }, [])

  // Add a new alert
  async function addAlert() {
    if (!newAlert.name || !newAlert.time || !newAlert.repeat) return
    if (newAlert.repeat === "specific" && selectedDays.length === 0) {
      alert("Please select at least one day for specific repeat.")
      return
    }

    const daysString = newAlert.repeat === "specific" ? selectedDays.join(",") : null

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAlert,
          days: daysString,
          active: true,
        }),
      })
      if (!res.ok) throw new Error("Failed to add alert")
      const createdAlert = await res.json()
      setAlerts((prev) => [createdAlert, ...prev])
      setNewAlert({})
      setSelectedDays([])
      setShowDialog(false)
    } catch (error) {
      console.error("Error adding alert:", error)
      alert("Failed to add alert")
    }
  }

  // Delete an alert
  async function deleteAlert(id: number) {
    try {
      const res = await fetch("/api/alerts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Failed to delete alert")
      setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    } catch (error) {
      console.error("Error deleting alert:", error)
      alert("Failed to delete alert")
    }
  }

  // Toggle active state
  async function toggleAlertActive(id: number, currentActive: boolean) {
    try {
      const res = await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      })
      if (!res.ok) throw new Error("Failed to update alert")
      const updatedAlert = await res.json()
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? updatedAlert : alert))
      )
    } catch (error) {
      console.error("Error updating alert:", error)
      alert("Failed to update alert")
    }
  }

  // Select or deselect a day for "specific" repeats
  function toggleDay(day: string) {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  return (
    <div>
      {/* Add Alert Dialog */}
      <div className="mb-6">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus size={16} /> Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-lg shadow-lg p-6 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
            <DialogHeader>
              <DialogTitle>Add Alert</DialogTitle>
            </DialogHeader>
            {/* Alert Name */}
            <div className="mb-4">
              <Label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                Alert Name
              </Label>
              <Input
                placeholder="Alert Name"
                value={newAlert.name || ""}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, name: e.target.value })
                }
                className="bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-md p-2"
              />
            </div>
            {/* Time Picker */}
            <div className="relative mb-4">
              <Label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                Time
              </Label>
              <Input
                readOnly
                placeholder="Select Time"
                value={newAlert.time || ""}
                onClick={() => setShowTimePicker((prev) => !prev)}
                className="cursor-pointer bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-md p-2"
              />
              {showTimePicker && (
                <div className="absolute z-10 mt-2 shadow-lg rounded-md overflow-hidden">
                  <TimeKeeper
                    time={newAlert.time || "12:00"}
                    onChange={(newTime) =>
                      setNewAlert({ ...newAlert, time: newTime.formatted24 })
                    }
                    onDoneClick={() => setShowTimePicker(false)}
                    switchToMinuteOnHourSelect
                  />
                </div>
              )}
            </div>
            {/* Repeat Dropdown */}
            <div className="mb-4">
              <Label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                Repeat
              </Label>
              <Select
                onValueChange={(val) =>
                  setNewAlert({
                    ...newAlert,
                    repeat: val as "none" | "daily" | "specific",
                  })
                }
                value={newAlert.repeat || ""}
              >
                <SelectTrigger className="bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-md p-2">
                  <SelectValue placeholder="Select Repeat Option" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))] border border-[hsl(var(--border))] rounded-md">
                  {repeatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Specific Days */}
            {newAlert.repeat === "specific" && (
              <div className="mb-4">
                <Label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                  Select Days
                </Label>
                <div className="flex gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <label key={day.value} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day.value)}
                        onChange={() => toggleDay(day.value)}
                        className="rounded border border-[hsl(var(--border))]"
                      />
                      <span className="text-[hsl(var(--foreground))]">
                        {day.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {/* Sound Selection Dropdown */}
            <div className="mb-4">
              <Label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                Select Sound
              </Label>
              <Select
                onValueChange={(val) =>
                  setNewAlert({
                    ...newAlert,
                    soundId: parseInt(val, 10),
                  })
                }
                value={newAlert.soundId ? newAlert.soundId.toString() : ""}
              >
                <SelectTrigger className="bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] rounded-md p-2">
                  <SelectValue placeholder="Select Sound" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))] border border-[hsl(var(--border))] rounded-md">
                  {sounds.map((sound) => (
                    <SelectItem key={sound.id} value={sound.id.toString()}>
                      {sound.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addAlert}>Save Alert</Button>
          </DialogContent>
        </Dialog>
      </div>
      {/* List of Existing Alerts */}
      <div>
        {alerts.length === 0 ? (
          <p>No alerts available.</p>
        ) : (
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="p-4 border border-[hsl(var(--border))] rounded-md flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-semibold">{alert.name}</div>
                  <div>Time: {alert.time}</div>
                  <div>
                    Repeat:{" "}
                    {alert.repeat === "none"
                      ? "Don't Repeat"
                      : alert.repeat === "daily"
                      ? "Daily"
                      : "Specific Days"}
                  </div>
                  {alert.repeat === "specific" && alert.days && (
                    <div>
                      Days:{" "}
                      {typeof alert.days === "string"
                        ? alert.days
                            .split(",")
                            .map((d) => d.trim())
                            .join(", ")
                        : alert.days}
                    </div>
                  )}
                  <div>Status: {alert.active ? "Enabled" : "Disabled"}</div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button
                    variant="outline"
                    onClick={() => toggleAlertActive(alert.id, alert.active)}
                  >
                    {alert.active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
