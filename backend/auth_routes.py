import os
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Request, Response, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from database import get_connection
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    generate_refresh_token,
    create_session,
    validate_refresh_session,
    revoke_session_by_token,
    revoke_session_by_id,
    revoke_other_sessions,
    revoke_all_user_sessions,
    get_active_sessions,
    create_email_verification_token,
    verify_email_token,
    create_password_reset_token,
    verify_and_use_password_reset_token,
    set_auth_cookies,
    clear_auth_cookies,
    send_transactional_email,
    JWT_ACCESS_EXPIRE_MINUTES,
    REFRESH_COOKIE_NAME,
    ACCESS_COOKIE_NAME,
)
from schemas import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    ChangePasswordRequest,
    AdminUpdateUserRoleRequest,
    AdminUpdateUserStatusRequest,
)
from security import (
    auth_rate_limiter,
    get_client_ip,
    get_current_user,
    get_optional_user,
    require_role,
)

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])
admin_router = APIRouter(prefix="/api/admin", tags=["Admin Panel"])


# ── /api/auth Endpoints ───────────────────────────────────────────────────────

@auth_router.post("/login")
async def login(req: LoginRequest, request: Request, response: Response):
    client_ip = get_client_ip(request)
    auth_rate_limiter.check(client_ip)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, password_hash, name, role, is_active, is_verified, created_at, last_login
    FROM users WHERE email = ?
    """, (req.email,))
    user = cursor.fetchone()

    if not user or not verify_password(req.password, user["password_hash"]):
        conn.close()
        auth_rate_limiter.record_failure(client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTHENTICATION_FAILED", "message": "Invalid email or password."}
        )

    if not user["is_active"]:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "ACCOUNT_DEACTIVATED", "message": "This account has been deactivated by an administrator."}
        )

    auth_rate_limiter.reset(client_ip)

    # Update last login
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?", (now_iso, now_iso, user["id"]))
    conn.commit()
    conn.close()

    # Create tokens
    access_token = create_access_token(user["id"], user["email"], user["role"])
    user_agent = request.headers.get("User-Agent", "Unknown")
    refresh_token = generate_refresh_token()
    create_session(user["id"], refresh_token, user_agent, client_ip)

    set_auth_cookies(response, access_token, refresh_token)

    return {
        "success": True,
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": JWT_ACCESS_EXPIRE_MINUTES * 60,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "is_active": bool(user["is_active"]),
                "is_verified": bool(user["is_verified"]),
                "created_at": user["created_at"],
                "last_login": now_iso
            }
        }
    }


@auth_router.post("/register")
async def register(req: RegisterRequest, request: Request, response: Response):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (req.email,))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "EMAIL_ALREADY_REGISTERED", "message": "An account with this email address already exists."}
        )

    pw_hash = hash_password(req.password)
    now_iso = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
    INSERT INTO users (email, password_hash, name, role, is_active, is_verified, created_at, updated_at)
    VALUES (?, ?, ?, 'researcher', 1, 0, ?, ?)
    """, (req.email, pw_hash, req.name, now_iso, now_iso))
    conn.commit()
    new_user_id = cursor.lastrowid
    conn.close()

    # Generate verification token
    raw_token = create_email_verification_token(new_user_id)
    send_transactional_email(
        req.email,
        "Verify your Lunar Fusion Account",
        f"Welcome {req.name},\n\nPlease verify your Lunar Fusion account using the verification code:\n{raw_token}\n\nISRO SIH Mission Team"
    )

    access_token = create_access_token(new_user_id, req.email, "researcher")
    client_ip = get_client_ip(request)
    user_agent = request.headers.get("User-Agent", "Unknown")
    refresh_token = generate_refresh_token()
    create_session(new_user_id, refresh_token, user_agent, client_ip)

    set_auth_cookies(response, access_token, refresh_token)

    return {
        "success": True,
        "data": {
            "access_token": access_token,
            "verification_token_dev": raw_token,
            "user": {
                "id": new_user_id,
                "email": req.email,
                "name": req.name,
                "role": "researcher",
                "is_active": True,
                "is_verified": False,
                "created_at": now_iso,
                "last_login": None
            }
        }
    }


