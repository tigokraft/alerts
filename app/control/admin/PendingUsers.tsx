"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  email: string
  role: string
  approved: boolean
}

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([])

  useEffect(() => {
    fetch("/api/admin/pending-users")
      .then((res) => res.json())
      .then(setPendingUsers)
      .catch((err) => console.error("Error fetching pending users", err))
  }, [])

  const approveUser = async (id: string) => {
    try {
      const res = await fetch("/api/admin/approve-user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Failed to approve user")
      setPendingUsers((prev) => prev.filter((user) => user.id !== id))
    } catch (error) {
      console.error("Error approving user", error)
      alert("Failed to approve user")
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Failed to delete user")
      setPendingUsers((prev) => prev.filter((user) => user.id !== id))
    } catch (error) {
      console.error("Error deleting user", error)
      alert("Failed to delete user")
    }
  }

  return (
    <div>
      {pendingUsers.length === 0 ? (
        <p>No pending accounts.</p>
      ) : (
        <ul className="space-y-2">
          {pendingUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span>{user.email}</span>
              <div className="flex gap-2">
                <Button onClick={() => approveUser(user.id)} variant="default">
                  Approve
                </Button>
                <Button onClick={() => deleteUser(user.id)} variant="destructive">
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
