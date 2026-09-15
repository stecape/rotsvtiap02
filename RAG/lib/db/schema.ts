import { pgTable, serial, text, integer, timestamp, customType } from "drizzle-orm/pg-core"

// Tipo personalizzato per pgvector
// Le dimensioni devono corrispondere al modello: nomic-embed-text → 768
const vector = customType<{
  data: number[]
  driverData: string
  config: { dimensions: number }
}>({
  dataType(config) {
    return `vector(${config?.dimensions ?? 768})`
  },
  fromDriver(value: string): number[] {
    // pgvector restituisce "[0.1,0.2,...]"
    return value
      .slice(1, -1)
      .split(",")
      .map(Number)
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`
  },
})

// Tabella per i chunk indicizzati delle pagine wiki (usata dal RAG)
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  chunkIndex: integer("chunk_index").notNull().default(0),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 768 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
