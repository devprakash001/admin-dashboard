"use client"

import { Button } from "@/components/ui/button"
import { clearToken } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold text-balance">Settings</h1>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground mb-2">Session</p>
        <Button
          variant="destructive"
          onClick={() => {
            clearToken()
            router.replace("/login")
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
