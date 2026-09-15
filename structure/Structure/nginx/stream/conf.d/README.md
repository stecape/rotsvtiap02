# Nginx Stream Multiplexer - Configurazioni

Questa directory contiene configurazioni aggiuntive per il multiplexer nginx.

## File caricati automaticamente

Tutti i file `.conf` in questa directory vengono inclusi automaticamente.

## Esempi d'uso

### Aggiungere un nuovo dominio

Crea `custom-domain.conf`:
```nginx
# Nessuna configurazione necessaria qui per stream
# Il map in nginx.conf gestisce già *.rotsvtiap02
```

### Log personalizzati

Crea `custom-logs.conf`:
```nginx
# Log format personalizzato per stream
log_format detailed '$remote_addr [$time_local] '
                    '$protocol $status $bytes_sent $bytes_received '
                    '$session_time';
```
