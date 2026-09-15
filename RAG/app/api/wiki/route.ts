import { getAllPages } from "@/lib/services/wikiService"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const pages = getAllPages().map(({ slug, title, date, tags, excerpt }) => ({
    slug,
    title,
    date,
    tags,
    excerpt,
  }))
  return NextResponse.json(pages)
}
