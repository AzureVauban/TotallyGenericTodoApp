# backend/otp/otp_service.py
import random
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))

def send_otp_email(recipient_email, otp_code):
    """Send OTP via SendGrid"""
    message = Mail(
        from_email='no-reply@yourdomain.com',
        to_emails=recipient_email,
        subject='Your DivideNDo OTP Code',
        html_content=f"""
        <html>
        <body>
          <h2>Your OTP Code:</h2>
          <p><strong>{otp_code}</strong></p>
          <p>Enter this code to complete your login process.</p>
        </body>
        </html>
        """
    )
    
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False