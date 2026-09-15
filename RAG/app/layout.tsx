import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/Navigation"
import Providers from "@/components/Providers"
import { auth } from "@/auth"

export const metadata: Metadata = {
  title: "Wiki RAG",
  description: "Knowledge base con ricerca AI",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="it">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <Providers>
          {session && <Navigation />}
          <main className={session ? "ml-64 min-h-screen" : "min-h-screen"}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
