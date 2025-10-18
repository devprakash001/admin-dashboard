"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthToken, clearToken } from '@/hooks/use-auth'
import { toast } from '@/components/ui/use-toast'

export function SessionManager() {
  const router = useRouter()
  const token = useAuthToken()

  useEffect(() => {
    // Global function to handle session expiry with proper toast
    const handleSessionExpiry = (message: string = 'Session expired') => {
      clearToken()
      toast({
        title: "Session Expired",
        description: message,
        variant: "destructive",
        duration: 3000,
      })
      
      // Redirect after showing toast
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }

    // Make it available globally
    if (typeof window !== 'undefined') {
      (window as any).handleSessionExpiry = handleSessionExpiry
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).handleSessionExpiry
      }
    }
  }, [router])

  return null // This component doesn't render anything
}
