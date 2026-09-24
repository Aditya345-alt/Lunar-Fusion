# Lunar Fusion — Multi-Modal Lunar Image Registration Prototype

An end-to-end aerospace computer vision and registration pipeline designed for Chandrayaan-2 (OHRC / TMC-2 / IIRS) imagery with automated lunar-location retrieval, LRO-NAC candidate selection, feature correspondence (SIFT), robust geometric outlier rejection (RANSAC / MAGSAC / USAC), and sub-pixel perspective registration.

Developed for **ISRO Problem Statement 26166**.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vitejs.dev/) with hot module replacement
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization:** [Recharts](https://recharts.org/) (Error distribution, radar quality metrics, spatial scatter)

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/) (Asynchronous ASGI)
- **Computer Vision:** [OpenCV](https://opencv.org/) (`cv2` SIFT, CLAHE, BFMatcher, RANSAC, USAC-MAGSAC, perspective transform)
- **Scientific Computing:** [NumPy](https://numpy.org/), [Pillow](https://python-pillow.org/)
- **Security & Authentication:** Role-Based Access Control (Admin, Researcher, Viewer), Bcrypt password hashing, PyJWT authentication tokens
- **Persistence:** SQLite with Write-Ahead Logging (WAL mode)

---

## 📁 Project Structure

```text
Lunar_Fusion_FULL_WORKING_PROTOTYPE/
├── backend/                        # FastAPI Backend Application
│   ├── auth.py                     # Authentication services & password hashing
│   ├── auth_routes.py              # Auth & admin endpoints (/api/auth/*, /api/admin/*)
│   ├── catalog_tiles/              # Indexed reference tile storage
│   ├── database.py                 # SQLite WAL connection management
│   ├── demo_tiles/                 # Sample OHRC & LRO-NAC tiles for offline testing
│   ├── init_db.py                  # Database & default account initializer
│   ├── location.py                 # Illumination-tolerant visual embedding & retriever
│   ├── lunar_catalog.db            # Lunar tile spatial catalog database
│   ├── lunar_fusion.db             # User accounts, tokens, and audit logs
│   ├── main.py                     # Primary API routes (/api/match, /api/locate, /api/health)
│   ├── requirements.txt            # Python dependencies
│   ├── schemas.py                  # Pydantic validation schemas
│   ├── security.py                 # JWT token generation & role dependencies
│   ├── scripts/                    # Catalog generation and training scripts
│   └── tests/                      # Automated test suite (test_auth.py)
├── public/                         # Static assets served at root
│   └── I_want_to_make_a_logo_video_of_gwr_video_mvp.mp4  # Mission opening sequence
├── src/                            # React Frontend Source
│   ├── components/
│   │   ├── admin/                  # Admin user management modal
│   │   ├── auth/                   # Login, password reset, security modals
│   │   ├── header/                 # User profile dropdown & navigation
│   │   └── ui/                     # IntroVideo (pure fullscreen logo intro)
│   ├── context/                    # AuthContext (JWT management & session state)
│   ├── imports/                    # Design documentation & style references
│   ├── App.tsx                     # Main application views & pipeline workflow
│   ├── index.css                   # Global styles & Tailwind imports
│   ├── main.tsx                    # React application entrypoint
│   └── Wallpaper.tsx               # Animated aerospace background canvas
├── .env.example                    # Frontend environment template
├── package.json                    # Node dependencies & npm scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration & dev server ports
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **Python**: 3.10 to 3.14
- **Package Manager**: `npm` or `pnpm`

---

### 1. Backend Setup & Run

1. Open a terminal in the project directory:
   ```powershell
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

3. Install backend dependencies:
   ```powershell
   pip install -r requirements.txt
   pip install httpx  # For running test suites
   ```

4. Initialize database and default accounts:
   ```powershell
   python init_db.py
   ```
   *Default dev credentials:*
   - **Admin:** `admin@lunarfusion.isro.gov.in` / `Admin@123456`
   - **Researcher:** `researcher@lunarfusion.isro.gov.in` / `Researcher@123456`
   - **Viewer:** `viewer@lunarfusion.isro.gov.in` / `Viewer@123456`

5. Start the FastAPI backend server:
   ```powershell
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   Backend will be running at `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`).

---

### 2. Frontend Setup & Run

1. In a separate terminal in the root directory:
   ```powershell
   npm install
   ```

2. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   The UI will be accessible at `http://localhost:8443` (or the port specified in your console).

---

## 🧪 Testing & Verification

### Running Backend Tests
Execute the unit test suite covering authentication, RBAC, and endpoints:
```powershell
python -m unittest discover -s backend/tests
```

### Running Frontend Type-Check & Build
Verify TypeScript correctness and create an optimized production build:
```powershell
npx tsc --noEmit
npm run build
```

---

## 📡 Key API Endpoints

| Endpoint | Method | Role Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/health` | `GET` | Public | System status and service health check |
| `/api/auth/login` | `POST` | Public | Authenticates credentials and returns JWT tokens |
| `/api/auth/me` | `GET` | Authenticated | Current user profile and role verification |
| `/api/match` | `POST` | Researcher / Admin | SIFT detection, Lowe ratio, and RANSAC/MAGSAC outlier removal |
| `/api/locate` | `POST` | Researcher / Admin | Embedding retrieval to find closest LRO-NAC tile |
| `/api/catalog/status` | `GET` | Public | Status and count of indexed reference tiles |
| `/api/demo/sample-source` | `GET` | Public | Fetch sample Chandrayaan-2 OHRC demo tile |
| `/api/demo/sample-reference` | `GET` | Public | Fetch sample LRO-NAC reference demo tile |

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` in the root and in `backend/.env` if customizing configurations:

### Frontend (`.env`)
```bash
VITE_API_BASE_URL=http://localhost:8000
PORT=8443
```

### Backend (`backend/.env`)
```bash
SECRET_KEY=your-secure-random-jwt-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=sqlite:///./lunar_fusion.db
```

---

## 📄 License & Attribution
Developed for research, evaluation, and SIH Problem Statement 26166. Contains synthetic demo tiles for pipeline validation.
