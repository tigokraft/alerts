// ChangePasswordDialog.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess: () => void
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("")

  const handleSubmit = async () => {
    if (!newPassword) {
      alert("Please enter a new password")
      return
    }
    try {
      const res = await fetch("/api/admin/change-user-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, newPassword }),
      })
      if (!res.ok) throw new Error("Failed to change password")
      onSuccess()
      onOpenChange(false)
      setNewPassword("")
    } catch (error) {
      console.error("Error changing password", error)
      alert("Failed to change password")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background border border-border shadow-lg rounded-lg p-6">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter a new password for the selected user.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
