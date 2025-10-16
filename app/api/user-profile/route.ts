import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization")
    const body = await request.json()
    const res = await fetch("https://19pays-api.oneninelabs.com/api/getuserprofile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    const contentType = res.headers.get("content-type") || ""
    const data = contentType.includes("application/json") ? JSON.parse(text) : { raw: text }
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Profile proxy failed" }, { status: 500 })
  }
}
