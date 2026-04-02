# Nyaay Sahayak - Hybrid RAG Application

Nyaay Sahayak is a generalized legal-analysis platform with a hybrid architecture:

- client: React + Vite
- server: Node.js + Express + MongoDB
- rag_service: Python + FastAPI + FAISS + LangChain

The frontend talks to the Node server for auth, history, and upload handling. The Node server forwards analysis requests to the Python RAG service.

## 1. Current Features

- Email/password signup and login
- Google sign-in
- Forgot password with real email OTP delivery (SMTP)
- Protected case analysis from text or PDF
- User-specific analysis history
- Landing page with rotating featured legal updates

## 2. Project Structure

- client/
- server/
- rag_service/

## 3. Environment Setup

Create server/.env:

```env
PORT=3002
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d

MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=nyayasahayak

# Used by rag_service
GEMINI_API_KEY=your_gemini_api_key_here

# Google auth
GOOGLE_CLIENT_ID=your_google_oauth_web_client_id

# Optional Node -> Python endpoint override
PYTHON_RAG_URL=http://localhost:8000/analyze

# Password reset OTP
PASSWORD_RESET_TTL_MINUTES=20

# Email provider: smtp or sendgrid
EMAIL_PROVIDER=smtp
APP_NAME=Nyaay Sahayak
APP_BASE_URL=http://localhost:5173
MAIL_FROM="Nyaay Sahayak <no-reply@example.com>"

# SMTP settings (required if EMAIL_PROVIDER=smtp)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password

```

Create client/.env:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id
```

## 4. Install Dependencies

Server:

```bash
cd server
npm install
```

Client:

```bash
cd client
npm install
```

Python service:

```bash
.venv\Scripts\python.exe -m pip install -r rag_service/requirements.txt
```

## 5. Build or Refresh FAISS Index

Run after case data updates:

```bash
.venv\Scripts\python.exe -u rag_service/ingest.py
```

## 6. Run the App

Start Python RAG service first, then Node API, then client.

Start Python RAG service (Windows cmd):

```cmd
cd server
npm run rag:dev
```

Start Node API:

```bash
cd server
npm run dev
```

Start frontend:

```bash
cd client
npm run dev
```

Current dev networking:

- client runs on http://localhost:5173
- Vite proxies /api to http://localhost:3002
- rag_service runs on http://localhost:8000

## 7. API Surface

Auth routes:

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/google
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET /api/auth/me
- PATCH /api/auth/me

Analysis and history routes:

- POST /api/analyze (requires bearer token)
- GET /api/history (requires bearer token)
- GET /api/health

## 8. Analysis Request Flow

1. Client submits text or PDF.
2. Node validates auth and input.
3. Node extracts PDF text if file input is used.
4. Node sends normalized request to Python RAG.
5. Python returns structured legal-analysis JSON.
6. Node returns response and stores history in MongoDB.

## 9. Forgot Password OTP Flow

1. User submits email on forgot-password screen.
2. Server creates a 6-digit OTP, hashes it, stores expiry.
3. OTP is sent via configured EMAIL_PROVIDER.
4. User submits OTP + new password.
5. Server verifies OTP and updates password hash.

No OTP or raw reset token is returned in API responses.

## 10. Troubleshooting

- Forgot-password returns 503:
  Email provider config is invalid or not loaded. Recheck server/.env and restart Node.
- SMTP with Gmail fails:
  Use an app password and verify SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT.
- /api/auth/forgot-password returns 404:
  You are running an old server process on port 3002. Restart the server.
- Analyze fails while server is healthy:
  Verify Python RAG service is running on http://localhost:8000.
- Gemini key errors:
  Ensure GEMINI_API_KEY is present for rag_service startup.

## 11. Main Files

- server/routes/authRoute.js
- server/routes/analyzeRoute.js
- server/routes/historyRoute.js
- server/services/authService.js
- server/services/emailService.js
- server/services/ragService.js
- rag_service/app.py
- rag_service/rag_pipeline.py
- rag_service/ingest.py
