---
title: "Diagnostica Guasti tramite Analisi Spettrale — Guida Pratica"
date: 2026-05-01
tags: [diagnostica, guasti, spettro, squilibrio, disallineamento, cuscinetti, barre-rotte]
---

# Diagnostica Guasti tramite Analisi Spettrale

## 1. Metodologia Diagnostica

### 1.1 Approccio Sistematico

La diagnosi vibrazionale non è un'operazione di "pattern matching" casuale: richiede un approccio metodico:

1. **Raccogliere il dato grezzo**: misurare nelle 4 posizioni standard con parametri corretti
2. **Confrontare con la baseline**: identificare variazioni significative (>25% in RMS o nuovi picchi)
3. **Identificare le frequenze dei picchi anomali**: calcolare $f / f_{rot}$ per ogni picco
4. **Confrontare con le frequenze teoriche**: squilibrio? cuscinetto? ingranaggio? elettrico?
5. **Confermare con misure aggiuntive**: cambio di velocità, envelope, MCSA, ispezione visiva
6. **Formulare la diagnosi**: tipo di difetto, gravità, urgenza di intervento

### 1.2 Regole Empiriche di Priorità

| Condizione | Priorità di intervento |
|-----------|----------------------|
| RMS > Livello D (ISO 20816) | IMMEDIATA — fermare macchina |
| Kurtosis > 10 o CF > 6 | ALTA — pianificare entro 1 settimana |
| Nuovo picco > 6 dB sopra baseline | MEDIA — monitorare settimanale |
| Trend crescente costante | BASSA — pianificare alla prossima finestra |

---

## 2. Squilibrio di Massa (Unbalance)

### 2.1 Firma Spettrale

Lo squilibrio è il difetto più comune nei rotori. La sua firma spettrale è inconfondibile:

- **Picco dominante a 1X** (frequenza di rotazione)
- **Direzionale**: alto in orizzontale E in verticale, con rapporto tipicamente 0.5–2
- **Fase stabile**: 0°–90° lag rispetto alla posizione pesante (per bilanciatura dinamica)
- **Armoniche deboli o assenti** (distingue da allentamento meccanico)

**Spettro tipico squilibrio**:
```
Ampiezza
    |
    |     ████
    |     ████
    |     ████   _
    |_____|1X__|__|_2X_|___3X___→ freq
```

### 2.2 Squilibrio del Cilindro Stampa vs. Motore

Sulle macchine rotocalco, il picco a 1X può originare da:
- Squilibrio del rotore del **motore** → picco a $f_{rot,motore}$
- Squilibrio del **cilindro stampa** → picco a $f_{cil}$ (≠ $f_{rot,motore}$ a causa del riduttore)
- Squilibrio del **cilindro pressione** → picco a $f_{pres}$

**Come distinguere**: calcolare le frequenze di rotazione di ciascun componente e identificare a quale corrisponde il picco.

### 2.3 Soglie per Bilanciatura

Le norme ISO 1940-1 definiscono le classi di qualità di bilanciatura (G). Per motori servo di precisione: **Classe G1** (residuo ≤ 1 g·mm/kg). Per cilindri stampa rotocalco: **Classe G0.4** o migliore.

Un residuo di squilibrio $U$ produce una forza centrifuga:
$$F = m \cdot e \cdot \omega^2 = U \cdot \omega^2$$
dove $e$ è l'eccentricità della massa di squilibrio.

---

## 3. Disallineamento (Misalignment)

### 3.1 Firma Spettrale

Il disallineamento tra l'asse del motore e l'asse del riduttore/cilindro è la seconda causa più comune di vibrazioni elevate.

**Disallineamento parallelo** (offset laterale degli assi):
- Picco elevato a **2X**, spesso comparabile o superiore a 1X
- Evidente in direzione radiale

**Disallineamento angolare** (angolo tra gli assi):
- Picco elevato a **1X e 2X** in direzione **assiale**
- Rapporto assiale/radiale > 0.5 è sospetto

**Disallineamento combinato** (più comune in pratica):
- Picchi a 1X, 2X, spesso anche 3X
- Sia in radiale che in assiale

