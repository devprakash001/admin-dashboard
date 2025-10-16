"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

type User = {
  _id?: string
  name?: string
  full_name?: string
  email?: string
  unique_id?: string
  unique_user_id?: string
  id?: string
  mobile?: number
  isVerified?: boolean
  isVerifiedmobile?: boolean
  IsAdimin?: boolean
  location?: {
    country?: string
    region?: string
    city?: string
    latitude?: number
    longitude?: number
  }
  ipAddress?: string
  createdAt?: string
  updatedAt?: string
  __v?: number
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
  const router = useRouter()

  const filtered = useMemo(() => {
    if (!data) return []
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter((u) =>
      [u.name, u.full_name, u.email, u.unique_id, u.unique_user_id, u.id, u._id, u.mobile]
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
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
              {filtered.map((u, idx) => {
                const name = u.name || u.full_name || "-"
                const email = u.email || "-"
                const uid = u.unique_id || u.unique_user_id || u.id || u._id || "-"
                const mobile = u.mobile || "-"
                const isAdmin = u.IsAdimin || false
                const isVerified = u.isVerified || false
                const isVerifiedMobile = u.isVerifiedmobile || false
                const location = u.location ? `${u.location.city || ""}, ${u.location.country || ""}`.replace(/^,\s*|,\s*$/g, "") : "-"
                
                return (
                  <Card key={`${uid}-${idx}`} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{name}</h3>
                        <div className="flex gap-1">
                          {isAdmin && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Admin</span>}
                          {isVerified && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div><strong>Email:</strong> {email}</div>
                        <div><strong>Mobile:</strong> {mobile}</div>
                        <div><strong>Location:</strong> {location}</div>
                        <div><strong>ID:</strong> {uid}</div>
                        <div className="flex gap-1 pt-1">
                          {isVerified && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Email ✓</span>}
                          {isVerifiedMobile && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Mobile ✓</span>}
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => router.push(`/user-profile/${uid}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
              {filtered.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No users found.
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <Table className="hidden sm:table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Unique ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u, idx) => {
                  const name = u.name || u.full_name || "-"
                  const email = u.email || "-"
                  const mobile = u.mobile || "-"
                  const uid = u.unique_id || u.unique_user_id || u.id || u._id || "-"
                  const isAdmin = u.IsAdimin || false
                  const isVerified = u.isVerified || false
                  const isVerifiedMobile = u.isVerifiedmobile || false
                  const location = u.location ? `${u.location.city || ""}, ${u.location.country || ""}`.replace(/^,\s*|,\s*$/g, "") : "-"
                  
                  return (
                    <TableRow key={`${uid}-${idx}`}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{mobile}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{location}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {isAdmin && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Admin</span>}
                          {isVerified && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">✓</span>}
                          {isVerifiedMobile && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">📱</span>}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">{uid}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => router.push(`/user-profile/${uid}`)}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
