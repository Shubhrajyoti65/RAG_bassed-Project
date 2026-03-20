# Nyaay_Sahayak - Hybrid RAG Setup Guide

Nyaay_Sahayak now uses a hybrid architecture:

- client: React + Vite
- server: Node.js + Express + MongoDB (auth, routing, PDF extraction, history)
- rag_service: Python + FastAPI + LangChain + FAISS + SentenceTransformers (RAG)

Node handles API/auth/upload. Python handles retrieval and generation.

## 1. Prerequisites

- Node.js 18+ and npm
- Python 3.10+ (project currently tested with 3.13)
- MongoDB (local or remote URI)
- Google Gemini API key

## 2. Project Structure

- client/
- server/
- rag_service/

## 3. Environment

Create server/.env with values like:

```env
PORT=3001
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=nyayasahayak

# Used by Python rag_service at runtime
GEMINI_API_KEY=your_gemini_api_key_here

# Optional Node -> Python endpoint override
PYTHON_RAG_URL=http://localhost:8000/analyze
```

Notes:

- Node no longer uses local embedding or prompt-generation config.
- Python service requires GEMINI_API_KEY in process environment.

## 4. Install Dependencies

### Node (server)

```bash
cd server
npm install
```

### Node (client)

```bash
cd client
npm install
```

### Python (rag_service)

From project root:

```bash
.venv\Scripts\python.exe -m pip install -r rag_service/requirements.txt
```

If .venv does not exist, create it first and then install.

## 5. Build FAISS Index (One-time or after data updates)

From project root:

```bash
.venv\Scripts\python.exe -u rag_service/ingest.py
```

This creates:

- rag_service/faiss_index/index.faiss
- rag_service/faiss_index/index.pkl

Data source for ingestion:

- server/data/sampleCases.js
- server/data/importedCases.json

Chunking and embeddings:

- chunk size: 700
- overlap: 100
- embeddings: all-MiniLM-L6-v2

## 6. Run Services

Start Python RAG API first, then Node, then client.

### 6.1 Start Python RAG API (Windows cmd)

```cmd
for /f "tokens=1,* delims==" %A in ('findstr /B /C:"GEMINI_API_KEY=" server\.env') do set GEMINI_API_KEY=%B && .venv\Scripts\python.exe -m uvicorn rag_service.app:app --host 127.0.0.1 --port 8000
```

### 6.2 Start Node API

```bash
cd server
npm start
```

### 6.3 Start Frontend

```bash
cd client
npm run dev
```

## 7. Request Flow (Current)

1. User submits text or PDF from frontend.
2. Node endpoint POST /api/analyze validates auth and payload.
3. If file is PDF, Node extracts text in server/services/pdfService.js.
4. Node sends text to Python POST /analyze.
5. Python RAG pipeline:
   - loads FAISS index
   - retrieves top-k chunks (k=5)
   - calls LLM with strict JSON prompt (temperature=0)
6. Python returns structured JSON.
7. Node returns JSON to frontend and stores history.

## 8. Required Output Schema

Python returns JSON with this shape:

```json
{
  "summary": "...",
  "legalProvisions": [
    {
      "section": "...",
      "act": "...",
      "relevance": "..."
    }
  ],
  "similarCases": [
    {
      "caseTitle": "...",
      "year": 2020,
      "caseNumber": "...",
      "similarityScore": 0,
      "keyParallels": "...",
      "decision": "..."
    }
  ],
  "disclaimer": "..."
}
```

## 9. Add New Case Files

To add more case documents:

1. Put files in server/data/import/
2. Run:

```bash
cd server
npm run import:cases
```

3. Re-run Python ingestion:

```bash
cd ..
.venv\Scripts\python.exe -u rag_service/ingest.py
```

## 10. Troubleshooting

- 500 with error "GEMINI_API_KEY is required":
  Python service is running without GEMINI_API_KEY in its environment.
- 500 with quota/rate-limit errors:
  Gemini quota is exhausted. Wait/reset quota or use a different key/model tier.
- 503 from Node analyze:
  FAISS index not found. Run rag_service/ingest.py.
- Node healthy but analyze fails:
  Ensure Python service is running on http://localhost:8000.

## 11. Key Files

- server/routes/analyzeRoute.js
- server/services/ragService.js
- server/services/pdfService.js
- rag_service/app.py
- rag_service/rag_pipeline.py
- rag_service/ingest.py
