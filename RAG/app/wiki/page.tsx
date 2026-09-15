import { getAllPages } from "@/lib/services/wikiService"
import WikiList from "@/components/wiki/WikiList"

export const dynamic = "force-dynamic"

export default function WikiIndexPage() {
  const pages = getAllPages().map(({ slug, title, date, tags, excerpt }) => ({
    slug,
    title,
    date,
    tags,
    excerpt,
  }))

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Wiki</h1>
          <p className="text-gray-400 mt-1">{pages.length} pagine</p>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Nessuna pagina trovata.</p>
          <p className="text-sm mt-2">
            Aggiungi file <code className="text-gray-400">.md</code> nella
            cartella <code className="text-gray-400">content/</code>.
          </p>
        </div>
      ) : (
        <WikiList pages={pages} />
      )}
    </div>
  )
}
