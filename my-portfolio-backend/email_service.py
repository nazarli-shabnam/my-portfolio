"""
Email notification service for contact form submissions.
Uses SendGrid for reliable email delivery.
"""
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from typing import Optional


def send_contact_notification(
    sender_name: str,
    sender_email: str,
    reason: str,
    message: str,
    recipient_email: Optional[str] = None,
) -> tuple[bool, Optional[str]]:
    """
    Send an email notification when someone submits the contact form.
    
    Args:
        sender_name: Name of the person who submitted the form
        sender_email: Email of the person who submitted the form
        reason: Reason for contact (collab, question, other)
        message: The message content
        recipient_email: Email address to send notification to (defaults to env var)
    
    Returns:
        Tuple of (success: bool, error_message: Optional[str])
    """
    # Get configuration from environment variables
    sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
    notification_email = recipient_email or os.getenv("NOTIFICATION_EMAIL", "shabnamnezerli@gmail.com")
    
    # Check if SendGrid is configured
    if not sendgrid_api_key:
        print("⚠️  SENDGRID_API_KEY not set. Email notification skipped.")
        return False, "Email service not configured"
    
    try:
        # Map reason to readable text
        reason_map = {
            "collab": "Collaboration / Offer",
            "question": "Question",
            "other": "Other",
        }
        reason_text = reason_map.get(reason, reason)
        
        # Create email content
        subject = f"New Contact Form Submission from {sender_name}"
        
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
        """
        
        # Create Mail object
        mail = Mail(
            from_email=os.getenv("SENDGRID_FROM_EMAIL", "noreply@portfolio.com"),
            to_emails=notification_email,
            subject=subject,
            html_content=html_content,
            plain_text_content=text_content,
        )
        
        # Add reply-to header so you can reply directly to the sender
        mail.reply_to = sender_email
        
        # Send email
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(mail)
        
        if response.status_code in [200, 201, 202]:
            print(f"✅ Email notification sent successfully to {notification_email}")
            return True, None
        else:
            error_msg = f"SendGrid returned status {response.status_code}"
            print(f"❌ Failed to send email: {error_msg}")
            return False, error_msg
            
    except Exception as e:
        error_msg = f"Error sending email: {str(e)}"
        print(f"❌ {error_msg}")
        return False, error_msg

