"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, User, MapPin, CreditCard, FileText, AlertCircle } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"

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
  
  const { profile, isLoading, error, refresh } = useUserProfile(uniqueId)

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Error Loading Profile</h2>
            <p className="text-sm text-muted-foreground mb-4">{error.message || String(error)}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
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
                <InfoRow label="IP Address" value={profile.Userresult.ipAddress || "-"} />
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
