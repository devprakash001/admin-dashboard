import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization")
    if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    const body = await request.json()
    const upstream = await fetch("https://19pays-api.oneninelabs.com/api/updateuserdebt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(body),
    })

    const text = await upstream.text()
    const contentType = upstream.headers.get("content-type") || ""
    const data = contentType.includes("application/json") ? JSON.parse(text) : { raw: text }
    return NextResponse.json(data, { status: upstream.status })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Debt update proxy failed" }, { status: 500 })
  }
}


