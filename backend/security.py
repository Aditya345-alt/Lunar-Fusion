import time
from typing import Optional, List, Dict, Tuple
from fastapi import Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database import get_connection
from auth import decode_access_token, ACCESS_COOKIE_NAME

security_scheme = HTTPBearer(auto_error=False)

# ── Rate Limiter ─────────────────────────────────────────────────────────────

class RateLimiter:
    """In-memory rate limiter tracking failed attempts per IP/key."""
    def __init__(self, max_attempts: int = 5, window_seconds: int = 300):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        # key -> list of timestamp floats
        self.attempts: Dict[str, List[float]] = {}

    def check(self, key: str):
        now = time.time()
        # Clean older attempts
        if key in self.attempts:
            self.attempts[key] = [t for t in self.attempts[key] if now - t < self.window_seconds]
            if len(self.attempts[key]) >= self.max_attempts:
                oldest = self.attempts[key][0]
                retry_after = int(self.window_seconds - (now - oldest)) + 1
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": f"Too many attempts. Please try again in {retry_after} seconds.",
                        "retry_after": retry_after
                    }
                )

    def record_failure(self, key: str):
        now = time.time()
        if key not in self.attempts:
            self.attempts[key] = []
        self.attempts[key].append(now)

    def reset(self, key: str):
        if key in self.attempts:
            del self.attempts[key]

# Instance for authentication endpoints
auth_rate_limiter = RateLimiter(max_attempts=6, window_seconds=300)

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

# ── Authentication Dependencies ─────────────────────────────────────────────

async def get_current_user(
    request: Request,
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> dict:
    token = None
    if auth_header and auth_header.credentials:
        token = auth_header.credentials
    elif ACCESS_COOKIE_NAME in request.cookies:
        token = request.cookies[ACCESS_COOKIE_NAME]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTHENTICATION_REQUIRED", "message": "Authentication required to access this resource."}
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "TOKEN_EXPIRED_OR_INVALID", "message": "Session has expired or is invalid. Please log in again."}
        )

    user_id = int(payload.get("sub"))
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, name, role, is_active, is_verified, created_at, last_login
    FROM users WHERE id = ?
    """, (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "USER_NOT_FOUND", "message": "User account no longer exists."}
        )

    if not row["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "ACCOUNT_DEACTIVATED", "message": "This account has been deactivated by an administrator."}
        )

    return dict(row)

async def get_optional_user(
    request: Request,
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Optional[dict]:
    try:
        return await get_current_user(request, auth_header)
    except HTTPException:
        return None

def require_role(allowed_roles: List[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role", "viewer")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "code": "FORBIDDEN",
                    "message": f"Insufficient role permissions. Required: {', '.join(allowed_roles)}; Your role: {user_role}."
                }
            )
        return current_user
    return role_checker
