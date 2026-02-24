"""
Email notification service for contact form submissions.
Supports EmailJS, SMTP2GO, or SendGrid (set env vars for the one you use).

- EmailJS: no domain needed; create a template in dashboard, use service/template/user IDs.
- SMTP2GO: free 200/day, 1000/month; may require verified domain.
- SendGrid: free tier often 100/day with possible time/credit limits.
"""
import json
import os
import urllib.request
import urllib.error
from typing import Optional

# Optional SendGrid import – only needed if using SendGrid
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail
except ImportError:
    SendGridAPIClient = None
    Mail = None


def _reason_text(reason: str) -> str:
    reason_map = {"collab": "Collaboration / Offer", "question": "Question", "other": "Other"}
    return reason_map.get(reason, reason)


def _build_email_content(sender_name: str, sender_email: str, reason_text: str, message: str) -> tuple[str, str]:
    """Return (html_content, text_content) for the notification email."""
    html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>From:</strong> {sender_name}</p>
                    <p><strong>Email:</strong> <a href="mailto:{sender_email}">{sender_email}</a></p>
                    <p><strong>Reason:</strong> {reason_text}</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #7c3aed; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Message:</h3>
                    <p style="white-space: pre-wrap;">{message}</p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                    <p>This is an automated notification from your portfolio contact form.</p>
                    <p>Reply directly to: <a href="mailto:{sender_email}">{sender_email}</a></p>
                </div>
            </div>
        </body>
        </html>
        """
    text_content = f"""
New Contact Form Submission

From: {sender_name}
Email: {sender_email}
Reason: {reason_text}

Message:
{message}

