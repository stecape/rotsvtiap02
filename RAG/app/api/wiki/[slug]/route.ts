import { getPageBySlug } from "@/lib/services/wikiService"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const page = getPageBySlug(slug)

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(page)
}
