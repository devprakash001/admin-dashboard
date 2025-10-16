import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch("https://19pays-api.oneninelabs.com/api/adminlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    const contentType = res.headers.get("content-type") || ""
    const data = contentType.includes("application/json") ? JSON.parse(text) : { raw: text }
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Login proxy failed" }, { status: 500 })
  }
}
