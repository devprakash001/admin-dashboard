"use client"

import { useEffect, useState } from "react"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("admin_token")
}

export function clearToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem("admin_token")
}

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    setToken(getToken())
  }, [])
  return token
}
