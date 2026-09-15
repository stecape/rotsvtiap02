---
title: "Fondamenti di Analisi Vibrazionale"
date: 2026-05-01
tags: [vibrazioni, accelerometro, velocità, spostamento, RMS, unità-misura]
---

# Fondamenti di Analisi Vibrazionale

## 1. Il Segnale Vibrazionale

### 1.1 Definizione

Una **vibrazione** è un moto oscillatorio di un corpo attorno a una posizione di equilibrio. In un motore o in una macchina industriale, le vibrazioni sono generate da forze dinamiche (squilibrio, disallineamento, difetti cuscinetti, forze elettromagnetiche…) e si propagano attraverso la struttura meccanica.

Il segnale vibrazionale è quindi un segnale nel **dominio del tempo** che descrive lo spostamento, la velocità o l'accelerazione di un punto della struttura in funzione del tempo:

$$x(t) = A \cdot \sin(2\pi f t + \phi)$$

Per un segnale reale (non sinusoidale puro), si tratta della sovrapposizione di molte componenti sinusoidali a frequenze diverse:

$$x(t) = \sum_{k=1}^{N} A_k \cdot \sin(2\pi f_k t + \phi_k)$$

L'analisi in frequenza ha proprio lo scopo di **scomporre** questo segnale nelle sue componenti, identificando quali frequenze sono presenti e con quale ampiezza.

### 1.2 Le Tre Grandezze Vibrazionali

| Grandezza | Simbolo | Unità | Relazione |
|-----------|---------|-------|-----------|
| **Spostamento** | $x$ | m, mm, µm | Integrale della velocità |
| **Velocità** | $v = \dot{x}$ | m/s, mm/s | Derivata dello spostamento |
| **Accelerazione** | $a = \ddot{x}$ | m/s², g | Derivata della velocità |

La relazione tra le grandezze per una sinusoide di frequenza $f$:

$$v = 2\pi f \cdot x$$
$$a = (2\pi f)^2 \cdot x = 2\pi f \cdot v$$

**Implicazione pratica**: 
- Lo **spostamento** è sensibile alle **basse frequenze** (squilibri, disallineamenti a 1X, 2X)
- La **velocità** è il compromesso migliore per il range 10–1000 Hz
- L'**accelerazione** è sensibile alle **alte frequenze** (difetti cuscinetti, ingranaggi, forze elettromagnetiche)

### 1.3 Scelta della Grandezza di Misura

Per i motori 1PH8 sulle macchine rotocalco:

| Tipo di difetto | Frequenza tipica | Grandezza consigliata |
|----------------|------------------|-----------------------|
| Squilibrio rotore/cilindro | 5–50 Hz (1X–2X) | Velocità o spostamento |
| Disallineamento alberi | 10–100 Hz (1X–3X) | Velocità |
| Difetto cuscinetto | 50 Hz – 3 kHz | Accelerazione |
| Difetto ingranaggi (riduttore) | 100 Hz – 5 kHz | Accelerazione |
| Forze elettromagnetiche | 100 Hz – 10 kHz | Accelerazione |
| Difetto barre rotore | 0–100 Hz (bande sl.) | Corrente (MCSA) |

---

## 2. Parametri Caratteristici del Segnale

### 2.1 Valore di Picco (Peak)

Il valore massimo raggiunto dal segnale:
$$x_{peak} = \max |x(t)|$$

Utile per verificare limiti strutturali istantanei.

### 2.2 Valore RMS (Root Mean Square)

Il valore efficace, proporzionale all'**energia** del segnale:

$$x_{RMS} = \sqrt{\frac{1}{T} \int_0^T x^2(t)\, dt}$$

Per una sinusoide pura: $x_{RMS} = x_{peak} / \sqrt{2}$

L'RMS di **velocità** (in mm/s) è il parametro usato dalle norme ISO per la classificazione delle vibrazioni delle macchine.

### 2.3 Fattore di Cresta (Crest Factor)

$$CF = \frac{x_{peak}}{x_{RMS}}$$

Per una sinusoide pura $CF = \sqrt{2} \approx 1.41$. Un CF molto elevato (> 3–4) indica la presenza di **impulsi** nel segnale, tipici dei difetti di cuscinetto nella fase iniziale. Quando il difetto evolve, i picchi si moltiplicano e l'RMS cresce, riportando il CF verso valori più bassi.

### 2.4 Kurtosis (Curtosi)

Il quarto momento statistico normalizzato:

$$Kurt = \frac{\mu_4}{\sigma^4}$$

