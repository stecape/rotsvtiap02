# Traefik Configuration - Modular Setup

Cartella per le configurazioni Traefik.

## Struttura

```
traefik/
├── traefik.yml         # Configurazione principale (root)
├── acme.json           # Certificati SSL (auto-generato)
├── config/             # Middlewares e configurazioni dinamiche
│   ├── middlewares.yml
│   └── tls.yml
└── logs/               # Log Traefik
    ├── access.log
    └── traefik.log
```

## Note

- `acme.json` viene creato automaticamente
- Permessi su Linux: `chmod 600 acme.json`
- Le configurazioni in `config/` vengono caricate dinamicamente
