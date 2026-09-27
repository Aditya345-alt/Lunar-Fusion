import re
from typing import Any, Optional, List
from pydantic import BaseModel, EmailStr, field_validator

def validate_password_strength(password: str) -> str:
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter.")
    if not re.search(r"[0-9]", password):
        raise ValueError("Password must contain at least one number.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValueError("Password must contain at least one special character (!@#$%^&*...).")
    return password

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("name")
    def validate_name(cls, v: str) -> str:
        s = v.strip()
        if len(s) < 2:
            raise ValueError("Name must be at least 2 characters.")
        return s

    @field_validator("password")
    def check_password(cls, v: str) -> str:
        return validate_password_strength(v)

    @field_validator("confirm_password")
    def check_passwords_match(cls, v: str, info) -> str:
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match.")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    def check_password(cls, v: str) -> str:
        return validate_password_strength(v)

    @field_validator("confirm_password")
    def check_passwords_match(cls, v: str, info) -> str:
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match.")
        return v

class VerifyEmailRequest(BaseModel):
    token: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    def check_password(cls, v: str) -> str:
        return validate_password_strength(v)

    @field_validator("confirm_password")
    def check_passwords_match(cls, v: str, info) -> str:
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match.")
        return v

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: str
    last_login: Optional[str] = None

class SessionResponse(BaseModel):
    id: int
    user_agent: Optional[str]
    ip_address: Optional[str]
    created_at: str
    expires_at: str
    is_current: bool = False

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class AdminUpdateUserRoleRequest(BaseModel):
    role: str

    @field_validator("role")
    def check_role(cls, v: str) -> str:
        val = v.lower().strip()
        if val not in ("admin", "researcher", "viewer"):
            raise ValueError("Role must be 'admin', 'researcher', or 'viewer'.")
        return val

class AdminUpdateUserStatusRequest(BaseModel):
    is_active: bool

class StandardResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[dict] = None
