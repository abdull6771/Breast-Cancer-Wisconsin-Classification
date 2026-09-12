# BCW Clinical — Frontend

Production React workstation for the Breast Cancer Wisconsin classifier. This SPA replaces the Streamlit page. It talks only to a FastAPI service (or local mocks). It is an educational / research tool and **not a medical device**.

## Stack

React 18, TypeScript (strict), Vite, React Router v6, Tailwind CSS, Radix / shadcn-style primitives, TanStack Query, Zustand, React Hook Form + Zod, Recharts, react-markdown, Framer Motion (page enter and diagnosis reveal only).

## Install

```bash
cd frontend
npm install
```

Copy environment defaults:

```bash
cp .env.example .env
```

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | FastAPI origin, e.g. `http://localhost:8000`. Leave blank to use the Vite `/api` proxy. |
| `VITE_USE_MOCKS` | `true` (default) uses typed in-memory adapters. No backend required. |
| `VITE_USE_MSW` | `true` starts Mock Service Worker and intercepts `/api/*`. Set `VITE_USE_MOCKS=false` so axios still issues requests. |

Gemini’s key stays on the server (`GEMINI_API_KEY`). The Settings field appears only when `GET /api/config` returns `{ geminiConfigured: false }`. That optional key is held in memory and sent as `X-Gemini-Api-Key`.

## Run

Mocked workstation (default):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Against a future FastAPI backend:

```env
VITE_USE_MOCKS=false
VITE_USE_MSW=false
VITE_API_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

The Vite dev server also proxies `/api` to `VITE_API_BASE_URL`.

```bash
npm run build
npm run preview
```

The production build is a static SPA and can be served from any static host or from FastAPI’s `StaticFiles`.

## Verify charts without a backend

On **Analyze**, use **Load benign sample** or **Load malignant sample**, then **Analyze Tumor**.

- Benign fixture: `[3, 1, 1, 1, 2, 2, 1, 1]`
- Malignant fixture: `[8, 10, 10, 8, 7, 9, 7, 4]`

Population radar uses Wisconsin dataset means (Bare Nuclei excluded):

- Benign: `[2.956, 1.325, 1.443, 1.365, 2.120, 2.100, 1.290, 1.063]`
- Malignant: `[7.195, 6.573, 6.560, 5.548, 5.299, 5.979, 5.863, 2.589]`

## API contract

All types live in `src/types/api.ts`. The client never calls Streamlit.

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | `{ status, service }` |
| `GET` | `/api/config` | — | `{ geminiConfigured: boolean }` |
| `GET` | `/api/population-stats` | — | `{ benign: number[8], malignant: number[8], categories: string[8] }` |
| `POST` | `/api/predict` | `{ features: number[8] }` integers 1–10 | `{ diagnosis: "BENIGN" \| "MALIGNANT", message, contributions: number[8] \| null, featureNames: string[8] }` |
| `POST` | `/api/recommend` | `{ diagnosis: string, features: Record<string, number> }` | `{ markdown: string }` |
| `POST` | `/api/report` | `{ features: number[8], predictionText: string, recommendation?: string }` | PDF blob, filename `medical_report.pdf` |
| `POST` | `/api/feedback` | `{ inputs: number[8], modelPrediction: string, userCorrection: "Benign" \| "Malignant", comments: string }` | `{ ok: true }` |

Feature order (Bare Nuclei excluded):

1. Clump Thickness
2. Uniformity of Cell Size
3. Uniformity of Cell Shape
4. Marginal Adhesion
5. Single Epithelial Cell Size
6. Bland Chromatin
7. Normal Nucleoli
8. Mitoses

Loading, empty, 4xx, 5xx, and timeout states are handled for every call. If Gemini, PDF generation, or population stats fail, the rest of the workstation stays usable.

## Deploy on Vercel (Hobby / free)

The production build is a static Vite SPA. Production uses mocked APIs (`frontend/.env.production`) so the app runs without FastAPI.

### GitHub import (recommended)

1. Open [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import `abdull6771/Breast-Cancer-Wisconsin-Classification`.
3. Leave the root as the repository root (uses the root `vercel.json`), or set **Root Directory** to `frontend`.
4. Framework: Vite. Build: `npm run build`. Output: `dist`.
5. Deploy. Routes such as `/analyze` and `/results` are rewritten to `index.html`.

Hobby is for personal / educational use. Do not put `GEMINI_API_KEY` in `VITE_*` variables.

### CLI

```bash
npx vercel login
npx vercel --prod
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```
