import { queryRAG, buildSystemPrompt } from "@/lib/services/ragService"
import { Ollama } from "ollama"
import OpenAI from "openai"
import { z } from "zod"

export const dynamic = "force-dynamic"
export const maxDuration = 300

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
  provider: z.enum(["ollama", "openai"]).default("ollama"),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    return new Response("Invalid request", { status: 400 })
  }

  const { message, provider } = parsed.data

  // Recupera i chunk più rilevanti dalla wiki (embeddings sempre locali via Ollama)
  const contexts = await queryRAG(message)
  const systemPrompt = buildSystemPrompt(contexts)

  const encoder = new TextEncoder()

  if (provider === "openai") {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      stream: true,
    })

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ""
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    })
  }

  // Default: Ollama
  const ollama = new Ollama({
    host: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  })

  const stream = await ollama.chat({
    model: process.env.OLLAMA_MODEL ?? "llama3.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    stream: true,
  })

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.message.content
          if (text) controller.enqueue(encoder.encode(text))
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
