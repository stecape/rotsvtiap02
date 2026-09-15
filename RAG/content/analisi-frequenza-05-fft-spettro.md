---
title: "FFT e Analisi Spettrale — Teoria e Pratica"
date: 2026-05-01
tags: [FFT, spettro, frequenza, finestre, risoluzione, waterfall, envelope]
---

# FFT e Analisi Spettrale — Teoria e Pratica

## 1. La Trasformata di Fourier

### 1.1 Principio

Jean-Baptiste Joseph Fourier dimostrò che **qualsiasi segnale periodico** può essere espresso come somma di sinusoidi a frequenze multiple intere della frequenza fondamentale (serie di Fourier). Estendendo il concetto a segnali non periodici, si ottiene la **Trasformata di Fourier**:

$$X(f) = \int_{-\infty}^{+\infty} x(t) \cdot e^{-j2\pi ft}\, dt$$

Il risultato $X(f)$ è una funzione complessa che descrive, per ogni frequenza $f$:
- **Modulo** $|X(f)|$: ampiezza della componente a quella frequenza
- **Fase** $\angle X(f)$: fase della componente

In pratica, per segnali acquisiti digitalmente, si usa la **DFT (Discrete Fourier Transform)** o, in forma ottimizzata algoritmicamente, la **FFT (Fast Fourier Transform)**.

### 1.2 FFT — Fast Fourier Transform

La FFT è un algoritmo che calcola la DFT in modo efficiente sfruttando la simmetria dei calcoli. La complessità scende da $O(N^2)$ a $O(N \log N)$.

**Requisiti**: l'algoritmo FFT standard (Cooley-Tukey) richiede che $N$ (numero di campioni) sia una **potenza di 2**: 512, 1024, 2048, 4096...

### 1.3 Relazioni Fondamentali

Dato un segnale acquisito con:
- $f_s$ = frequenza di campionamento [Hz]
- $N$ = numero di campioni

Si ottengono:

| Parametro | Formula | Significato |
|-----------|---------|-------------|
| **Risoluzione in frequenza** | $\Delta f = f_s / N$ | Minima separazione tra due picchi |
| **Frequenza massima (Nyquist)** | $f_{max} = f_s / 2$ | Limite superiore dello spettro |
| **Durata acquisizione** | $T = N / f_s$ | Finestra temporale totale |

**Esempio pratico**: voler analizzare fino a 2000 Hz con risoluzione 0.5 Hz
- $f_s$ minima = 4000 Hz (2× Nyquist)
- $\Delta f$ = 0.5 Hz → $N = f_s / \Delta f = 4000 / 0.5 = 8192$ campioni
- Durata acquisizione $T = 8192/4000 = 2.05$ secondi

---

## 2. Fenomeni da Gestire in Pratica

### 2.1 Aliasing

Se il segnale contiene componenti a frequenza superiore a $f_s/2$ (frequenza di Nyquist), queste vengono **rispecchiate (aliased)** nel range visibile, producendo picchi spuri.

**Soluzione**: applicare un **filtro anti-aliasing** passa-basso prima dell'ADC, con frequenza di taglio ≤ $f_s/2$. Negli analizzatori moderni questo filtro è integrato.

### 2.2 Leakage (Dispersione Spettrale)

Il leakage si verifica quando la frequenza del segnale non è un multiplo intero della risoluzione $\Delta f$, cioè quando il segnale non è **periodico** nella finestra di acquisizione. Il risultato è che l'energia di un picco si "spalma" sulle frequenze adiacenti, riducendo la risoluzione e mascherando picchi deboli vicini.

**Sintomi**: picchi allargati, "skirt" ai lati dei picchi principali.

**Soluzione**: applicare una **funzione finestra (windowing)**.

### 2.3 Picket Fence Effect

Anche con windowing corretto, se un picco cade esattamente tra due bin FFT, la sua ampiezza viene sottostimata. Questo è il "picket fence effect". Negli analizzatori moderni viene compensato con interpolazione parabolica o zoom FFT.

---

## 3. Funzioni Finestra (Windowing)

Le funzioni finestra moltiplicano il segnale nel dominio del tempo prima della FFT per ridurre il leakage, smussando i bordi della finestra di acquisizione.

| Finestra | Leakage | Risoluzione in frequenza | Uso consigliato |
|----------|---------|--------------------------|-----------------|
| **Rettangolare** (no window) | Alto | Massima | Solo segnali strettamente periodici nella finestra |
| **Hann** | Basso | Buona | Uso generale — macchine rotanti |
| **Hamming** | Medio-basso | Buona | Simile a Hann, leggermente diversa |
| **Flat Top** | Molto basso | Bassa | Misure di ampiezza accurate (calibrazione) |
| **Blackman-Harris** | Minimo | Scarsa | Quando si cercano picchi deboli vicino a picchi forti |
| **Kaiser-Bessel** | Basso | Media | Buon compromesso generale |
| **Forza esponenziale** | — | — | Solo per impact testing (bump test) |

**Raccomandazione per analisi motori 1PH8 su rotocalco**: usare **finestra Hann** come standard. Passare a **Flat Top** solo per misure quantitative di ampiezza (calibrazione sensori, trending).

---

## 4. Spettro in Ampiezza: Rappresentazione

### 4.1 Scala Lineare vs. Logaritmica

- **Scala lineare**: adeguata quando le componenti sono di ordine di grandezza simile
- **Scala logaritmica (dB)**: permette di visualizzare simultaneamente componenti con rapporto di ampiezza di 1:1000 o più

