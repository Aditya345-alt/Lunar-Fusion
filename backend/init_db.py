import sys
from datetime import datetime, timezone
from pathlib import Path

# Ensure backend directory is in python path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import init_tables, get_connection
from auth import hash_password

DEV_ACCOUNTS = [
    {
        "name": "ISRO Lunar Mission Director",
        "email": "admin@lunarfusion.isro.gov.in",
        "password": "Admin@Lunar2026!",
        "role": "admin",
        "is_verified": 1,
        "is_active": 1
    },
    {
        "name": "Lead Vision Researcher",
        "email": "researcher@lunarfusion.isro.gov.in",
        "password": "Research@Lunar2026!",
        "role": "researcher",
        "is_verified": 1,
        "is_active": 1
    },
    {
        "name": "Guest Science Evaluator",
        "email": "viewer@lunarfusion.isro.gov.in",
        "password": "Viewer@Lunar2026!",
        "role": "viewer",
        "is_verified": 1,
        "is_active": 1
    }
]

def setup_database():
    print("Initializing Lunar Fusion Database Tables...")
    init_tables()
    print("Tables verified / created.")

    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    print("\nVerifying / Seeding Development Accounts:")
    for acc in DEV_ACCOUNTS:
        cursor.execute("SELECT id, email, role FROM users WHERE email = ?", (acc["email"],))
        existing = cursor.fetchone()
        if existing:
            print(f"  [EXISTS] {acc['role'].upper()}: {acc['email']} (ID: {existing['id']})")
        else:
            pw_hash = hash_password(acc["password"])
            cursor.execute("""
            INSERT INTO users (email, password_hash, name, role, is_active, is_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (acc["email"], pw_hash, acc["name"], acc["role"], acc["is_active"], acc["is_verified"], now_iso, now_iso))
            conn.commit()
            new_id = cursor.lastrowid
            print(f"  [CREATED] {acc['role'].upper()}: {acc['email']} (ID: {new_id})")

    conn.close()
    print("\nDatabase initialization complete!\n")

if __name__ == "__main__":
    setup_database()
