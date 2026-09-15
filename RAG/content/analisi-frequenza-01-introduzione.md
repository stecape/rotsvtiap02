---
title: "Analisi in Frequenza Motori 1PH8 - Introduzione e Panoramica"
date: 2026-05-01
tags: [motori, 1PH8, siemens, analisi-frequenza, rotocalco, servo, sinamics]
---

# Analisi in Frequenza dei Motori Asincroni Siemens 1PH8 sulle Macchine Rotocalco

## Panoramica della Serie

Questa serie di documenti tratta l'analisi vibrazionale e spettrale in frequenza applicata ai motori asincroni **Siemens serie 1PH8** installati sulle nostre macchine da stampa rotocalco. Il controllo è di tipo **servo** tramite azionamento **SINAMICS S120**, con encoder incorporato e anello di posizione/velocità chiuso.

L'obiettivo è fornire al personale di manutenzione e agli ingegneri di processo una guida completa per:

- Comprendere la teoria alla base dell'analisi in frequenza
- Identificare le frequenze caratteristiche dei motori e della macchina
- Eseguire misure vibrazionali in campo
- Diagnosticare guasti incipienti
- Impostare un programma di manutenzione predittiva

---

## Perché l'Analisi in Frequenza su Macchine Rotocalco

Le macchine da stampa rotocalco sono sistemi meccanici di alta precisione. Il cilindro di stampa ruota a velocità variabile, trascinando il nastro di carta/film attraverso gruppi stampa, essiccatori e gruppo di tiro. La qualità del prodotto stampato dipende direttamente dalla stabilità rotazionale e dall'assenza di vibrazioni.

Un difetto meccanico che si sviluppa nel tempo — cuscinetto deteriorato, squilibrio del cilindro, allentamento meccanico — produce una **firma vibrazionale** identificabile nello spettro delle frequenze **prima** che si manifesti come difetto visibile sul prodotto o come guasto catastrofico.

### Vantaggi del monitoraggio spettrale

| Beneficio | Impatto operativo |
|-----------|-------------------|
| Rilevamento precoce guasti cuscinetti | Settimane/mesi di anticipo rispetto al guasto |
| Identificazione squilibrio cilindri | Prevenzione difetti di registro |
| Controllo allineamento | Riduzione usura accoppiamenti |
| Monitoraggio allentamenti | Prevenzione danni strutturali |
| Trend nel tempo | Pianificazione fermi manutentivi |

---

## Architettura del Sistema Motore-Azionamento

### Il motore 1PH8

Il motore **Siemens 1PH8** è un motore asincrono trifase a gabbia di scoiattolo progettato specificamente per applicazioni servo ad alta dinamica. Le caratteristiche principali rispetto a un motore industriale standard sono:

- **Encoder integrato** (tipicamente sin/cos o EnDat) per il feedback di posizione e velocità
- **Inerzia ridotta del rotore** per massimizzare la risposta dinamica
- **Raffreddamento forzato** (ventola esterna o a liquido) per mantenere la coppia nominale a bassa velocità
- **Flangia di montaggio precisa** (IEC/NEMA) per l'accoppiamento diretto ai riduttori o ai cilindri

### L'azionamento SINAMICS S120

Il drive **SINAMICS S120** esegue il controllo vettoriale orientato al campo (FOC — Field Oriented Control) in modalità servo, con:

- Anello di corrente (banda tipica 1–5 kHz)
- Anello di velocità (banda tipica 50–500 Hz)
- Anello di posizione (quando richiesto)

In modalità servo, l'azionamento **compensa attivamente** le perturbazioni meccaniche (cogging, attrito, carichi variabili), il che significa che alcune caratteristiche vibrazionali che nei motori a V/Hz sarebbero immediatamente visibili vengono parzialmente mascherate dal regolatore. Questo è un aspetto critico da tenere presente durante l'analisi.

---

## Struttura della Serie Documentale

| Documento | Contenuto |
|-----------|-----------|
| **01 - Introduzione** | Questo documento: panoramica e architettura |
| **02 - Teoria motore asincrono** | Principi elettromagnetici e meccanici |
| **03 - Siemens 1PH8: specifiche** | Parametri tecnici, costruzione, encoder |
| **04 - Fondamenti vibrazionali** | Moto periodico, smorzamento, risonanza |
| **05 - FFT e analisi spettrale** | Trasformata di Fourier, finestre, risoluzione |
| **06 - Frequenze caratteristiche motore** | Calcolo delle frequenze di guasto |
| **07 - Cinematica macchina rotocalco** | Rapporti di trasmissione, frequenze di macchina |
| **08 - Setup di misura pratico** | Strumentazione, posizionamento sensori, procedure |
| **09 - Diagnostica guasti** | Interpretazione spettri, casi reali |
| **10 - Manutenzione predittiva** | KPI, soglie, piano di monitoraggio |

---

## Glossario Essenziale

| Termine | Definizione |
|---------|-------------|
| **FFT** | Fast Fourier Transform — algoritmo per calcolare lo spettro di frequenza da un segnale nel tempo |
| **Frequenza fondamentale (1X)** | Frequenza di rotazione dell'albero in esame |
| **Armoniche** | Multipli interi della frequenza fondamentale (2X, 3X, …) |
| **BPFI/BPFO** | Ball Pass Frequency Inner/Outer — frequenze di passaggio sfere su cuscinetto |
| **BSF** | Ball Spin Frequency — frequenza di rotazione della sfera del cuscinetto |
| **FTF** | Fundamental Train Frequency — frequenza del cage del cuscinetto |
| **Slip** | Scorrimento del motore asincrono (differenza relativa fra velocità di sincronismo e velocità reale) |
| **MCSA** | Motor Current Signature Analysis — analisi firma corrente motore |
| **RMS** | Root Mean Square — valore efficace, misura dell'ampiezza vibrazionale globale |
| **dB** | Decibel — scala logaritmica usata per rappresentare ampiezza spettrale |
| **Envelope** | Analisi dell'inviluppo — tecnica per rilevare impulsi ad alta frequenza (cuscinetti) |
| **Waterfall** | Grafico 3D spettro vs. tempo (o velocità) |

---

## Note di Sicurezza

> **ATTENZIONE**: Le operazioni di misura vibrazionale sui motori in funzione devono essere eseguite rispettando le procedure di sicurezza aziendali. I motori 1PH8 possono raggiungere temperature superficiali elevate (classe F, 155°C). Le misure con accelerometro a contatto richiedono l'utilizzo di guanti termici e il rispetto delle distanze di sicurezza dalle parti in rotazione.

> **NOTA TECNICA**: In presenza di controllo servo attivo (SINAMICS S120), l'azionamento può compensare perturbazioni meccaniche fino alla banda passante del regolatore di velocità. Guasti a frequenza inferiore alla banda del regolatore possono non essere visibili sullo spettro vibrazionale ma potrebbero emergere dall'analisi della corrente motore (MCSA).
