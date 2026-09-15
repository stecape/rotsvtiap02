# =============================================
# Setup Cloudflare DDNS - Creazione Record DNS
# =============================================

Write-Host "🚀 Setup Cloudflare DDNS - Creazione Record" -ForegroundColor Cyan
Write-Host ""

# Verifica .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ File .env non trovato!" -ForegroundColor Red
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

# Verifica configurazione
if ([string]::IsNullOrEmpty($CF_API_KEY) -or $CF_API_KEY -eq "your-cloudflare-api-key") {
    Write-Host "❌ CF_API_KEY non configurato in .env" -ForegroundColor Red
    exit 1
}

# Rileva IP pubblico
Write-Host "Rilevamento IP pubblico..." -ForegroundColor Yellow
$ip = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
Write-Host "✅ IP rilevato: $ip" -ForegroundColor Green
Write-Host ""

# Setup API
$headers = @{
    "Authorization" = "Bearer $CF_API_KEY"
    "Content-Type" = "application/json"
}

# Ottieni Zone ID
Write-Host "Ricerca zone per $DOMAIN..." -ForegroundColor Yellow
$zones = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" `
                           -Headers $headers `
                           -Method GET

if ($zones.result.Count -eq 0) {
    Write-Host "❌ Dominio non trovato su Cloudflare" -ForegroundColor Red
    exit 1
}

$zoneId = $zones.result[0].id
Write-Host "✅ Zone ID: $zoneId" -ForegroundColor Green
Write-Host ""

# Funzione per creare/aggiornare record
function Set-DNSRecord {
    param(
        [string]$Name,
        [string]$Content,
        [string]$ZoneId,
        [hashtable]$Headers
    )
    
    # Cerca record esistente
    $existing = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records?type=A&name=$Name" `
                                  -Headers $Headers `
                                  -Method GET
    
    if ($existing.result.Count -gt 0) {
        # Aggiorna esistente
        $recordId = $existing.result[0].id
        $currentIp = $existing.result[0].content
        $isProxied = $existing.result[0].proxied
        
        Write-Host "Record '$Name' esistente (IP: $currentIp, Proxy: $isProxied)" -ForegroundColor Yellow
        
        $body = @{
            type = "A"
            name = $Name
            content = $Content
            ttl = 1
            proxied = $false
        } | ConvertTo-Json
        
        $result = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records/$recordId" `
                                    -Headers $Headers `
                                    -Method PUT `
                                    -Body $body
        
        if ($result.success) {
            Write-Host "✅ Record '$Name' aggiornato → $Content (Proxy OFF)" -ForegroundColor Green
        } else {
            Write-Host "❌ Errore aggiornamento: $($result.errors)" -ForegroundColor Red
        }
    } else {
        # Crea nuovo
        Write-Host "Creazione record '$Name'..." -ForegroundColor Yellow
        
        $body = @{
            type = "A"
            name = $Name
            content = $Content
            ttl = 1
            proxied = $false
        } | ConvertTo-Json
        
        $result = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records" `
                                    -Headers $Headers `
                                    -Method POST `
                                    -Body $body
        
        if ($result.success) {
            Write-Host "✅ Record '$Name' creato → $Content (Proxy OFF)" -ForegroundColor Green
        } else {
            Write-Host "❌ Errore creazione: $($result.errors)" -ForegroundColor Red
        }
    }
}

# Crea/aggiorna record
Write-Host "Configurazione record DNS..." -ForegroundColor Cyan
Write-Host ""

Set-DNSRecord -Name $DOMAIN -Content $ip -ZoneId $zoneId -Headers $headers
Set-DNSRecord -Name "*.$DOMAIN" -Content $ip -ZoneId $zoneId -Headers $headers

Write-Host ""
Write-Host "✅ Setup DNS completato!" -ForegroundColor Green
Write-Host ""
Write-Host "Ora avvia il container DDNS:" -ForegroundColor Yellow
Write-Host "  docker-compose up -d cloudflare-ddns" -ForegroundColor Gray
