"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/adminlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        let errorMessage = "Login failed"
        try {
          const errorData = await res.json()
          // Handle different error response formats
          if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else if (typeof errorData === 'string') {
            errorMessage = errorData
          } else if (errorData.raw) {
            errorMessage = errorData.raw
          }
        } catch {
          // If JSON parsing fails, try to get text
          const text = await res.text()
          errorMessage = text || "Login failed"
        }
        throw new Error(errorMessage)
      }
      const data = await res.json()
      // Attempt common token shapes
      const token: string | undefined = data?.token || data?.jwt || data?.access_token || data?.data?.token
      if (!token) throw new Error("No token returned")
      localStorage.setItem("admin_token", token)
      toast({ title: "Logged in", description: "Welcome back!" })
      router.replace("/dashboard")
    } catch (err: any) {
      // Provide user-friendly error messages
      let errorMessage = "Login failed"
      
      if (err.message) {
        // Clean up common error messages
        const message = err.message.toLowerCase()
        if (message.includes('unauthorized') || message.includes('invalid credentials')) {
          errorMessage = "Invalid email or password"
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (message.includes('timeout')) {
          errorMessage = "Request timed out. Please try again."
        } else if (message.includes('server') || message.includes('500')) {
          errorMessage = "Server error. Please try again later."
        } else if (message.includes('no token')) {
          errorMessage = "Authentication failed. Please check your credentials."
        } else {
          // For other errors, show the original message if it's not JSON
          if (!err.message.startsWith('{') && !err.message.startsWith('[')) {
            errorMessage = err.message
          }
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin</CardTitle>
          <CardDescription>Sign in to manage the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@19pays.com"
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            {error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mt-2">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
