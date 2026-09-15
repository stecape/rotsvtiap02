---
title: "Frequenze Caratteristiche del Motore 1PH8 — Calcolo e Identificazione"
date: 2026-05-01
tags: [frequenze-caratteristiche, cuscinetti, BPFI, BPFO, BSF, FTF, RSH, slip]
---

# Frequenze Caratteristiche del Motore 1PH8

## 1. Frequenza di Rotazione Fondamentale

### 1.1 Calcolo della Frequenza di Rotazione

La frequenza fondamentale di rotazione (chiamata **1X** nella terminologia vibrazionale) è:

$$f_{rot} = \frac{n}{60} \quad [\text{Hz}]$$

dove $n$ è la velocità in RPM.

Per un motore 1PH8 a 4 poli controllato in servo, la velocità è **variabile** — impostata dall'azionamento SINAMICS S120. Non esiste quindi una $f_{rot}$ fissa: tutte le frequenze caratteristiche devono essere **calcolate in funzione della velocità di esercizio**.

**Velocità tipiche sulle macchine rotocalco** (da verificare per la macchina specifica):

| Condizione operativa | Velocità tipica | $f_{rot}$ |
|---------------------|----------------|----------|
| Set-up / caricolamento | 10–50 RPM | 0.17–0.83 Hz |
| Stampa lenta (prova) | 100–300 RPM | 1.7–5 Hz |
| Stampa normale | 300–1500 RPM | 5–25 Hz |
| Stampa veloce | 1500–3000 RPM | 25–50 Hz |

### 1.2 Armoniche della Rotazione

Le armoniche ($kX$) della frequenza di rotazione sono indicatori di specifiche condizioni:

| Armonica | Condizione tipicamente associata |
|----------|----------------------------------|
| **1X** | Squilibrio di massa, disallineamento semplice, piegatura albero |
| **2X** | Disallineamento angolare, allentamento, ovalizzazione |
| **3X** | Disallineamento angolare grave, cedimento strutturale |
| **kX** (k = 3,4,5…) | Allentamento meccanico, rub |
| **0.5X, 1.5X, 2.5X** | Instabilità di olio (fluid whirl), cricche albero |

---

## 2. Frequenze di Difetto dei Cuscinetti

### 2.1 Geometria del Cuscinetto

Per calcolare le frequenze di difetto è necessario conoscere la geometria del cuscinetto:

- $N_b$ = numero di sfere (o rulli)
- $d$ = diametro della sfera [mm]
- $D_{pw}$ = diametro del cerchio primitivo (pitch diameter) [mm]
- $\alpha$ = angolo di contatto [°] (tipicamente 0° per cuscinetti radiali a sfere, 15° per cuscinetti angolari)

### 2.2 Le Quattro Frequenze Caratteristiche

**BPFO — Ball Pass Frequency Outer race** (frequenza di passaggio sfere sulla pista esterna)

$$BPFO = \frac{N_b}{2} \cdot f_{rot} \cdot \left(1 - \frac{d}{D_{pw}} \cos\alpha\right)$$

**BPFI — Ball Pass Frequency Inner race** (frequenza di passaggio sfere sulla pista interna)

$$BPFI = \frac{N_b}{2} \cdot f_{rot} \cdot \left(1 + \frac{d}{D_{pw}} \cos\alpha\right)$$

**BSF — Ball Spin Frequency** (frequenza di rotazione della sfera)

$$BSF = \frac{D_{pw}}{2d} \cdot f_{rot} \cdot \left[1 - \left(\frac{d}{D_{pw}} \cos\alpha\right)^2\right]$$

**FTF — Fundamental Train Frequency** (frequenza del cage/gabbia)

$$FTF = \frac{f_{rot}}{2} \cdot \left(1 - \frac{d}{D_{pw}} \cos\alpha\right)$$

### 2.3 Esempio di Calcolo — Cuscinetto 6210 (1PH8131, lato DE)

Parametri cuscinetto SKF 6210:
- $N_b = 10$ sfere
- $d = 12.7$ mm
- $D_{pw} = 63.5$ mm
- $\alpha = 0°$ (radiale a sfere → $\cos 0° = 1$)

Per un motore in esercizio a **1470 RPM** ($f_{rot} = 24.5$ Hz):

$$BPFO = \frac{10}{2} \cdot 24.5 \cdot \left(1 - \frac{12.7}{63.5}\right) = 5 \cdot 24.5 \cdot 0.8 = 98.0 \text{ Hz}$$

$$BPFI = \frac{10}{2} \cdot 24.5 \cdot \left(1 + \frac{12.7}{63.5}\right) = 5 \cdot 24.5 \cdot 1.2 = 147.0 \text{ Hz}$$

$$BSF = \frac{63.5}{2 \cdot 12.7} \cdot 24.5 \cdot \left[1 - 0.04\right] = 2.5 \cdot 24.5 \cdot 0.96 = 58.8 \text{ Hz}$$

$$FTF = \frac{24.5}{2} \cdot 0.8 = 9.8 \text{ Hz}$$

> **IMPORTANTE**: questi valori cambiano proporzionalmente con la velocità. A 735 RPM (metà velocità) tutte le frequenze si dimezzano.

### 2.4 Bande Laterali Attorno alle Frequenze di Difetto

Un difetto di cuscinetto non produce un picco isolato alla frequenza di difetto, ma genera **bande laterali** a distanza $f_{rot}$ dai picchi principali:

$$f_{difetto} \pm k \cdot f_{rot} \quad (k = 1, 2, 3, ...)$$

