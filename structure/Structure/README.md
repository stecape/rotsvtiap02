# 🏗️ Architettura Modulare Docker - Traefik + Nginx Stream

Infrastruttura modulare per reverse proxy, SSL/TLS automatico con **multiplexing SSH+HTTPS su porta 443**.

## 🎯 Architettura

```
Internet
   │
   ├─ :80  (HTTP)  → Nginx → Redirect HTTPS
   │
   └─ :443 (TCP)   → Nginx Stream Multiplexer
                        │
                        ├─ SNI presente (HTTPS) → Traefik:8443
                        │                              ↓
                        │                    ┌─────────────────┐
                        │                    │ SSL Termination │
                        │                    │  (Cloudflare)   │
                        │                    └─────────────────┘
                        │                              ↓
                        │                    ┌─────────────────┐
                        │                    │ Service Routing │
                        │                    │  (Docker Labels)│
                        │                    └─────────────────┘
                        │                              ↓
                        │              ┌───────┬───────┬────────┐
                        │              │ Web   │ Blog  │  API   │
                        │              └───────┴───────┴────────┘
                        │
                        └─ SNI assente (SSH) → host:22
```

## 📦 Componenti Modulari

### 1. **Nginx Stream Multiplexer**
- **Ruolo**: Distinguere SSH da HTTPS sulla porta 443
- **Tecnologia**: `ssl_preread` per ispezionare SNI senza decriptare
- **Config**: [`nginx/stream/nginx.conf`](nginx/stream/nginx.conf)

### 2. **Traefik Reverse Proxy**
- **Ruolo**: SSL termination + routing HTTP
- **Certificati**: Let's Encrypt via Cloudflare DNS Challenge
- **Config**: [`traefik/traefik.yml`](traefik/traefik.yml)

### 3. **Cloudflare DDNS**
- **Ruolo**: Aggiornamento automatico IP dinamico
- **Frequenza**: Ogni 5 minuti (configurabile)
- **Doc**: [`CLOUDFLARE-DDNS.md`](CLOUDFLARE-DDNS.md)

### 4. **Servizi Modulari**
- **Struttura**: Ogni servizio in `services/[nome]/`
- **Configurazione**: Labels Docker (zero file di config)
- **Isolamento**: Rete `proxy` dedicata

## 📋 Prerequisiti

- Docker e Docker Compose installati
- Dominio configurato su Cloudflare
- API Key di Cloudflare

## 🔧 Configurazione Iniziale

### 1. Clona e configura

```bash
cd C:\Structure
copy .env.example .env
```

### 2. Modifica il file `.env`

```env
CF_API_EMAIL=tua-email@cloudflare.com
CF_API_KEY=la-tua-api-key
TRAEFIK_DASHBOARD_USERS=admin:$$apr1$$...
```

Per generare le credenziali dashboard:
```bash
# Linux/Mac
echo $(htpasswd -nb admin password) | sed -e s/\\$/\\$\\$/g

# Windows (installa Apache utils o usa online generator)
# Oppure usa: https://hostingcanada.org/htpasswd-generator/
```

### 3. Configura email in traefik.yml

Modifica `traefik.yml` e inserisci la tua email:
```yaml
certificatesResolvers:
  cloudflare:
    acme:
      email: tua-email@example.com
```

### 4. Crea il file acme.json

```bash
# Linux/Mac
touch acme.json
chmod 600 acme.json

# Windows PowerShell
New-Item -ItemType File -Path acme.json
icacls acme.json /inheritance:r /grant:r "$($env:USERNAME):(R,W)"
```

### 5. Configura Cloudflare

1. Accedi a Cloudflare Dashboard
2. Vai in "My Profile" → "API Tokens"
3. Crea un token con permessi:
   - Zone.Zone (Read)
   - Zone.DNS (Edit)
4. Oppure usa la Global API Key (meno sicura)

### 6. Configura DNS su Cloudflare

Aggiungi record A/AAAA per:
- `rotsvtiap02` → IP del server
- `*.rotsvtiap02` → IP del server (wildcard)

**Importante**: Disabilita il proxy Cloudflare (cloud grigia) per usare Let's Encrypt direttamente.

## 🚀 Avvio

```bash
docker-compose up -d
```

