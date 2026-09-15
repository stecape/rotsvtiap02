# Wiki RAG — Architettura & Riferimento

## Stack tecnico

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Database | PostgreSQL 18 + pgvector (`pgvector/pgvector:pg18`) |
| ORM | Drizzle ORM |
| Auth | NextAuth v5 (credentials — username/password bcrypt) |
| LLM / Embedding | Ollama (`llama3.2` per chat, `nomic-embed-text` per embedding) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-raw` |
| Container | Docker Compose, container name `RAG` |

## Struttura cartelle

```
RAG/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Handler NextAuth
│   │   ├── wiki/                 # GET /api/wiki → lista pagine
│   │   ├── wiki/[slug]/          # GET /api/wiki/:slug → singola pagina
│   │   ├── rag/                  # POST /api/rag → chat streaming
│   │   └── ingest/               # POST /api/ingest → reindicizza .md
│   ├── chat/                     # Pagina AI Chat
│   ├── login/                    # Pagina login
│   ├── wiki/                     # Lista wiki
│   ├── wiki/[slug]/              # Pagina singola wiki
│   ├── layout.tsx                # Root layout (sidebar se autenticato)
│   └── page.tsx                  # Redirect → /wiki
├── components/
│   ├── Navigation.tsx            # Sidebar fissa (Wiki + Chat + Logout)
│   ├── wiki/
│   │   ├── WikiList.tsx          # Griglia card pagine wiki
│   │   └── WikiPage.tsx          # Renderer markdown (client component)
│   └── chat/
│       └── ChatInterface.tsx     # Chat streaming con RAG (client component)
├── lib/
│   ├── db/
│   │   ├── client.ts             # Drizzle instance (Pool pg)
│   │   └── schema.ts             # Tabella documents (slug, content, embedding vector(768))
│   └── services/
│       ├── wikiService.ts        # Legge .md da content/ con gray-matter
│       └── ragService.ts         # Embed, chunk, ingest, queryRAG, buildSystemPrompt
├── content/                      # File .md della wiki (montati come volume)
│   └── welcome.md
├── drizzle/                      # Migrazioni generate (git-ignored)
├── auth.ts                       # Config NextAuth
├── middleware.ts                 # Protezione globale route (redirect → /login)
├── docker-compose.yml
├── Dockerfile.dev
├── .env                          # NON in git
└── .env.example
```

## Database

### Schema (`lib/db/schema.ts`)

```
documents
  id           SERIAL PK
  slug         TEXT NOT NULL          ← nome file .md senza estensione
  title        TEXT NOT NULL          ← da frontmatter o nome file
  chunk_index  INTEGER DEFAULT 0      ← indice del chunk nel documento
  content      TEXT NOT NULL          ← testo del chunk
  embedding    vector(768)            ← nomic-embed-text output
  created_at   TIMESTAMP
```

La ricerca vettoriale usa l'operatore `<=>` di pgvector (cosine distance).

### Setup iniziale DB

```bash
# 1. Crea il database
docker exec -it postgres psql -U postgres -c "CREATE DATABASE wiki_rag;"

# 2. Abilita estensione vector
docker exec -it postgres psql -U postgres -d wiki_rag -c "CREATE EXTENSION IF NOT EXISTS vector;"

# 3. Crea le tabelle
docker exec RAG npm run db:push
```

## Variabili d'ambiente (`.env`)

```
DATABASE_URL          postgresql://postgres:<pw>@postgres:5432/wiki_rag
NEXTAUTH_SECRET       stringa random base64 (openssl rand -base64 32)
NEXTAUTH_URL          http://localhost:3000
ADMIN_USERNAME        nome utente admin
ADMIN_PASSWORD_HASH   hash bcrypt della password (vedere sotto)
OLLAMA_BASE_URL       http://ollama:11434  oppure  http://host.docker.internal:11434
OLLAMA_MODEL          llama3.2
OLLAMA_EMBED_MODEL    nomic-embed-text
```

### Generare hash password

```bash
docker run --rm node:22-alpine sh -c \
  "cd /tmp && npm init -y > /dev/null && npm install bcryptjs > /dev/null 2>&1 \
  && node -e \"const b=require('./node_modules/bcryptjs');console.log(b.hashSync('TUAPASSWORD',10))\""
```

## Docker

### Avvio dev (con hot-reload)

```bash
cd /home/bobst/proj/RAG
docker compose up -d --build
```

Il container `RAG`:
- Monta il source code come volume → Next.js rileva le modifiche in tempo reale
- `node_modules` e `.next` sono volumi Docker separati → non vengono sovrascritti dal mount
- Usa `WATCHPACK_POLLING=true` per compatibilità inotify Docker

### Reti Docker

| Rete | Scopo |
|---|---|
| `backend` | Comunicazione con container `postgres` (rete esterna, già esistente) |
| `proxy` | Esposto da Traefik (rete esterna, già esistente) |

### Comandi utili

```bash
# Vedere i log
docker logs RAG -f

# Shell nel container
docker exec -it RAG sh

# Eseguire migrazioni
docker exec RAG npm run db:push

# Reindicizzare la wiki
docker exec RAG curl -s -X POST http://localhost:3000/api/ingest

# Ricostruire dopo modifica Dockerfile o package.json
docker compose up -d --build
```

## Flusso RAG

1. I file `.md` in `content/` vengono letti da `wikiService.ts` tramite `fs` (solo server-side)
2. `POST /api/ingest` → svuota `documents`, chunka ogni pagina (~800 char per paragrafo), genera embedding via Ollama `nomic-embed-text`, salva in pgvector
3. `POST /api/rag` con `{ message }` → genera embedding della domanda → query pgvector `<=>` top-5 chunk → costruisce system prompt → stream Ollama `llama3.2` → risposta SSE al client
4. `ChatInterface.tsx` legge lo stream chunk per chunk e aggiorna lo stato React in tempo reale

## Wiki

- I file `.md` devono stare in `content/` (montato come volume nel container)
- Supportano frontmatter YAML: `title`, `date`, `tags`
- Vengono renderizzati con `react-markdown` + GFM (tabelle, task list, strikethrough)
- Dopo aver aggiunto nuovi file, eseguire `POST /api/ingest` per indicizzarli

## Aggiungere una pagina wiki

```bash
# 1. Crea il file .md (il nome diventa lo slug)
cat > /home/bobst/proj/RAG/content/mia-pagina.md << 'EOF'
---
title: La Mia Pagina
date: 2026-01-15
tags: [esempio]
---

# Titolo

Contenuto in markdown...
EOF

# 2. Reindicizza
docker exec RAG curl -s -X POST http://localhost:3000/api/ingest
```

## Traefik

L'app è raggiungibile su `http://wiki.rotsvtiap02` tramite le label nel `docker-compose.yml`.
Per HTTPS, aggiungere le label `traefik.http.routers.wiki-rag-secure` con entrypoint `https` e `tls: true`.
