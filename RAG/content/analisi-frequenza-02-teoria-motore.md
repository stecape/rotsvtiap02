---
title: "Teoria del Motore Asincrono Trifase per Applicazioni Servo"
date: 2026-05-01
tags: [motori, asincrono, teoria, elettromagnetismo, servo, FOC]
---

# Teoria del Motore Asincrono Trifase per Applicazioni Servo

## 1. Principio di Funzionamento

### 1.1 Campo Magnetico Rotante

Un motore asincrono trifase (o motore a induzione) sfrutta il principio del **campo magnetico rotante**. Alimentando lo statore con tre correnti sfasate di 120° elettrici tra loro, si genera un campo magnetico che ruota nello spazio a velocità angolare:

$$\omega_s = \frac{2\pi f}{p}$$

dove:
- $f$ = frequenza di alimentazione [Hz]
- $p$ = numero di **coppie polari**
- $\omega_s$ = velocità angolare di sincronismo [rad/s]

In termini di giri al minuto:

$$n_s = \frac{60 \cdot f}{p}$$

**Esempio**: motore 4 poli (p=2) a 50 Hz → $n_s = 1500$ RPM

### 1.2 Lo Scorrimento (Slip)

Il rotore non può mai raggiungere la velocità di sincronismo del campo magnetico: se lo facesse, non ci sarebbe più variazione di flusso, non ci sarebbero forze indotte, non ci sarebbe coppia. La differenza relativa tra velocità di sincronismo e velocità reale del rotore è definita **scorrimento** (slip):

$$s = \frac{n_s - n_r}{n_s}$$

dove $n_r$ è la velocità effettiva del rotore in RPM.

- A **carico nominale**: $s$ tipicamente 1–8% nei motori standard, 0.1–2% nei motori servo ad alta efficienza
- A **vuoto**: $s \approx 0$ (il motore si avvicina alla velocità di sincronismo)
- **Importanza per l'analisi in frequenza**: lo slip introduce bande laterali caratteristiche attorno alle frequenze elettriche

### 1.3 Frequenza delle Correnti nel Rotore

Le correnti indotte nel rotore hanno una frequenza che dipende dallo slip:

$$f_{rotore} = s \cdot f_{statore}$$

Queste correnti nel rotore generano a loro volta un campo magnetico che, combinandosi con quello dello statore, produce la coppia motrice.

---

## 2. Costruzione Meccanica

### 2.1 Statore

Lo statore è composto da:
- **Nucleo magnetico laminato** (lamierini in acciaio al silicio, spessore 0.35–0.5 mm) per ridurre le perdite per correnti parassite
- **Avvolgimento trifase** inserito in cave (slot) distribuite sulla circonferenza interna
- Il numero di **cave statoriche** ($Q_s$) è un parametro fondamentale per il calcolo delle frequenze di modulazione

### 2.2 Rotore a Gabbia di Scoiattolo

Nei motori 1PH8, il rotore è del tipo **a gabbia di scoiattolo** (squirrel cage):
- Barre conduttrici (alluminio o rame) inserite in cave nel nucleo rotorico
- Due anelli di cortocircuito chiudono il circuito alle estremità
- Il numero di **cave rotoriche** ($Q_r$) è anch'esso fondamentale per l'analisi spettrale

> **Nota critica**: il numero di cave rotorico $Q_r$ determina la frequenza delle **RSH (Rotor Slot Harmonics)**, componenti spettrali caratteristiche molto utili per la diagnostica. Nei motori Siemens 1PH8, questo dato è reperibile dalla documentazione tecnica o misurabile sperimentalmente.

### 2.3 Cuscinetti

Il motore 1PH8 monta tipicamente:
- **Lato accoppiamento (DE — Drive End)**: cuscinetto radiale a sfere o a rulli, dimensionato per carichi radiali elevati
- **Lato opposto (NDE — Non-Drive End)**: cuscinetto di guida libera (free bearing)

I riferimenti dei cuscinetti specifici per ogni taglia 1PH8 sono riportati nel documento 03 - Specifiche Tecniche.

---

## 3. Controllo in Modalità Servo (FOC)

### 3.1 Field Oriented Control (FOC)

A differenza del controllo scalare (V/Hz), il controllo servo utilizza il **Field Oriented Control** (controllo vettoriale orientato al campo). Il principio fondamentale è la scomposizione del vettore di corrente dello statore in due componenti ortogonali, espresse nel sistema di riferimento solidale al flusso del rotore:

- **Componente $i_d$** (asse d — diretto): controlla il **flusso magnetico** del motore
- **Componente $i_q$** (asse q — in quadratura): controlla la **coppia** del motore

Questo consente di controllare coppia e flusso in modo **disaccoppiato**, esattamente come in un motore in corrente continua, ottenendo alta dinamica e precisione.

### 3.2 Implicazioni dell'FOC sull'analisi vibrazionale

Il controllo FOC con SINAMICS S120 ha conseguenze importanti sull'analisi spettrale:

1. **Banda del regolatore di velocità** (tipicamente 50–500 Hz): perturbazioni meccaniche a frequenza inferiore alla banda vengono **compensate attivamente** dall'azionamento. Il motore "segue" la perturbazione senza emetterla come vibrazione meccanica. Questo può mascherare guasti a bassa frequenza (squilibri, disallineamenti lievi).

