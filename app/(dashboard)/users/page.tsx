"use client"

import { useState } from "react"
import { UsersTable } from "@/components/19pays/user-table"

export default function UsersPage() {
  // When needed, we could elevate search to a context; for now, a separate search can be added here if desired.
  const [search, setSearch] = useState<string>("") // reserved for future use
  return (
    <div className="grid gap-4">
      <UsersTable search={search} />
    </div>
  )
}
