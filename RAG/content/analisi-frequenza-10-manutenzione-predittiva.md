---
title: "Manutenzione Predittiva Motori 1PH8 sulle Macchine Rotocalco"
date: 2026-05-01
tags: [manutenzione-predittiva, CBM, KPI, soglie, piano-monitoraggio, trend, CMMS]
---

# Manutenzione Predittiva Motori 1PH8 sulle Macchine Rotocalco

## 1. Dalla Manutenzione Preventiva alla Manutenzione Predittiva

### 1.1 Confronto tra Strategie

| Strategia | Descrizione | Pro | Contro |
|-----------|-------------|-----|--------|
| **Reattiva** (Run to failure) | Si interviene solo al guasto | Nessun costo di manutenzione pianificata | Guasti imprevisti, fermo non pianificato, danni secondari |
| **Preventiva a tempo fisso** | Sostituzione componenti a intervalli fissi (es. cuscinetti ogni 2 anni) | Prevedibile, semplice | Spreco: si sostituisce il 50% dei componenti ancora buoni |
| **Predittiva (CBM)** | Si interviene quando il monitoraggio indica effettiva necessità | Massimo utilizzo dei componenti, zero fermo imprevisto | Richiede investimento in strumentazione e competenze |

La strategia **Condition-Based Maintenance (CBM)** con analisi vibrazionale è quella adottata nel presente piano.

### 1.2 ROI della Manutenzione Predittiva nel Rotocalco

Una macchina rotocalco con guasto catastrofico di un cuscinetto motore causa:
- **Fermo macchina**: 4–16 ore (sostituzione motore/cuscinetto, riallineamento, riscaldamento)
- **Scarti di produzione**: nastro già caricato, inchiostro nel sistema
- **Costo opportunità**: perdita di produzione pregiata (lavori con alte tirature)
- **Possibili danni secondari**: al riduttore, al cilindro stampa, al controcilindr

L'analisi vibrazionale costa una manodopera qualificata ~2–3 ore/macchina/trimestre. Il ROI è tipicamente >10:1 sul solo risparmio fermo macchina nel primo anno.

---

## 2. Definizione dei KPI di Monitoraggio

### 2.1 KPI per Ogni Motore 1PH8

Per ogni motore monitorato, definire e registrare i seguenti KPI ad ogni campagna di misura:

| KPI | Grandezza | Frequenza registrazione | Soglia allarme |
|-----|-----------|------------------------|----------------|
| **Overall RMS velocità** | mm/s RMS, banda 10–1000 Hz | Ogni campagna | > +25% dalla baseline |
| **Picco 1X** | mm/s picco | Ogni campagna | > +3 dB dalla baseline |
| **Kurtosis** (banda acc. 1–10 kHz) | adimensionale | Ogni campagna | > 4 |
| **Crest Factor** | adimensionale | Ogni campagna | > 3 |
| **Overall envelope RMS** | g RMS, banda inviluppo | Ogni campagna | > +3 dB dalla baseline |
| **Temperatura carcassa motore** | °C | Ogni campagna | > 90°C (o +15°C da baseline) |
| **Corrente di fase RMS** | A RMS | Ogni campagna (da drive) | > $I_n \times 1.1$ |

### 2.2 KPI Specifici per Cuscinetti (se analisi envelope disponibile)

| Componente | KPI | Soglia attenzione | Soglia allarme |
|-----------|-----|------------------|----------------|
| Cuscinetto DE | BPFO amp. in envelope | +6 dB / baseline | +12 dB / baseline |
| Cuscinetto DE | BPFI amp. in envelope | +6 dB / baseline | +12 dB / baseline |
| Cuscinetto NDE | BPFO amp. in envelope | +6 dB / baseline | +12 dB / baseline |
| Qualsiasi | Armoniche BPFO/BPFI (3+ armoniche visibili) | — | → Piano sostituzione |

---

## 3. Classificazione di Severità

### 3.1 Semaforo Vibrazionale

Adottare un sistema a 3 livelli (semaforo) per classificare lo stato di ogni motore:

| Colore | Stato | Criterio | Azione |
|--------|-------|----------|--------|
| 🟢 **VERDE** | Normal | Tutti i KPI nella norma, trend stabile | Monitoraggio standard |
| 🟡 **GIALLO** | Attention | Un KPI supera la soglia di attenzione, o trend crescente | Monitoraggio intensificato, analisi approfondita |
| 🔴 **ROSSO** | Critical | KPI in zona C/D (ISO 20816) o difetto confermato evolutivo | Pianificazione intervento urgente, preparare ricambi |
| ⚫ **NERO** | Danger | KPI in zona D, kurtosis > 10, RMS raddoppiato | Fermare la macchina al più presto |

