"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { UserProfileModal } from "./user-profile-modal"

type User = {
  name?: string
  full_name?: string
  email?: string
  unique_user_id?: string
  id?: string
  [k: string]: any
}

async function fetchUsers(): Promise<User[]> {
  const token = localStorage.getItem("admin_token")
  if (!token) throw new Error("No session")
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(t || "Failed to load users")
  }
  const data = await res.json()
  // Attempt common shapes: { users: [] } or { data: [] } or []
  const list = data?.users || data?.data || data?.result || data
  return Array.isArray(list) ? list : []
}

export function UsersTable({ search }: { search?: string }) {
  const { data, error, isLoading, mutate } = useSWR("users", fetchUsers)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!data) return []
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter((u) =>
      [u.name, u.full_name, u.email, u.unique_user_id, u.id]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [data, search])

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <Button variant="outline" onClick={() => mutate()}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Loading users…
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">{error.message ?? "Failed to load users"}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Unique ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u, idx) => {
                  const name = u.name || u.full_name || "-"
                  const email = u.email || "-"
                  const uid = u.unique_user_id || u.id || "-"
                  return (
                    <TableRow key={`${uid}-${idx}`}>
                      <TableCell>{name}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{uid}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedId(String(uid))
                            setOpen(true)
                          }}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <UserProfileModal open={open} onOpenChange={setOpen} uniqueId={selectedId} />
    </Card>
  )
}
