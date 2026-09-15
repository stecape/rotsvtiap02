import Link from "next/link"
import SignOutButton from "./SignOutButton"

export default function Navigation() {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-10">
      <div className="p-5 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">Wiki RAG</h1>
      </div>

      <div className="flex-1 p-4 space-y-1">
        <Link
          href="/wiki"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
        >
          <span>📚</span> Wiki
        </Link>
        <Link
          href="/chat"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
        >
          <span>💬</span> AI Chat
        </Link>
      </div>

      <div className="p-4 border-t border-gray-800">
        <SignOutButton />
      </div>
    </nav>
  )
}
