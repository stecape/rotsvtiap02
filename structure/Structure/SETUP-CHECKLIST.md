# ✅ Checklist Setup Architettura Ibrida

> ⚠️ **Non è il setup attualmente in uso.** Questa checklist presuppone un
> dominio pubblico gestito da Cloudflare — ma `rotsvtiap02` è un nome a
> singola etichetta (hostname stile Windows/Hyper-V), che Cloudflare non può
> ospitare come zona DNS. Il container `cloudflare-ddns` descritto qui non
> risulta in esecuzione (`docker ps` reale non lo elenca), e `traefik.yml`
> non ha alcun `certificatesResolvers` configurato (`insecure: true`,
> nessun ACME). La risoluzione e il routing **effettivamente attivi** oggi
> sono interamente locali: file `hosts` del client + `netsh portproxy`
> sull'host `rotsvtiap02` + Traefik solo su HTTP. Vedi
> [`README.md`](README.md#-risoluzione-nomi--port-forward-setup-reale-in-uso)
> per il quadro reale. Questo file resta come riferimento se in futuro si
> vorrà migrare a un dominio pubblico.

## 📋 Pre-requisiti

- [ ] Docker e Docker Compose installati
- [ ] Dominio registrato (rotsvtiap02)
- [ ] Account Cloudflare creato
- [ ] SSH server attivo sull'host (porta 22)

## 🌐 Configurazione DNS

### Su Cloudflare

1. [ ] Aggiungi dominio `rotsvtiap02`
2. [ ] Ottieni nameservers Cloudflare (es: ada.ns.cloudflare.com)
3. [ ] Crea record DNS:
   - [ ] `A    rotsvtiap02      → [IP-SERVER]` (Proxy OFF 🌐)
   - [ ] `A    *.rotsvtiap02    → [IP-SERVER]` (Proxy OFF 🌐)

### Su Namecheap (o altro registrar)

4. [ ] Cambia nameservers:
   - [ ] Nameserver 1: `ada.ns.cloudflare.com`
   - [ ] Nameserver 2: `neil.ns.cloudflare.com`
5. [ ] Attendi propagazione DNS (15min - 48h, di solito 1-2h)

### Verifica DNS
```powershell
Resolve-DnsName rotsvtiap02
Resolve-DnsName blog.rotsvtiap02
```

## 🔐 Configurazione Cloudflare API

6. [ ] Vai su: My Profile → API Tokens
7. [ ] Ottieni Global API Key (o crea token con permessi DNS)
8. [ ] Salva email e API key

## ⚙️ Configurazione Locale

### File .env

9. [ ] Copia `.env.example` in `.env`:
```powershell
Copy-Item .env.example .env
```

10. [ ] Modifica `.env` con:
```env
CF_API_EMAIL=tua-email@cloudflare.com
CF_API_KEY=tua-cloudflare-api-key
DOMAIN=rotsvtiap02
APP_IP=192.168.1.100  # IP servizio esterno (opzionale)
```

### Credenziali Dashboard Traefik

11. [ ] Genera password hash:
   - Online: https://hostingcanada.org/htpasswd-generator/
   - Username: `admin`
   - Password: (scegli una sicura)

12. [ ] Copia hash in `.env`:
```env
TRAEFIK_DASHBOARD_USERS=admin:$$apr1$$...
```

### File acme.json

13. [ ] Verifica che esista `traefik/acme.json`
14. [ ] (Linux) Imposta permessi: `chmod 600 traefik/acme.json`
15. [ ] (Windows) Già gestito automaticamente

### Servizi Esterni (opzionale)

16. [ ] Modifica `traefik/config/external-services.yml`
17. [ ] Imposta IP e porta del servizio esterno:
```yaml
- url: "http://192.168.1.100:8080"  # ← Tuo IP:porta reali
```

## 🚀 Avvio Infrastruttura

18. [ ] Avvia container:
```powershell
docker-compose up -d
```

19. [ ] Verifica container attivi:
```powershell
docker-compose ps
```

Dovresti vedere:
- ✅ nginx-multiplexer (running)
- ✅ traefik (running)

20. [ ] Verifica logs Traefik:
```powershell
docker-compose logs -f traefik
```

Cerca:
- ✅ `Obtaining certificate for *.rotsvtiap02`
- ✅ `Certificate obtained for domain *.rotsvtiap02`

## ✅ Test Funzionalità

### Test HTTPS

21. [ ] Apri browser: `https://www.rotsvtiap02`
   - [ ] Certificato SSL valido
   - [ ] Connessione sicura

22. [ ] Testa sottodomini:
   - [ ] `https://blog.rotsvtiap02`
   - [ ] `https://api.rotsvtiap02`

### Test Dashboard Traefik

23. [ ] Apri: `https://traefik.rotsvtiap02:8080`
24. [ ] Login con credenziali (user: admin)
25. [ ] Verifica router e servizi visibili

### Test SSH su porta 443

26. [ ] Da terminale:
```bash
ssh -p 443 user@www.rotsvtiap02
```

27. [ ] Oppure configura `~/.ssh/config`:
```
Host rotsvtiap02-443
    HostName www.rotsvtiap02
    Port 443
    User tuo-user
```

Poi: `ssh rotsvtiap02-443`

### Test App esterna (se configurata)

28. [ ] Apri: `http://app.rotsvtiap02`
29. [ ] Verifica che il servizio risponda

## 🔍 Troubleshooting

### Certificati non generati

- [ ] Verifica credenziali Cloudflare in `.env`
- [ ] Controlla proxy Cloudflare OFF (🌐 grigio)
- [ ] Verifica logs: `docker-compose logs traefik | Select-String "error"`

### SSH non funziona

- [ ] Verifica SSH server attivo: `Get-Service sshd` (Windows)
- [ ] Test porta 22 locale: `Test-NetConnection localhost -Port 22`
- [ ] Verifica logs nginx: `docker-compose logs nginx-multiplexer`

### Servizi non raggiungibili

- [ ] Verifica DNS propagato: `Resolve-DnsName dominio.rotsvtiap02`
- [ ] Controlla firewall: porte 80, 443 aperte
- [ ] Verifica container in rete proxy: `docker network inspect proxy`

## 🎯 Prossimi Passi

30. [ ] Aggiungi servizi Docker in `docker-compose.yml`
31. [ ] Configura servizi esterni in `traefik/config/external-services.yml`
32. [ ] (Produzione) Rimuovi porta 8080 dashboard
33. [ ] Setup backup automatico `traefik/acme.json`
34. [ ] Configura monitoring (opzionale)

## 📊 Verifica Finale

Tutti i test passati?
- [ ] ✅ HTTPS funziona
- [ ] ✅ SSH su 443 funziona
- [ ] ✅ Certificati wildcard ottenuti
- [ ] ✅ Dashboard Traefik accessibile
- [ ] ✅ Servizi esterni raggiungibili

🎉 **Setup completato!**

---

**Data setup**: _________  
**IP Server**: _________  
**Note**: _________
