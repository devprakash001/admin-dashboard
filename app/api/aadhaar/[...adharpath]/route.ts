import { NextResponse } from "next/server"

export async function GET(_request: Request, context: { params: Promise<{ adharpath: string[] }> }) {
  try {
    const { adharpath } = await context.params
    const joined = Array.isArray(adharpath) ? adharpath.join("/") : String(adharpath || "")
    if (!joined) return new NextResponse("Missing adharpath", { status: 400 })

    const upstream = `https://19pays-api.oneninelabs.com/api/aadhar/${encodeURI(joined)}`
    const res = await fetch(upstream)
    if (!res.ok) {
      const text = await res.text()
      return new NextResponse(text || "Failed to fetch image", { status: res.status })
    }

    const contentType = res.headers.get("content-type") || "image/jpeg"
    const body = res.body
    if (!body) return new NextResponse("No content", { status: 502 })

    const headers = new Headers()
    headers.set("Content-Type", contentType)
    headers.set("Cache-Control", "private, max-age=60")

    return new NextResponse(body, { status: 200, headers })
  } catch (e: any) {
    return new NextResponse(e?.message || "Proxy error", { status: 500 })
  }
}


