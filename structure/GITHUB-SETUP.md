# Setup GitHub

Segui questi passaggi per pubblicare l'infrastructure su GitHub:

## 1. Crea i repository su GitHub

Crea 4 repository vuoti (senza README, .gitignore o licenza):
- `infrastructure` (repository principale)
- `infrastructure-structure`
- `infrastructure-db`
- `infrastructure-mqtt`

## 2. Collega i repository locali a GitHub

```powershell
# Repository Structure
cd c:\Structure
git remote add origin https://github.com/TUO_USERNAME/infrastructure-structure.git
git branch -M main
git push -u origin main

# Repository DB
cd c:\DB
git remote add origin https://github.com/TUO_USERNAME/infrastructure-db.git
git branch -M main
git push -u origin main

# Repository MQTT
cd c:\MQTT
git remote add origin https://github.com/TUO_USERNAME/infrastructure-mqtt.git
git branch -M main
git push -u origin main

# Repository principale
cd c:\infrastructure
git remote add origin https://github.com/TUO_USERNAME/infrastructure.git
git branch -M main
git push -u origin main
```

## 3. Aggiorna gli URL dei submodules

Dopo aver pubblicato i repository, aggiorna il file `.gitmodules` nel repository principale:

```powershell
cd c:\infrastructure
# Modifica .gitmodules per usare gli URL HTTPS di GitHub invece dei percorsi locali
```

Il file `.gitmodules` dovrebbe essere modificato da:
```ini
[submodule "Structure"]
    path = Structure
    url = c:/Structure
```

A:
```ini
[submodule "Structure"]
    path = Structure
    url = https://github.com/TUO_USERNAME/infrastructure-structure.git
```

Ripeti per tutti e tre i submodules, poi:

```powershell
git add .gitmodules
git commit -m "Update submodule URLs to GitHub"
git push
```

## 4. Clone del progetto completo

Chiunque potrà clonare l'intero progetto con:

```bash
git clone --recursive https://github.com/TUO_USERNAME/infrastructure.git
```

## 5. Workflow di sviluppo

### Aggiornare un submodule:
```bash
cd infrastructure/Structure
git pull origin main
cd ..
git add Structure
git commit -m "Update Structure submodule"
git push
```

### Aggiornare tutti i submodules:
```bash
git submodule update --remote --merge
```

### Clonare senza dimenticare i submodules:
```bash
git clone --recursive <repo-url>
```

### Se hai già clonato senza --recursive:
```bash
git submodule update --init --recursive
```
