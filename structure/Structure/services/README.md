# Servizi Modulari

Questa directory contiene i tuoi servizi applicativi.

## 📦 Struttura

Ogni servizio ha la sua cartella:
```
services/
├── [nome-servizio-1]/
│   ├── docker-compose.yml (opzionale - se standalone)
│   └── [file del servizio]
├── [nome-servizio-2]/
└── ...
```

## ➕ Aggiungere Servizi

### Metodo 1: Nel docker-compose.yml principale

Decommenta e modifica l'esempio nel file principale.

### Metodo 2: Servizi esterni (Raspberry Pi, NAS, ecc.)

Aggiungi in `traefik/config/external-services.yml`.

### Metodo 3: Standalone (docker-compose separato)

Crea una cartella qui con il suo docker-compose.yml.

Vedi README principale per esempi completi.

