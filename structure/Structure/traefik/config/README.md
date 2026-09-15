# Configurazione Servizi Esterni

Questa directory contiene le configurazioni per servizi che girano **fuori** dai container Docker (altri host, Raspberry Pi, servizi locali, ecc.).

## 📋 File

- **external-services.yml** - Servizi su altri host (app esterne, n8n, ecc.)
- **middlewares.yml** - Middleware condivisi
- **tls.yml** - Configurazioni TLS avanzate (opzionale)

## ➕ Aggiungere un Nuovo Servizio Esterno

### Esempio: Servizio su altro host

Aggiungi in `external-services.yml`:

```yaml
http:
  routers:
    myservice:
      rule: "Host(`myservice.rotsvtiap02`)"
      entrypoints:
        - https
      service: myservice-external
      tls:
        certResolver: cloudflare
      middlewares:
        - security-headers

  services:
    myservice-external:
      loadBalancer:
        servers:
          - url: "http://192.168.1.50:8080"  # IP e porta del servizio
        passHostHeader: true
```

### Con Autenticazione

```yaml
http:
  routers:
    protected-service:
      rule: "Host(`protected.rotsvtiap02`)"
      entrypoints:
        - https
      service: protected-external
      tls:
        certResolver: cloudflare
      middlewares:
        - auth-basic  # Definito in middlewares.yml
        - security-headers

  services:
    protected-external:
      loadBalancer:
        servers:
          - url: "http://192.168.1.60:3000"
```

### WebSocket Support

```yaml
http:
  services:
    websocket-service:
      loadBalancer:
        servers:
          - url: "http://192.168.1.70:8080"
        passHostHeader: true
        # Per WebSocket, Traefik gestisce automaticamente l'upgrade
```

## 🔄 Ricaricamento

Traefik ricarica automaticamente le configurazioni in questa directory (watch mode abilitato).

## 🌐 Servizi Esterni vs Container

**Servizi Esterni (questo file):**
- Host remoti (Raspberry Pi, NAS, ecc.)
- Servizi sull'host Docker (host.docker.internal)
- Applicazioni non containerizzate

**Container Docker (labels):**
- Applicazioni in docker-compose.yml
- Auto-discovery automatico
- Nessun file di config necessario

## 🎯 Esempi Comuni

### App generica
```yaml
- url: "http://192.168.1.100:8080"
```

### Portainer
```yaml
- url: "http://192.168.1.100:9000"
```

### n8n
```yaml
- url: "http://host.docker.internal:5678"  # Se su host Docker
- url: "http://192.168.1.100:5678"          # Se su altro host
```

### Jellyfin/Plex
```yaml
- url: "http://192.168.1.100:8096"  # Jellyfin
- url: "http://192.168.1.100:32400" # Plex
```

### Synology NAS
```yaml
- url: "http://192.168.1.50:5000"   # DSM
- url: "http://192.168.1.50:5001"   # DSM HTTPS
```

## 🔒 Note Sicurezza

- Usa `passHostHeader: true` per preservare l'host originale
- Aggiungi sempre middleware `security-headers`
- Considera autenticazione basic per servizi sensibili
- Verifica che il firewall permetta la connessione da Docker host
