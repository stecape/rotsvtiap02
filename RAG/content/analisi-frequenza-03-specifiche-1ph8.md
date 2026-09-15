---
title: "Siemens 1PH8 - Specifiche Tecniche e Costruzione"
date: 2026-05-01
tags: [1PH8, siemens, specifiche, encoder, cuscinetti, SINAMICS, S120]
---

# Siemens 1PH8 — Specifiche Tecniche e Costruzione

## 1. Posizionamento della Serie 1PH8

La serie **1PH8** è la linea di motori asincroni (induction motors) Siemens ottimizzata per applicazioni servo ad alta dinamica. Si distingue dalla serie 1PH7 (progenitrice) e dai motori sincroni a magneti permanenti (1FK7, 1FT7) per:

- **Robustezza**: il rotore a gabbia non ha magneti che possono smagnetirsi o scheggiarsi
- **Economicità**: costo inferiore ai motori sincroni a PM a parità di potenza
- **Tolleranza termica**: migliore comportamento in sovraccarico prolungato
- **Velocità elevate**: può raggiungere velocità molto superiori ai motori PM senza problemi di debolimento di campo

L'applicazione tipica nelle macchine rotocalco è il **motore di trascinamento cilindro** e il **motore di tiro nastro**, dove si richiedono coppie medie elevate, bassa inerzia e alta ripetibilità di velocità.

---

## 2. Famiglie e Taglie

La nomenclatura Siemens 1PH8 segue lo schema:

```
1PH8 [altezza asse] [lunghezza] - [versione] [encoder] [raffreddamento]
       |               |
       |               L = corto, M = medio, X = lungo
       LL = 63mm, 100, 132, 160, 180, 225...
```

Esempi tipici sulle nostre macchine rotocalco:

| Codice | Altezza asse | Potenza tipica | Coppia nominale | Velocità nominale |
|--------|-------------|----------------|-----------------|-------------------|
| 1PH8101 | 100 mm | 2.0–5.5 kW | 7–18 Nm | 2000–3000 RPM |
| 1PH8131 | 132 mm | 5.5–15 kW | 18–48 Nm | 2000–3000 RPM |
| 1PH8161 | 160 mm | 11–30 kW | 35–95 Nm | 2000–3000 RPM |
| 1PH8183 | 180 mm | 22–55 kW | 70–175 Nm | 2000–3000 RPM |

> **Nota**: verificare sempre il datasheet specifico del motore installato sulla macchina, rilevabile dalla targhetta o dall'Order Number stampato sulla targhetta dati.

---

## 3. Costruzione Meccanica Rilevante per l'Analisi Vibrazionale

### 3.1 Cuscinetti

I motori 1PH8 montano cuscinetti SKF o FAG (entrambi compatibili Siemens). La tipologia varia con la taglia:

| Taglia | Lato DE (accoppiamento) | Lato NDE | Note |
|--------|------------------------|----------|------|
| 1PH8101 | 6208 (radiale, sfere) | 6207 | Free bearing NDE |
| 1PH8131 | 6210 (radiale, sfere) | 6209 | |
| 1PH8161 | 6212 (radiale, sfere) | 6211 | |
| 1PH8183 | 6314 (radiale, sfere) | 6313 | Carico radiale elevato |

> **IMPORTANTE**: verificare i riferimenti cuscinetti sul datasheet del motore specifico prima di calcolare le frequenze di difetto (BPFI, BPFO, BSF, FTF). Le specifiche geometriche necessarie al calcolo sono:
> - $N_b$ = numero di sfere
> - $d$ = diametro sfere [mm]
> - $D_{pw}$ = diametro primitivo (pitch diameter) [mm]
> - $\alpha$ = angolo di contatto [°]

### 3.2 Numero di Cave

Il numero di cave statoriche e rotoriche varia per taglia e costruzione. Valori indicativi (verificare sul datasheet specifico):

| Taglia | Cave statoriche $Q_s$ | Cave rotoriche $Q_r$ | Coppie polari $p$ |
|--------|-----------------------|-----------------------|--------------------|
| 1PH8101 | 36 | 28 | 2 (4 poli) |
| 1PH8131 | 36 | 28 | 2 (4 poli) |
| 1PH8161 | 48 | 40 | 2 (4 poli) |
| 1PH8183 | 48 | 40 | 2 (4 poli) |

Questi valori sono fondamentali per calcolare le **Rotor Slot Harmonics (RSH)** — vedi documento 06.

### 3.3 Inerzia del Rotore

L'inerzia ridotta è una caratteristica chiave dei motori servo. Valori tipici:

| Taglia | $J_{rotore}$ [kg·m²] | Confronto con motore ind. std. |
|--------|----------------------|-------------------------------|
| 1PH8101 | 0.004–0.006 | ~50% dell'equivalente standard |
| 1PH8131 | 0.010–0.020 | |
| 1PH8161 | 0.030–0.060 | |
| 1PH8183 | 0.080–0.150 | |

L'inerzia ridotta influenza la **frequenza di risonanza torsionale** del sistema motore-trasmissione-carico.

---

## 4. Sistema di Encoder

### 4.1 Tipi di Encoder Installati su 1PH8

L'encoder è integrato nel motore lato NDE e fornisce feedback all'azionamento SINAMICS S120. I tipi disponibili:

| Tipo | Risoluzione | Protocollo | Utilizzo |
|------|-------------|------------|----------|
| **EnDat 2.2** (preferito) | 512–2048 righe/giro + valore assoluto | Seriale bidirezionale | Servo ad alta dinamica |
| **Sin/Cos 1Vpp** | 512–2048 righe/giro (analogico) | Analogico | Alta velocità |
| **HTL/TTL incrementale** | 1024–2048 ppr | Digitale | Applicazioni meno critiche |
| **Resolver** | ~14 bit equivalenti | Analogico AC | Alta robustezza ambientale |

