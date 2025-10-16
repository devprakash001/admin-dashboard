"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
]

function SidebarContent() {
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

export function Sidebar() {
  // Only show sidebar on desktop, mobile menu is handled in navbar
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-card/40">
      <SidebarContent />
    </aside>
  )
}
