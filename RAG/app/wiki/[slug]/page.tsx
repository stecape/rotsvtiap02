import { getPageBySlug } from "@/lib/services/wikiService"
import WikiPage from "@/components/wiki/WikiPage"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function WikiSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getPageBySlug(slug)

  if (!page) notFound()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/wiki"
        className="text-sm text-gray-400 hover:text-white transition-colors mb-6 inline-block"
      >
        ← Wiki
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white">{page.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          {page.date && (
            <span className="text-sm text-gray-500">{page.date}</span>
          )}
          {page.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <WikiPage content={page.content} />
    </div>
  )
}
