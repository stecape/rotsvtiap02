---
title: "Cinematica della Macchina Rotocalco — Frequenze di Macchina"
date: 2026-05-01
tags: [rotocalco, cinematica, cilindro-stampa, frequenze-macchina, riduttore, tiro]
---

# Cinematica della Macchina Rotocalco — Frequenze di Macchina

## 1. Architettura di una Macchina da Stampa Rotocalco

### 1.1 Schema Generale

Una macchina rotocalco è composta da una serie di **unità di stampa** (o gruppi stampa) che stampano il nastro (carta, film, alluminio) con inchiostro liquido. Ogni unità di stampa è indipendente e azionata dal proprio motore.

Schema semplificato di un gruppo stampa:

```
[Motore 1PH8]
      |
  [Riduttore]       ← rapporto i1
      |
[Albero principale]
      |
  [Cilindro stampa] ← portacilindro
      |
[Cilindro pressione / contro-cilindro]
      |
[Nastro di supporto] → → → → →
```

### 1.2 Componenti Meccanici Principali

| Componente | Funzione | Frequenze generate |
|-----------|---------|-------------------|
| **Cilindro stampa** (inciso) | Porta l'immagine incisa, trasferisce inchiostro | $f_{cil} = v_{nastro} / L_{cil}$ |
| **Cilindro pressione** | Preme il nastro contro il cilindro stampa | $f_{pres}$ |
| **Vaschetta inchiostro** | Immerge il cilindro nell'inchiostro | — |
| **Racletta** | Rimuove eccesso inchiostro dal cilindro | Forze impulsive periodiche |
| **Essiccatore** | Asciuga l'inchiostro sul nastro | — |
| **Gruppo di tiro** | Mantiene la tensione del nastro | $f_{tiro}$ |
| **Albero di trasmissione** | Sincronizza i gruppi (o elettricamente via drive) | $f_{albero}$ |

---

## 2. Calcolo delle Frequenze Cinematiche

### 2.1 Velocità del Nastro e Frequenza Cilindro

La **velocità del nastro** $v_{nastro}$ è la variabile di processo principale. Per ogni cilindro di stampa con circonferenza $C_{cil}$:

$$f_{cil} = \frac{v_{nastro}}{C_{cil}} = \frac{v_{nastro}}{\pi \cdot D_{cil}}$$

dove $D_{cil}$ è il diametro del cilindro.

**Esempio**: nastro a 200 m/min = 3.33 m/s, cilindro diametro 200 mm (C = 628 mm):

$$f_{cil} = \frac{3.33}{0.628} = 5.31 \text{ Hz}$$

### 2.2 Velocità Motore e Rapporto Riduttore

La velocità del motore $n_{motor}$ è legata alla velocità cilindro dal rapporto del riduttore $i$:

$$n_{motor} = i \cdot n_{cil} = i \cdot f_{cil} \cdot 60$$

**Esempio** (continuazione): $f_{cil} = 5.31$ Hz → $n_{cil} = 319$ RPM. Con riduttore $i = 4$: $n_{motor} = 1275$ RPM.

La velocità massima della macchina determina la **velocità massima del motore**. Per una macchina a 400 m/min:

$$n_{motor,max} = i \cdot \frac{400/60}{C_{cil}} \cdot 60 = i \cdot \frac{v_{nastro,max}}{C_{cil}} \cdot 60$$

### 2.3 Frequenza Rifermento Cilindro (Cylinder Reference Frequency)

La frequenza di rifermento del cilindro (nota anche come **CRF** o frequenza di "repeat") è la frequenza con cui ogni punto inciso del cilindro torna nella stessa posizione sul nastro — ovvero la frequenza del **passo di stampa**:

$$CRF = f_{cil} = \frac{n_{cil}}{60}$$

Un difetto periodico sul cilindro (rigatura, mancanza di inchiostro puntuale) produce un difetto sul nastro a ogni giro del cilindro, riconoscibile come **ripetizione con passo $C_{cil}$.

---

## 3. Riduttore — Frequenze degli Ingranaggi

### 3.1 Gear Mesh Frequency (GMF)

Il riduttore introduce frequenze proprie legate all'ingranamento. La **frequenza di contatto tra i denti** (gear mesh frequency) è:

$$GMF = z \cdot \frac{n_{ruota}}{60}$$

dove $z$ è il numero di denti della ruota e $n_{ruota}$ la sua velocità.

Per una coppia di ruote ($z_1$, $n_1$) e ($z_2$, $n_2$) con $z_1 \cdot n_1 = z_2 \cdot n_2$:

$$GMF = z_1 \cdot \frac{n_1}{60} = z_2 \cdot \frac{n_2}{60}$$

**Esempio**: riduttore a 2 stadi. Primo stadio: $z_1 = 20$ denti, $z_2 = 60$ denti (rapporto $i_1 = 3$). Secondo stadio: $z_3 = 18$, $z_4 = 54$ (rapporto $i_2 = 3$). Rapporto totale $i = 9$.

Con motore a 1275 RPM:
- Albero ingresso: $n_1 = 1275$ RPM → $GMF_1 = 20 \times 21.25 = 425$ Hz
- Albero intermedio: $n_2 = 425$ RPM → $GMF_2 = 18 \times 7.08 = 127.5$ Hz

### 3.2 Bande Laterali degli Ingranaggi

Attorno alla GMF compaiono bande laterali a distanza $f_{rot}$ dell'albero portante il pignone:

$$f_{GMF} \pm k \cdot f_{rot,pignone}$$

Queste bande indicano:
- Eccentricità della ruota
- Errori di passo
- Usura non uniforme