Verifica i logs:
```bash
docker-compose logs -f traefik
```

## 🌐 Accesso ai Servizi

Dopo l'avvio, i servizi saranno accessibili su:

- **Dashboard Traefik**: https://traefik.rotsvtiap02:8080
- **Sito principale**: https://www.rotsvtiap02
- **Blog**: https://blog.rotsvtiap02
- **API**: https://api.rotsvtiap02

## 📝 Aggiungere Nuovi Servizi

### Esempio: Aggiungere un nuovo servizio

```yaml
  myapp:
    image: myapp:latest
    container_name: myapp
    restart: unless-stopped
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.myapp.entrypoints=http"
      - "traefik.http.routers.myapp.rule=Host(`myapp.rotsvtiap02`)"
      - "traefik.http.middlewares.myapp-https-redirect.redirectscheme.scheme=https"
      - "traefik.http.routers.myapp.middlewares=myapp-https-redirect"
      - "traefik.http.routers.myapp-secure.entrypoints=https"
      - "traefik.http.routers.myapp-secure.rule=Host(`myapp.rotsvtiap02`)"
      - "traefik.http.routers.myapp-secure.tls=true"
      - "traefik.http.routers.myapp-secure.tls.certresolver=cloudflare"
      - "traefik.http.routers.myapp-secure.service=myapp"
      - "traefik.http.services.myapp.loadbalancer.server.port=8080"
      - "traefik.docker.network=proxy"
```

## 🔒 Sicurezza

### Best Practices

1. **Disabilita dashboard in produzione**: Rimuovi la porta 8080 dal docker-compose
2. **Usa strong passwords**: Per l'autenticazione dashboard
3. **Firewall**: Configura iptables per limitare l'accesso
4. **Aggiorna regolarmente**: Mantieni Traefik aggiornato
5. **Monitora i logs**: Controlla regolarmente `/var/log/traefik/`

### Proteggere un servizio con autenticazione

```yaml
labels:
  - "traefik.http.middlewares.myapp-auth.basicauth.users=${MYAPP_USERS}"
  - "traefik.http.routers.myapp-secure.middlewares=myapp-auth"
```

## 🛠 Troubleshooting

### I certificati non vengono generati

1. Verifica le credenziali Cloudflare nel `.env`
2. Controlla che il DNS sia configurato correttamente
3. Verifica i logs: `docker-compose logs traefik`
4. Assicurati che `acme.json` abbia permessi 600

### Errore "too many redirects"

- Verifica che il proxy Cloudflare sia disabilitato (cloud grigia)
- Controlla le regole di redirect in Cloudflare

### Dashboard non accessibile

- Verifica le credenziali in `TRAEFIK_DASHBOARD_USERS`
- Controlla che la porta 8080 sia esposta
- Verifica il DNS per `traefik.rotsvtiap02`

## 📚 Documentazione

- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Cloudflare API](https://developers.cloudflare.com/api/)

## 🔄 Comandi Utili

```bash
# Avvia i servizi
docker-compose up -d

# Ferma i servizi
docker-compose down

# Riavvia Traefik
docker-compose restart traefik

# Vedi i logs
docker-compose logs -f

# Vedi solo i logs di Traefik
docker-compose logs -f traefik

# Rinnova i certificati (automatico, ma se necessario)
docker-compose restart traefik

# Lista container attivi
docker-compose ps

# Pulisci tutto
docker-compose down -v
```

## 📂 Struttura del Progetto

```
Structure/
├── docker-compose.yml      # Configurazione principale
├── traefik.yml            # Configurazione Traefik
├── acme.json              # Certificati SSL (generato automaticamente)
├── .env                   # Variabili d'ambiente (non committare!)
├── .env.example           # Template per .env
├── config/                # Configurazioni dinamiche (opzionale)
├── sites/                 # Contenuti dei siti
│   ├── web1/
│   ├── blog/
│   └── api/
└── README.md              # Questa documentazione
```

## 📝 Note

- I certificati vengono rinnovati automaticamente da Traefik
- Wildcard SSL copre tutti i sottodomini `*.rotsvtiap02`
- La rete `proxy` permette la comunicazione tra i container
- I servizi sono isolati e comunicano solo tramite Traefik