**Spettro tipico disallineamento angolare**:
```
Ampiezza
    |     ████
    |     ████  ████
    |     ████  ████  ██
    |_____|1X__|_2X_|_3X_|___→ freq
         (in direzione assiale)
```

### 3.2 Verifica del Disallineamento

La diagnosi vibrazionale indica la **probabilità** di disallineamento. La **conferma** richiede:
1. Misura con comparatori o laser aligner (strumento di allineamento)
2. Tolleranze tipiche per accoppiamento motore 1PH8 – riduttore:
   - Offset radiale: ≤ 0.05 mm
   - Angolo: ≤ 0.05 mm/100 mm

---

## 4. Allentamento Meccanico (Looseness)

### 4.1 Firma Spettrale

L'allentamento meccanico (bulloni base motore allentati, chiavetta gioca sull'albero, accoppiamento con gioco eccessivo) produce:

- **Numerose armoniche di 1X**: da 1X fino a 10X–20X con ampiezza decrescente irregolare
- Possibile presenza di **sub-armoniche**: 0.5X, 1.5X, 2.5X... (tipico di allentamento strutturale con battuta)
- **Variabilità**: lo spettro di un allentamento è spesso irregolare e cambia tra una misura e l'altra (comportamento non lineare)

**Spettro tipico allentamento**:
```
Ampiezza
    |  ██
    |  ██ ██
    |  ██ ██ ██ █ █ █ █ █ █
    |__|1X|2X|3X|4X|5X|6X|→ freq
```

### 4.2 Allentamento del Motore sulla Staffa

Nei motori 1PH8 montati su staffa/base:
- Verificare il serraggio dei bulloni di ancoraggio (coppia di serraggio da manuale Siemens)
- Verificare le linguette antivibranti della base
- Soft foot: condizione in cui il motore si appoggia solo su 3 dei 4 piedi (causa disallineamento e allentamento combinati)

---

## 5. Difetti di Cuscinetto — Evoluzione e Firma Spettrale

### 5.1 Le 4 Fasi di Degrado del Cuscinetto

Il degrado di un cuscinetto evolve in 4 stadi, ciascuno con una firma spettrale diversa:

**Fase 1 — Difetto microscopico (mesi prima del guasto)**
- Kurtosis e CF elevati (>4–6)
- Energia nelle bande ad alta frequenza (stress waves, 2–50 kHz)
- Nello spettro standard: niente di visibile

**Fase 2 — Difetto iniziale (settimane-mesi prima)**
- Picchi alle frequenze BPFO/BPFI/BSF/FTF nello **spettro dell'inviluppo**
- Nello spettro di velocità: ancora assente o picchi molto deboli

**Fase 3 — Difetto sviluppato (giorni-settimane)**
- Picchi BPFO/BPFI/BSF con armoniche (2×BPFO, 3×BPFO…)
- Bande laterali a $\pm 1X$ attorno ai picchi di difetto
- Aumento dell'RMS generale
- Visibile nello spettro di velocità standard

**Fase 4 — Degrado grave (ore-giorni)**
- L'RMS sale bruscamente
- Lo spettro si "riempie": il cuscinetto ormai produce rumore broadband
- Paradossalmente Kurtosis e CF **scendono** (il difetto è ovunque, non impulsivo)
- Rischio di guasto imminente

### 5.2 Esempi di Spettri Envelope per Cuscinetto Difettoso

**BPFO — Difetto pista esterna (stadio 2)**:
```
Inviluppo FFT:
    |        ████
    |    ██  ████  ██
    |    ██  ████  ██  ██
    |____|FTF|BPFO|2BPFO|3BPFO|→ freq
    (picchi puliti, senza bande laterali)
```

**BPFI — Difetto pista interna (stadio 3)**:
```
Inviluppo FFT:
    |      |BPFI - 1X| ████ |BPFI + 1X|
    |     ██           ████           ██
    |   _|BPFI - 2X|  ████  |BPFI + 2X|_
    |____|____________|BPFI|____________|→ freq
    (bande laterali a ±1X: pista interna ruota)
```