@auth_router.post("/verify-email")
async def verify_email(req: VerifyEmailRequest):
    user_id = verify_email_token(req.token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_TOKEN", "message": "Verification code is invalid or has expired."}
        )
    return {
        "success": True,
        "data": {"message": "Email address has been successfully verified."}
    }


@auth_router.post("/refresh")
async def refresh_session(request: Request, response: Response):
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        try:
            body = await request.json()
            token = body.get("refresh_token")
        except Exception:
            token = None

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "MISSING_REFRESH_TOKEN", "message": "No refresh token provided."}
        )

    session = validate_refresh_session(token)
    if not session:
        clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_SESSION", "message": "Refresh session has expired or is invalid."}
        )

    user_id = session["user_id"]
    email = session["email"]
    role = session["role"]

    new_access = create_access_token(user_id, email, role)

    response.set_cookie(
        key=ACCESS_COOKIE_NAME,
        value=new_access,
        max_age=JWT_ACCESS_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )

    return {
        "success": True,
        "data": {
            "access_token": new_access,
            "token_type": "bearer",
            "expires_in": JWT_ACCESS_EXPIRE_MINUTES * 60,
            "user": {
                "id": user_id,
                "email": email,
                "name": session["name"],
                "role": role,
                "is_active": bool(session["is_active"]),
                "is_verified": bool(session["is_verified"])
            }
        }
    }


@auth_router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "data": {"user": current_user}
    }


@auth_router.get("/sessions")
async def list_sessions(request: Request, current_user: dict = Depends(get_current_user)):
    current_token = request.cookies.get(REFRESH_COOKIE_NAME)
    sessions = get_active_sessions(current_user["id"], current_token)
    return {
        "success": True,
        "data": {"sessions": sessions}
    }


@auth_router.delete("/sessions/{session_id}")
async def revoke_session(session_id: int, current_user: dict = Depends(get_current_user)):
    revoke_session_by_id(session_id, current_user["id"])
    return {
        "success": True,
        "data": {"message": "Session terminated."}
    }


@auth_router.delete("/sessions")
async def revoke_all_other(request: Request, current_user: dict = Depends(get_current_user)):
    current_token = request.cookies.get(REFRESH_COOKIE_NAME) or ""
    revoke_other_sessions(current_user["id"], current_token)
    return {
        "success": True,
        "data": {"message": "All other active sessions have been terminated."}
    }


@auth_router.post("/change-password")
async def change_password(req: ChangePasswordRequest, request: Request, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM users WHERE id = ?", (current_user["id"],))
    row = cursor.fetchone()

    if not row or not verify_password(req.current_password, row["password_hash"]):
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_CURRENT_PASSWORD", "message": "Your current password does not match."}
        )

    new_hash = hash_password(req.new_password)
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?", (new_hash, now_iso, current_user["id"]))
    conn.commit()
    conn.close()

    current_token = request.cookies.get(REFRESH_COOKIE_NAME) or ""
    revoke_other_sessions(current_user["id"], current_token)

    return {
        "success": True,
        "data": {"message": "Password changed successfully."}
    }


@auth_router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email FROM users WHERE email = ?", (req.email,))
    user = cursor.fetchone()
    conn.close()

    if user:
        raw_token = create_password_reset_token(user["id"])
        send_transactional_email(
            user["email"],
            "Lunar Fusion - Password Reset Request",
            f"Hello {user['name']},\n\nA password reset request was received for your Lunar Fusion account.\nUse the following reset token:\n{raw_token}\n\nIf you did not request this, you can safely ignore this email."
        )

    return {
        "success": True,
        "data": {"message": "If an account exists with this email, a password reset link has been sent."}
    }


@auth_router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    new_pw_hash = hash_password(req.new_password)
    user_id = verify_and_use_password_reset_token(req.token, new_pw_hash)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_OR_EXPIRED_TOKEN", "message": "Password reset token is invalid or expired."}
        )
    return {
        "success": True,
        "data": {"message": "Password has been successfully reset. Please log in with your new password."}
    }


