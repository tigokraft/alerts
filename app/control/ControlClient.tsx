// app/control/ControlClient.tsx
"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"

// For SWR, define a simple fetcher:
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ControlClient() {
  const [loadingTest, setLoadingTest] = useState(false)

  // Poll the active video
  const { data: videoData, error: videoError } = useSWR("/api/video/active", fetcher, {
    refreshInterval: 5000,
  })

  // Poll the alerts
  const { data: alerts, error: alertsError, mutate } = useSWR("/api/alerts", fetcher, {
    refreshInterval: 5000,
  })

  // Active video object
  const activeVideo = videoData?.video || null

  // Filter upcoming alerts
  const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  const upcomingAlerts = alerts
    ? [...alerts].filter((alert: any) => alert.time > now)
    : []
  upcomingAlerts.sort((a: any, b: any) => a.time.localeCompare(b.time))

  async function testAlert() {
    setLoadingTest(true)
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const payload = {
      name: "Test Alert",
      time: currentTime,
      repeat: "none",
      days: null,
      sound: null,
      active: true,
    }

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to create test alert")
      // Revalidate / refresh the alerts
      mutate()
    } catch (err) {
      console.error(err)
      alert("Error creating test alert")
    } finally {
      setLoadingTest(false)
    }
  }

  return (
    <div>
      {/* Active Video Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Active Video</h2>
        {videoError ? (
          <p className="text-red-500">Error loading active video.</p>
        ) : activeVideo ? (
          <p>Video: {activeVideo.path}</p>
        ) : (
          <p>No active video.</p>
        )}
      </div>

      {/* Upcoming Alerts Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Upcoming Alerts</h2>
        {alertsError ? (
          <p className="text-red-500">Error loading alerts.</p>
        ) : !alerts ? (
          <p>Loading alerts...</p>
        ) : upcomingAlerts.length > 0 ? (
          <ul className="list-disc pl-5">
            {upcomingAlerts.map((alert: any) => (
              <li key={alert.id}>{alert.name} at {alert.time}</li>
            ))}
          </ul>
        ) : (
          <p>No upcoming alerts for today.</p>
        )}
      </div>

      {/* Test Alert Button */}
      <Button onClick={testAlert} disabled={loadingTest}>
        {loadingTest ? "Testing..." : "Test Alert"}
      </Button>
    </div>
  )
}