### 3.2 Scala Temporale di Intervento

| Classificazione | Intervento entro |
|----------------|-----------------|
| 🟢 VERDE | Nessun intervento — prossima campagna standard |
| 🟡 GIALLO | 1 mese — analisi approfondita, ordinare eventuale ricambio |
| 🔴 ROSSO | 1 settimana — pianificare sostituzione alla prossima fermata programmata |
| ⚫ NERO | Immediato — non superare il turno di produzione corrente |

---

## 4. Piano di Monitoraggio Periodico

### 4.1 Frequenza delle Campagne

| Tipo di macchina / Priorità | Frequenza campagne |
|-----------------------------|-------------------|
| Macchina critica (alta produzione, nessun backup) | Mensile |
| Macchina importante (backup disponibile) | Trimestrale |
| Macchina non critica | Semestrale |
| Post-intervento (sostituzione cuscinetto, allineamento) | 1 settimana dopo, poi 1 mese dopo, poi standard |

### 4.2 Procedure per Campagna Standard (Checklist)

**Prima della campagna (in ufficio/magazzino)**
- [ ] Stampare la scheda di ispezione con i valori baseline e dell'ultima campagna
- [ ] Verificare la calibrazione dell'analizzatore (certificato di calibrazione annuale)
- [ ] Verificare la carica della batteria dell'analizzatore e del notebook
- [ ] Recuperare la posizione esatta dei sensori (foto archiviate)
- [ ] Calcolare le frequenze teoriche per la velocità di esercizio odierna

**In campo**
- [ ] Comunicare all'operatore: macchina non deve essere fermata o accelerata durante le misure
- [ ] Verificare la velocità di esercizio e documentarla
- [ ] Misura overall RMS in tutte e 4 le posizioni (DE-H, DE-V, DE-A, NDE-H)
- [ ] Acquisire spettro completo (0–1000 Hz) in tutte le posizioni
- [ ] Acquisire spettro envelope (se disponibile) nelle posizioni DE-H e NDE-H
- [ ] Registrare temperatura superficiale motore con termometro IR
- [ ] Verificare visivamente: perdite olio, danneggiamenti fisici, bulloni allentati
- [ ] Acquisire corrente di fase dal display SINAMICS S120 (o parametro r0027)

**Dopo la campagna (in ufficio)**
- [ ] Inserire i dati nel database/foglio di monitoraggio
- [ ] Aggiornare i grafici di trend
- [ ] Confrontare spettri con baseline (overlay plot)
- [ ] Classificare ogni motore con il semaforo
- [ ] Emettere rapporto di ispezione e comunicare al responsabile di manutenzione
- [ ] Aggiornare la data della prossima campagna

---

## 5. Database e Archiviazione

### 5.1 Struttura del Database di Monitoraggio

Per ogni macchina/motore, archiviare:

```
/Macchina_[nome]/
  /[ID_Motore_Posizione]/
    baseline_[data].dat        ← spettro di riferimento
    [data]_DE-H_spettro.dat    ← misure successive
    [data]_DE-H_envelope.dat
    [data]_scheda.pdf          ← scheda compilata
    trend_KPI.xlsx             ← foglio trend
    foto_sensori/              ← posizioni sensori documentate
```

### 5.2 Grafici di Trend Essenziali

Per ogni motore mantenere aggiornati almeno:

1. **Trend RMS overall** nel tempo: scala lineare, con linee di soglia gialla/rossa
2. **Trend Kurtosis** nel tempo: evidenziare quando supera 4
3. **Overlay spettri**: ultimi 3 spettri sovrapposti al baseline
4. **Trend temperatura**: correlata con le vibrazioni per identificare problemi termici

---

## 6. Gestione dei Ricambi

### 6.1 Ricambi Critici da Tenere a Magazzino

Per ogni taglia di motore 1PH8 installata sulla macchina, il magazzino dovrebbe contenere:

| Ricambio | Quantità minima | Note |
|---------|----------------|------|
| Cuscinetto DE | 2 pz | Per ogni taglia motore installata |
| Cuscinetto NDE | 2 pz | |
| Guarnizioni tenuta olio | 5 pz | |
| Motore completo (taglia principale) | 1 pz | Solo per macchine critiche |
| Connettore encoder (SpeedTec o Cannon) | 2 pz | Molto fragile |

