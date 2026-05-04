# AI Chatbot Demo

Chatbot AI conversazionale per la ricerca di locali vegani e vegan-friendly in Puglia. Utilizza Mistral AI come modello linguistico e un database strutturato in formato CSV come fonte dati.

## Requisiti

- Node.js (versione 18 o superiore)
- npm
- API Key di Mistral AI
- Git

## Installazione

1. Clona il repository:
   ```bash
   git clone <url-repository>
   cd ai-chatbot-demo
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Crea un file `.env.local` nella root del progetto e aggiungi le variabili d'ambiente:
   ```
   MISTRAL_API_KEY=la_tua_chiave_mistral
   VITE_GOOGLE_MAPS_API_KEY=la_tua_chiave_google_maps
   VITE_DATA_SHEET_ID=id_del_foglio_google_sheets
   VITE_DATA_SHEET_GID=0
   ```

   > **Come ottenere le API Key:**
   >
   > **Mistral API (obbligatoria):**
   > - Vai su [console.mistral.ai](https://console.mistral.ai/)
   > - Crea un account o accedi
   > - Vai su "API Keys" e crea una nuova chiave
   > - Copia la chiave e incollala nel file `.env.local`
   >
   > **Google Maps API (opzionale ma consigliata):**
   > - Vai su [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   > - Crea un nuovo progetto o selezionane uno esistente
   > - Abilita "Maps Embed API"
   > - Vai su "Credenziali" e crea una nuova API key
   > - Copia la chiave e incollala nel file `.env.local`

4. Avvia l'applicazione in modalità sviluppo:
   ```bash
   npm run dev
   ```
   L'app sarà disponibile su [http://localhost:3000](http://localhost:3000)

## Funzionalità

- Ricerca intelligente di locali vegani e vegan-friendly
- Suggerimenti personalizzati basati su preferenze e zona
- Anteprime Google Maps integrate per ogni locale
- Pianificazione di itinerari gastronomici
- Confronto tra locali
- Supporto multilingua (Italiano/Inglese)
- Tema chiaro/scuro
- Cronologia conversazioni salvata in locale

## Tecnologie

- React + TypeScript
- Tailwind CSS
- Mistral AI API
- Vite

## Build per produzione

```bash
npm run build
```

Il risultato sarà nella cartella `dist/`.

## Note

- Le chat e le impostazioni vengono salvate nel localStorage del browser
- L'API key non viene mai esposta al client grazie al proxy Vite