### 5.3 Differenza tra BPFO e Forze Elettromagnetiche

Come già notato nel documento 06, BPFO e $2f_{el}$ possono coincidere numericamente. Per distinguerli:

1. **Variare la velocità del 10%**: entrambi cambieranno proporzionalmente (in un motore controllato in servo, la frequenza elettrica scala con la velocità), ma il **rapporto** BPFO/$2f_{el}$ rimane costante. Non è un metodo risolutivo.

2. **Analisi dell'inviluppo**: un difetto BPFO compare nell'**inviluppo** ad alta frequenza; $2f_{el}$ no.

3. **Misura con il solo drive off**: impossibile in produzione, ma in alcune finestre di manutenzione è possibile trascinare il motore meccanicamente — se il picco scompare, era elettrico.

4. **MCSA**: analizzare lo spettro della corrente di fase — la $2f_{el}$ compare nella corrente; il BPFO no.

---

## 6. Difetti di Rotore — Barre Rotte

### 6.1 Meccanismo

In un motore 1PH8 (gabbia di scoiattolo), una barra rotta riduce asimmetricamente la corrente indotta nel rotore, creando uno squilibrio magnetico che modula in ampiezza la corrente statorica e la coppia motrice.

### 6.2 Firma Spettrale nella Corrente (MCSA)

Nello spettro della corrente di fase compaiono bande laterali attorno alla frequenza fondamentale $f_{el}$:

$$f_{barre} = f_{el} \pm 2k \cdot s \cdot f_{el} = f_{el}(1 \pm 2ks)$$

Per $k = 1$: $f_{el}(1 - 2s)$ e $f_{el}(1 + 2s)$

Esempio con $f_{el} = 49$ Hz, $s = 2\%$:
$$f_{barre} = 49 \times (1 - 0.04) = 47.04 \text{ Hz}$$
$$f_{barre} = 49 \times (1 + 0.04) = 50.96 \text{ Hz}$$

Una differenza di ampiezza asimmetrica tra le due bande indica barre rotte.

### 6.3 Firma nella Vibrazione

Nella vibrazione meccanica, le barre rotte producono:
- Modulazione in ampiezza dell'1X con frequenza $2sf_{el}$
- Bande laterali visibili a $1X \pm 2sf_{el}$
- Oscillazione della coppia (visibile nel Trace SINAMICS su r0031)

> **Nota importante per motori in servo control**: con SINAMICS S120 il regolatore di corrente compensa attivamente le asimmetrie di corrente fino alla sua banda passante. L'effetto di barre rotte può essere **mascherato** dal regolatore e risultare meno visibile nella vibrazione meccanica rispetto a un motore in V/Hz. La MCSA rimane lo strumento più affidabile.

---

## 7. Checklist Diagnostica Rapida

| Sintomo | Prima ipotesi | Verifica |
|---------|--------------|---------|
| 1X elevato, armoniche assenti | Squilibrio | Misura in più direzioni, balancing check |
| 1X + 2X elevati in assiale | Disallineamento angolare | Allineamento laser |
| Molte armoniche irregolari | Allentamento | Verifica serraggi, soft foot |
| Kurtosis > 5, spectrum OK | Cuscinetto fase 1 | Envelope analysis urgente |
| Picchi BPFO/BPFI in envelope | Cuscinetto fase 2-3 | Monitoraggio intensificato, pianificare sostituzione |
| RMS in crescita rapida | Cuscinetto fase 4 | Sostituzione urgente |
| Picchi a $GMF \pm n \cdot f_{rot}$ | Usura ingranaggi riduttore | Analisi olio, ispezione visiva |
| Picchi a $2f_{el}$, $4f_{el}$ | Forze elettromagnetiche normali | Monitorare trend; se crescenti: eccentricità air gap |
| Oscillazione velocità @1X in Trace | Squilibrio o torque ripple 1° | FFT del segnale di coppia SINAMICS |
| Oscillazione coppia @6X $f_{el}$ | Torque ripple elettrico | Normale; se eccessivo: parametri drive |
