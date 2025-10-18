"use client"

import useSWR from "swr"

export interface Location {
  country: string
  region: string
  city: string
  latitude: number
  longitude: number
}

export interface UserResult {
  location: Location
  IsAdimin: boolean
  _id: string
  email: string
  name: string
  full_name?: string
  isVerified: boolean
  ipAddress: string
  unique_id: string
  createdAt: string
  updatedAt: string
  __v: number
  mobile: number
  isVerifiedmobile: boolean
  otpExpiry: string
}

export interface IfscDetails {
  micr: string | null
  swift: string | null
  bank: string
  bank_code: string
  bank_name: string
  branch: string
  centre: string
  district: string
  state: string
  city: string
  address: string
  contact: string | null
  imps: boolean
  rtgs: boolean
  neft: boolean
  upi: boolean
}

export interface KycDataResult {
  _id: string
  unique_id: string
  __v: number
  aadhaar_linked: boolean
  adharpath: string
  completed: boolean
  createdAt: string
  email: string
  isVerified: boolean
  kyc_type: string
  status: string
  transaction_id: string
  updatedAt: string
}

export interface BankAccountResult {
  ifsc_details: IfscDetails
  _id: string
  unique_id: string
  __v: number
  account_exists: boolean
  createdAt: string
  email: string
  full_name: string
  id_number: string
  ifsc: string
  imps_ref_no: string | null
  remarks: string
  status: string
  updatedAt: string
}

export interface DebtResult {
  _id: string
  unique_id: string
  description: string
  amount: string
  debtType: string
  year: string
  proof: string
  transactionRef: string
  status: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ProfileResult {
  Userresult: UserResult
  kycdataresult: KycDataResult
  BankAccountresult: BankAccountResult
  Debtresult: DebtResult
}

export interface ProfileResponse {
  status: boolean
  message: string
  result: ProfileResult
}

import { authenticatedFetch } from "./use-auth"

async function postJson<T>(url: string, body: unknown, token?: string): Promise<T> {
  const res = await authenticatedFetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
  
  const text = await res.text()
  let message = text || `Request failed with ${res.status}`
  let data: any = {}
  
  try {
    data = JSON.parse(text)
    if (data?.error) message = data.error
    else if (data?.message) message = data.message
    else if (typeof data === "string") message = data
  } catch {
    // ignore JSON parse failure and use raw text
  }
  
  return data as T
}

type SwrKey = ["user-profile", string | undefined, string | null]

export function useUserProfile(uniqueId: string | undefined) {
  // Read token on client side; guard SWR key if missing
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  const shouldFetch = Boolean(uniqueId && token)
  const key: SwrKey | null = shouldFetch ? ["user-profile", uniqueId, token] : null

  const { data, error, isLoading, mutate } = useSWR<ProfileResponse>(
    key,
    async ([, id, t]) => {
      if (!id) throw new Error("Missing user id")
      if (!t) throw new Error("No session")
      // Call the internal API route which proxies to the upstream
      return await postJson<ProfileResponse>(
        "/api/user-profile",
        { unique_id: id, unique_user_id: id },
        t as string,
      )
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 2,
    }
  )

  return {
    profile: data?.result,
    raw: data,
    isLoading,
    error: error as Error | undefined,
    refresh: () => mutate(),
  }
}


