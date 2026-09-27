import os
import shutil
import sqlite3
import tempfile
from datetime import datetime, timezone
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
DEFAULT_SQLITE_PATH = BACKEND_DIR / "lunar_fusion.db"

def is_dir_writable(path: Path) -> bool:
    try:
        path.mkdir(parents=True, exist_ok=True)
        test_file = path / f".write_test_{os.getpid()}"
        test_file.touch()
        test_file.unlink()
        return True
    except Exception:
        return False

def get_database_path() -> Path:
    db_url = os.getenv("DATABASE_URL", "")
    if db_url.startswith("sqlite:///"):
        clean_path = db_url.replace("sqlite:///", "")
        if clean_path.startswith("./"):
            target_path = BACKEND_DIR / clean_path[2:]
        else:
            target_path = Path(clean_path)
    else:
        target_path = DEFAULT_SQLITE_PATH

    # If running in serverless (e.g. Vercel) or on a read-only filesystem:
    if os.getenv("VERCEL") == "1" or not is_dir_writable(target_path.parent):
        tmp_dir = Path(tempfile.gettempdir()) / "lunar_fusion"
        tmp_dir.mkdir(parents=True, exist_ok=True)
        tmp_db_path = tmp_dir / target_path.name
        if not tmp_db_path.exists() and target_path.exists():
            try:
                shutil.copy2(target_path, tmp_db_path)
            except Exception as e:
                print(f"[WARN] Could not copy SQLite database to temp dir: {e}")
        return tmp_db_path

    return target_path

def get_connection():
    db_path = get_database_path()
    conn = sqlite3.connect(str(db_path), timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        conn.execute("PRAGMA journal_mode = WAL")
        conn.execute("PRAGMA busy_timeout = 30000")
    except Exception:
        try:
            conn.execute("PRAGMA journal_mode = DELETE")
        except Exception:
            pass
    return conn

def init_tables():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'researcher', -- admin, researcher, viewer
        is_active INTEGER NOT NULL DEFAULT 1,
        is_verified INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_login TEXT
    )
    """)
    
    # Sessions / Refresh tokens table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        revoked_at TEXT,
        user_agent TEXT,
        ip_address TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Email verifications table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS email_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        used_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Password resets table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        used_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Audit log table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        created_at TEXT NOT NULL
    )
    """)
    
    # Indices for performance and security lookups
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_password_resets_hash ON password_resets(token_hash)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_email_verif_hash ON email_verifications(token_hash)")
    
    conn.commit()
    conn.close()

# Auto-initialize tables on module import if they don't exist
try:
    init_tables()
except Exception as e:
    print(f"[WARN] Database initialization warning: {e}")