@auth_router.post("/logout")
async def logout(request: Request, response: Response):
    current_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if current_token:
        revoke_session_by_token(current_token)
    clear_auth_cookies(response)
    return {
        "success": True,
        "data": {"message": "Successfully logged out."}
    }


# ── /api/admin Endpoints ──────────────────────────────────────────────────────

@admin_router.get("/users")
async def admin_list_users(admin: dict = Depends(require_role(["admin"]))):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, name, role, is_active, is_verified, created_at, last_login
    FROM users ORDER BY id ASC
    """)
    rows = cursor.fetchall()
    conn.close()

    users = []
    for r in rows:
        users.append({
            "id": r["id"],
            "email": r["email"],
            "name": r["name"],
            "role": r["role"],
            "is_active": bool(r["is_active"]),
            "is_verified": bool(r["is_verified"]),
            "created_at": r["created_at"],
            "last_login": r["last_login"],
        })

    return {
        "success": True,
        "data": {"users": users}
    }


@admin_router.patch("/users/{user_id}/role")
async def admin_update_user_role(user_id: int, req: AdminUpdateUserRoleRequest, admin: dict = Depends(require_role(["admin"]))):
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE users SET role = ?, updated_at = ? WHERE id = ?", (req.role, now_iso, user_id))
    conn.commit()
    conn.close()
    return {
        "success": True,
        "data": {"message": f"User role updated to '{req.role}'."}
    }


@admin_router.patch("/users/{user_id}/status")
async def admin_update_user_status(user_id: int, req: AdminUpdateUserStatusRequest, admin: dict = Depends(require_role(["admin"]))):
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    status_int = 1 if req.is_active else 0
    cursor.execute("UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?", (status_int, now_iso, user_id))
    conn.commit()
    conn.close()

    if not req.is_active:
        revoke_all_user_sessions(user_id)

    status_str = "activated" if req.is_active else "deactivated"
    return {
        "success": True,
        "data": {"message": f"User account has been {status_str}."}
    }


@admin_router.get("/sessions")
async def admin_list_sessions(admin: dict = Depends(require_role(["admin"]))):
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("""
    SELECT s.id, s.user_id, s.user_agent, s.ip_address, s.created_at, s.expires_at,
           u.email, u.name, u.role
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.revoked_at IS NULL AND s.expires_at > ?
    ORDER BY s.created_at DESC
    """, (now_iso,))
    rows = cursor.fetchall()
    conn.close()

    sessions = []
    for r in rows:
        sessions.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "user_email": r["email"],
            "user_name": r["name"],
            "user_role": r["role"],
            "user_agent": r["user_agent"],
            "ip_address": r["ip_address"],
            "created_at": r["created_at"],
            "expires_at": r["expires_at"]
        })

    return {
        "success": True,
        "data": {"sessions": sessions}
    }


@admin_router.delete("/sessions/{session_id}")
async def admin_terminate_session(session_id: int, admin: dict = Depends(require_role(["admin"]))):
    revoke_session_by_id(session_id)
    return {
        "success": True,
        "data": {"message": "Session terminated by mission administrator."}
    }


@admin_router.get("/system")
async def admin_system_status(admin: dict = Depends(require_role(["admin"]))):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM users")
    user_cnt = cursor.fetchone()["cnt"]
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("SELECT COUNT(*) as cnt FROM sessions WHERE revoked_at IS NULL AND expires_at > ?", (now_iso,))
    active_sessions = cursor.fetchone()["cnt"]
    conn.close()

    return {
        "success": True,
        "data": {
            "status": "HEALTHY",
            "active_users": user_cnt,
            "active_sessions": active_sessions,
            "database": "SQLite (WAL Mode)",
            "auth_mode": "JWT (HS256) + HTTP-only Secure Refresh Cookies",
            "matcher": "OpenCV SIFT + Lowe Ratio + RANSAC",
            "server_time": now_iso,
            "version": "1.0.0-SIH-ISRO-DEMO"
        }
    }
