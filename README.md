# NyayaSahayak Website - Initialization Guide

This project has two parts:

- `client` (React + Vite)
- `server` (Node.js + Express + Gemini API + MongoDB)

## 1. Prerequisites

Install these first:

- Node.js 18+ and npm
- MongoDB (local or remote URI)
- A Google Gemini API key

## 2. Clone / Open Project

Open this folder in VS Code:

- `mini project`

## 3. Setup Backend (server)

Open a terminal in the `server` folder and run:

```bash
npm install
```

Create a file named `.env` inside `server/` with the following values:

```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
EMBEDDING_MODEL=gemini-embedding-001
GENERATION_MODEL=gemini-2.0-flash
ENABLE_FALLBACK_ANALYSIS=true
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=nyayasahayak
```

Start backend:

```bash
npm run dev
```

Backend health check:

- http://localhost:3001/api/health

## 4. Setup Frontend (client)

Open another terminal in the `client` folder and run:

```bash
npm install
npm run dev
```

Frontend runs at:

- http://localhost:5173

The Vite proxy is already configured so frontend `/api` calls go to `http://localhost:3001`.

## 5. First Run Flow

1. Open `http://localhost:5173`
2. Create an account (Sign Up)
3. Login
4. Submit case text or upload a PDF
5. View generated legal analysis and history

## 6. Common Issues

- `GEMINI_API_KEY is missing in .env`:
  Add a valid key in `server/.env`.
- `Port 3001 is already in use`:
  Change `PORT` in `server/.env` or stop the process using that port.
- Mongo connection errors:
  Verify `MONGODB_URI` and that MongoDB is running.
- API calls fail from frontend:
  Make sure backend is running before starting analysis.

## 7. Production Notes

- Set a strong `JWT_SECRET`
- Restrict CORS origins
- Use secure MongoDB credentials
- Run with `npm start` on server after testing

## 8. Architecture (Node.js RAG Pipeline)

This project implements RAG in the Node.js backend (`server`) using Express + Gemini models.

### Request Path

1. User sends case details (text or PDF) from the frontend.
2. Backend endpoint `/api/analyze` validates auth and input.
3. If input is PDF, text is extracted before analysis.
4. Query text is embedded and matched against stored legal case embeddings.
5. Top similar cases are injected into a structured prompt.
6. Gemini generates JSON analysis (summary, provisions, similar cases, disclaimer).
7. Analysis is saved to user history and returned to the client.

### Retrieval Layer

- Sample legal cases are embedded once during startup.
- Vectors are cached in `server/vectorStore/vectorData.json`.
- Similarity search uses cosine similarity over embedding vectors.

### Generation Layer

- Embedding model default: `gemini-embedding-001`
- Generation model default: `gemini-2.0-flash`
- The generation response is forced/parsing-validated as JSON.

### Fallback Behavior

If vector search or model quota/rate limits fail (and `ENABLE_FALLBACK_ANALYSIS=true`), backend returns a retrieval-based fallback analysis so the app remains usable.

### Key Backend Files

- `server/routes/analyzeRoute.js` - analyze endpoint, validation, save history
- `server/services/ragService.js` - orchestrates retrieval + prompt + generation/fallback
- `server/services/geminiService.js` - embedding + generation calls to Gemini
- `server/vectorStore/VectorStore.js` - vector cache, cosine search
- `server/prompts/analysisPrompt.js` - final prompt template

## 9. Add Cases From PDF/TXT Files

If you have raw case files in PDF or TXT format, use the importer pipeline:

1. Copy files to `server/data/import/`
2. Run importer from `server/`:

```bash
npm run import:cases
```

This generates/updates `server/data/importedCases.json`.

3. Restart backend:

```bash
npm run dev
```

The backend now resumes embedding automatically from cached progress.

4. Optional full rebuild (only when needed):

- Delete `server/vectorStore/vectorData.json` only if you want a complete re-embed from zero.

### Notes

- Imported entries are merged with `server/data/sampleCases.js` at startup.
- If embedding quota is hit mid-run, restart later and embedding resumes from remaining cases.
- For best retrieval quality, review imported records in `server/data/importedCases.json` and improve:
  - `caseTitle`
  - `legalReasoning`
  - `decision`
  - `relevantSections`
