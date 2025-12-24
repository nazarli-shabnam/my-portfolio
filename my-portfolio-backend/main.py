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
    origins = [origin.strip()
               for origin in allowed_origins_env.split(",") if origin.strip()]
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

# Log startup information
print("=" * 50)
print("🚀 Portfolio Backend API Starting...")
print("=" * 50)
print(f"📝 Service: Shabnam Portfolio API")
print(f"🌐 CORS Origins: {origins}")
print(
    f"📧 SendGrid configured: {'✅ Yes' if os.getenv('SENDGRID_API_KEY') else '❌ No'}")
print(
    f"📬 Notification email: {os.getenv('NOTIFICATION_EMAIL', 'shabnamnezerli@gmail.com (default)')}")
print("=" * 50)


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
        print("=" * 50)
        print("📧 CONTACT FORM SUBMISSION RECEIVED")
        print("=" * 50)

        message_data = payload.dict()
        print(f"👤 Name: {message_data['name']}")
        print(f"📮 Email: {message_data['email']}")
        print(f"📋 Reason: {message_data['reason']}")
        print(f"💬 Message: {message_data['message']}")
        print("-" * 50)

        # Send email notification
        print("📤 Attempting to send email notification...")
        email_sent, email_error = send_contact_notification(
            sender_name=message_data['name'],
            sender_email=message_data['email'],
            reason=message_data['reason'],
            message=message_data['message'],
        )

        if email_sent:
            print("✅ Email notification sent successfully!")
        else:
            # Log warning but don't fail the request - message was still received
            print(f"⚠️  Email notification failed: {email_error}")
            print("ℹ️  Form submission still successful (email is optional)")
            # In production, you might want to log this to a monitoring service

        print("=" * 50)
        print("✅ Request processed successfully")
        print("=" * 50)

        # TODO: Later you can add:
        # - Save to database
        # - Rate limiting to prevent spam

        return {
            "success": True,
            "message": "Your message has been received. I'll get back to you soon!",
            "email_sent": email_sent
        }
    except Exception as e:
        # Log the error (in production, use proper logging)
        print("=" * 50)
        print("❌ ERROR PROCESSING CONTACT MESSAGE")
        print("=" * 50)
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        import traceback
        print("Traceback:")
        traceback.print_exc()
        print("=" * 50)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your message. Please try again later."
        )
