# Script di setup per Windows
# Esegui con: .\setup.ps1

Write-Host "🚀 Setup Infrastruttura Docker Traefik" -ForegroundColor Cyan
Write-Host ""

# Verifica Docker
Write-Host "Verifica Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker installato" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker non trovato. Installa Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verifica Docker Compose
Write-Host "Verifica Docker Compose..." -ForegroundColor Yellow
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose installato" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose non trovato." -ForegroundColor Red
    exit 1
}

# Crea file .env se non esiste
if (-not (Test-Path ".env")) {
    Write-Host "Creazione file .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ File .env creato. IMPORTANTE: Modifica .env con le tue credenziali!" -ForegroundColor Green
} else {
    Write-Host "⚠️  File .env già esistente" -ForegroundColor Yellow
}

# Crea file acme.json
Write-Host "Creazione file traefik/acme.json..." -ForegroundColor Yellow
if (-not (Test-Path "traefik/acme.json")) {
    New-Item -ItemType File -Path "traefik/acme.json" -Force | Out-Null
    Set-Content -Path "traefik/acme.json" -Value "{}"
    
    # Imposta permessi corretti (equivalente chmod 600)
    $acl = Get-Acl "traefik/acme.json"
    $acl.SetAccessRuleProtection($true, $false)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        $env:USERNAME,
        "Read,Write",
        "Allow"
    )
    $acl.SetAccessRule($rule)
    Set-Acl "traefik/acme.json" $acl
    
    Write-Host "✅ File traefik/acme.json creato con permessi corretti" -ForegroundColor Green
} else {
    Write-Host "⚠️  File traefik/acme.json già esistente" -ForegroundColor Yellow
}

# Verifica struttura directory
Write-Host "Verifica struttura directory..." -ForegroundColor Yellow
$directories = @("traefik", "traefik/config", "traefik/logs", "nginx/stream", "nginx/stream/conf.d", "services")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Creata directory: $dir" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📋 PROSSIMI PASSI:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configura .env con le credenziali Cloudflare:" -ForegroundColor Yellow
Write-Host "   notepad .env" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test configurazione Cloudflare DDNS:" -ForegroundColor Yellow
Write-Host "   .\test-ddns.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Setup record DNS su Cloudflare (opzionale, lo fa anche il container):" -ForegroundColor Yellow
Write-Host "   .\setup-ddns.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Avvia infrastruttura:" -ForegroundColor Yellow
Write-Host "   docker-compose up -d" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Monitora logs:" -ForegroundColor Yellow
Write-Host "   docker-compose logs -f" -ForegroundColor Gray
Write-Host ""
Write-Host "Per la checklist completa, vedi: SETUP-CHECKLIST.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Setup base completato!" -ForegroundColor Green