### 4.2 Ruolo dell'Encoder nell'Analisi Vibrazionale

L'encoder non è direttamente coinvolto nella misura vibrazionale (che utilizza accelerometri separati), ma è **indirettamente fondamentale** per due motivi:

1. **Sincronizzazione delle misure**: nei sistemi di analisi avanzata, il segnale di trigger dell'encoder (una tacca per giro) viene usato per sincronizzare l'acquisizione vibrazionale con la posizione angolare del rotore. Questo consente tecniche come il **Time Synchronous Averaging (TSA)** per isolare le componenti legate alla rotazione.

2. **Monitoraggio via SINAMICS**: il drive S120 acquisisce continuamente velocità e posizione dall'encoder. Tramite la funzione **Trace** del SINAMICS, è possibile registrare oscillazioni di velocità che riflettono perturbazioni meccaniche — senza bisogno di accelerometri.

### 4.3 Anomalie Encoder Rilevabili Spectralmente

Un encoder deteriorato produce segnali imperfetti che si manifestano come:
- **Vibrazioni alla frequenza delle righe encoder** × velocità di rotazione (tipicamente nell'intervallo kHz)
- **Instabilità del regolatore di velocità** → oscillazioni alla frequenza naturale dell'anello (visibili come banda laterale attorno alla frequenza di rotazione)
- **Rumore di quantizzazione**: non visibile spectralmente ma influenza la qualità del controllo

---

## 5. Sistema di Raffreddamento

### 5.1 Tipologie disponibili

| Tipo | Codice | Caratteristiche | Impatto vibrazionale |
|------|--------|-----------------|----------------------|
| **IC416** — Ventola esterna forzata | Suffisso -Z | Ventola indipendente dalla velocità del motore | Aggiunge frequenze della ventola (numero pale × n_vent/60) |
| **IC71W** — Raffreddamento a liquido | Suffisso -Z | Massima coppia a bassa velocità | Nessuna aggiunta vibrazionale da ventola |
| **IC411** — Autoventilato | Solo alta velocità | Limitato uso servo | Frequenze ventola dipendono dalla velocità motore |

Nelle macchine rotocalco, dove i motori lavorano spesso a velocità variabile (compreso il funzionamento a bassa velocità durante il set-up), il raffreddamento a liquido (IC71W) è preferito. La ventola esterna (IC416) è alternativa valida ma introduce una sorgente vibrazionale aggiuntiva che deve essere identificata e separata durante l'analisi.

---

## 6. Parametri Elettrici Rilevanti per la Diagnostica

Dal nameplate e dal datasheet del motore si ricavano i parametri necessari per l'analisi MCSA (Motor Current Signature Analysis):

| Parametro | Simbolo | Unità | Utilizzo diagnostico |
|-----------|---------|-------|----------------------|
| Potenza nominale | $P_n$ | kW | Calcolo corrente nominale |
| Tensione nominale | $U_n$ | V | |
| Corrente nominale | $I_n$ | A | Soglia per analisi corrente |
| Velocità nominale | $n_n$ | RPM | Calcolo slip nominale |
| Fattore di potenza | $\cos\phi$ | — | |
| Numero di coppie polari | $p$ | — | Calcolo $f_s$, RSH |
| Frequenza nominale | $f_n$ | Hz | Base per calcolo slip |
| Scorrimento nominale | $s_n$ | % | Calcolo frequenze MCSA |
| Classe di isolamento | F/H | — | Temperatura max avvolgimenti |
| Classe di protezione | IP | — | Condizioni ambientali |

### Calcolo dello Slip Nominale

$$s_n = \frac{n_s - n_n}{n_s} = \frac{1500 - n_n}{1500} \quad \text{(per motori 4 poli a 50 Hz)}$$

Esempio: motore con $n_n = 1470$ RPM → $s_n = 2\%$

---

## 7. Interfaccia con SINAMICS S120

### 7.1 Parametri S120 utili per la diagnostica

Il SINAMICS S120 espone via SINAMICS Startdrive o STARTER i seguenti parametri utili per la diagnostica:

| Parametro | Descrizione | Utilizzo |
|-----------|-------------|----------|
| r0063 | Velocità attuale del motore [RPM] | Velocità istantanea per calcolo frequenze |
| r0027 | Corrente attuale (valore efficace) | MCSA |
| r0031 | Coppia attuale | Monitoraggio torque ripple |
| r0036 | Temperatura motore (da KTY/PTC) | Monitoraggio termico |
| r0068 | Corrente di fase U, V, W | Analisi armonica corrente |
| p1800 | Frequenza impulsi (PWM) | Identificazione frequenze di commutazione |
| r1801 | Frequenza impulsi corrente | PWM attuale |

### 7.2 Funzione Trace SINAMICS

Il SINAMICS S120 dispone di una funzione **Trace** interna che permette di registrare fino a 8 segnali interni con risoluzione temporale configurabile (tipicamente 1–10 ms). Questa funzione è utile per:

- Registrare l'oscillazione di velocità durante un difetto meccanico
- Analizzare il torque ripple in funzione della posizione angolare
- Identificare comportamenti anomali del regolatore

**Procedura di accesso alla Trace**:
1. Connettere PC con SINAMICS Startdrive (TIA Portal) o STARTER
2. Menu Drive → Diagnostics → Trace
3. Configurare i canali (tipicamente: r0063=velocità, r0031=coppia, r0027=corrente)
4. Impostare trigger (es. fronte di salita su r0063 > soglia)
5. Registrare e esportare in CSV per analisi FFT esterna
