# Portfolio Backend API

Minimal FastAPI backend for the portfolio (health check, CORS). Contact form is handled by **Web3Forms** on the frontend; no email is sent from this backend.

## Setup

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

API: `http://localhost:8000`

## Endpoints

- **GET /** — Service info.
- **GET /health** — Health check.

## Environment variables

- `ALLOWED_ORIGINS` — Comma-separated frontend origins for CORS (e.g. `https://your-site.onrender.com`). Optional for local dev.

## Deploy on Render

1. New **Web Service**, repo, **Root Directory**: `my-portfolio-backend`.
2. **Build:** `pip install --upgrade pip && pip install -r requirements.txt`
3. **Start:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Environment:** Set `ALLOWED_ORIGINS` to your frontend URL if needed.
