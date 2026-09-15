# Infrastructure

Repository principale per la gestione dell'infrastruttura modulare.

## Moduli

Questo progetto è composto da tre moduli principali, gestiti come git submodules:

- **Structure**: Configurazione infrastrutturale con Traefik, Nginx, CrowdSec
- **DB**: Modulo database
- **MQTT**: Broker MQTT

## Setup

### Clone con submodules

```bash
git clone --recursive <repository-url>
```

Se hai già clonato il repository senza i submodules:

```bash
git submodule update --init --recursive
```

### Aggiornamento submodules

```bash
git submodule update --remote --merge
```

## Utilizzo

Ogni modulo ha il proprio README con le istruzioni specifiche.
