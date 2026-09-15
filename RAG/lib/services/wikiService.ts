import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content")

export interface WikiPage {
  slug: string
  title: string
  date?: string
  tags?: string[]
  content: string
  excerpt: string
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "")
}

function extractExcerpt(content: string, maxLength = 160): string {
  // Rimuove heading markdown e prende il primo paragrafo di testo
  const text = content
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#>-]/g, "")
    .replace(/\n+/g, " ")
    .trim()
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text
}

export function getAllPages(): WikiPage[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8")
    const { data, content } = matter(raw)

    return {
      slug: slugFromFilename(filename),
      title: (data.title as string) || slugFromFilename(filename),
      date: data.date ? String(data.date) : undefined,
      tags: Array.isArray(data.tags) ? data.tags : undefined,
      content,
      excerpt: extractExcerpt(content),
    }
  })
}

export function getPageBySlug(slug: string): WikiPage | null {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, "utf8")
  const { data, content } = matter(raw)

  return {
    slug,
    title: (data.title as string) || slug,
    date: data.date ? String(data.date) : undefined,
    tags: Array.isArray(data.tags) ? data.tags : undefined,
    content,
    excerpt: extractExcerpt(content),
  }
}
