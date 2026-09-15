# Mosquitto MQTT Broker

Broker MQTT con supporto WebSocket, integrato con Traefik per SSL e reverse proxy.

## 🏗️ Architettura

### Mosquitto MQTT Broker
- **Versione**: Eclipse Mosquitto (latest)
- **MQTT Standard**: Porta 1883 (TCP) esposta direttamente
- **MQTT WebSocket**: wss://mqtt.rotsvtiap02 via Traefik (porta interna 9001)
- **Persistenza**: Volume persistente `mosquitto-data`

## 📡 Modalità di Accesso

### 1. MQTT Standard (TCP)
Per client MQTT nativi (Python, Node.js, ESP32, etc.):
```
Host: mqtt.rotsvtiap02 (o IP del server)
Port: 1883
Protocol: MQTT
```

### 2. MQTT WebSocket (WSS)
Per browser e applicazioni web:
```
URL: wss://mqtt.rotsvtiap02
Protocol: WebSocket
```

### 3. Da Backend Docker
Per servizi Docker nello stesso host:
```
Host: mosquitto
Port: 1883 (MQTT) o 9001 (WebSocket interno)
```

## 🚀 Quick Start

### 1. Avvio Broker
```powershell
# Dalla cartella MQTT
docker-compose up -d

# Verifica stato
docker-compose ps

# Visualizza log
docker-compose logs -f
```

### 2. Test Connessione

#### Con mosquitto_sub/pub (installare mosquitto-clients)
```powershell
# Subscribe
mosquitto_sub -h mqtt.rotsvtiap02 -p 1883 -t test/topic

# Publish
mosquitto_pub -h mqtt.rotsvtiap02 -p 1883 -t test/topic -m "Hello MQTT"
```

#### Con Node.js (mqtt.js)
```javascript
const mqtt = require('mqtt');

// MQTT Standard
const client = mqtt.connect('mqtt://mqtt.rotsvtiap02:1883');

// MQTT WebSocket
const clientWS = mqtt.connect('wss://mqtt.rotsvtiap02');

client.on('connect', () => {
  console.log('Connected!');
  client.subscribe('test/topic');
  client.publish('test/topic', 'Hello from Node.js');
});

client.on('message', (topic, message) => {
  console.log(topic, message.toString());
});
```

#### Con Python (paho-mqtt)
```python
import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    print(f"Connected: {rc}")
    client.subscribe("test/topic")

def on_message(client, userdata, msg):
    print(f"{msg.topic}: {msg.payload.decode()}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("mqtt.rotsvtiap02", 1883, 60)
client.loop_forever()
```

## 🔌 Connessione da Backend Docker

Per connettere un backend Docker al broker MQTT:

### 1. Aggiungi la rete al docker-compose
```yaml
services:
  your-backend:
    image: your-image
    networks:
      - mqtt-network  # Aggiungi questa rete
      - proxy         # Eventualmente per Traefik

networks:
  mqtt-network:
    external: true  # Riferimento alla rete creata da questo stack
  proxy:
    external: true
```

### 2. Connection String
```
Host: mosquitto
Port: 1883 (MQTT standard) o 9001 (WebSocket)
```

## 📡 Reti Docker

### `mqtt-network` (interna)
Rete per backend Docker:
- Mosquitto broker
- Servizi backend che necessitano MQTT

### `proxy` (esterna)
Rete Traefik per WebSocket:
- Espone WebSocket su wss://mqtt.rotsvtiap02

## 🔒 Sicurezza

### Configurazione Attuale
- ⚠️ **allow_anonymous true** - Accesso senza autenticazione

### Abilitare Autenticazione

#### 1. Crea file password
```powershell
# Entra nel container
docker exec -it mosquitto sh

# Crea utente (verrà chiesta la password)
mosquitto_passwd -c /mosquitto/config/passwd username

# Aggiungi altri utenti (senza -c per non sovrascrivere)
mosquitto_passwd /mosquitto/config/passwd another_user

# Esci
exit
```

#### 2. Modifica mosquitto.conf
Cambia `allow_anonymous true` in:
```conf
allow_anonymous false
password_file /mosquitto/config/passwd
```

#### 3. Restart broker
```powershell
docker-compose restart
```

### ACL (Access Control List)
Per limitare topic per utente, crea `config/acl`:
```conf
# Admin ha accesso a tutto
user admin
topic readwrite #

# User1 può solo leggere sensor/*
user user1
topic read sensor/#

# User2 può pubblicare su command/*
user user2
topic write command/#
```

Abilita in `mosquitto.conf`:
```conf
acl_file /mosquitto/config/acl
```

## 🔧 Comandi Utili

```powershell
# Stop broker
docker-compose down

# Stop e rimuovi volumi (ATTENZIONE: cancella dati!)
docker-compose down -v

# Restart broker
docker-compose restart

# Log in tempo reale
docker-compose logs -f

# Shell nel container
docker exec -it mosquitto sh

# Verifica configurazione
docker exec mosquitto mosquitto -c /mosquitto/config/mosquitto.conf -v
```

## 📊 Monitoring

### Log
```powershell
# Log del broker
docker-compose logs -f mosquitto

# Log file dentro il container
docker exec mosquitto cat /mosquitto/log/mosquitto.log
```

### Statistiche
```powershell
# Connessioni attive
mosquitto_sub -h mqtt.rotsvtiap02 -p 1883 -t \$SYS/broker/clients/connected
```

## 🌐 Integrazione con Traefik

Questo stack si integra con l'infrastruttura Traefik in `C:\Structure`:
- Usa la rete `proxy` condivisa
- WebSocket esposto via HTTPS con certificato SSL automatico
- MQTT standard (porta 1883) bypassare Traefik (TCP diretto)

## 🔧 Troubleshooting

### WebSocket non connette
- Verifica che Traefik sia attivo: `docker ps | grep traefik`
- Controlla DNS per `mqtt.rotsvtiap02`
- Verifica log Mosquitto: `docker-compose logs -f`

### MQTT standard non connette
- Verifica porta 1883 aperta: `Test-NetConnection mqtt.rotsvtiap02 -Port 1883`
- Controlla firewall Windows

### Backend Docker non si connette
- Verifica che il servizio sia sulla rete `mqtt-network`
- Usa `mosquitto` come hostname, non IP o `localhost`

### Persistenza non funziona
```powershell
# Verifica permessi volume
docker-compose down
docker volume inspect mqtt_mosquitto-data

# Ricrea volume
docker volume rm mqtt_mosquitto-data
docker-compose up -d
```

## 📚 Risorse

- [Mosquitto Documentation](https://mosquitto.org/documentation/)
- [MQTT.js Client](https://github.com/mqttjs/MQTT.js)
- [Paho MQTT Python](https://www.eclipse.org/paho/index.php?page=clients/python/index.php)
- [MQTT Protocol Specs](https://mqtt.org/)