---
This is an automated notification from your portfolio contact form.
Reply directly to: {sender_email}
        """.strip()
    return html_content, text_content


def _send_via_emailjs(
    to_email: str,
    subject: str,
    from_name: str,
    from_email: str,
    reason_text: str,
    message: str,
) -> tuple[bool, Optional[str]]:
    """Send via EmailJS REST API. Uses a template; pass template_params."""
    service_id = (os.getenv("EMAILJS_SERVICE_ID") or "").strip()
    template_id = (os.getenv("EMAILJS_TEMPLATE_ID") or "").strip()
    user_id = (os.getenv("EMAILJS_USER_ID") or "").strip()
    access_token = (os.getenv("EMAILJS_ACCESS_TOKEN") or "").strip()
    if not service_id or not template_id or not user_id:
        return False, "EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_USER_ID are required"

    payload = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": user_id,
        "template_params": {
            "to_email": to_email,
            "subject": subject,
            "from_name": from_name,
            "from_email": from_email,
            "reply_to": from_email,
            "reason": reason_text,
            "message": message,
        },
    }
    if access_token:
        payload["accessToken"] = access_token

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.emailjs.com/api/v1.0/email/send",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            if 200 <= r.status < 300:
                return True, None
            body = r.read().decode("utf-8", errors="replace")
            return False, body or f"HTTP {r.status}"
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8", errors="replace")
        except Exception:
            pass
        return False, body or f"HTTP {e.code} {e.reason}"
    except Exception as e:
        return False, str(e)


def _send_via_smtp2go(
    from_email: str,
    to_email: str,
    reply_to: str,
    subject: str,
    html_content: str,
    text_content: str,
) -> tuple[bool, Optional[str]]:
    """Send via SMTP2GO API. No extra dependency (uses urllib)."""
    api_key = (os.getenv("SMTP2GO_API_KEY") or "").strip()
    if not api_key:
        return False, "SMTP2GO_API_KEY not set"

    payload = {
        "sender": from_email,
        "to": [to_email],
        "subject": subject,
        "html_body": html_content,
        "text_body": text_content,
        "custom_headers": [{"header": "Reply-To", "value": reply_to}],
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.smtp2go.com/v3/email/send",
        data=data,
        headers={
            "Content-Type": "application/json",
            "X-Smtp2go-Api-Key": api_key,
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as r:
            result = json.loads(r.read().decode("utf-8"))
            if result.get("data", {}).get("succeeded", 0) >= 1:
                return True, None
            failures = result.get("data", {}).get("failures", [])
            err = failures[0] if failures else result.get("data", {}).get("error", "Unknown error")
            return False, str(err)
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8", errors="replace")
        except Exception:
            pass
        try:
            data = json.loads(body) if body else {}
            err = data.get("data", {}).get("error", body or f"HTTP {e.code}")
        except Exception:
            err = body or f"HTTP {e.code} {e.reason}"
        return False, str(err)
    except Exception as e:
        return False, str(e)


def _send_via_sendgrid(
    from_email: str,
    to_email: str,
    reply_to: str,
    subject: str,
    html_content: str,
    text_content: str,
    api_key: str,
) -> tuple[bool, Optional[str]]:
    """Send via SendGrid API."""
    if not SendGridAPIClient or not Mail:
        return False, "SendGrid package not installed"

    mail = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=html_content,
        plain_text_content=text_content,
    )
    mail.reply_to = reply_to
    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(mail)
        if response.status_code in [200, 201, 202]:
            return True, None
        return False, f"SendGrid returned status {response.status_code}"
    except Exception as e:
        return False, str(e)


def send_contact_notification(
    sender_name: str,
    sender_email: str,
    reason: str,
    message: str,
    recipient_email: Optional[str] = None,
) -> tuple[bool, Optional[str]]:
    """
    Send an email notification when someone submits the contact form.
    Uses SMTP2GO if SMTP2GO_API_KEY is set, otherwise SendGrid if SENDGRID_API_KEY is set.

    From: verified sender (env). To: your inbox. Reply-To: form submitter.
    """
    notification_email = recipient_email or os.getenv("NOTIFICATION_EMAIL", "shabnamnezerli@gmail.com")
    reason_text = _reason_text(reason)
    subject = f"New Contact Form Submission from {sender_name}"
    html_content, text_content = _build_email_content(sender_name, sender_email, reason_text, message)

    # Provider selection: EmailJS first, then SMTP2GO, then SendGrid
    emailjs_service = (os.getenv("EMAILJS_SERVICE_ID") or "").strip()
    emailjs_template = (os.getenv("EMAILJS_TEMPLATE_ID") or "").strip()
    emailjs_user = (os.getenv("EMAILJS_USER_ID") or "").strip()
    smtp2go_key = (os.getenv("SMTP2GO_API_KEY") or "").strip()
    sendgrid_key = (os.getenv("SENDGRID_API_KEY") or "").strip()

    if emailjs_service and emailjs_template and emailjs_user:
        print("🔍 Using EmailJS for email...")
        print(f"   EMAILJS_SERVICE_ID: ✅  |  NOTIFICATION_EMAIL: {notification_email}")
        success, err = _send_via_emailjs(
            to_email=notification_email,
            subject=subject,
            from_name=sender_name,
            from_email=sender_email,
            reason_text=reason_text,
            message=message,
        )
        if success:
            print(f"✅ Email notification sent via EmailJS to {notification_email}")
        else:
            print(f"❌ EmailJS failed: {err}")
        return success, err

    if smtp2go_key:
        from_email = os.getenv("SMTP2GO_FROM_EMAIL") or os.getenv("SENDGRID_FROM_EMAIL") or notification_email
        print("🔍 Using SMTP2GO for email...")
        print(f"   SMTP2GO_API_KEY: ✅ Set  |  NOTIFICATION_EMAIL: {notification_email}")
        print(f"   From: {from_email}  |  Reply-To: (submitter)")
        success, err = _send_via_smtp2go(
            from_email=from_email,
            to_email=notification_email,
            reply_to=sender_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content,
        )
        if success:
            print(f"✅ Email notification sent via SMTP2GO to {notification_email}")
        else:
            print(f"❌ SMTP2GO failed: {err}")
        return success, err

    if sendgrid_key:
        from_email = os.getenv("SENDGRID_FROM_EMAIL", "noreply@portfolio.com")
        print("🔍 Using SendGrid for email...")
        print(f"   SENDGRID_API_KEY: ✅ Set  |  NOTIFICATION_EMAIL: {notification_email}")
        print(f"   SENDGRID_FROM_EMAIL: {from_email}")
        success, err = _send_via_sendgrid(
            from_email=from_email,
            to_email=notification_email,
            reply_to=sender_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content,
            api_key=sendgrid_key,
        )
        if success:
            print(f"✅ Email notification sent via SendGrid to {notification_email}")
        else:
            print(f"❌ SendGrid failed: {err}")
        return success, err

    print("⚠️  No email provider configured. Set EmailJS (SERVICE_ID, TEMPLATE_ID, USER_ID), SMTP2GO_API_KEY, or SENDGRID_API_KEY on Render.")
    return False, "Email service not configured"
