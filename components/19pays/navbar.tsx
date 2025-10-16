"use client"

import { useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clearToken, useAuthToken } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import ThemeToggle from "@/components/theme-toggle"

export function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const token = useAuthToken()
  const [q, setQ] = useState("")

  useEffect(() => {
    setQ("")
  }, [pathname])

  function logout() {
    clearToken()
    router.replace("/login")
  }

  return (
    <header className="h-14 border-b bg-card/50 backdrop-blur flex items-center justify-between px-4">
      <div className="w-full max-w-md">
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            onSearch?.(e.target.value)
          }}
          placeholder="Search…"
          aria-label="Search"
        />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full px-3 bg-transparent">
              <span className="sr-only">Open profile</span>
              {token ? "Admin" : "Guest"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
