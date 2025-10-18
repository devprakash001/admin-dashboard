"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  
  useEffect(() => {
    const currentToken = getToken()
    setToken(currentToken)
  }, [])
  
  return token
}

// Enhanced fetch wrapper that handles token validation and redirects
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  
  if (!token) {
    clearToken()
    // Use global session expiry handler if available
    if (typeof window !== 'undefined' && (window as any).handleSessionExpiry) {
      (window as any).handleSessionExpiry('No authentication token. Please log in to continue.')
    } else {
      // Fallback to immediate redirect
      window.location.href = '/login'
    }
    throw new Error('No authentication token')
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  
  // Handle token expiry
  if (response.status === 401) {
    clearToken()
    // Use global session expiry handler if available
    if (typeof window !== 'undefined' && (window as any).handleSessionExpiry) {
      (window as any).handleSessionExpiry('Your session has expired. Redirecting to login...')
    } else {
      // Fallback to immediate redirect
      window.location.href = '/login'
    }
    throw new Error('Session expired')
  }
  
  return response
}
