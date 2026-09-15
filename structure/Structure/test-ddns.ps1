# =============================================
# Test Cloudflare DDNS - Verifica Configurazione
# =============================================

Write-Host "Test Cloudflare DDNS Configuration" -ForegroundColor Cyan
Write-Host ""

# Verifica .env
Write-Host "1. Verifica file .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "ERRORE: File .env non trovato!" -ForegroundColor Red
    Write-Host "   Esegui prima: Copy-Item .env.example .env" -ForegroundColor Yellow
    exit 1
}

# Carica variabili .env
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Variable -Name $name -Value $value -Scope Script
    }
}

# Verifica variabili necessarie
Write-Host "2. Verifica variabili d'ambiente..." -ForegroundColor Yellow
$errors = @()

if ([string]::IsNullOrEmpty($CF_API_KEY) -or $CF_API_KEY -eq "your-cloudflare-api-key") {
    $errors += "CF_API_KEY non configurato"
}

if ([string]::IsNullOrEmpty($DOMAIN) -or $DOMAIN -eq "rotsvtiap02") {
    Write-Host "WARNING: DOMAIN e' 'rotsvtiap02' - assicurati sia corretto" -ForegroundColor Yellow
}

if ($errors.Count -gt 0) {
    Write-Host "ERRORE: Configurazione non valida:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "OK: Variabili configurate" -ForegroundColor Green

# Verifica connessione internet
Write-Host ""
Write-Host "3. Verifica connessione internet..." -ForegroundColor Yellow
try {
    $ip = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing -TimeoutSec 5).Content
    Write-Host "OK: IP pubblico rilevato: $ip" -ForegroundColor Green
} catch {
    Write-Host "ERRORE: Impossibile rilevare IP pubblico" -ForegroundColor Red
    exit 1
}

# Verifica API Cloudflare
Write-Host ""
Write-Host "4. Test API Cloudflare..." -ForegroundColor Yellow
try {
    # Determina se è un token o Global API Key
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($CF_API_KEY.Length -gt 40) {
        # È un API Token (più lungo)
        $headers["Authorization"] = "Bearer $CF_API_KEY"
        $verifyUrl = "https://api.cloudflare.com/client/v4/user/tokens/verify"
    } else {
        # È una Global API Key (più corta)
        $headers["X-Auth-Email"] = $CF_API_EMAIL
        $headers["X-Auth-Key"] = $CF_API_KEY
        $verifyUrl = "https://api.cloudflare.com/client/v4/user"
    }
    
    $response = Invoke-RestMethod -Uri $verifyUrl `
                                  -Headers $headers `
                                  -Method GET `
                                  -TimeoutSec 10
    
    if ($response.success) {
        Write-Host "OK: API Token/Key valido" -ForegroundColor Green
    } else {
        Write-Host "ERRORE: API Token/Key non valido" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERRORE: Chiamata API Cloudflare fallita: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Verifica che CF_API_KEY sia corretto" -ForegroundColor Yellow
    Write-Host "   Se usi Global API Key, verifica anche CF_API_EMAIL" -ForegroundColor Yellow
    exit 1
}

# Verifica Zone ID
Write-Host ""
Write-Host "5. Ricerca Zone ID per $DOMAIN..." -ForegroundColor Yellow
try {
    # Usa gli stessi headers configurati prima
    $zones = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" `
                               -Headers $headers `
                               -Method GET
    
    if ($zones.result.Count -gt 0) {
        $zoneId = $zones.result[0].id
        $zoneName = $zones.result[0].name
        Write-Host "OK: Zone trovata: $zoneName (ID: $zoneId)" -ForegroundColor Green
    } else {
        Write-Host "ERRORE: Dominio $DOMAIN non trovato su Cloudflare" -ForegroundColor Red
        Write-Host "   Aggiungi prima il dominio su Cloudflare Dashboard" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "ERRORE: Ricerca zone fallita: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verifica record DNS esistenti
Write-Host ""
Write-Host "6. Verifica record DNS esistenti..." -ForegroundColor Yellow
try {
    $records = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?type=A" `
                                 -Headers $headers `
                                 -Method GET
    
    $rootRecord = $records.result | Where-Object { $_.name -eq $DOMAIN }
    $wildcardRecord = $records.result | Where-Object { $_.name -eq "*.$DOMAIN" }
    
    if ($rootRecord) {
        Write-Host "OK: Record A '$DOMAIN' trovato: $($rootRecord.content)" -ForegroundColor Green
        if ($rootRecord.proxied) {
            Write-Host "   WARNING: PROXY ATTIVO! Disattivalo (deve essere grigio)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "WARNING: Record A '$DOMAIN' NON trovato - verra' creato dal container" -ForegroundColor Yellow
    }
    
    if ($wildcardRecord) {
        Write-Host "OK: Record A '*.$DOMAIN' trovato: $($wildcardRecord.content)" -ForegroundColor Green
        if ($wildcardRecord.proxied) {
            Write-Host "   WARNING: PROXY ATTIVO! Disattivalo (deve essere grigio)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "WARNING: Record A '*.$DOMAIN' NON trovato - verra' creato dal container" -ForegroundColor Yellow
    }
} catch {
    Write-Host "WARNING: Impossibile verificare record DNS esistenti" -ForegroundColor Yellow
}

# Verifica Docker
Write-Host ""
Write-Host "7. Verifica Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "OK: Docker installato" -ForegroundColor Green
} catch {
    Write-Host "ERRORE: Docker non trovato" -ForegroundColor Red
    exit 1
}

# Riepilogo
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "RIEPILOGO" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dominio:          $DOMAIN" -ForegroundColor White
Write-Host "Zone ID:          $zoneId" -ForegroundColor White
Write-Host "IP Pubblico:      $ip" -ForegroundColor White
Write-Host ""
Write-Host "Container DDNS configurato per aggiornare:" -ForegroundColor White
Write-Host "  - $DOMAIN -> $ip" -ForegroundColor Gray
Write-Host "  - *.$DOMAIN -> $ip" -ForegroundColor Gray
Write-Host ""
Write-Host "Frequenza aggiornamento: ogni 5 minuti" -ForegroundColor Gray
Write-Host ""

# Istruzioni finali
Write-Host "PROSSIMI PASSI:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Su Cloudflare Dashboard, crea/verifica record:" -ForegroundColor Yellow
Write-Host "   A    $DOMAIN      -> $ip    (Proxy OFF)" -ForegroundColor Gray
Write-Host "   A    *.$DOMAIN    -> $ip    (Proxy OFF)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Avvia il container:" -ForegroundColor Yellow
Write-Host "   docker-compose up -d cloudflare-ddns" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Monitora i logs:" -ForegroundColor Yellow
Write-Host "   docker-compose logs -f cloudflare-ddns" -ForegroundColor Gray
Write-Host ""
Write-Host "Test completato con successo!" -ForegroundColor Green
