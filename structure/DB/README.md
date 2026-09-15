# PostgreSQL + PGAdmin - Database Infrastructure

Stack di database PostgreSQL con interfaccia web PGAdmin, integrato con Traefik per SSL e reverse proxy.

## 🏗️ Architettura

### PostgreSQL
- **Versione**: PostgreSQL 16 Alpine
- **Accessibilità**: SOLO rete interna Docker (`db-network`)
- **NON esposto** direttamente all'esterno per sicurezza
- **Storage**: Volume persistente `postgres-data`

### PGAdmin
- **Accessibilità**: Esterno via HTTPS tramite Traefik
- **URL**: https://pgadmin.rotsvtiap02
- **Porta interna**: 80 (NON esposta direttamente)
- **Storage**: Volume persistente `pgadmin-data`

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
1. Vai su https://pgadmin.rotsvtiap02
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

### Certificato SSL non funziona
- Controlla che Traefik sia attivo: `docker ps | grep traefik`
- Verifica DNS Cloudflare per `pgadmin.rotsvtiap02`
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
- Certificato SSL via DNS Challenge Cloudflare
- Middleware di sicurezza da `middlewares.yml`

Assicurati che Traefik sia attivo prima di avviare questo stack.
