# backend/otp/__init__.py
from .otp_service import generate_otp, send_otp_email

__all__ = ["generate_otp", "send_otp_email"]