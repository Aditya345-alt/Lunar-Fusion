import os
import secrets
import hashlib
import sqlite3
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple, List, Any
import bcrypt
import jwt
from fastapi import Response, Request

from database import get_connection

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "lunar-fusion-jwt-secret-key-2026-sih-isro-demo")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_EXPIRE_MINUTES", "15"))
JWT_REFRESH_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_EXPIRE_DAYS", "7"))
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"

ACCESS_COOKIE_NAME = "lunar_fusion_access"
REFRESH_COOKIE_NAME = "lunar_fusion_refresh"

# ── Password Hashing ─────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

# ── JWT Generation & Verification ───────────────────────────────────────────

def create_access_token(user_id: int, email: str, role: str, expires_minutes: Optional[int] = None) -> str:
    exp_mins = expires_minutes or JWT_ACCESS_EXPIRE_MINUTES
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=exp_mins)
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp())
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except jwt.PyJWTError:
        return None

# ── Refresh Tokens & Sessions ───────────────────────────────────────────────

def generate_refresh_token() -> str:
    return secrets.token_urlsafe(48)

def create_session(user_id: int, refresh_token: str, user_agent: Optional[str] = None, ip_address: Optional[str] = None) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    token_h = hash_token(refresh_token)
    now = datetime.now(timezone.utc)
    expires = now + timedelta(days=JWT_REFRESH_EXPIRE_DAYS)
    
    cursor.execute("""
    INSERT INTO sessions (user_id, token_hash, expires_at, created_at, user_agent, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, token_h, expires.isoformat(), now.isoformat(), user_agent, ip_address))
    
    conn.commit()
    session_id = cursor.lastrowid
    conn.close()
    return session_id

def validate_refresh_session(refresh_token: str) -> Optional[sqlite3.Row]:
    conn = get_connection()
    cursor = conn.cursor()
    token_h = hash_token(refresh_token)
    now_iso = datetime.now(timezone.utc).isoformat()
    
    cursor.execute("""
    SELECT s.id as session_id, s.user_id, s.expires_at, s.revoked_at,
           u.id, u.email, u.name, u.role, u.is_active, u.is_verified
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ? AND u.is_active = 1
    """, (token_h, now_iso))
    row = cursor.fetchone()
    conn.close()
    return row

def revoke_session_by_token(refresh_token: str):
    conn = get_connection()
    cursor = conn.cursor()
    token_h = hash_token(refresh_token)
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE sessions SET revoked_at = ? WHERE token_hash = ?", (now_iso, token_h))
    conn.commit()
    conn.close()

def revoke_session_by_id(session_id: int, user_id: Optional[int] = None):
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    if user_id is not None:
        cursor.execute("UPDATE sessions SET revoked_at = ? WHERE id = ? AND user_id = ?", (now_iso, session_id, user_id))
    else:
        cursor.execute("UPDATE sessions SET revoked_at = ? WHERE id = ?", (now_iso, session_id))
    conn.commit()
    conn.close()

def revoke_other_sessions(user_id: int, current_refresh_token: str):
    conn = get_connection()
    cursor = conn.cursor()
    token_h = hash_token(current_refresh_token)
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("""
    UPDATE sessions SET revoked_at = ?
    WHERE user_id = ? AND token_hash != ? AND revoked_at IS NULL
    """, (now_iso, user_id, token_h))
    conn.commit()
    conn.close()

def revoke_all_user_sessions(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL", (now_iso, user_id))
    conn.commit()
    conn.close()

def get_active_sessions(user_id: int, current_refresh_token: Optional[str] = None) -> list:
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    current_h = hash_token(current_refresh_token) if current_refresh_token else None
    
    cursor.execute("""
    SELECT id, user_agent, ip_address, created_at, expires_at, token_hash
    FROM sessions
    WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
    ORDER BY created_at DESC
    """, (user_id, now_iso))
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "user_agent": r["user_agent"],
            "ip_address": r["ip_address"],
            "created_at": r["created_at"],
            "expires_at": r["expires_at"],
            "is_current": (current_h is not None and r["token_hash"] == current_h)
        })
    return results

# ── Email Verification & Password Reset ─────────────────────────────────────

def create_email_verification_token(user_id: int, expires_hours: int = 24) -> str:
    raw_token = secrets.token_urlsafe(32)
    token_h = hash_token(raw_token)
    now = datetime.now(timezone.utc)
    expires = now + timedelta(hours=expires_hours)
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO email_verifications (user_id, token_hash, expires_at, created_at)
    VALUES (?, ?, ?, ?)
    """, (user_id, token_h, expires.isoformat(), now.isoformat()))
    conn.commit()
    conn.close()
    return raw_token

