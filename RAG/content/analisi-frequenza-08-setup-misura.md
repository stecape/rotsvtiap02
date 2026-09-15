---
title: "Setup di Misura Pratico — Strumentazione e Procedure"
date: 2026-05-01
tags: [misura, accelerometro, strumentazione, procedura, sensori, posizionamento]
---

# Setup di Misura Pratico — Strumentazione e Procedure

## 1. Strumentazione Necessaria

### 1.1 Accelerometri

L'accelerometro piezoelettrico è il sensore standard per l'analisi vibrazionale industriale.

**Caratteristiche da verificare per l'applicazione su macchine rotocalco con motori 1PH8:**

| Parametro | Valore consigliato | Note |
|-----------|-------------------|------|
| Sensibilità | 100 mV/g | Standard industriale |
| Range in frequenza | 0.5 Hz – 15 kHz (±3 dB) | Copre 1X fino a RSH e PWM |
| Range dinamico | ±50 g | Sufficiente per motori industriali |
| Connettore | BNC o M12 | Evitare microfoni o connettori fragili |
| Temperatura operativa | -40°C / +120°C | Superficie carcassa motore può essere calda |
| Classe di protezione | IP67 | Ambiente con nebbia di inchiostro |

**Accelerometri consigliati** (tipologia generica):
- **Sensore uniassiale** (un asse): sufficiente per la maggior parte delle misure, scegliere l'asse di misura in base al difetto sospettato
- **Sensore triassiale**: misura simultanea radiale X, radiale Y e assiale Z — utile per il primo rilievo diagnostico globale

### 1.2 Analizzatore di Segnale

Gli analizzatori portatili più comuni per la diagnostica in campo:

| Tipo | Esempi | Caratteristiche |
|------|--------|-----------------|
| **Analizzatore vibrazioni portatile** | SKF Microlog, CSI 2140 Emerson, Fluke 810 | 2–4 canali, FFT onboard, memoria, display |
| **DAQ + software PC** | NI CompactDAQ + DIAdem/LabVIEW | Alta flessibilità, più canali, analisi offline |
| **Analizzatore multi-canale** | Brüel & Kjær PULSE, HEAD Artemis | Lab grade, per analisi strutturale avanzata |

Per la diagnostica di routine sulle macchine rotocalco è sufficiente un **analizzatore portatile a 2 canali** con capacità di envelope analysis.

### 1.3 Accessori

- **Magnete di fissaggio**: per fissaggio rapido su superfici ferrose (carcassa motore). Limite: introduce risonanza propria del magnete (tipicamente 1–2 kHz) che può falsare le misure ad alta frequenza
- **Stud con filettatura** (M5 o M8): montaggio rigido per massima banda passante — usare dove possibile per misure di riferimento permanente
- **Cera di montaggio**: per montaggio temporaneo, buona fino a ~2 kHz
- **Punta di contatto**: per misure rapide esplorative, banda passante limitata (~1 kHz)

> **Raccomandazione**: per le misure di baseline (riferimento) usare sempre il **montaggio a stud**. Per le misure di follow-up rapide è accettabile il magnete, ma confrontare sempre con la stessa modalità di fissaggio.

---

## 2. Posizionamento dei Sensori

### 2.1 Principio Generale

Regola d'oro: **il sensore deve essere posizionato il più vicino possibile al cuscinetto da monitorare**, minimizzando le giunture meccaniche nel percorso vibrazionale.

Il percorso vibrazionale ideale è:
```
Cuscinetto → Carcassa motore (superficie liscia in asse al cuscinetto) → Sensore
```

### 2.2 Posizioni Standard sul Motore 1PH8

Per ogni motore 1PH8, definire **4 posizioni di misura standard**:

| Posizione | Direzione | Denominazione | Cosa monitora principalmente |
|-----------|-----------|---------------|------------------------------|
| **DE-H** | Radiale orizzontale | Drive End Horizontal | Cuscinetto DE, squilibrio, disallineamento |
| **DE-V** | Radiale verticale | Drive End Vertical | Cuscinetto DE |
| **DE-A** | Assiale | Drive End Axial | Disallineamento angolare, spinta assiale |
| **NDE-H** | Radiale orizzontale | Non-Drive End Horizontal | Cuscinetto NDE, encoder |

**Posizioni opzionali per analisi avanzata**:
- **NDE-V**: radiale verticale lato NDE
- **RIDUTTORE-H**: su carcassa riduttore, lato albero lento (vicino al cuscinetto del cilindro)

### 2.3 Indicazioni Pratiche sul Motore 1PH8

```
Vista laterale del motore 1PH8:

    [NDE]                              [DE - accoppiamento]
    Encoder                            Flangia / Riduttore
      |                                        |
 _____|_________________________________________|_____
|    |                                          |    |
|  [Cuscinetto NDE]    Carcassa motore    [Cuscinetto DE]|
|____|__________________________________________|____|

Posizioni sensore:
  • NDE-H: superficie carcassa, sopra asse cuscinetto NDE, direzione orizzontale
  • DE-H:  superficie carcassa, sopra asse cuscinetto DE, direzione orizzontale
  • DE-A:  superficie carcassa lato DE, direzione assiale (puntare verso il cilindro)
```

### 2.4 Cosa Evitare

- **Superfici verniciate**: ridurre la vernice con carta abrasiva fine prima del montaggio stud. La vernice introduce un'interfaccia soffice che attenuа le alte frequenze.
- **Superfici con nervature di raffreddamento** (come alette): risuonano a frequenze proprie e falsano il segnale. Posizionare tra le alette, sulla superficie piatta.
- **Superfici calde** (>80°C): usare accelerometri con certificazione termica e cavo resistente
- **Zone vibranti per cause esterne**: evitare superfici vicino a tubi con flusso turbolento, ventole, pompe