Per un segnale gaussiano (rumore random) $Kurt \approx 3$. Valori > 6 indicano impulsi anomali nel segnale — marker precoce di difetti di cuscinetto. Come il CF, si riduce quando il difetto è molto avanzato.

---

## 3. Classificazione ISO delle Vibrazioni

### 3.1 ISO 10816-3 / ISO 20816-3

La norma **ISO 20816-3** (evoluzione della 10816-3) classifica i macchinari industriali in base alla potenza e definisce le soglie di allarme/pericolo per la **velocità vibrazionale RMS** (banda 10–1000 Hz):

**Classe I** — Macchine fino a 15 kW:

| Zona | v RMS [mm/s] | Significato |
|------|-------------|-------------|
| A | < 2.3 | Nuovo o appena revisionato |
| B | 2.3–4.5 | Accettabile per esercizio continuo |
| C | 4.5–7.1 | Tollerabile solo a breve termine |
| D | > 7.1 | Pericolo — intervento immediato |

**Classe II** — Macchine 15–75 kW:

| Zona | v RMS [mm/s] |
|------|-------------|
| A | < 2.8 |
| B | 2.8–7.1 |
| C | 7.1–11.2 |
| D | > 11.2 |

> **Nota per rotocalco**: queste soglie si riferiscono alla misura sulla carcassa del motore. Per i cilindri di stampa, applicare le tolleranze specifiche di macchina definite dal costruttore (tipicamente più stringenti in radiale per garantire il registro).

### 3.2 ISO 10816-1 — Criteri Generali

La norma fornisce anche criteri di **variazione relativa**: un aumento del 25% del livello RMS rispetto al baseline stabilito (macchina nuova o post-revisione) è motivo di indagine, indipendentemente dal valore assoluto.

---

## 4. Il Fenomeno della Risonanza

### 4.1 Frequenza Naturale

Ogni sistema meccanico ha una o più **frequenze naturali** (o proprie) determinate da massa e rigidezza:

$$f_n = \frac{1}{2\pi} \sqrt{\frac{k}{m}}$$

dove $k$ = rigidezza [N/m] e $m$ = massa [kg].

### 4.2 Risonanza

Se una forza eccitatrice (squilibrio, difetto cuscinetto…) ha una frequenza vicina a $f_n$, il sistema entra in **risonanza**: l'ampiezza vibrazionale viene amplificata dal **fattore di qualità** Q:

$$A_{risonanza} = Q \cdot A_{eccitazione}$$

$$Q = \frac{f_n}{2\xi f_n} = \frac{1}{2\xi}$$

dove $\xi$ è il coefficiente di smorzamento relativo. Per strutture metalliche tipiche $\xi \approx 0.01$–$0.05$, quindi $Q$ può valere 10–50.

### 4.3 Implicazioni per Macchine Rotocalco

Le macchine rotocalco operano su un ampio range di velocità (dal set-up a bassa velocità fino alla velocità di produzione). Durante l'accelerazione o la decelerazione, il sistema attraversa diverse frequenze. Se una di queste corrisponde a una frequenza naturale strutturale, si verificheranno **vibrazioni transitorie amplificate** che possono danneggiare i cuscinetti o causare difetti di stampa.

**Test di impatto (Bump Test)** — procedura per identificare le frequenze naturali strutturali:
1. Motore fermo, sistema rigido
2. Impatto con martello strumentato sulla struttura
3. Acquisire risposta con accelerometro
4. Calcolare FRF (Frequency Response Function)
5. I picchi della FRF indicano le frequenze naturali

---

## 5. Propagazione delle Vibrazioni

### 5.1 Percorso Vibrazionale

Le vibrazioni generate da un difetto si propagano dal punto di generazione al punto di misura attraverso:

```
Difetto → Albero → Cuscinetto → Struttura portante → Sensore
```

Ogni interfaccia attenua e filtra il segnale:
- I cuscinetti sono un punto di **accoppiamento** ma anche di **attenuazione** (specie ad alta frequenza)
- La struttura ha un comportamento di filtro determinato dalle sue frequenze naturali

### 5.2 Posizionamento del Sensore

Regola fondamentale: **il sensore deve essere posizionato il più vicino possibile alla sorgente del difetto**, minimizzando le interfacce meccaniche nel percorso vibrazionale.

Per un cuscinetto del motore 1PH8:
- **Posizione ideale**: sulla carcassa del motore, in corrispondenza del cuscinetto, direzione radiale e/o assiale
- **Evitare**: distanze >15 cm dal cuscinetto, superfici non rigide, superfici verniciate/ossidate

La metodologia di posizionamento è dettagliata nel documento 08 - Setup di Misura Pratico.
