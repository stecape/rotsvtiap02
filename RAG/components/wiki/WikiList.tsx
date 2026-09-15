import Link from "next/link"

interface WikiPageMeta {
  slug: string
  title: string
  date?: string
  tags?: string[]
  excerpt: string
}

interface Props {
  pages: WikiPageMeta[]
}

export default function WikiList({ pages }: Props) {
  return (
    <div className="grid gap-3">
      {pages.map((page) => (
        <Link key={page.slug} href={`/wiki/${page.slug}`}>
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-600 hover:bg-gray-900/80 transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                  {page.title}
                </h2>
                {page.excerpt && (
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                    {page.excerpt}
                  </p>
                )}
                {page.tags && page.tags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {page.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {page.date && (
                <span className="text-xs text-gray-600 shrink-0">{page.date}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
