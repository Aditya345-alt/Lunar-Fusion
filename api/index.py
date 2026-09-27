import os
import sys
from pathlib import Path

# Add backend directory to sys.path so backend modules (location, auth, security, etc.) are discovered
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Signal to backend that it is executing inside a serverless environment
os.environ["VERCEL"] = "1"

# Import the configured FastAPI instance
from main import app  # noqa: E402
