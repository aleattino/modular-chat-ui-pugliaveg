# AI Chatbot Demo

Interfaccia chat conversazionale in React/TypeScript con suggerimenti dinamici, supporto multilingua e integrazione Mistral AI.

## Requisiti

- Node.js 18+
- npm
- API key Mistral AI

## Installazione

1. Clona il repository e entra nella cartella:
   ```bash
   git clone <url-repository>
   cd ai-chatbot-demo
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Crea il file `.env.local` copiando `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Compila le variabili:
   ```bash
   MISTRAL_API_KEY=la_tua_chiave_mistral
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=la_tua_service_role_key
   VITE_GOOGLE_MAPS_API_KEY=chiave_google_maps_opzionale
   ```

5. Avvia in sviluppo:
   ```bash
   npm run dev
   ```

## Sicurezza API key

La chiave `MISTRAL_API_KEY` viene usata solo dal server locale (`server/index.mjs`) tramite endpoint `/api/*`.
Il frontend non contiene la chiave e comunica via proxy Vite verso `http://localhost:8787`.

## Script disponibili

- `npm run dev` avvia frontend Vite + server API locale
- `npm run build` build frontend di produzione
- `npm run preview` anteprima della build

## Note

- Chat e impostazioni sono salvate in `localStorage`.
- In produzione è necessario deployare anche un backend API equivalente a `server/index.mjs`.
