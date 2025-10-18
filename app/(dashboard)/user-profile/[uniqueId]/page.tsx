"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, User, MapPin, CreditCard, FileText, AlertCircle, Download, Eye } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useAuthToken, authenticatedFetch } from "@/hooks/use-auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border p-3 gap-1 sm:gap-0">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span className="text-sm font-medium break-all sm:break-normal text-right sm:text-left">{value}</span>
    </div>
  )
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const uniqueId = params.uniqueId as string
  const token = useAuthToken()
  const isAdmin = !!token
  
  const { profile, isLoading, error, refresh } = useUserProfile(uniqueId)
  const [adjustedAmount, setAdjustedAmount] = useState<string>("")
  const [debtUpdating, setDebtUpdating] = useState<boolean>(false)

  async function handleDebtUpdate(approved: boolean) {
    if (!token || !profile?.Debtresult?._id) {
      toast({ title: "Not allowed", description: "Admin authorization required", variant: "destructive" })
      return
    }
    setDebtUpdating(true)
    try {
      const amt = Number(adjustedAmount)
      const body = {
        unique_user_id: uniqueId,
        debtid: profile.Debtresult._id,
        approved,
        adjustedAmount: Number.isFinite(amt) && amt > 0 ? Math.floor(amt) : 0,
      }
      const res = await authenticatedFetch("/api/updateuserdebt", {
        method: "POST",
        body: JSON.stringify(body),
      })
      let data: any = {}
      let text = ""
      try {
        text = await res.text()
        data = text ? JSON.parse(text) : {}
      } catch {
        // non-JSON body
      }
      if (!res.ok) {
        const msg = data?.error || data?.message || text || `Failed to update debt (${res.status})`
        throw new Error(msg)
      }
      const successMsg = data?.message || (approved ? "Debt approved" : "Debt rejected")
      toast({ title: successMsg })
      setAdjustedAmount("")
      refresh()
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message || String(e), variant: "destructive" })
    } finally {
      setDebtUpdating(false)
    }
  }

  // If not logged in, show a friendly prompt instead of raw errors
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Login Required</h2>
            <p className="text-sm text-muted-foreground mb-4">Please log in as an admin to view this profile.</p>
            <Button onClick={() => router.replace("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="h-4 w-4" />
          Loading profile…
        </div>
      </div>
    )
  }

  if (error) {
    const raw = String(error?.message || "")
    const friendly =
      /authorization token required|bearer token|unauthorized|401/i.test(raw)
        ? "Authorization required. Please log in again."
        : raw || "Failed to load profile"
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Error Loading Profile</h2>
            <p className="text-sm text-muted-foreground mb-4">{friendly}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
              <Button onClick={() => router.replace("/login")}>Go to Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">
            {profile?.Userresult?.name || "Unknown User"}
          </p>
        </div>
      </div>

      {profile ? (
        <div className="grid gap-6">
          {/* User Information */}
          {profile.Userresult && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-primary">User Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <InfoRow label="Name" value={profile.Userresult.name || "-"} />
                <InfoRow label="Email" value={profile.Userresult.email || "-"} />
                <InfoRow label="Mobile" value={profile.Userresult.mobile || "-"} />
                <InfoRow label="Unique ID" value={profile.Userresult.unique_id || "-"} />
              </CardContent>
            </Card>
          )}
          
          {/* Account Status */}
          {profile.Userresult && (
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <InfoRow 
                  label="Email Verified" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.Userresult.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.Userresult.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  } 
                />
                <InfoRow 
                  label="Mobile Verified" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.Userresult.isVerifiedmobile 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.Userresult.isVerifiedmobile ? 'Verified' : 'Not Verified'}
                    </span>
                  } 
                />
                <InfoRow 
                  label="Admin Status" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.Userresult.IsAdimin 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.Userresult.IsAdimin ? 'Admin' : 'User'}
                    </span>
                  } 
                />
              </CardContent>
            </Card>
          )}

          {/* Location Information */}
          {profile.Userresult?.location && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-600">Location</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <InfoRow label="IP Address" value={profile.Userresult.ipAddress || "-"} />
                <InfoRow label="City" value={profile.Userresult.location.city || "-"} />
                <InfoRow label="Region" value={profile.Userresult.location.region || "-"} />
                <InfoRow label="Country" value={profile.Userresult.location.country || "-"} />
                {profile.Userresult.location.latitude && profile.Userresult.location.longitude && (
                  <InfoRow 
                    label="Coordinates" 
                    value={`${profile.Userresult.location.latitude}, ${profile.Userresult.location.longitude}`} 
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* KYC Information */}
          {profile.kycdataresult && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-600">KYC Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <InfoRow 
                  label="KYC Status" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.kycdataresult.status === 'verified'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profile.kycdataresult.status || 'Not Verified'}
                    </span>
                  } 
                />
                <InfoRow label="KYC Type" value={profile.kycdataresult.kyc_type || "-"} />
                <InfoRow label="Aadhaar Linked" value={profile.kycdataresult.aadhaar_linked ? "Yes" : "No"} />
                <InfoRow label="Completed" value={profile.kycdataresult.completed ? "Yes" : "No"} />
                <InfoRow label="Transaction ID" value={profile.kycdataresult.transaction_id || "-"} />
                <InfoRow 
                  label="Created" 
                  value={profile.kycdataresult.createdAt ? new Date(profile.kycdataresult.createdAt).toLocaleDateString() : "-"} 
                />
                {profile.kycdataresult.adharpath && isAdmin && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Aadhaar Document</h4>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                            <DialogHeader>
                              <DialogTitle>Aadhaar Document</DialogTitle>
                            </DialogHeader>
                            <AadhaarViewer adharpath={profile.kycdataresult.adharpath} watermark={profile.Userresult?.unique_id || "19Pays"} />
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadAadhaar(profile.kycdataresult.adharpath, profile.Userresult?.unique_id || "19Pays")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Admin access required to view and download Aadhaar documents.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bank Account Information */}
          {profile.BankAccountresult && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-600">Bank Account Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <InfoRow 
                  label="Account Status" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.BankAccountresult.status === 'success'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.BankAccountresult.status || 'Unknown'}
                    </span>
                  } 
                />
                <InfoRow label="Account Holder" value={profile.BankAccountresult.full_name || "-"} />
                <InfoRow label="Account Number" value={profile.BankAccountresult.id_number || "-"} />
                <InfoRow label="IFSC Code" value={profile.BankAccountresult.ifsc || "-"} />
                {profile.BankAccountresult.ifsc_details && (
                  <>
                    <InfoRow label="Bank Name" value={profile.BankAccountresult.ifsc_details.bank_name || "-"} />
                    <InfoRow label="Branch" value={profile.BankAccountresult.ifsc_details.branch || "-"} />
                    <InfoRow label="City" value={profile.BankAccountresult.ifsc_details.city || "-"} />
                    <InfoRow label="State" value={profile.BankAccountresult.ifsc_details.state || "-"} />
                    <InfoRow 
                      label="UPI Enabled" 
                      value={
                        <span className={`text-xs px-2 py-1 rounded ${
                          profile.BankAccountresult.ifsc_details.upi
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {profile.BankAccountresult.ifsc_details.upi ? 'Yes' : 'No'}
                        </span>
                      } 
                    />
                  </>
                )}
                <InfoRow 
                  label="Created" 
                  value={profile.BankAccountresult.createdAt ? new Date(profile.BankAccountresult.createdAt).toLocaleDateString() : "-"} 
                />
              </CardContent>
            </Card>
          )}

          {/* Debt Information */}
          {profile.Debtresult && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-600">Debt Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <InfoRow 
                  label="Status" 
                  value={
                    <span className={`text-xs px-2 py-1 rounded ${
                      profile.Debtresult.status
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.Debtresult.status ? 'Active' : 'Inactive'}
                    </span>
                  } 
                />
                <InfoRow label="Debt Type" value={profile.Debtresult.debtType || "-"} />
                <InfoRow label="Amount" value={`₹${profile.Debtresult.amount || "0"}`} />
                <InfoRow label="Description" value={profile.Debtresult.description || "-"} />
                <InfoRow label="Year" value={profile.Debtresult.year || "-"} />
                <InfoRow label="Transaction Ref" value={profile.Debtresult.transactionRef || "-"} />
                <InfoRow label="Proof" value={profile.Debtresult.proof || "-"} />
                <InfoRow 
                  label="Created" 
                  value={profile.Debtresult.createdAt ? new Date(profile.Debtresult.createdAt).toLocaleDateString() : "-"} 
                />
                {isAdmin && (
                  <div className="mt-2 grid gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Adjusted amount (optional)"
                        value={adjustedAmount}
                        onChange={(e) => setAdjustedAmount(e.target.value)}
                        className="max-w-[240px]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button disabled={debtUpdating} onClick={() => handleDebtUpdate(true)}>Approve</Button>
                      <Button variant="destructive" disabled={debtUpdating} onClick={() => handleDebtUpdate(false)}>Reject</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Details */}
          {profile.Userresult && (
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <InfoRow 
                  label="Created" 
                  value={profile.Userresult.createdAt ? new Date(profile.Userresult.createdAt).toLocaleDateString() : "-"} 
                />
                <InfoRow 
                  label="Last Updated" 
                  value={profile.Userresult.updatedAt ? new Date(profile.Userresult.updatedAt).toLocaleDateString() : "-"} 
                />
                {profile.Userresult.otpExpiry && (
                  <InfoRow 
                    label="OTP Expiry" 
                    value={new Date(profile.Userresult.otpExpiry).toLocaleDateString()} 
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No profile data available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

async function downloadAadhaar(adharpath: string, watermark: string) {
  try {
    const response = await authenticatedFetch(`/api/aadhaar/${encodeURI(adharpath)}`)
    if (!response.ok) throw new Error('Failed to fetch Aadhaar document')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Determine file extension based on content type
    const contentType = response.headers.get('content-type') || ''
    const extension = contentType.includes('pdf') ? 'pdf' : 'jpg'
    
    link.download = `aadhaar_${watermark}_${Date.now()}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading Aadhaar:', error)
    alert('Failed to download Aadhaar document')
  }
}

function AadhaarViewer({ adharpath, watermark }: { adharpath: string; watermark: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let aborted = false
    
    async function loadAadhaar() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Loading Aadhaar:', adharpath)
        const response = await authenticatedFetch(`/api/aadhaar/${encodeURI(adharpath)}`)
        console.log('Aadhaar response:', response.status, response.headers.get('content-type'))
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Aadhaar fetch error:', errorText)
          throw new Error(`Failed to fetch Aadhaar file: ${response.status}`)
        }
        
        const contentType = response.headers.get("content-type") || ""
        const blob = await response.blob()
        console.log('Aadhaar blob size:', blob.size, 'type:', contentType)
        
        if (aborted) return
        
        // Create blob URL for both PDFs and images
        const blobUrl = URL.createObjectURL(blob)
        console.log('Created blob URL:', blobUrl)
        setImageUrl(blobUrl)
      } catch (e: any) {
        console.error('Aadhaar loading error:', e)
        if (!aborted) {
          setError(e.message || "Failed to load Aadhaar document")
        }
      } finally {
        if (!aborted) {
          setLoading(false)
        }
      }
    }
    
    loadAadhaar()
    
    return () => {
      aborted = true
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [adharpath])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    
    const block = (e: Event) => e.preventDefault()
    el.addEventListener("contextmenu", block)
    el.addEventListener("dragstart", block)
    
    return () => {
      el.removeEventListener("contextmenu", block)
      el.removeEventListener("dragstart", block)
    }
  }, [])

  if (loading) {
    return (
      <div className="grid gap-2 select-none">
        <span className="text-sm text-muted-foreground font-medium">Aadhaar Document</span>
        <div className="rounded-md border p-8 bg-muted/20 flex items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-2 select-none">
        <span className="text-sm text-muted-foreground font-medium">Aadhaar Document</span>
        <div className="rounded-md border p-4 bg-muted/20">
          <p className="text-sm text-destructive">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="grid gap-2 select-none">
      <span className="text-sm text-muted-foreground font-medium">Aadhaar Document</span>
      <div className="rounded-md border p-2 bg-muted/20">
        {imageUrl && (
          <div className="space-y-2">
            {/* Try to display as image first */}
            <img
              src={imageUrl}
              alt="Aadhaar Document"
              className="w-full h-auto rounded-md object-contain"
              style={{ 
                filter: 'blur(0.5px)',
                maxHeight: '800px',
                minHeight: '400px'
              }}
              onError={(e) => {
                // If image fails to load, try as PDF in iframe
                const target = e.target as HTMLImageElement
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <iframe
                      src="${imageUrl}"
                      className="w-full rounded-md"
                      style="height: 600px; min-height: 400px;"
                      title="Aadhaar Document"
                    ></iframe>
                  `
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Document ID: {watermark} | Viewing only. Download/print is disabled.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

