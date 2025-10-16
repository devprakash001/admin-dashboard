import { NextResponse } from "next/server"

async function forward(auth: string | null) {
  const res = await fetch("https://19pays-api.oneninelabs.com/api/getalluser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body: JSON.stringify({}),
  })
  const text = await res.text()
  const contentType = res.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? JSON.parse(text) : { raw: text }
  return NextResponse.json(data, { status: res.status })
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization")
  return forward(auth)
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization")
  return forward(auth)
}
