import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Shabnam Portfolio API")

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:5500",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "https://shabnamnazarli.ufazien.com",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "Shabnam Portfolio API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "openapi": "/openapi.json",
        },
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "portfolio-api"}
