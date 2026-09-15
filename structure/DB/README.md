# PostgreSQL + PGAdmin - Database Infrastructure

Stack di database PostgreSQL con interfaccia web PGAdmin, integrato con Traefik per SSL e reverse proxy.

## 🏗️ Architettura

### PostgreSQL
- **Versione**: PostgreSQL 16 Alpine
- **Accessibilità**: SOLO rete interna Docker (`db-network`)
- **NON esposto** direttamente all'esterno per sicurezza
- **Storage**: Volume persistente `postgres-data`

### PGAdmin
- **Accessibilità**: Esterno via Traefik
- **URL**: http://pgadmin.rotsvtiap02 (⚠️ HTTP, non HTTPS: il router Traefik
  usa `entrypoints=http`, nessun certificate resolver è configurato oggi —
  vedi [`traefik.yml`](../Structure/traefik/traefik.yml))
- **Porta interna**: 80 (NON esposta direttamente)
- **Storage**: Volume persistente `pgadmin-data`
- **Risoluzione nome**: `pgadmin.rotsvtiap02` non è DNS pubblico — richiede
  una riga nel file `hosts` del client, vedi
  [`structure/Structure/README.md`](../Structure/README.md#-risoluzione-nomi--port-forward-setup-reale-in-uso)

## 📡 Reti Docker

### `db-network` (interna)
Rete privata per comunicazione database:
- PostgreSQL
- PGAdmin
- Servizi backend che necessitano accesso al DB

### `proxy` (esterna)
Rete Traefik per reverse proxy:
- PGAdmin (esposto via HTTPS)
- Collegata alla rete proxy principale in `C:\Structure`

## 🚀 Quick Start

### 1. Configurazione Ambiente
```powershell
# Copia e modifica il file .env
cp .env.example .env
# Modifica .env con le tue credenziali
```

### 2. Avvio Servizi
```powershell
# Dalla cartella DB
docker-compose up -d

# Verifica stato
docker-compose ps

# Visualizza log
docker-compose logs -f
```

### 3. Accesso PGAdmin
1. Vai su http://pgadmin.rotsvtiap02 (richiede riga in `hosts` sul client, vedi sopra)
2. Login con credenziali da `.env`:
   - Email: `PGADMIN_EMAIL`
   - Password: `PGADMIN_PASSWORD`

### 4. Configurare connessione PostgreSQL in PGAdmin
1. In PGAdmin, crea nuovo server:
   - **Nome**: MainDB (o a piacere)
   - **Host**: `postgres` (nome del container)
   - **Port**: `5432`
   - **Username**: valore di `POSTGRES_USER` da `.env`
   - **Password**: valore di `POSTGRES_PASSWORD` da `.env`
   - **Database**: valore di `POSTGRES_DB` da `.env`

## 🔌 Connessione da Servizi Backend

Per connettere un servizio backend al database:

### 1. Aggiungi la rete al docker-compose del servizio
```yaml
services:
  your-backend:
    image: your-image
    networks:
      - db-network  # Aggiungi questa rete
      - proxy       # Eventualmente per Traefik

networks:
  db-network:
    external: true  # Riferimento alla rete creata da questo stack
  proxy:
    external: true
```

### 2. Connection String
```
Host: postgres
Port: 5432
Database: maindb (o il valore in POSTGRES_DB)
User: admin (o il valore in POSTGRES_USER)
Password: dalla variabile POSTGRES_PASSWORD
```

Esempio connection string:
```
postgresql://admin:SecurePassword123!@postgres:5432/maindb
```

## 🛡️ Sicurezza

✅ **Configurazioni di sicurezza implementate**:
- PostgreSQL NON esposto all'esterno
- Solo comunicazione interna via `db-network`
- PGAdmin accessibile solo via HTTPS con certificato SSL
- Credenziali in file `.env` (escluso da Git)
- Security headers via Traefik middleware
- `no-new-privileges` attivo su tutti i container

⚠️ **IMPORTANTE**: Cambia le password di default nel file `.env`!

## 📂 Script di Inizializzazione

Per eseguire script SQL all'avvio di PostgreSQL:

1. Crea la cartella `init-scripts/`
2. Aggiungi file `.sql` (es: `01-init.sql`, `02-schema.sql`)
3. I file verranno eseguiti in ordine alfabetico al primo avvio

Esempio `init-scripts/01-init.sql`:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA IF NOT EXISTS app;
```

## 🔄 Comandi Utili

```powershell
# Stop servizi
docker-compose down

# Stop e rimuovi volumi (ATTENZIONE: cancella tutti i dati!)
docker-compose down -v

# Restart servizi
docker-compose restart

# Backup database
docker exec postgres pg_dump -U admin maindb > backup.sql

# Restore database
cat backup.sql | docker exec -i postgres psql -U admin maindb

# Accesso diretto a PostgreSQL CLI
docker exec -it postgres psql -U admin -d maindb

# Log in tempo reale
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

## 📊 Health Check

PostgreSQL include un health check automatico:
- Verifica connessione ogni 10 secondi
- PGAdmin attende che PostgreSQL sia healthy prima di avviarsi

Controlla lo stato:
```powershell
docker-compose ps
# Se healthy, vedrai "(healthy)" accanto a postgres
```

## 🔧 Troubleshooting

### PGAdmin non si connette a PostgreSQL
- Verifica che entrambi i container siano sulla rete `db-network`
- Usa `postgres` come hostname (non `localhost` o IP)
- Verifica credenziali nel file `.env`

### PGAdmin non risponde su `pgadmin.rotsvtiap02`
- Controlla che Traefik sia attivo: `docker ps | grep traefik`
- Verifica che il file `hosts` del client abbia la riga
  `<IP-host-rotsvtiap02>  pgadmin.rotsvtiap02` (non è DNS, vedi
  [`structure/Structure/README.md`](../Structure/README.md#-risoluzione-nomi--port-forward-setup-reale-in-uso))
- Verifica la regola `netsh portproxy` sull'host `rotsvtiap02` per la porta
  usata (oggi solo `:8080` risulta affidabile, `:80` punta a un IP stale)
- Controlla log Traefik: `docker logs traefik`

### Errori di permessi sui volumi
```powershell
# Reset permessi volumi
docker-compose down
docker volume rm db_postgres-data db_pgadmin-data
docker-compose up -d
```

## 🌐 Integrazione con Traefik

Questo stack si integra con l'infrastruttura Traefik in `C:\Structure`:
- Usa la rete `proxy` condivisa
- Router su `entrypoints=http` — nessun HTTPS/certificato attivo oggi
  (la sezione "DNS Challenge Cloudflare" nella documentazione di
  `Structure` descrive un setup pianificato, non quello attualmente in uso)
- Middleware di sicurezza (`security-headers`, `rate-limit`) da file config

Assicurati che Traefik sia attivo prima di avviare questo stack.