---

## 3. Procedure di Misura

### 3.1 Misura di Baseline (Prima Campagna)

La misura di baseline è il **riferimento assoluto** con cui confrontare tutte le misure future. Deve essere eseguita:
- Su macchina **nuova o appena revisionata**
- A regime stabile (velocità, temperatura, carico nominali)
- Con condizioni di processo documentate
- Con parametri di acquisizione documentati e ripetibili

**Checklist pre-misura baseline**:
- [ ] Verificare che la macchina sia a regime da almeno 30 minuti (cuscinetti a temperatura stabile)
- [ ] Documentare velocità nastro [m/min], velocità motore [RPM], carico [%]
- [ ] Documentare temperatura ambiente e temperatura superficiale motore (termometro IR)
- [ ] Documentare viscosità e tipo inchiostro (se rilevante)
- [ ] Verificare che non ci siano interventi meccanici recenti (cambio cuscinetto, allineamento)
- [ ] Documentare il serial number e la posizione esatta del sensore (foto)

**Parametri di acquisizione da documentare**:
- Frequenza di campionamento
- Numero di campioni / risoluzione FFT
- Tipo di finestra
- Numero di medie
- Grandezza misurata (accelerazione/velocità) e unità
- Tipo e metodo di fissaggio sensore

### 3.2 Misura di Monitoraggio Periodico

Le misure periodiche devono replicare **esattamente** le condizioni della baseline:
- Stessa velocità di processo
- Stessa posizione e metodo di fissaggio sensore
- Stessi parametri di acquisizione

**Frequenza di misura consigliata**:

| Stato della macchina | Frequenza consigliata |
|---------------------|----------------------|
| Macchina nuova / OK | Ogni 3–6 mesi |
| Livello B (attenzione) | Ogni mese |
| Livello C (allarme) | Ogni settimana / in continuo |
| Dopo intervento | Baseline post-riparazione |

### 3.3 Protocollo di Acquisizione Step-by-Step

**Fase 1 — Misura globale RMS (2 minuti)**
1. Connettere accelerometro in posizione DE-H
2. Impostare analizzatore in modalità "Overall RMS" banda 10–1000 Hz
3. Registrare il valore. Se >10% superiore alla baseline → approfondire.

**Fase 2 — Spettro di velocità (5 minuti per posizione)**
1. Impostare: $f_s$ = 3200 Hz, N = 4096, Hann, 8 medie, banda 0–1000 Hz
2. Acquisire in ciascuna delle 4 posizioni standard
3. Sovrapporre allo spettro di baseline (overlay)
4. Identificare picchi nuovi o cresciuti

**Fase 3 — Analisi envelope (5 minuti per posizione, se sospetto cuscinetto)**
1. Impostare: $f_s$ = 25600 Hz
2. Applicare filtro BP 2–10 kHz
3. Demodulare (envelope)
4. FFT dell'inviluppo: risoluzione 0.2 Hz, banda 0–500 Hz
5. Confrontare con frequenze teoriche BPFO, BPFI, BSF, FTF

**Fase 4 — Waterfall a velocità variabile (10 minuti, se disponibile)**
1. Avviare registrazione waterfall
2. Eseguire rampa di velocità da 0 a nominale
3. Identificare componenti sincrone (difetti meccanici) e asincrone (elettriche)

### 3.4 Misura con Funzione Trace SINAMICS S120

Quando si sospetta un difetto meccanico che si manifesta come irregolarità di velocità (torque ripple, difetto cilindro):

1. **Connettere** PC con TIA Portal / SINAMICS Startdrive alla Control Unit S120
2. **Aprire** Diagnostics → Trace
3. **Configurare** i canali:
   - CH1: r0063 (Actual speed value) [RPM]
   - CH2: r0031 (Actual torque value) [Nm]
4. **Trigger**: avvio manuale
5. **Tempo campionamento**: 1 ms (1000 Hz di banda)
6. **Durata**: 10 secondi (sufficiente per 5–10 giri a velocità nominale)
7. **Acquisire** e esportare CSV
8. **Analisi FFT** del segnale esportato in Python/MATLAB/Excel con funzione FFT

> **Tip**: la velocità angolare istantanea (r0063) è uno dei segnali più informativi — contiene direttamente le oscillazioni di velocità causate da squilibri, difetti cuscinetto trasmessi tramite coppia, e torque ripple elettrico.

---

## 4. Sicurezza durante le Misure

### 4.1 Rischi Specifici in Ambiente Rotocalco

| Rischio | Misura preventiva |
|---------|------------------|
| Superfici calde motore (>80°C) | Guanti termici, termometro IR prima del contatto |
| Nastro in movimento | Non avvicinarsi al percorso nastro con cavi che potrebbero impigliarsi |
| Inchiostro (solventi) | DPI (guanti nitrile, occhiali). Verificare che il sensore sia approvato per uso in Zone ATEX se applicabile |
| Parti in rotazione (accoppiamento, riduttore) | Rispettare distanze di sicurezza, non avvicinarsi senza carter |
| Alta tensione (cavi motore, azionamento) | Non aprire quadri o canaline durante la misura |
| Avvio inatteso della macchina | Comunicare con l'operatore. Non eseguire misure durante il set-up senza autorizzazione |

### 4.2 Verifiche ATEX

Se la macchina opera con solventi infiammabili (inchiostri a base solvente — tipico nel rotocalco), verificare che:
- La zona di installazione sensori sia classificata (Zona 1, 2, ecc.)
- Gli accelerometri e i cavi siano certificati ATEX per la zona specifica
- Il raccoglitore di dati sia posizionato fuori dalla zona ATEX o sia esso stesso certificato
