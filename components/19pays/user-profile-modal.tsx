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
          body: JSON.stringify({ unique_id: uniqueId }),
        })
        if (!res.ok) {
          const t = await res.text()
          throw new Error(t || "Failed to load profile")
        }
        const data = await res.json()
        // Handle the API response structure: { status, message, result: [...] }
        const profileData = data?.result?.[0] || data?.profile || data?.data || data
        setProfile(profileData)
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
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
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
          <div className="grid gap-3">
            <div className="grid gap-2">
              <InfoRow label="Name" value={profile.name || profile.full_name || "-"} />
              <InfoRow label="Email" value={profile.email || "-"} />
              <InfoRow label="Mobile" value={profile.mobile || "-"} />
              <InfoRow label="Unique ID" value={profile.unique_id || profile.unique_user_id || profile.id || profile._id || "-"} />
            </div>
            
            <div className="border-t pt-3">
              <h4 className="font-medium text-sm mb-2">Account Status</h4>
              <div className="grid gap-2">
                <InfoRow 
                  label="Email Verified" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  } 
                />
                <InfoRow 
                  label="Mobile Verified" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.isVerifiedmobile 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.isVerifiedmobile ? 'Verified' : 'Not Verified'}
                    </span>
                  } 
                />
                <InfoRow 
                  label="Admin Status" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.IsAdimin 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.IsAdimin ? 'Admin' : 'User'}
                    </span>
                  } 
                />
              </div>
            </div>

            {profile.location && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Location</h4>
                <div className="grid gap-2">
                  <InfoRow label="City" value={profile.location.city || "-"} />
                  <InfoRow label="Region" value={profile.location.region || "-"} />
                  <InfoRow label="Country" value={profile.location.country || "-"} />
                  {profile.location.latitude && profile.location.longitude && (
                    <InfoRow 
                      label="Coordinates" 
                      value={`${profile.location.latitude}, ${profile.location.longitude}`} 
                    />
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-3">
              <h4 className="font-medium text-sm mb-2">Account Details</h4>
              <div className="grid gap-2">
                <InfoRow label="IP Address" value={profile.ipAddress || "-"} />
                <InfoRow 
                  label="Created" 
                  value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"} 
                />
                <InfoRow 
                  label="Last Updated" 
                  value={profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "-"} 
                />
              </div>
            </div>
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border p-2 gap-1 sm:gap-0">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span className="text-sm font-medium break-all sm:break-normal text-right sm:text-left">{value}</span>
    </div>
  )
}
