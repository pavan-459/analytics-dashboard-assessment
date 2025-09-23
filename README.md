# EV Analytics Dashboard (Clean Rebuild)

This is a clean, from-scratch React + Vite + Tailwind dashboard that visualizes the provided EV population CSV.

## Quick Start

> **Keep your data**: Do **not** delete the folder `data-to-visualize/` (it contains the CSV the assignment expects).

```bash
# from the repo root
npm i
npm run dev
```

## Stack
- React + Vite
- TailwindCSS
- Recharts (charts)
- Zustand (global state)
- TanStack Table (data table)
- Papa Parse (CSV parsing via Vite `?raw` import)

## Project Structure
```
.
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ index.css
   ├─ App.jsx
   ├─ state/
   │  └─ store.js
   ├─ lib/
   │  ├─ csv.js
   │  └─ evSelectors.js
   ├─ components/
   │  ├─ Header.jsx
   │  ├─ KPICard.jsx
   │  ├─ FilterBar.jsx
   │  └─ DataTable.jsx
   └─ charts/
      ├─ ModelYearTrend.jsx
      ├─ TopMakesBar.jsx
      └─ TypeDonut.jsx
```

## Notes
- Data is imported directly from `data-to-visualize/Electric_Vehicle_Population_Data.csv` using Vite's `?raw` import to avoid MIME issues.
- Global filters (Make, EV Type, Model Year) are in Zustand store; all cards/charts/table react to filters.
- The UI is intentionally simple, responsive, and easily readable by reviewers.