def verify_email_token(raw_token: str) -> Optional[int]:
    conn = get_connection()
    cursor = conn.cursor()
    token_h = hash_token(raw_token)
    now_iso = datetime.now(timezone.utc).isoformat()
    
    cursor.execute("""
    SELECT id, user_id FROM email_verifications
    WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
    """, (token_h, now_iso))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
        
    verif_id = row["id"]
    user_id = row["user_id"]
    
    cursor.execute("UPDATE email_verifications SET used_at = ? WHERE id = ?", (now_iso, verif_id))
    cursor.execute("UPDATE users SET is_verified = 1, updated_at = ? WHERE id = ?", (now_iso, user_id))
    conn.commit()
    conn.close()
    return user_id

def create_password_reset_token(user_id: int, expires_minutes: int = 30) -> str:
    raw_token = secrets.token_urlsafe(32)
    token_h = hash_token(raw_token)
    now = datetime.now(timezone.utc)
    expires = now + timedelta(minutes=expires_minutes)
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO password_resets (user_id, token_hash, expires_at, created_at)
    VALUES (?, ?, ?, ?)
    """, (user_id, token_h, expires.isoformat(), now.isoformat()))
    conn.commit()
    conn.close()
    return raw_token

def verify_and_use_password_reset_token(raw_token: str, new_password_hash: str) -> Optional[int]:
    conn = get_connection()
    cursor = conn.cursor()
    token_h = hash_token(raw_token)
    now_iso = datetime.now(timezone.utc).isoformat()
    
    cursor.execute("""
    SELECT id, user_id FROM password_resets
    WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
    """, (token_h, now_iso))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
        
    reset_id = row["id"]
    user_id = row["user_id"]
    
    cursor.execute("UPDATE password_resets SET used_at = ? WHERE id = ?", (now_iso, reset_id))
    cursor.execute("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?", (new_password_hash, now_iso, user_id))
    # Revoke all existing sessions on password reset for security
    cursor.execute("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL", (now_iso, user_id))
    conn.commit()
    conn.close()
    return user_id

# ── Cookie Handlers ─────────────────────────────────────────────────────────

def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    # Short-lived access token cookie
    response.set_cookie(
        key=ACCESS_COOKIE_NAME,
        value=access_token,
        max_age=JWT_ACCESS_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/"
    )
    # Long-lived refresh token cookie
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        max_age=JWT_REFRESH_EXPIRE_DAYS * 86400,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/api/auth"
    )

def clear_auth_cookies(response: Response):
    response.delete_cookie(key=ACCESS_COOKIE_NAME, path="/")
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/api/auth")

# ── Email Dispatcher ─────────────────────────────────────────────────────────

def send_transactional_email(to_email: str, subject: str, body: str):
    api_key = os.getenv("EMAIL_API_KEY")
    email_from = os.getenv("EMAIL_FROM", "auth@lunarfusion.isro.gov.in")
    
    if api_key:
        try:
            import urllib.request
            import json
            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=json.dumps({
                    "from": email_from,
                    "to": [to_email],
                    "subject": subject,
                    "text": body
                }).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=5) as res:
                print(f"[EMAIL] Sent email to {to_email} via Resend. Status: {res.status}")
                return
        except Exception as e:
            print(f"[WARN] Resend email failed: {e}. Falling back to console log.")
            
    # Local development logging
    print(f"\n{'='*60}\n[LOCAL EMAIL DISPATCH - DEV LOG]\nTO: {to_email}\nSUBJECT: {subject}\n{body}\n{'='*60}\n")
