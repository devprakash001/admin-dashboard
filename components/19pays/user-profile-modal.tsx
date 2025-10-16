"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  uniqueId: string | null
}

export function UserProfileModal({ open, onOpenChange, uniqueId }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function load() {
      if (!open || !uniqueId) return
      setLoading(true)
      setError(null)
      setProfile(null)
      try {
        const token = localStorage.getItem("admin_token")
        if (!token) throw new Error("No session")
        const res = await fetch("/api/user-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ unique_user_id: uniqueId }),
        })
        if (!res.ok) {
          const t = await res.text()
          throw new Error(t || "Failed to load profile")
        }
        const data = await res.json()
        setProfile(data?.profile || data?.data || data)
      } catch (err: any) {
        setError(err.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [open, uniqueId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Loading profile…
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : profile ? (
          <div className="grid gap-2">
            <InfoRow label="Name" value={profile.name || profile.full_name || "-"} />
            <InfoRow label="Email" value={profile.email || "-"} />
            <InfoRow label="Unique ID" value={profile.unique_user_id || "-"} />
            {/* Add more fields as available */}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No profile data.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-md border p-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
