# Proteo - Assistente Marino Intelligente 🌊

**Proteo** è un chatbot marino intelligente per ISPRA/MER con integrazione RAG e dati ufficiali del progetto Marine Ecosystem Restoration. Aiuta turisti e cittadini a scoprire e proteggere gli ecosistemi marini italiani.

🚀 **Live Demo:** [https://proteo-marine.netlify.app](https://proteo-marine.netlify.app)

## Requisiti / Requirements

- Node.js >= 18
- npm o yarn

## Installazione / Installation

```bash
git clone <repo-url>
cd proteo-mvp
npm install
```

## Sviluppo / Development

```bash
# Avvia il dev server / Start dev server
npm run dev

# Build di produzione / Production build
npm run build

# Preview build / Preview production build
npm run preview

# Build per Netlify / Netlify build
npm run build:netlify
```

## 🚀 Deploy su Netlify

### Opzione 1: Deploy Automatico
1. Fork questo repository su GitHub
2. Vai su [netlify.com](https://netlify.com) e collega il tuo account GitHub
3. Click "New site from Git" → Seleziona il repository
4. Netlify rileverà automaticamente le configurazioni da `netlify.toml`
5. Deploy automatico! 🎉

### Opzione 2: Deploy Manuale
```bash
# Installa Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build e deploy
npm run build
netlify deploy --prod --dir=dist
```

### Configurazione Netlify
Il file `netlify.toml` include:
- ✅ Build automatico con Node 18
- ✅ Redirect per SPA routing
- ✅ Headers di sicurezza
- ✅ Cache ottimizzata per assets
- ✅ Configurazione marine-themed

## Variabili d'ambiente / Environment Variables

Crea un file `.env.local`:

```env
# OpenAI API (required for full AI responses)
VITE_OPENAI_API_KEY=your-openai-api-key-here
VITE_LLM_API_URL=https://api.openai.com/v1/chat/completions

# Optional: Custom system prompt
VITE_SYSTEM_PROMPT="Your custom system prompt..."
```

⚠️ **IMPORTANTE**: Non committare mai le chiavi API! Sono già escluse in `.gitignore`.

## Caratteristiche / Features

### Core Features
- ✅ React + TypeScript + Vite
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Accessibilità WCAG 2.2 AA
- ✅ Animazioni con framer-motion
- ✅ Design marino con gradient ocean
- ✅ Responsive design

### AI & Data Integration
- ✅ **RAG System**: Retrieval-Augmented Generation con dati ISPRA
- ✅ **Progetto MER**: Integrazione completa con dati ufficiali €400M
- ✅ **Specie Marine**: Database Posidonia, Pinna nobilis, Cymodocea
- ✅ **Quick Marine Facts**: Curiosità integrate nelle risposte
- ✅ **Links Diretti**: Collegamenti a mer.isprambiente.it
- ✅ **Risposta Italiana**: Ottimizzato per turisti e cittadini italiani

### Data Sources / Fonti Dati
- 🌊 **RMN** - Rete Mareografica Nazionale (livelli mare)
- 🌊 **RON** - Rete Ondametrica Nazionale (moto ondoso)
- 🏗️ **Progetto MER** - Marine Ecosystem Restoration (2022-2026)
- 🌱 **Praterie Marine** - Posidonia oceanica, Cymodocea nodosa
- 🐚 **Specie Protette** - Pinna nobilis, conservazione marina
- 🗑️ **Reti Fantasma** - Rimozione detriti da pesca
- ⛰️ **Montagne Sottomarine** - 90+ seamounts nel Mediterraneo

## Architettura RAG / RAG Architecture

```
User Query → RAG Service → ISPRA Data Retrieval → Context Enhancement → OpenAI API → Enhanced Response
```

### Componenti RAG:
1. **Data Sources** (`/src/data/marineDataSources.ts`) - Configurazione fonti ISPRA
2. **RAG Service** (`/src/services/ragService.ts`) - Motore recupero dati
3. **Enhanced API Client** (`/src/api/client.ts`) - Integrazione OpenAI + RAG
4. **Data Updater** (`/src/services/dataUpdater.ts`) - Aggiornamenti automatici

## Quick Questions / Domande Rapide

Il sistema include 10 categorie di domande rapide:
- 🌡️ **Temperatura marina**
- 🌱 **Livelli clorofilla**
- 🌊 **Condizioni moto ondoso**
- 🏗️ **Progetto MER**
- 🌿 **Posidonia oceanica**
- 🐚 **Pinna nobilis**
- 💧 **Qualità acque costiere**
- 🐟 **Biodiversità marina**
- 🗑️ **Reti fantasma**
- 💡 **Curiosità marine**

## EU AI Act Disclosure

Questo chatbot utilizza tecnologie di intelligenza artificiale. Le risposte sono generate automaticamente e potrebbero non essere sempre accurate. I dati ISPRA sono integrati per migliorare l'accuratezza, ma verificare sempre le informazioni critiche attraverso fonti ufficiali.

*This chatbot uses artificial intelligence technologies. Responses are automatically generated and may not always be accurate. ISPRA data is integrated to improve accuracy, but always verify critical information through official sources.*

## Struttura del progetto / Project Structure

```
proteo-mvp/
├── src/
│   ├── components/         # UI Components
│   │   ├── QuickQuestions.tsx  # Quick question buttons
│   │   └── ProteoChat.tsx      # Enhanced chat interface
│   ├── services/          # Core services
│   │   ├── ragService.ts      # RAG implementation
│   │   └── dataUpdater.ts     # Background data updates
│   ├── data/              # Data configuration
│   │   └── marineDataSources.ts  # ISPRA data sources
│   ├── types/             # TypeScript definitions
│   │   └── marine.ts          # Marine data types
│   ├── api/               # API clients
│   │   └── client.ts          # Enhanced OpenAI + RAG client
│   └── hooks/             # React hooks
       └── useChat.ts         # Chat functionality
```

## Modalità Funzionamento / Operating Modes

### 1. **Full AI Mode** (con OpenAI API Key)
- RAG + OpenAI GPT-4o-mini
- Risposte IA complete con dati ISPRA reali
- Contesto marino specializzato

### 2. **Enhanced Mock Mode** (senza API Key)
- RAG + Mock intelligente
- Dati ISPRA simulati ma realistici
- Perfetto per sviluppo e demo

### 3. **Fallback Mode**
- Mock responses semplici
- Backup in caso di errori sistema

## Performance & Monitoring

- **Aggiornamenti automatici**: Dati marini ogni 15 minuti
- **Cache intelligente**: Riduce chiamate API
- **Error handling**: Fallback robusti
- **Type safety**: TypeScript completo

## Note di sviluppo / Development Notes

- Design system basato su ocean gradient e temi marini
- Supporto completo per screen reader e navigazione da tastiera
- Animazioni rispettano `prefer-reduced-motion`
- Font stack ottimizzato per leggibilità
- Sistema RAG modulare ed estensibile
- Integrazione ISPRA pronta per dati reali

## Esempi d'uso / Usage Examples

```javascript
// Esempio query con RAG
"Qual è la temperatura del mare oggi?"
→ Recupera dati reali da RON + risposta IA

// Quick question
Click "🌡️ Temperatura marina" 
→ Dati temperatura automatici

// Query complessa
"Analizza la qualità delle acque nel Tirreno"
→ RAG multi-source + analisi IA dettagliata
```