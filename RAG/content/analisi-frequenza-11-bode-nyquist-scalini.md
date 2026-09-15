---
title: "Identificazione del Sistema tramite Scalini di Velocità — Bode e Nyquist"
date: 2026-05-01
tags: [bode, nyquist, scalini-velocità, identificazione-sistema, SINAMICS, risonanze, servo, ottimizzazione]
---

# Identificazione del Sistema tramite Scalini di Velocità — Bode e Nyquist

## 1. Principio: dall'Analisi Vibrazionale all'Identificazione del Sistema

### 1.1 Il Limite dell'Analisi Vibrazionale Classica

L'analisi con accelerometro (documenti 04–09) misura le **vibrazioni generate da difetti esistenti**. Ma per comprendere il comportamento dinamico del sistema servo (motore + trasmissione + carico) e identificare le **risonanze meccaniche** prima che diventino problematiche, serve un approccio diverso: la **System Identification**.

L'idea è semplice:
- Si **eccita** il sistema con un segnale noto (scalino di velocità, rampa, segnale PRBS, sweep sinusoidale)
- Si **misura** la risposta (velocità, coppia, corrente)
- Si ricava la **funzione di trasferimento** che descrive il comportamento dinamico del sistema
- Si rappresenta questa funzione come **diagramma di Bode** (modulo e fase vs. frequenza) o **diagramma di Nyquist** (piano complesso)

### 1.2 Perché è Particolarmente Rilevante sulle Macchine Rotocalco

Le macchine rotocalco hanno una trasmissione meccanica complessa: motore → riduttore → cilindro stampa → nastro. Ogni elemento introduce inerzie, rigidezze e smorzamenti che creano **modi di risonanza meccanica**.

Se una di queste risonanze ricade nella banda passante del regolatore di velocità del SINAMICS S120:
- Il sistema può diventare **instabile** (oscillazioni autosustenute)
- Il **registro** tra gruppi si deteriora
- Si generano **bande sul prodotto stampato** (banding) a frequenza fissa, indipendente dalla velocità

La misura Bode/Nyquist permette di:
1. Identificare la frequenza e il fattore Q di ogni risonanza meccanica
2. Verificare i margini di stabilità del regolatore
3. Progettare **filtri notch** nel SINAMICS S120 per sopprimere le risonanze
4. Ottimizzare i guadagni P/I del regolatore di velocità

---

## 2. Teoria: Risposta in Frequenza da Dati nel Tempo

### 2.1 Funzione di Trasferimento

Per un sistema lineare e tempo-invariante (LTI), la **funzione di trasferimento** $G(j\omega)$ è il rapporto tra l'uscita e l'ingresso nel dominio della frequenza:

$$G(j\omega) = \frac{Y(j\omega)}{U(j\omega)}$$

dove $U(j\omega)$ è la trasformata di Fourier dell'ingresso e $Y(j\omega)$ quella dell'uscita.

### 2.2 Risposta allo Scalino e Risposta in Frequenza

Dalla risposta allo scalino $y(t)$ si può ricavare la risposta in frequenza con il seguente procedimento:

1. Derivare la risposta allo scalino per ottenere la risposta impulsiva: $h(t) = \frac{d}{dt} y(t)$
2. Calcolare la FFT della risposta impulsiva: $H(j\omega) = \mathcal{F}\{h(t)\}$
3. $H(j\omega)$ è la funzione di trasferimento del sistema: $H(j\omega) = G(j\omega)$

**Condizioni di validità**:
- Il sistema deve essere approssimativamente **lineare** nel punto di lavoro
- L'ampiezza dello scalino deve essere **piccola** rispetto al setpoint (per restare nel regime lineare), tipicamente 5–15% del valore nominale
- Il sistema deve essere a **riposo** prima dello scalino (condizioni iniziali note)

### 2.3 Limiti del Singolo Scalino

Un singolo scalino eccita tutte le frequenze contemporaneamente, ma in modo non uniforme (lo spettro di uno scalino decresce con la frequenza come $1/f$). Questo significa che:
- **Bassa frequenza**: buona eccitazione, buona stima
- **Alta frequenza**: eccitazione debole, stima rumorosa

Per superare questo limite si usano segnali di eccitazione più ricchi:
- **PRBS (Pseudo-Random Binary Sequence)**: sequenza binaria pseudo-casuale con spettro piatto fino a una frequenza di taglio definita
- **Sweep sinusoidale (chirp)**: sinusoide con frequenza crescente nel tempo — eccitazione uniforme su tutto il range

