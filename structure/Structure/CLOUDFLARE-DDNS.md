# Cloudflare DDNS - Dynamic DNS Updater

Container per aggiornare automaticamente l'IP pubblico su Cloudflare quando cambia (IP dinamico).

## 🎯 Funzionamento

Il container `cloudflare-ddns`:
- Rileva il tuo IP pubblico attuale
- Lo confronta con quello su Cloudflare
- Se diverso, aggiorna automaticamente i record DNS
- Controlla ogni 5 minuti

## 📋 Configurazione

### Domini Aggiornati

I seguenti record vengono aggiornati automaticamente:
- `rotsvtiap02` (record A principale)
- `*.rotsvtiap02` (record A wildcard)

### Variabili d'Ambiente

In `.env`:
```env
CF_API_KEY=your-cloudflare-api-token
DOMAIN=rotsvtiap02
```

### Personalizzazione

Nel `docker-compose.yml`, puoi modificare:

```yaml
environment:
  - UPDATE_CRON=@every 5m    # Frequenza controllo (default: 5 minuti)
  - PROXIED=false            # Proxy Cloudflare (deve essere false per Let's Encrypt)
  - DETECTION_TIMEOUT=5s     # Timeout rilevamento IP
```

#### Frequenze Alternative

```yaml
- UPDATE_CRON=@every 1m     # Ogni minuto (molto frequente)
- UPDATE_CRON=@every 10m    # Ogni 10 minuti
- UPDATE_CRON=@every 1h     # Ogni ora (meno frequente)
```

## 🔍 Verifica Funzionamento

### Vedi logs in tempo reale
```powershell
docker-compose logs -f cloudflare-ddns
```

### Verifica ultimo aggiornamento
```powershell
docker-compose logs cloudflare-ddns | Select-String "updated"
```

Output esempio:
```
✅ IP address updated: 93.45.123.45 → rotsvtiap02
✅ IP address updated: 93.45.123.45 → *.rotsvtiap02
```

### Verifica IP corrente su Cloudflare
```powershell
Resolve-DnsName rotsvtiap02
```

## 🎛️ Comandi Utili

```powershell
# Forza aggiornamento immediato (riavvia container)
docker-compose restart cloudflare-ddns

# Vedi stato
docker-compose ps cloudflare-ddns

# Vedi tutti i log
docker-compose logs cloudflare-ddns

# Ferma aggiornamenti automatici
docker-compose stop cloudflare-ddns

# Riavvia aggiornamenti
docker-compose start cloudflare-ddns
```

## 🔒 Sicurezza

- Il container usa `no-new-privileges` per sicurezza
- Network mode `host` per rilevare IP pubblico reale
- Non richiede porte esposte
- Usa token API Cloudflare (non Global API Key per maggior sicurezza)

## 📝 Token API vs Global API Key

### Global API Key (funziona)
```env
CF_API_KEY=your-global-api-key
```

### API Token (più sicuro, consigliato)
Crea token su Cloudflare con permessi:
- Zone → DNS → Edit
- Zone → Zone → Read

```env
CF_API_KEY=your-api-token
```

## ⚠️ Note

- **PROXIED=false** è obbligatorio per Let's Encrypt
- Il container non crea record DNS, li aggiorna solo
- Devi creare manualmente i record DNS iniziali su Cloudflare
- Se IP non cambia, il container non fa nulla (efficiente)

## 🆚 Alternativa: Namecheap DDNS

Se preferisci continuare con Namecheap DDNS, puoi:

1. Rimuovere questo container
2. Mantenere Namecheap DDNS attivo
3. Cambiare solo i nameserver a Cloudflare
4. Cloudflare sincronizzerà l'IP da Namecheap

Ma è più efficiente gestire tutto su Cloudflare.

## 🔄 Migrazione da Namecheap DDNS

Quando passi a Cloudflare DDNS:
1. ✅ Avvia questo container
2. ✅ Disabilita DDNS su Namecheap
3. ✅ Il container gestirà tutto automaticamente

---

**Container**: `favonia/cloudflare-ddns`  
**Repository**: https://github.com/favonia/cloudflare-ddns  
**Documentazione**: https://github.com/favonia/cloudflare-ddns#readme
