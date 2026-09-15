---
title: Benvenuto nella Wiki
date: 2026-01-01
tags: [getting-started, wiki]
---

# Benvenuto nella Wiki RAG

Questa è la tua prima pagina wiki. Puoi aggiungere altri file `.md` nella cartella `content/`.

## Come aggiungere contenuti

1. Crea un file `.md` nella cartella `content/`
2. Aggiungi un frontmatter YAML con `title`, `date` e `tags`
3. Scrivi il contenuto in Markdown standard

## Frontmatter supportato

```yaml
---
title: Titolo della pagina
date: 2026-01-15
tags: [tag1, tag2]
---
```

## Come usare il RAG

Dopo aver aggiunto i tuoi file `.md`, devi indicizzarli per abilitare la ricerca AI:

```bash
# Da dentro il container RAG:
curl -X POST http://localhost:3000/api/ingest
```

Oppure direttamente dal container:

```bash
docker exec RAG curl -s -X POST http://localhost:3000/api/ingest
```

Poi vai su **AI Chat** e inizia a fare domande sui tuoi contenuti.