### 2.4 Diagramma di Bode

Il diagramma di Bode rappresenta $G(j\omega)$ in due grafici:

**Modulo** (guadagno):
$$|G(j\omega)|_{dB} = 20 \log_{10} |G(j\omega)|$$

**Fase**:
$$\angle G(j\omega) \quad [\text{gradi o radianti}]$$

Entrambi in funzione di $\omega$ (o $f$) in **scala logaritmica** sull'asse delle ascisse.

**Lettura del Bode per la stabilità**:
- **Frequenza di taglio** ($f_c$ o crossover): frequenza a cui il modulo dell'anello aperto è 0 dB
- **Margine di fase** (PM): angolo tra la fase e -180° alla frequenza di taglio. PM > 45° è tipicamente richiesto per una buona stabilità; nei servo drive Siemens per macchine di qualità si punta a PM > 60°
- **Margine di guadagno** (GM): di quanto si può aumentare il guadagno prima che il sistema oscilli, misurato alla frequenza in cui la fase è -180°. GM > 6 dB è tipicamente richiesto.

### 2.5 Diagramma di Nyquist

Il diagramma di Nyquist rappresenta $G(j\omega)$ nel **piano complesso** (parte reale vs. parte immaginaria) al variare di $\omega$:

$$G(j\omega) = \text{Re}[G(j\omega)] + j \cdot \text{Im}[G(j\omega)]$$

**Criterio di Nyquist**: il sistema ad anello chiuso è stabile se la curva di Nyquist dell'anello aperto non gira attorno al punto critico $(-1, 0j)$.

La **distanza dal punto critico** è una misura della robustezza: più è grande, più il sistema è robusto alle variazioni dei parametri meccanici (cambio di cilindro, cambio di bobina, variazione tensione nastro).

---

## 3. Procedura con Scalini di Velocità — Manuale

### 3.1 Setup

**Attrezzatura necessaria**:
- PC con SINAMICS Startdrive (TIA Portal) o STARTER
- Connessione al SINAMICS S120 (Ethernet, PROFIBUS o USB)
- Foglio di calcolo o software di analisi (Python, MATLAB, Excel)

**Condizioni operative**:
- Macchina in modalità **automatica**, servo attivo
- Velocità di esercizio a **regime stabile** (es. velocità di produzione tipica)
- Carico normale (nastro caricato, tensione regolare)
- Temperatura motore a regime

### 3.2 Dimensionamento dello Scalino

L'ampiezza dello scalino deve essere:
- **Abbastanza grande** da essere misurabile (> rumore di fondo)
- **Abbastanza piccola** da restare nel regime lineare e non disturbare il processo

Regola pratica per macchine rotocalco in produzione:
$$\Delta n = 5 \div 10\% \text{ della velocità nominale del gruppo}$$

Esempio: macchina a 1470 RPM → scalino di 75–150 RPM.

> **Attenzione**: su macchine a piena produzione, anche un piccolo scalino di velocità può causare variazioni di tensione nastro e difetti di registro. Eseguire questi test durante **prove di macchina** o con nastro di scarto.

### 3.3 Sequenza di Scalini a Velocità Diverse

Per caratterizzare il sistema a diversi punti di lavoro (il comportamento meccanico può variare con la velocità, specialmente per effetti di lubrificazione e giochi):

| Step | Velocità base [RPM] | Ampiezza scalino [RPM] | Note |
|------|--------------------|-----------------------|------|
| 1 | 300 (20%) | 30 | Bassa velocità / set-up |
| 2 | 750 (50%) | 75 | Velocità media |
| 3 | 1050 (70%) | 100 | Velocità tipica stampa |
| 4 | 1350 (90%) | 135 | Velocità alta |
| 5 | 1470 (100%) | 150 | Velocità nominale |

Per ogni step, eseguire **scalino positivo** (+Δn) e **scalino negativo** (-Δn) e mediare — per cancellare asimmetrie e non linearità.

### 3.4 Acquisizione con Trace SINAMICS

