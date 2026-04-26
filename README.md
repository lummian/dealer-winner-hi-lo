# Dealer Winner — Hi-Lo BJ Counter

Contador de cartas de Blackjack semi-manual con cálculo de apuesta óptima.

PWA hecha con Vite + React + TypeScript + Tailwind. Pensada para usarse en el celular durante sesiones de live dealer online: tappeas cada carta visible y la app maneja Running Count, True Count, mazos restantes, ventaja del jugador, recomendación de apuesta y desviaciones de estrategia.

## Features

- Conteo Hi-Lo, KO o Hi-Opt I (configurable)
- Cálculo en vivo de RC, TC, ventaja del jugador y mazos restantes
- Recomendación de apuesta por **bet spread** o **Kelly fraccional**
- Estrategia básica completa (hard, soft, pares)
- Desviaciones Illustrious 18 + Fab 4 (surrender)
- Indicador de Insurance basado en TC
- Reglas de mesa configurables (decks, S17/H17, DAS, surrender, BJ pays, penetración)
- Persistencia local en `localStorage`
- Instalable como PWA en móvil

## Setup

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` o desde tu celular `http://<tu-ip-lan>:5173`.

## Build

```bash
npm run build
npm run preview
```

## Estructura

- `src/lib/` — lógica pura (counting, betting, strategy, types, storage)
- `src/components/` — UI (CardButton, StatTile, Settings, HandScreen)
- `src/App.tsx` — pantalla principal

## Disclaimer

Esta herramienta es de uso personal y educativo. Verifica la legalidad del conteo de cartas y las reglas de cada operador antes de utilizarla con dinero real.