### 6.2 Procedura di Sostituzione Cuscinetto su 1PH8

La sostituzione dei cuscinetti del motore 1PH8 è un'operazione qualificata. Passaggi principali (fare riferimento al manuale Siemens 1PH8 — Capitolo "Bearing replacement"):

1. **Sicurezza**: STO (Safe Torque Off) attivato sul drive, blocco meccanico, LOTO
2. **Raffreddamento**: attendere che la superficie scenda sotto 40°C
3. **Disaccoppiamento**: rimuovere l'accoppiamento dal lato DE
4. **Rimozione encoder**: smontare con cura il connettore e lo stator dell'encoder NDE (verificare se EnDat: richiedrà riparametrizzazione drive dopo rimontaggio)
5. **Smontaggio cuscinetti**: usare estrattore meccanico — MAI colpi di martello direttamente sull'anello
6. **Pulizia**: pulizia delle sedi con solvente approvato
7. **Montaggio**: installare i nuovi cuscinetti con pressa o metodo termico (riscaldamento induttivo a max 100°C) — MAI colpi di martello
8. **Lubrificazione**: applicare la quantità di grasso corretta (verifica sul manuale Siemens per la taglia specifica)
9. **Rimontaggio encoder**: verificare l'allineamento
10. **Riallineamento motore-riduttore**: misura con laser aligner dopo rimontaggio
11. **Misura vibrazionale post-sostituzione**: acquisire baseline aggiornata entro 1 settimana

---

## 7. Integrazione con il Sistema di Controllo — Monitoraggio Continuo

### 7.1 Parametri Monitorabili in Continuo via SINAMICS

Il SINAMICS S120 mette a disposizione funzioni di monitoraggio continuo senza sensori aggiuntivi:

| Funzione | Parametro SINAMICS | Cosa monitora |
|---------|-------------------|---------------|
| Monitoraggio temperatura motore | r0035, r0036 | KTY84 / PTC — sovratemperatura avvolgimenti |
| Corrente di fase (overload) | r0027 | Sovraccarico termico, difetto rotore |
| Speed controller output | r0040 | Riferimento coppia — variazioni indicano perturbazioni meccaniche |
| Vibration monitoring (opz.) | Funzione "Vibration Detection" | Disponibile su alcuni firmware SINAMICS come funzione opzionale |

### 7.2 Vibration Detection Integrata SINAMICS S120

Alcune versioni firmware del SINAMICS S120 includono la funzione **"Motor Vibration Identification"** che analizza le oscillazioni del segnale di velocità dell'encoder per rilevare vibrazioni meccaniche senza sensori aggiuntivi.

Parametri da abilitare (se disponibili nel firmware installato):
- p0491: abilita la rilevazione di vibrazioni
- r0492: frequenza di vibrazione rilevata
- r0493: ampiezza di vibrazione rilevata

Questa funzione è un complemento utile ma non sostituisce la misura con accelerometro, poiché la sua sensibilità è limitata alla banda passante dell'encoder e del regolatore.

---

## 8. Reporting e Comunicazione

### 8.1 Struttura del Rapporto di Ispezione

Ogni campagna di misura deve produrre un **Rapporto di Ispezione** sintetico contenente:

```
RAPPORTO ISPEZIONE VIBRAZIONALE
Data: ___________   Macchina: ___________   Operatore: ___________
Velocità di esercizio: ___ m/min   Temperatura ambiente: ___ °C

MOTORE [ID] — Posizione [DE/NDE]
  Overall RMS:  ___ mm/s   (baseline: ___ mm/s)   Variazione: ____%
  Kurtosis:     ___         Crest Factor: ___
  Temperatura:  ___ °C
  
  Osservazioni spettro: _____________________________________________
  Analisi envelope: _________________________________________________
  
  CLASSIFICAZIONE: 🟢 VERDE / 🟡 GIALLO / 🔴 ROSSO / ⚫ NERO
  
  Raccomandazioni: __________________________________________________
  Prossima campagna: ___________
```

### 8.2 Comunicazione delle Anomalie

In caso di classificazione 🟡 GIALLO o superiore:
1. **Notifica immediata** al responsabile di manutenzione (email/ticket CMMS)
2. **Allegare**: rapporto, spettri overlay, trend KPI
3. **Proposta di azione**: tipo di intervento, stima costo, urgenza
4. **Tracking**: il ticket rimane aperto fino alla risoluzione e alla misura di verifica post-intervento