1. In SINAMICS Startdrive → Diagnostics → **Trace**
2. Configurare i canali:
   - CH1: **r0063** — Velocità attuale [RPM]
   - CH2: **r0031** — Coppia attuale [Nm]
   - CH3: **r1538** — Setpoint velocità [RPM] (per avere l'ingresso del sistema)
3. **Frequenza di campionamento**: 500 µs (2000 Hz) — necessaria per identificare risonanze fino a ~500 Hz
4. **Lunghezza**: 2000 campioni = 1 secondo (sufficiente per la risposta transitoria)
5. **Trigger**: fronte di salita su r1538 (setpoint velocità che cambia)
6. Applicare lo scalino tramite HMI o da Startdrive
7. Verificare la cattura, salvare e **esportare CSV**

### 3.5 Elaborazione Offline

Con i dati CSV (tempo, setpoint, velocità_attuale):

**In Python (esempio)**:
```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.fft import fft, fftfreq
from scipy.signal import savgol_filter

# Carica dati
data = np.loadtxt('trace_scalino.csv', delimiter=';', skiprows=1)
t = data[:, 0]          # tempo [s]
u = data[:, 2]          # setpoint velocità [RPM] — ingresso
y = data[:, 1]          # velocità attuale [RPM] — uscita

dt = t[1] - t[0]        # passo di campionamento
fs = 1 / dt             # frequenza di campionamento

# Calcola la risposta impulsiva (derivata della risposta allo scalino)
e = y - u               # errore (o usare y direttamente)
dy = np.gradient(y, dt)  # derivata = risposta impulsiva
du = np.gradient(u, dt)  # derivata dell'ingresso scalino

# FFT di entrambi
N = len(dy)
Y = fft(dy)
U = fft(du)
freqs = fftfreq(N, dt)

# Funzione di trasferimento stimata
H = Y / (U + 1e-10)     # evita divisione per zero

# Bode plot
mask = freqs > 0
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

ax1.semilogx(freqs[mask], 20*np.log10(np.abs(H[mask])))
ax1.set_ylabel('Modulo [dB]')
ax1.set_title('Diagramma di Bode — Anello Chiuso Velocità')
ax1.grid(True, which='both')
ax1.axhline(-3, color='r', linestyle='--', label='-3 dB')

ax2.semilogx(freqs[mask], np.degrees(np.angle(H[mask])))
ax2.set_ylabel('Fase [°]')
ax2.set_xlabel('Frequenza [Hz]')
ax2.grid(True, which='both')
ax2.axhline(-180, color='r', linestyle='--', label='-180°')

plt.tight_layout()
plt.savefig('bode_anello_chiuso.png', dpi=150)
plt.show()
```

**In Excel** (alternativa senza programmazione):
1. Inserire i dati in due colonne (tempo, velocità)
2. Calcolare la derivata con differenze finite: `=(B3-B2)/(A3-A2)`
3. Usare la funzione Analysis ToolPak → Fourier Analysis
4. Calcolare modulo e fase con `=IMABS()` e `=IMARGUMENT()`
5. Graficare su asse X logaritmico

---

## 4. Funzione Bode Integrata in SINAMICS Startdrive

### 4.1 Descrizione della Funzione

SINAMICS Startdrive (TIA Portal) include uno strumento integrato per la misura della risposta in frequenza, accessibile da:

**TIA Portal → Drive → Commissioning → Speed controller optimization → Frequency response measurement**

Questa funzione inietta automaticamente un segnale di eccitazione (PRBS o rampa di frequenza) nel setpoint di velocità e misura la risposta per calcolare il Bode diagram dell'anello aperto di velocità. Non richiede elaborazione manuale.

### 4.2 Parametri da Configurare

| Parametro | Valore tipico | Significato |
|-----------|--------------|-------------|
| **Excitation amplitude** | 20–100 RPM (5–10% n_nom) | Ampiezza del segnale di eccitazione |
| **Frequency range** | 1–500 Hz | Range di frequenza da analizzare |
| **Excitation type** | PRBS | Segnale pseudo-random (spettro piatto) |
| **Measurement time** | 10–30 s | Durata della misura (più lungo = più accurato) |
| **Setpoint filter** | Secondo le impostazioni correnti | Tenere invariato durante la misura |

### 4.3 Procedura Step-by-Step con Startdrive

1. **Connettere** il PC al SINAMICS S120 via Ethernet (PROFINET o diretta)
2. **Aprire** il progetto TIA Portal della macchina
3. **Online**: andare in modalità online con il drive
4. **Navigare** a: `[Drive] → Commissioning → Speed controller optimization`
5. **Selezionare** "Frequency response measurement" o "Bode diagram"
6. **Impostare** i parametri di eccitazione (vedere tabella sopra)
7. Verificare che la macchina sia a **velocità nominale stabile** con carico normale
8. **Avviare la misura** — il drive inizia ad iniettare il segnale PRBS
9. **Attendere** il completamento (10–30 secondi)
10. Il **Bode diagram** apparirà automaticamente in Startdrive

> **Sicurezza**: durante la misura la macchina si comporterà come se ricevesse piccole variazioni di setpoint. Avvertire l'operatore. Non eseguire con bobina di carta pregiata o in fase di cambio colore.

### 4.4 Interpretazione del Bode Risultante

Il diagramma ottenuto mostra la risposta dell'**anello aperto di velocità**. Elementi da identificare:

**Picchi di risonanza meccanica**:
```
Modulo [dB]
  |                     ↑ Risonanza meccanica (picco)
  |                    /|\
  |                   / | \
  |------------------/--|--\----------------  0 dB
  |                 /   |   \___
  |                /    |       ↓ Anti-risonanza (valle)
  |_______________/_____|_____________________→ freq [Hz] (log)
```

I picchi indicano **modi di risonanza** del sistema meccanico (cilindro, riduttore, albero, nastro). La frequenza del picco è la frequenza naturale del modo, l'altezza è inversamente proporzionale allo smorzamento.

**Lettura dei margini**:
- Identificare la **frequenza di crossover** (0 dB nel modulo)
- Leggere la **fase a quella frequenza** → margine di fase PM = fase − (−180°)
- Identificare la frequenza in cui la fase è −180° → leggere il modulo → margine di guadagno GM = −modulo in dB

**Esempio di Bode ben ottimizzato** per macchina rotocalco:
```
Modulo: crossover a 80–120 Hz (banda del regolatore)
Fase al crossover: −120° → PM = 60° ✓
Modulo a f(fase=−180°): −8 dB → GM = 8 dB ✓
```

### 4.5 Risonanze Meccaniche — Cosa Fare

| Situazione | Azione |
|-----------|--------|
| Risonanza a frequenza > 2× crossover | Tipicamente non pericolosa — monitorare |
| Risonanza a frequenza 1–2× crossover | Ridurre il guadagno oppure inserire filtro notch |
| Risonanza a frequenza < crossover | **Critica** — ridurre guadagno o il sistema oscilla |
| PM < 30° | **Instabile in pratica** — ridurre guadagno P immediatamente |
| GM < 3 dB | **Instabile in pratica** — ridurre guadagno immediatamente |

---

## 5. Filtri Notch nel SINAMICS S120

### 5.1 Cos'è un Filtro Notch

Un filtro notch (o filtro a intaglio) è un filtro che **atttenua fortemente** le frequenze in un range stretto attorno alla frequenza centrale $f_0$, lasciando praticamente invariate le altre frequenze.

$$H_{notch}(s) = \frac{s^2 + 2\zeta_z \omega_0 s + \omega_0^2}{s^2 + 2\zeta_p \omega_0 s + \omega_0^2}$$

Con $\zeta_z < \zeta_p$: l'attenuazione alla frequenza $\omega_0 = 2\pi f_0$ è:

$$A_{notch} = 20 \log_{10}\frac{\zeta_z}{\zeta_p} \quad [\text{dB}]$$

### 5.2 Configurazione Notch in SINAMICS S120

Il SINAMICS S120 supporta fino a **4 filtri notch** configurabili sul setpoint di coppia (dopo il regolatore di velocità):

| Parametro SINAMICS | Descrizione | Valore esempio |
|-------------------|-------------|---------------|
| p1656[0] | Frequenza notch 1 [Hz] | 85.0 (risonanza cilindro) |
| p1657[0] | Smorzamento numeratore $\zeta_z$ | 0.01 (attenuazione profonda) |
| p1658[0] | Smorzamento denominatore $\zeta_p$ | 0.3 (larghezza di banda) |
| p1656[1] | Frequenza notch 2 [Hz] | 220.0 (risonanza riduttore) |
| ... | ... | ... |

**Procedura per impostare i notch dopo la misura Bode**:
1. Identificare dal Bode le frequenze delle risonanze meccaniche problematiche
2. Impostare p1656[k] = frequenza della risonanza identificata
3. Impostare p1657[k] = 0.01–0.05 (più piccolo = attenuazione più profonda, ma banda più stretta)
4. Impostare p1658[k] = 0.2–0.5 (più grande = filtro più largo, copre variazioni della risonanza)
5. **Ripetere la misura Bode** per verificare che il notch abbia corretto il margine di fase

> **Avvertenza**: i filtri notch introducono **ritardo di fase** a frequenze vicine alla frequenza di taglio. Impostare notch errati (frequenza sbagliata o banda troppo larga) può **ridurre** il margine di fase e destabilizzare il sistema. Sempre ripetere la misura Bode dopo ogni modifica.

---

## 6. Diagramma di Nyquist — Lettura Pratica

### 6.1 Costruzione del Diagramma di Nyquist dai Dati

Dai dati Bode (modulo e fase in funzione della frequenza):

$$\text{Re}[G(j\omega)] = |G| \cos(\angle G)$$
$$\text{Im}[G(j\omega)] = |G| \sin(\angle G)$$

Tracciando Re vs. Im al variare di $\omega$, si ottiene il diagramma di Nyquist.

### 6.2 Interpretazione Pratica

| Caratteristica nel piano Nyquist | Significato |
|---------------------------------|-------------|
| La curva **non gira** attorno a (−1, 0) | Sistema stabile |
| La curva **passa vicino** a (−1, 0) | Scarso margine di stabilità — rischio oscillazioni |
| La curva **gira attorno** a (−1, 0) | Sistema instabile — oscillazioni autosustenute |
| **Cerchio** di raggio r attorno a (−1, 0) non intersecato dalla curva | Margine di robustezza $M_s = 1/r$ |

**Margine di robustezza consigliato** per macchine rotocalco (sistemi con variabilità del carico): $M_s > 2$ (cioè la curva di Nyquist deve stare fuori da un cerchio di raggio 0.5 centrato in −1).

---

## 7. Correlazione con i Difetti Meccanici nel Tempo

### 7.1 Come Cambia il Bode con il Degrado Meccanico

Con il degrado nel tempo (usura cuscinetti, aumento giochi riduttore, variazione tensione nastro):

| Condizione | Effetto sul Bode |
|-----------|-----------------|
| Cuscinetto usurato (aumento attrito) | Riduzione del guadagno a bassa frequenza, possibile allargamento risonanza |
| Gioco aumentato nel riduttore | Risonanza meccanica che si sposta a frequenza più bassa |
| Variazione inerzia (cambio cilindro) | Spostamento di tutte le frequenze di risonanza ($f_n \propto 1/\sqrt{J}$) |
| Allentamento meccanico | Comparsa di non linearità — il Bode appare diverso per scalini di ampiezza diversa |

### 7.2 Monitoraggio nel Tempo dei Parametri Bode

Come per il monitoraggio vibrazionale (documento 10), è utile eseguire la misura Bode periodicamente e tracciare il trend:

| KPI Bode | Periodicità | Soglia attenzione |
|----------|------------|------------------|
| Margine di fase PM | Semestrale o dopo revisioni | < 45° |
| Margine di guadagno GM | Semestrale | < 6 dB |
| Frequenza crossover | Semestrale | Variazione > 20% dalla baseline |
| Frequenza risonanza meccanica | Annuale o dopo cambio cilindro | Variazione > 10% |
| Picco risonanza [dB] | Semestrale | Aumento > 3 dB |

Un abbassamento progressivo della frequenza di risonanza meccanica è un **indicatore di degrado** della trasmissione (aumento giochi, riduzione rigidezza) complementare all'analisi vibrazionale.

---

## 8. Riepilogo del Workflow Completo

```
1. MACCHINA A REGIME (velocità nominale, carico normale)
          ↓
2. MISURA BODE CON STARTDRIVE (o scalini manuali + Trace)
          ↓
3. IDENTIFICAZIONE RISONANZE MECCANICHE
   (frequenza, ampiezza, smorzamento di ciascuna)
          ↓
4. VERIFICA MARGINI DI STABILITÀ
   PM > 60°? GM > 6 dB?
          ↓
   NO → Impostare filtri notch sulle risonanze problematiche
        Ridurre guadagno P del regolatore di velocità
        Ripetere misura Bode
          ↓
   SÌ → Sistema ottimizzato
          ↓
5. ARCHIVIO BASELINE BODE
   (data, velocità, cilindro installato, valori PM/GM)
          ↓
6. MISURE PERIODICHE (semestrale / dopo ogni revisione)
   Confronto con baseline → rilevamento degrado meccanico
```
