import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from email_service import send_contact_notification

app = FastAPI(title="Shabnam Portfolio API")

# Get allowed origins from environment variable (for Render/production)
# Format: "http://localhost:5500,https://shabnamnazarli.ufazien.com,https://your-frontend-domain.com"
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
    # Log for debugging (remove in production or use proper logging)
    print(f"✅ CORS Origins from environment: {origins}")
else:
    # Default origins for local development
    origins = [
        "http://localhost:5500",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "https://shabnamnazarli.ufazien.com",
    ]
    print(f"⚠️  Using default CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


class ContactMessage(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    reason: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=2000)


@app.get("/")
def root():
    return {
        "service": "Shabnam Portfolio API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "contact": "/contact (POST)",
            "docs": "/docs",
            "openapi": "/openapi.json"
        }
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "portfolio-api"}


@app.post("/contact")
async def contact(payload: ContactMessage):
    try:
        # Log the message (in production, you might want to use proper logging)
        message_data = payload.dict()
        print(f"New contact message from {message_data['name']} ({message_data['email']})")
        print(f"Reason: {message_data['reason']}")
        print(f"Message: {message_data['message']}")
        
        # Send email notification
        email_sent, email_error = send_contact_notification(
            sender_name=message_data['name'],
            sender_email=message_data['email'],
            reason=message_data['reason'],
            message=message_data['message'],
        )
        
        if not email_sent:
            # Log warning but don't fail the request - message was still received
            print(f"⚠️  Email notification failed: {email_error}")
            # In production, you might want to log this to a monitoring service
        
        # TODO: Later you can add:
        # - Save to database
        # - Rate limiting to prevent spam
        
        return {
            "success": True,
            "message": "Your message has been received. I'll get back to you soon!"
        }
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error processing contact message: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your message. Please try again later."
        )
