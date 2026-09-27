import hmac
import hashlib
import base64
import time
from typing import Optional
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

security = HTTPBearer(auto_error=False)

def create_admin_token(username: str) -> str:
    # Payload: username:timestamp:expiry
    now = int(time.time())
    expiry = now + (24 * 3600)  # 24 hours
    payload = f"{username}:{now}:{expiry}"
    signature = hmac.new(
        settings.SECRET_KEY.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    raw = f"{payload}:{signature}"
    return base64.urlsafe_b64encode(raw.encode()).decode()

def verify_admin_token(token: str) -> Optional[str]:
    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        parts = decoded.split(":")
        if len(parts) != 4:
            return None
        username, created_at, expiry, signature = parts
        expected_sig = hmac.new(
            settings.SECRET_KEY.encode(),
            f"{username}:{created_at}:{expiry}".encode(),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(signature, expected_sig):
            return None

        if int(expiry) < int(time.time()):
            return None

        return username
    except Exception:
        return None

def get_current_admin(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> str:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username = verify_admin_token(credentials.credentials)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired admin session token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username
