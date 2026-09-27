# Lunar Fusion — Multi-Modal Lunar Image Registration Prototype

An end-to-end aerospace computer vision and registration pipeline designed for Chandrayaan-2 (OHRC / TMC-2 / IIRS) imagery with automated lunar-location retrieval, LRO-NAC candidate selection, feature correspondence (SIFT), robust geometric outlier rejection (RANSAC / MAGSAC / USAC), and sub-pixel perspective registration.

Developed for **ISRO Problem Statement 26166**.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vitejs.dev/) with optimized production bundling
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization:** [Recharts](https://recharts.org/) (Error distribution, radar quality metrics, spatial scatter)

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/) (Asynchronous ASGI)
- **Computer Vision:** [OpenCV Headless](https://opencv.org/) (`cv2` SIFT, CLAHE, BFMatcher, RANSAC, USAC-MAGSAC, perspective transform)
- **Scientific Computing:** [NumPy](https://numpy.org/), [Pillow](https://python-pillow.org/)
- **Security & Authentication:** Role-Based Access Control (Admin, Researcher, Viewer), Bcrypt password hashing, PyJWT authentication tokens
- **Persistence:** SQLite with Write-Ahead Logging (WAL mode) and `/tmp` serverless fallback

---

## 📁 Project Structure

```text
Lunar_Fusion_FULL_WORKING_PROTOTYPE/
├── api/                            # Vercel Serverless Function entry point
│   └── index.py                    # Serverless Python ASGI adapter for FastAPI
├── backend/                        # FastAPI Backend Application
│   ├── Dockerfile                  # Containerized deployment manifest
│   ├── auth.py                     # Authentication services & password hashing
│   ├── auth_routes.py              # Auth & admin endpoints (/api/auth/*, /api/admin/*)
│   ├── catalog_tiles/              # Indexed reference tile storage
│   ├── database.py                 # SQLite WAL connection management with /tmp fallback
│   ├── demo_tiles/                 # Sample OHRC & LRO-NAC tiles for offline testing
│   ├── init_db.py                  # Database & default account initializer
│   ├── location.py                 # Illumination-tolerant visual embedding & retriever
│   ├── lunar_catalog.db            # Lunar tile spatial catalog database
│   ├── lunar_fusion.db             # User accounts, tokens, and audit logs
│   ├── main.py                     # Primary API routes (/api/match, /api/locate, /api/health)
│   ├── requirements.txt            # Python dependencies (opencv-python-headless)
│   ├── schemas.py                  # Pydantic validation schemas
│   ├── security.py                 # JWT token generation & role dependencies
│   ├── scripts/                    # Catalog generation and training scripts
│   └── tests/                      # Automated test suite (test_auth.py, test_pipeline.py)
├── public/                         # Static assets served at root
│   └── I_want_to_make_a_logo_video_of_gwr_video_mvp.mp4  # Mission opening sequence
├── src/                            # React Frontend Source
│   ├── components/
│   │   ├── admin/                  # Admin user management modal
│   │   ├── auth/                   # Login, password reset, security modals
│   │   ├── header/                 # User profile dropdown & navigation
│   │   └── ui/                     # IntroVideo (pure fullscreen logo intro)
│   ├── config/
│   │   └── api.ts                  # Centralized API base URL resolver and health checks
│   ├── context/                    # AuthContext (JWT management & session state)
│   ├── App.tsx                     # Main application views & pipeline workflow
│   ├── index.css                   # Global styles & Tailwind imports
│   ├── main.tsx                    # React application entrypoint
│   └── Wallpaper.tsx               # Animated aerospace background canvas
├── .env.example                    # Environment configuration template
├── docker-compose.yml              # Local container deployment
├── package.json                    # Node dependencies & npm scripts
├── requirements.txt                # Root Python dependencies for Vercel Serverless
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel SPA rewrites and serverless routing
└── vite.config.ts                  # Vite configuration & dev server ports
```

---

## ☁️ Vercel Deployment Guide

### Option 1: Frontend on Vercel + Backend on Persistent Host (Recommended for Production)

For heavy aerospace computer vision tasks (SIFT keypoints, RANSAC estimation, high-resolution tiles, and write-heavy SQLite catalogs), hosting the backend on a container service (e.g. Render, Railway, AWS ECS, Google Cloud Run) with persistent volume storage is recommended.

#### Step 1: Deploy Backend Container
1. Connect your repository to **Railway**, **Render**, or **Fly.io**.
2. Set the Root/Context Directory to `./backend` or use the root `docker-compose.yml`.
3. Set the required backend environment variables (see below).
4. Note your public backend URL (e.g., `https://lunar-fusion-api.onrender.com`).

#### Step 2: Deploy Frontend on Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Select your `Lunar_Fusion` GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add the following **Environment Variable** in the Vercel project settings:
   - `VITE_API_BASE_URL` = `https://your-backend-api-url.com`
5. Click **Deploy**. Vercel will build the frontend and deploy it to a global edge CDN with full SPA routing (`vercel.json`).

---

### Option 2: Full-Stack Serverless Deployment on Vercel

Lunar Fusion is configured with `api/index.py` and `vercel.json` to run serverless on Vercel directly:

1. Connect your repository to **Vercel**.
2. Vercel automatically detects `vite` and the Python entrypoint at `api/index.py`.
3. Configure the following environment variables in Vercel:
   - `JWT_SECRET_KEY` = `your-secure-random-jwt-key-32-chars`
   - `COOKIE_SECURE` = `true`
   - Leave `VITE_API_BASE_URL` blank (it will automatically use same-origin `/api/*` rewrites).
4. Deploy the project. The serverless Python runtime will run with `opencv-python-headless` and safe `/tmp` database fallback.

---

## 🔑 Environment Variables Reference

| Variable | Target | Required | Description |
| :--- | :---: | :---: | :--- |
| `VITE_API_BASE_URL` | Frontend (Vercel) | Optional | URL of external FastAPI backend. Leave blank for same-origin proxy. |
| `JWT_SECRET_KEY` | Backend | **Yes** | 32+ character random secret for HS256 JWT tokens. |
| `JWT_ACCESS_EXPIRE_MINUTES` | Backend | No (Default: 15) | Access token lifespan in minutes. |
| `JWT_REFRESH_EXPIRE_DAYS` | Backend | No (Default: 7) | Session refresh token lifespan in days. |
| `COOKIE_SECURE` | Backend | No (Default: true on prod) | Enforce Secure HTTPS flag on auth cookies. |
| `CORS_ORIGINS` | Backend | **Yes** | Comma-separated allowed frontend origins (e.g. `https://your-app.vercel.app`). |
| `DATABASE_URL` | Backend | No (Default: SQLite) | SQLite path or external database connection string. |
| `EMAIL_API_KEY` | Backend | Optional | Resend API key for transactional emails. |

---

## 🚀 Local Development Setup

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
   pip install httpx
   ```

4. Initialize database and default accounts:
   ```powershell
   python init_db.py
   ```

   *Default dev credentials:*
   - **Admin:** `admin@lunarfusion.isro.gov.in` / `Admin@Lunar2026!`
   - **Researcher:** `researcher@lunarfusion.isro.gov.in` / `Research@Lunar2026!`
   - **Viewer:** `viewer@lunarfusion.isro.gov.in` / `Viewer@Lunar2026!`

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
   The UI will be accessible at `http://localhost:8443`.

---

## 🧪 Testing & Verification

### Running Complete Backend Unit Tests (16 Tests)
Execute the unit test suite covering authentication, RBAC, sessions, rate limiting, SIFT matching, RANSAC homography, location retrieval, metadata, and error validation:
```powershell
python -m unittest discover -s backend/tests
```

### Running Frontend Type-Check & Production Build
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
| `/api/auth/register` | `POST` | Public | Creates new research personnel account |
| `/api/auth/me` | `GET` | Authenticated | Current user profile and role verification |
| `/api/auth/refresh` | `POST` | Public / Cookie | Silent session renewal using refresh tokens |
| `/api/match` | `POST` | Researcher / Admin | SIFT detection, Lowe ratio, and RANSAC/MAGSAC outlier removal |
| `/api/locate` | `POST` | Researcher / Admin | Embedding retrieval to find closest LRO-NAC tile |
| `/api/catalog/status` | `GET` | Public | Status and count of indexed reference tiles |
| `/api/catalog/index` | `POST` | Researcher / Admin | Index new reference tiles with spatial metadata |
| `/api/demo/samples` | `GET` | Public | Demo crater metadata catalog |
| `/api/demo/sample-source` | `GET` | Public | Fetch sample Chandrayaan-2 OHRC demo tile |
| `/api/demo/sample-reference` | `GET` | Public | Fetch sample LRO-NAC reference demo tile |
| `/api/admin/users` | `GET` | Admin | Manage personnel accounts and role escalation |
| `/api/admin/system` | `GET` | Admin | Real-time system diagnostics and active sessions |

---

## 📄 License & Attribution
Developed for research, evaluation, and SIH Problem Statement 26166. Contains synthetic demo tiles for pipeline validation.
