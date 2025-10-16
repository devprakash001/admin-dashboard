"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/19pays/sidebar"
import { Navbar } from "@/components/19pays/navbar"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [search, setSearch] = useState<string>("")

  useEffect(() => {
    const t = localStorage.getItem("admin_token")
    if (!t) {
      router.replace("/login")
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <main className="min-h-dvh grid place-items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="h-4 w-4" />
          Checking session…
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-dvh">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onSearch={setSearch} />
          <main className="flex-1 p-2 sm:p-4 overflow-x-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
