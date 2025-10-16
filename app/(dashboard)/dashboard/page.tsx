"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function fetchUsersCount(): Promise<number | null> {
  const token = localStorage.getItem("admin_token")
  if (!token) return null
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
  if (!res.ok) return null
  const data = await res.json()
  const list = data?.users || data?.data || data?.result || data
  return Array.isArray(list) ? list.length : null
}

export default function DashboardHome() {
  const { data: count, isLoading } = useSWR("users-count", fetchUsersCount)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">Total Users</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{isLoading ? "…" : (count ?? "-")}</CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">New Signups</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">-</CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">Reports</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">-</CardContent>
      </Card>
    </div>
  )
}