- **BPFI** con bande a $\pm 1X$, $\pm 2X$: difetto sulla pista interna in rotazione
- **BPFO** solitario, senza bande (pista fissa): difetto sulla pista esterna

La presenza e l'ampiezza delle bande laterali fornisce informazioni sul tipo e sulla gravità del difetto.

---

## 3. Frequenze Elettromagnetiche e Rotor Slot Harmonics

### 3.1 Frequenza di Alimentazione dal Drive

In un motore controllato da SINAMICS S120, la **frequenza di alimentazione** dello statore $f_{el}$ non è 50 Hz fissi ma dipende dalla velocità impostata:

$$f_{el} = p \cdot f_{rot} = p \cdot \frac{n}{60}$$

Per un motore a 4 poli ($p = 2$) a 1470 RPM: $f_{el} = 2 \times 24.5 = 49$ Hz

(Leggermente inferiore a 50 Hz a causa dello slip)

Dallo spettro vibrazionale, le forze elettromagnetiche si presentano a:
- $2f_{el}$ (doppia frequenza di alimentazione): forze radiali sull'air gap
- $6f_{el}$, $12f_{el}$, ... (armoniche sesta): torque ripple

### 3.2 Rotor Slot Harmonics (RSH)

Le RSH sono componenti spettrali generate dall'interazione tra le cave rotoriche e il campo dello statore. Sono **fingerprint** del motore e permettono di:
1. Verificare che il motore giri a un regime specifico
2. Diagnosticare difetti di rotore (barre rotte, anelli spezzati)

La frequenza RSH principale è:

$$f_{RSH} = Q_r \cdot f_{rot} \pm f_{el} = Q_r \cdot \frac{n}{60} \pm p \cdot \frac{n}{60} = (Q_r \pm p) \cdot \frac{n}{60}$$

Per il motore 1PH8131 ($Q_r = 28$, $p = 2$) a 1470 RPM:

$$f_{RSH,+} = (28 + 2) \cdot 24.5 = 30 \cdot 24.5 = 735 \text{ Hz}$$
$$f_{RSH,-} = (28 - 2) \cdot 24.5 = 26 \cdot 24.5 = 637 \text{ Hz}$$

Le armoniche di ordine superiore:
$$f_{RSH,k} = (k \cdot Q_r \pm m) \cdot \frac{n}{60} \pm l \cdot f_{el}$$

### 3.3 Bande Laterali di Slip sulle RSH (MCSA)

Nell'analisi della corrente motore (MCSA), attorno a ciascuna RSH compaiono bande laterali alla frequenza di slip:

$$f_{sl} = 2 \cdot s \cdot f_{el}$$

La presenza di bande laterali asimmetriche attorno alle RSH indica **barre rotoriche difettose**.

**Nello spettro vibrazionale** (non corrente), le barre rotte si manifestano come modulazione in ampiezza e frequenza della vibrazione alla velocità di rotazione, producendo bande laterali a $\pm 2sf_{el}$ attorno a 1X.

---

## 4. Frequenza di Commutazione PWM

Il SINAMICS S120 genera tensione con modulazione PWM a frequenza configurabile $f_{PWM}$ (parametro p1800). Le frequenze tipiche e le loro manifestazioni vibrazionali:

| $f_{PWM}$ | Commento | Manifestazione vibrazionale |
|----------|---------|---------------------------|
| 4 kHz | Carico termico minimo, rumore udibile | Vibrazione udibile (fischio 4 kHz) |
| 8 kHz | Standard | Vibrazione a 8 kHz, spesso mascherata |
| 16 kHz | Silenzioso, carico termico elevato | Al di sopra della sensibilità umana |

Le armoniche della PWM appaiono come picchi a $f_{PWM}$, $2f_{PWM}$, $3f_{PWM}$... nello spettro di accelerazione. Queste sono **caratteristiche dell'azionamento**, non del motore, e non indicano guasti meccanici.

**Bande laterali della PWM**: attorno a $f_{PWM}$ compaiono bande laterali a $\pm 2f_{el}$, $\pm 4f_{el}$... che sono normali nell'esercizio con inverter.

---

## 5. Schema Riepilogativo delle Frequenze

Per un motore 1PH8131 (4 poli, $Q_r = 28$) a 1470 RPM in servo control SINAMICS S120:

| Componente | Frequenza [Hz] | Origine | Difetto associato |
|-----------|--------------|---------|------------------|
| 1X | 24.5 | Rotazione | Squilibrio, disalin. |
| 2X | 49.0 | Rotazione × 2 | Disallineamento |
| $2f_{el}$ | 98.0 | Elettrica | Normale (monitorare) |
| $6f_{el}$ | 294.0 | Torque ripple | Normale (monitorare) |
| BPFO (6210) | ~98 | Cuscinetto DE | Difetto pista est. |
| BPFI (6210) | ~147 | Cuscinetto DE | Difetto pista int. |
| BSF (6210) | ~58.8 | Cuscinetto DE | Difetto sfere |
| FTF (6210) | ~9.8 | Cuscinetto DE | Difetto cage |
| RSH (+) | 735 | Cave rotoriche | Barre rotte (MCSA) |
| RSH (-) | 637 | Cave rotoriche | Barre rotte (MCSA) |
| $f_{PWM}$ | 8000 | Drive S120 | Normale |

> **Attenzione**: la coincidenza BPFO ≈ $2f_{el}$ in questo esempio (entrambi ~98 Hz) richiede un'analisi più attenta per distinguere l'origine elettrica da quella meccanica. Metodo: misurare a velocità leggermente diversa — la BPFO cambia con la velocità, la $2f_{el}$ anche ma in modo proporzionale diverso.
