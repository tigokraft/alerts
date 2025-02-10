"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ChangePasswordDialog from "./ChangePasswordDialog" // adjust the import path as needed
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  role: string
  approved: boolean
}

export default function ExistingUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/admin/existing-users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Error fetching existing users", err))
  }, [])

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Failed to delete user")
      setUsers((prev) => prev.filter((user) => user.id !== id))
    } catch (error) {
      console.error("Error deleting user", error)
      alert("Failed to delete user")
    }
  }

  const updateUserRole = async (id: string, newRole: string) => {
    try {
      setLoadingId(id)
      const res = await fetch("/api/admin/update-user-role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      })
      if (!res.ok) throw new Error("Failed to update role")
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      )
    } catch (error) {
      console.error("Error updating user role", error)
      alert("Failed to update role")
    } finally {
      setLoadingId(null)
    }
  }

  const openChangePassword = (id: string) => {
    setSelectedUserId(id)
    setIsChangePasswordOpen(true)
  }

  return (
    <div>
      {users.length === 0 ? (
        <p>No existing accounts.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              {/* Left side: fixed-width email and role dropdown */}
              <div className="flex items-center gap-4">
                {/* Fixed width container for email */}
                <div className="w-64 truncate">{user.email}</div>
                <Select
                  value={user.role}
                  onValueChange={(val) => updateUserRole(user.id, val)}
                  disabled={loadingId === user.id}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="CONTROLER">CONTROLER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Right side: Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => openChangePassword(user.id)}
                  disabled={loadingId === user.id}
                >
                  Change Password
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteUser(user.id)}
                  disabled={loadingId === user.id}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Change Password Dialog */}
      {isChangePasswordOpen && (
        <ChangePasswordDialog
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
          userId={selectedUserId}
          onSuccess={() => {
            toast({
                title: "Pasword Reset complete",
            })
          }}
          
          
        />
      )}
    </div>
  )
}