Conversione in dB (riferimento: $a_{ref} = 10^{-6}$ m/s² per l'accelerazione, $v_{ref} = 10^{-9}$ m/s per la velocità):

$$L_a = 20 \cdot \log_{10}\left(\frac{a_{RMS}}{a_{ref}}\right) \quad [\text{dB re 1 µg}]$$

Per la diagnostica delle macchine è comune usare la **scala lineare** per gli spettri di velocità (mm/s) e la **scala logaritmica** per gli spettri di accelerazione (g o dB).

### 4.2 Spettro di Potenza (PSD)

La **PSD (Power Spectral Density)** normalizza lo spettro per la risoluzione in frequenza:

$$PSD(f) = \frac{|X(f)|^2}{\Delta f}$$

Utile quando si confrontano misure con diverse risoluzioni. L'analisi statistica in banda larga richiede la PSD.

---

## 5. Tecniche Avanzate

### 5.1 Zoom FFT (Banda Passante Selettiva)

Quando si vuole alta risoluzione su un range limitato di frequenze senza aumentare enormemente il numero di campioni, si usa lo **Zoom FFT** o **Band-selectable analysis**:
- Demodulazione in banda base del range di interesse
- Decimazione del segnale
- FFT sul segnale decimato

**Esempio**: analizzare con risoluzione 0.01 Hz il range 24–26 Hz (attorno alla rotazione di un cilindro a 1500 RPM = 25 Hz), senza dover acquisire un segnale di 100 secondi a 50 kHz.

### 5.2 Analisi dell'Inviluppo (Envelope Analysis / Demodulazione AM)

Tecnica fondamentale per il rilevamento precoce di difetti di cuscinetto.

**Principio**: un difetto di cuscinetto genera impulsi ad alta frequenza (spesso nella banda 1–20 kHz) la cui cadenza è la frequenza di difetto del cuscinetto (BPFO, BPFI…). Questi impulsi modulano in ampiezza (AM) la banda portante ad alta frequenza.

**Procedura**:
1. Filtrare il segnale di accelerazione in una banda ad alta frequenza dove il rapporto S/N è favorevole (es. 2–10 kHz, o una banda di risonanza strutturale)
2. Calcolare l'inviluppo del segnale filtrato (demodulazione AM: rettificazione + low-pass)
3. Calcolare la FFT dell'inviluppo
4. Cercare picchi alle frequenze di difetto BPFI, BPFO, BSF, FTF e relative armoniche

**Vantaggio**: rileva difetti **mesi prima** che diventino visibili nello spettro di velocità normale.

### 5.3 Time Synchronous Averaging (TSA)

La TSA media il segnale nel dominio del tempo su molte rivoluzioni, sincronizzata con la posizione angolare dell'albero (tramite trigger dall'encoder).

**Effetto**: le componenti periodiche legate alla rotazione si sommano coerentemente e crescono, mentre il rumore random (e le componenti non sincronizzate) si cancella con la radice del numero di medie N:

$$SNR_{miglioramento} = \sqrt{N_{medie}}$$

**Uso**: isolare difetti di ingranaggi o squilibri dal rumore di fondo e da componenti di altri assi.

### 5.4 Waterfall Plot (Diagramma a Cascata)

Un waterfall plot è un grafico tridimensionale che mostra lo spettro al variare di un parametro (tipicamente la velocità di rotazione o il tempo):

- **Asse X**: frequenza [Hz]
- **Asse Y**: velocità [RPM] o tempo
- **Asse Z (colore/altezza)**: ampiezza

**Utilità per rotocalco**: eseguendo un waterfall durante l'accelerazione della macchina (speed sweep), si identificano:
- Componenti sincronizzate con la velocità (difetti meccanici rotanti: si muovono diagonalmente)
- Componenti a frequenza fissa (forze elettriche: linee verticali)
- Punti di risonanza (amplificazioni improvvise)

---

## 6. Parametri di Acquisizione Consigliati

### 6.1 Per Analisi Standard Motori 1PH8 — Rotocalco

| Parametro | Valore consigliato | Motivazione |
|-----------|-------------------|-------------|
| Frequenza campionamento | 25.6 kHz | Copre fino a ~10 kHz (Nyquist) |
| Numero campioni (blocco FFT) | 16384 (2^14) | Risoluzione ~1.5 Hz a 25.6 kHz |
| Finestra | Hann | Standard per macchine rotanti |
| Medie | 4–8 medie lineari | Stabilità del risultato |
| Overlap | 50–75% | Riduce il tempo di acquisizione effettivo |
| Range frequenza display | 0–1000 Hz (standard), 0–10 kHz (envelope) | |

### 6.2 Per Analisi Envelope (Cuscinetti)

| Parametro | Valore |
|-----------|--------|
| Freq. campionamento | 25.6–51.2 kHz |
| Banda filtro passa-banda | 2–10 kHz (o banda di risonanza identificata) |
| Demodulatore | Rettificatore + LPF a 1 kHz |
| FFT dell'inviluppo | 0–500 Hz, risoluzione 0.2 Hz |

### 6.3 Calcolo della Risoluzione Necessaria

Per risolvere le bande laterali di slip attorno alla frequenza di rotazione (distanza tipica 0.5–2 Hz a velocità nominale), è necessaria una risoluzione di almeno **0.1–0.2 Hz**, corrispondente a un'acquisizione di almeno **5–10 secondi**.

Tempo minimo di acquisizione per frequenza minima risolvibile:
$$T_{min} = \frac{1}{\Delta f_{desiderato}}$$

Esempio: risolvere bande a 0.2 Hz → $T_{min} = 5$ secondi
