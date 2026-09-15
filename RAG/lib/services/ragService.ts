import { Ollama } from "ollama"
import { db } from "@/lib/db/client"
import { documents } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import type { WikiPage } from "./wikiService"

function getOllama() {
  return new Ollama({
    host: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  })
}

// ─── Embedding ───────────────────────────────────────────────────────────────

export async function embedText(text: string): Promise<number[]> {
  const ollama = getOllama()
  const response = await ollama.embed({
    model: process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text",
    input: text,
  })
  return response.embeddings[0]
}

// ─── Chunking ─────────────────────────────────────────────────────────────────

function chunkText(text: string, maxChunkSize = 800): string[] {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 20)
  const chunks: string[] = []
  let current = ""

  for (const para of paragraphs) {
    if (current.length + para.length > maxChunkSize && current) {
      chunks.push(current.trim())
      current = para
    } else {
      current += (current ? "\n\n" : "") + para
    }
  }

  if (current.trim()) chunks.push(current.trim())
  return chunks
}

// ─── Ingest ───────────────────────────────────────────────────────────────────

export async function ingestDocuments(pages: WikiPage[]): Promise<number> {
  // Svuota la tabella e reindicizza tutto
  await db.delete(documents)

  let totalChunks = 0

  for (const page of pages) {
    const chunks = chunkText(page.content)

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await embedText(chunks[i])
      await db.insert(documents).values({
        slug: page.slug,
        title: page.title,
        chunkIndex: i,
        content: chunks[i],
        embedding,
      })
      totalChunks++
    }
  }

  return totalChunks
}

// ─── Query ────────────────────────────────────────────────────────────────────

export interface RagContext {
  slug: string
  title: string
  content: string
}

export async function queryRAG(question: string, topK = 5): Promise<RagContext[]> {
  const embedding = await embedText(question)
  const embeddingLiteral = `[${embedding.join(",")}]`

  const results = await db
    .select({
      slug: documents.slug,
      title: documents.title,
      content: documents.content,
    })
    .from(documents)
    .orderBy(sql`embedding <=> ${embeddingLiteral}::vector`)
    .limit(topK)

  return results
}

export function buildSystemPrompt(contexts: RagContext[]): string {
  const contextText = contexts
    .map((c) => `## ${c.title} (/${c.slug})\n\n${c.content}`)
    .join("\n\n---\n\n")

  return `Sei un assistente che risponde ESCLUSIVAMENTE basandosi sul seguente contesto dalla wiki.
Se la risposta non è nel contesto, dillo chiaramente senza inventare informazioni.

CONTESTO:
${contextText}`
}