2. **Iniezione di corrente**: il drive inietta correnti di controllo alla frequenza PWM (tipicamente 4–16 kHz) e alle sue armoniche. Queste frequenze appaiono nello spettro vibrazionale come **forze di eccitazione elettromagnetica** e devono essere riconosciute per non essere confuse con difetti meccanici.

3. **Frequenza PWM**: la frequenza di commutazione del drive crea forze elettromagnetiche che si propagano al motore. Frequenze tipiche: 4 kHz, 8 kHz, 16 kHz.

4. **Armoniche di corrente**: il drive introduce armoniche di corrente (5ª, 7ª, 11ª, 13ª…) che generano componenti vibrazionali alle relative frequenze elettriche.

### 3.3 Struttura degli anelli di regolazione SINAMICS S120

```
Setpoint posizione → [Regolatore P posizione] → Setpoint velocità
                                                         ↓
Encoder ←────────────────── [Regolatore PI velocità] ←─
                                                         ↓
                                                   Setpoint coppia (iq*)
                                                         ↓
                                              [Regolatore PI corrente id/iq]
                                                         ↓
                                              [Modulatore PWM / Inverter]
                                                         ↓
                                                    Motore 1PH8
```

---

## 4. Forze Elettromagnetiche in un Motore Asincrono

### 4.1 Forze di Maxwell e Forze di Riluttanza

Le vibrazioni di origine elettromagnetica in un motore asincrono sono generate da:

- **Forze di Maxwell** (pressioni magnetiche radiali): proporzionali al quadrato del campo magnetico nell'air gap, agiscono radialmente sullo statore
- **Forze di Riluttanza**: dovute alla variazione di riluttanza con la posizione delle cave

La forza radiale per unità di superficie nell'air gap è:

$$P = \frac{B^2}{2\mu_0}$$

dove $B$ è la densità di flusso e $\mu_0 = 4\pi \times 10^{-7}$ H/m.

### 4.2 Frequenze delle Forze Elettromagnetiche

Le forze elettromagnetiche si generano alle frequenze:

$$f_{em} = |k_1 \cdot Q_s \pm k_2 \cdot Q_r| \cdot \frac{n_r}{60} \pm k_3 \cdot f_s$$

dove $k_1, k_2, k_3$ sono interi, $Q_s$ e $Q_r$ sono il numero di cave statoriche e rotoriche.

La frequenza più bassa delle forze elettromagnetiche (spesso la più eccitatrice) è:

$$f_{em,1} = (Q_r \cdot \frac{n_r}{60}) \pm 2f_s$$

### 4.3 Ordine Spaziale delle Forze

Fondamentale per la risposta vibrazionale è l'**ordine spaziale** r della forza (numero di nodi del modo di deformazione dello statore). Solo le forze con r = 0 (pulsanti radialmente) o r = 2 (ovalization) sono particolarmente eccitative. Le forze con r elevato generano deformazioni di ordine superiore e sono meno pericolose dal punto di vista acustico/vibrazionale.

---

## 5. Coppia e Vibrazioni Meccaniche

### 5.1 Ondulazione di Coppia (Torque Ripple)

In ogni motore elettrico esiste una componente di coppia oscillante sovrapposta alla coppia media, detta **torque ripple** o ondulazione di coppia. Le cause principali sono:

- **Armonica 6k** della corrente di alimentazione: genera torque ripple a $6f_s$, $12f_s$, $18f_s$...
- **Cave statoriche**: il cogging (pur minimo nella gabbia di scoiattolo) genera ripple a $Q_s \cdot n/60$
- **Interazione cave statoriche-rotoriche**: produce ripple alla frequenza $|Q_s \pm Q_r| \cdot n/60$

### 5.2 Torque Ripple in Servo Control

In modalità servo con SINAMICS S120, il regolatore di corrente tende a minimizzare il torque ripple compensando attivamente le armoniche di corrente. Tuttavia:

- Il torque ripple residuo **si trasmette meccanicamente** al sistema connesso (riduttore, cilindro)
- A basse velocità (come l'avanzamento lento del nastro) il torque ripple diventa più visibile come **irregolarità di velocità**
- Nelle macchine rotocalco questo si traduce in **difetti di registro** o **banding** (bande orizzontali sul prodotto stampato)

---

## 6. Riepilogo delle Frequenze di Origine Elettrica

| Fonte | Frequenza | Nota |
|-------|-----------|------|
| Alimentazione fondamentale | $f_s$ (50 Hz o freq. drive) | Dal drive: variabile con la velocità |
| Armoniche corrente statorica | $5f_s$, $7f_s$, $11f_s$, $13f_s$... | Tipiche da inverter |
| Doppia frequenza di rete | $2f_s$ | Forze radiali sull'air gap |
| Rotor slot harmonics | $Q_r \cdot n/60 \pm f_s$ | Identificativa del motore |
| Frequenza PWM drive | $f_{PWM}$ (4–16 kHz) | Dal SINAMICS S120 |
| Armoniche PWM | $2f_{PWM}$, $3f_{PWM}$... | Spesso udibili come fischio |
| Torque ripple 6° armonico | $6f_s$, $12f_s$... | Si trasmette meccanicamente |
