import { getAllPages } from "@/lib/services/wikiService"
import { ingestDocuments } from "@/lib/services/ragService"
import { NextResponse, type NextRequest } from "next/server"

export const dynamic = "force-dynamic"

// POST /api/ingest → reindicizza tutti i file .md nella wiki
export async function POST(req: NextRequest) {
  const secret = process.env.INGEST_SECRET
  if (secret) {
    const provided = req.headers.get("x-ingest-secret")
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }
  try {
    const pages = getAllPages()
    const count = await ingestDocuments(pages)
    return NextResponse.json({ success: true, pages: pages.length, chunks: count })
  } catch (err) {
    console.error("Ingest error:", err)
    return NextResponse.json(
      { error: "Ingest failed", detail: String(err) },
      { status: 500 }
    )
  }
}
