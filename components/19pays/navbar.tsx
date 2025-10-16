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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
]

function MobileSidebarContent() {
  const pathname = usePathname()
  return (
    <>
      <div className="h-14 flex items-center px-4 border-b">
        <span className="font-semibold">Admin</span>
      </div>
      <nav className="p-2">
        <ul className="grid gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn("block rounded-md px-3 py-2 text-sm hover:bg-accent", active ? "bg-accent" : "")}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

export function Navbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const token = useAuthToken()
  const [q, setQ] = useState("")
  const isMobile = useIsMobile()

  useEffect(() => {
    setQ("")
  }, [pathname])

  function logout() {
    clearToken()
    router.replace("/login")
  }

  return (
    <header className="h-14 border-b bg-card/50 backdrop-blur flex items-center justify-between px-2 sm:px-4">
      <div className="flex items-center gap-2">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <MobileSidebarContent />
            </SheetContent>
          </Sheet>
        )}
        
        <div className="w-full max-w-xs sm:max-w-md">
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              onSearch?.(e.target.value)
            }}
            placeholder="Search…"
            aria-label="Search"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full px-2 sm:px-3 bg-transparent text-xs sm:text-sm">
              <span className="sr-only">Open profile</span>
              <span className="hidden sm:inline">{token ? "Admin" : "Guest"}</span>
              <span className="sm:hidden">👤</span>
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