Un numero elevato di bande laterali indica degrado avanzato.

---

## 4. Frequenze di Macchina Rilevanti per l'Analisi

### 4.1 Tabella delle Frequenze da Calcolare (Template)

Per ogni macchina rotocalco occorre compilare questa tabella con i valori specifici:

| Componente | Simbolo | Formula | Valore @ v_nastro tipica |
|-----------|---------|---------|--------------------------|
| Velocità nastro | $v$ | — | \_\_\_ m/min |
| Frequenza cilindro stampa | $f_{cil}$ | $v / (\pi D_{cil})$ | \_\_\_ Hz |
| Frequenza motore | $f_{mot}$ | $i \cdot f_{cil}$ | \_\_\_ Hz |
| GMF riduttore stadio 1 | $GMF_1$ | $z_1 \cdot f_{mot}$ | \_\_\_ Hz |
| GMF riduttore stadio 2 | $GMF_2$ | $z_3 \cdot n_2/60$ | \_\_\_ Hz |
| BPFO cuscinetto mot. DE | $BPFO$ | (formula doc. 06) | \_\_\_ Hz |
| BPFI cuscinetto mot. DE | $BPFI$ | (formula doc. 06) | \_\_\_ Hz |
| Frequenza cilindro pressione | $f_{pres}$ | $v / (\pi D_{pres})$ | \_\_\_ Hz |
| Frequenza gruppo tiro | $f_{tiro}$ | $v / (\pi D_{tiro})$ | \_\_\_ Hz |

### 4.2 Armatura Elettrica — Sincronismo tra Gruppi

Nelle macchine rotocalco moderne (incluse quelle con motori Siemens 1PH8 + S120), i gruppi stampa sono sincronizzati **elettricamente** tramite il sistema di motion control (SIMOTION o TIA Portal con SINAMICS). Non esiste più l'albero meccanico di linea.

Questo significa che:
- Il **registro** (allineamento delle immagini dei vari gruppi) è garantito dal controllo elettronico
- Un errore di registro può avere origine meccanica (eccentricità cilindro, vibrazione) **o** elettrica/di controllo (ritardo di comunicazione, guadagni mal tarati)
- L'analisi vibrazionale deve essere **correlata con il dato di registro** per distinguere i due casi

---

## 5. Effetti Vibrazionali Specifici della Stampa Rotocalco

### 5.1 Racletta (Dottore Blade)

La racletta è una lamina flessibile che striscia tangenzialmente sul cilindro stampa per rimuovere l'eccesso di inchiostro. Genera:

- **Vibrazione a frequenza di racletta**: oscillazione autoindotta della lamina (flutter) a frequenza dipendente da lunghezza, spessore e pressione di contatto. Tipicamente 50–500 Hz.
- **Eccitazione broadband**: il contatto continuo genera rumore di fondo broadband sullo spettro

La frequenza di flutter della racletta può **risuonare** con frequenze della struttura o del cilindro. Questo è un problema frequente nelle macchine ad alta velocità e si manifesta come **banding** sul prodotto (strisciature periodiche).

**Come identificare**: la frequenza di flutter della racletta è indipendente dalla velocità del nastro (o varia poco). Cambiando la velocità di stampa, le frequenze di macchina cambiano proporzionalmente, ma la frequenza di flutter rimane stabile o cambia poco.

### 5.2 Eccentricità del Cilindro Stampa

L'eccentricità del cilindro (decentramento dell'asse geometrico rispetto all'asse di rotazione) genera:
- Vibrazione a **1X** e armoniche
- Variazione periodica della **pressione di stampa** con periodo pari al giro del cilindro
- Difetto di densità del colore con ripetizione = circonferenza cilindro

Tolleranza tipica di eccentricità per stampa rotocalco di qualità: < 5 µm.

### 5.3 Vibrazione di Tiro (Web Tension Variation)

Le variazioni di tensione del nastro si propagano come onde di pressione lungo il percorso nastro e si manifestano come:
- Variazioni di velocità dei cilindri di tiro
- Oscillazioni nel sistema di regolazione della tensione
- Frequenze caratteristiche legate alle dimensioni del percorso nastro e alla velocità

La frequenza propria del nastro teso tra due rulli può essere calcolata come:

$$f_{nastro} = \frac{1}{2L}\sqrt{\frac{T}{\rho A}}$$

dove $L$ = lunghezza libera nastro, $T$ = tensione, $\rho$ = densità materiale, $A$ = sezione trasversale.

---

## 6. Schema Cinematico Completo — Esempio di Compilazione

Per una macchina rotocalco con le seguenti caratteristiche (da adattare alla macchina specifica):

- Velocità di produzione: 250 m/min
- Diametro cilindro stampa: 250 mm ($C = 785$ mm)
- Diametro cilindro pressione: 220 mm ($C = 691$ mm)
- Rapporto riduttore motore-cilindro: $i = 5$
- Motore: 1PH8131, 4 poli

Calcoli:

| | |
|---|---|
| $v_{nastro}$ | 250/60 = 4.17 m/s |
| $f_{cil,stampa}$ | 4.17/0.785 = **5.31 Hz** |
| $n_{cil,stampa}$ | 319 RPM |
| $n_{motore}$ | 5 × 319 = **1594 RPM** |
| $f_{rot,motore}$ | 1594/60 = **26.6 Hz** |
| $f_{el}$ | 2 × 26.6 = **53.1 Hz** |
| $2f_{el}$ | **106.2 Hz** |
| $f_{cil,pressione}$ | 4.17/0.691 = **6.03 Hz** |

Queste frequenze costituiscono il **reference map** da confrontare con lo spettro vibrazionale misurato.
