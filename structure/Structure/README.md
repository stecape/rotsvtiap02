# 🏗️ Architettura Modulare Docker - Traefik + Nginx Stream

Infrastruttura modulare per reverse proxy, SSL/TLS automatico con **multiplexing SSH+HTTPS su porta 443**.

> ⚠️ **Stato reale vs questo documento**: il diagramma e le sezioni DNS/SSL
> qui sotto descrivono l'architettura *pianificata* (dominio pubblico via
> Cloudflare, HTTPS ovunque). Nel deployment attuale non c'è HTTPS attivo
> (tutti i router Traefik sono `entrypoints=http`, nessun certResolver in
> `traefik.yml`) e la risoluzione di `*.rotsvtiap02` è locale (file `hosts`
> del client + `netsh portproxy`), non DNS Cloudflare. Vedi la sezione
> [🧭 Risoluzione Nomi & Port-Forward](#-risoluzione-nomi--port-forward-setup-reale-in-uso)
> per il quadro verificato.

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

Dopo l'avvio, i servizi *pianificati* sarebbero accessibili su (vedi ⚠️ sopra: oggi solo HTTP, e serve una riga in `hosts` sul client per ogni alias):

- **Dashboard Traefik**: http://IP-VM:8090 (porta pubblicata direttamente, non via Traefik/hostname)
- **Sito principale**: http://www.rotsvtiap02
- **Blog**: http://blog.rotsvtiap02
- **API**: http://api.rotsvtiap02

Servizi realmente configurati oggi nei vari stack: `wiki.rotsvtiap02` (RAG),
`pgadmin.rotsvtiap02` (DB), `mqtt.rotsvtiap02` (MQTT), `app.rotsvtiap02`
(external-services di esempio).

## 🧭 Risoluzione Nomi & Port-Forward (setup reale in uso)

> ⚠️ Le sezioni "Configura DNS su Cloudflare" e "Wildcard SSL" sopra descrivono
> un setup con dominio pubblico che **non è quello attualmente in uso**.
> `rotsvtiap02` è un nome a singola etichetta (stile hostname Windows), non
> un dominio pubblico: Cloudflare non può ospitarne la zona. La risoluzione
> reale è interamente locale, come descritto qui sotto.

### Topologia reale

Un solo host fisico/Hyper-V, nome macchina **`rotsvtiap02`**, esegue le VM
guest. **Tutti** i container (stack `Structure` + stack `RAG`, incluso
`ollama`, `mosquitto`, `postgres`, `pgadmin`, ecc.) girano insieme su
un'**unica VM guest**, `dk-vm`, oggi all'IP `192.168.50.10` sulla rete
interna dell'host.

### Catena di risoluzione (verificata)

```
Browser (PC Windows)
   │
   │  wiki.rotsvtiap02  (nome a due etichette, non risolvibile via
   │                     NetBIOS/LLMNR — serve una regola esplicita)
   ▼
File hosts LOCALE del PC (C:\Windows\System32\drivers\etc\hosts)
   │  — regola presente SOLO sui PC dove è stata aggiunta a mano,
   │    non è DNS, non è condivisa automaticamente —
   │
   │  10.100.13.20  wiki.rotsvtiap02
   │  10.100.13.20  pgadmin.rotsvtiap02
   │  10.100.13.20  app.rotsvtiap02
   │  10.100.13.20  mqtt.rotsvtiap02
   ▼
10.100.13.20  (host Hyper-V "rotsvtiap02", NIC verso la rete client)
   │
   │  netsh interface portproxy (eseguito sull'host rotsvtiap02)
   ▼
dk-vm (192.168.50.10) — porta di destinazione dipende dalla regola:
   │
   ├─ :8080 → dk-vm:3000  ✅ attiva, ma bypassa nginx + Traefik
   │          (va dritta nel container RAG, nessun routing per Host,
   │           nessun middleware security-headers, nessun CrowdSec)
   │
   └─ :80   → 192.168.20.50:3000  ⚠️ STALE — IP non più valido per dk-vm
              (dovrebbe puntare a dk-vm:80, dove ascolta
              nginx-multiplexer → Traefik → routing per Host header)
```

**Implicazione pratica**: oggi solo `wiki.rotsvtiap02:8080` funziona in modo
affidabile, e lo fa scavalcando tutto il livello di sicurezza/routing
(nginx, Traefik, CrowdSec, middleware `security-headers`). Gli altri alias
(`pgadmin.rotsvtiap02`, `app.rotsvtiap02`, `mqtt.rotsvtiap02`) risolvono
verso lo stesso `10.100.13.20`, ma senza `:8080` (o un'analoga regola di
forward dedicata) dipendono anch'essi dalla regola `:80` stale e
probabilmente non sono raggiungibili dall'esterno della VM in questo
momento.

### Fix consigliato

Sull'host Hyper-V `rotsvtiap02` (PowerShell da amministratore):

```powershell
netsh interface portproxy delete v4tov4 listenport=80 listenaddress=0.0.0.0
netsh interface portproxy add v4tov4 listenport=80 listenaddress=0.0.0.0 connectaddress=192.168.50.10 connectport=80
```

Questo ripristina il routing corretto `:80 → nginx → Traefik → Host()` per
**tutti** i servizi (non solo `wiki-rag`), con middleware e bouncer CrowdSec
applicati. La regola `:8080 → dk-vm:3000` può restare come scorciatoia di
debug diretta sull'app, ma va tenuta presente che bypassa la sicurezza a
livello Traefik.

### Nota per aggiungere un nuovo alias

Un nuovo hostname `*.rotsvtiap02` richiede **due** modifiche, non una sola:
1. Label Traefik `Host(\`nomealias.rotsvtiap02\`)` sul nuovo servizio (vedi sezione successiva)
2. Una riga nel file `hosts` di ogni client che deve raggiungerlo, puntata
   a `10.100.13.20` (o l'IP attuale della NIC "esterna" dell'host
   `rotsvtiap02`) — non esiste un DNS/wildcard automatico che lo faccia.

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
