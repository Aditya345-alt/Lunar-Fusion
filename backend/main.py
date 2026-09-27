import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
# pyrefly: ignore [missing-import]
import cv2
# pyrefly: ignore [missing-import]
import numpy as np
import base64
import io
from typing import Optional
# pyrefly: ignore [missing-import]
from PIL import Image
from pathlib import Path
from location import add_tile, search_tiles, db, get_tile

from auth_routes import auth_router, admin_router
from security import get_current_user, get_optional_user, require_role

app = FastAPI(title="Lunar Fusion API", version="1.0.0")

# ── Dynamic Production CORS ──────────────────────────────────────────────────
cors_origins_env = os.getenv("CORS_ORIGINS", "")
allowed_origins = [
    "http://localhost:8443",
    "http://127.0.0.1:8443",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
if cors_origins_env:
    for origin in cors_origins_env.split(","):
        cleaned = origin.strip()
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

cors_regex = os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app|https://.*\.onrender\.com|https://.*\.railway\.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=cors_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    err_detail = exc.detail
    if isinstance(err_detail, dict):
        return JSONResponse(status_code=exc.status_code, content={"success": False, "error": err_detail})
    return JSONResponse(status_code=exc.status_code, content={"success": False, "error": {"code": "HTTP_ERROR", "message": str(err_detail)}})

app.include_router(auth_router)
app.include_router(admin_router)

# ── Security & Image Validation ──────────────────────────────────────────────
MAX_UPLOAD_BYTES = 30 * 1024 * 1024  # 30 MB

def validate_uploaded_image(file: UploadFile, data: bytes) -> None:
    if not data or len(data) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Uploaded file exceeds maximum limit of {MAX_UPLOAD_BYTES // (1024 * 1024)}MB."
        )
    fname = (file.filename or "").lower()
    allowed_exts = (".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp", ".webp")
    if fname and not any(fname.endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file format for '{file.filename}'. Allowed types: PNG, JPG, TIFF, BMP, WEBP."
        )

def read_image(data: bytes):
    if len(data) == 0:
        raise ValueError("Image data is empty")
    arr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError("Unsupported or corrupt image format")
    if img.ndim == 2:
        gray = img
    elif img.shape[2] == 4:
        gray = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return img, gray


def normalize(gray):
    gray = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(gray)


def encode_png(img):
    ok, buf = cv2.imencode('.png', img)
    if not ok:
        raise ValueError('Could not encode image')
    return 'data:image/png;base64,' + base64.b64encode(buf.tobytes()).decode('ascii')


def resize_for_processing(img, max_dim=1400):
    h, w = img.shape[:2]
    scale = min(1.0, max_dim / max(h, w))
    if scale < 1:
        img = cv2.resize(img, (int(w*scale), int(h*scale)), interpolation=cv2.INTER_AREA)
    return img, scale


def make_match_visual(src_gray, ref_gray, kp1, kp2, good, inlier_mask=None, filter_mode='all'):
    src = cv2.cvtColor(src_gray, cv2.COLOR_GRAY2BGR)
    ref = cv2.cvtColor(ref_gray, cv2.COLOR_GRAY2BGR)
    canvas = np.zeros((max(src.shape[0], ref.shape[0]), src.shape[1] + ref.shape[1], 3), dtype=np.uint8)
    canvas[:src.shape[0], :src.shape[1]] = src
    canvas[:ref.shape[0], src.shape[1]:] = ref
    for i, m in enumerate(good):
        inlier = inlier_mask is not None and i < len(inlier_mask) and bool(inlier_mask[i])
        if filter_mode == 'inliers' and not inlier:
            continue
        if filter_mode == 'outliers' and inlier:
            continue
        p1 = tuple(np.round(kp1[m.queryIdx].pt).astype(int))
        p2 = tuple(np.round(kp2[m.trainIdx].pt).astype(int) + np.array([src.shape[1], 0]))
        color = (70, 220, 120) if inlier else (70, 80, 230)
        thick = 1 if inlier else 2
        r = 3 if inlier else 4
        cv2.line(canvas, p1, p2, color, thick, cv2.LINE_AA)
        cv2.circle(canvas, p1, r, color, -1, cv2.LINE_AA)
        cv2.circle(canvas, p2, r, color, -1, cv2.LINE_AA)
    return canvas


def register(src_gray, ref_gray, H):
    if H is None:
        return ref_gray.copy(), None
    h, w = ref_gray.shape[:2]
    warped = cv2.warpPerspective(src_gray, H, (w, h))
    return warped, H



@app.get('/api/catalog/status')
def catalog_status():
    c = db(); n = c.execute('SELECT COUNT(*) FROM tiles').fetchone()[0]; c.close()
    return {'indexed_tiles': n, 'ready': n > 0, 'message': 'LRO-NAC catalog ready' if n else 'Index selected LRO-NAC tiles first'}

def resolve_demo_file(name: str) -> Path:
    candidates = [
        Path(__file__).resolve().parent / 'demo_tiles' / name,
        Path(__file__).resolve().parent.parent / 'backend' / 'demo_tiles' / name,
        Path('backend/demo_tiles') / name,
        Path('demo_tiles') / name,
    ]
    for c in candidates:
        if c.exists():
            return c.resolve()
    raise HTTPException(404, f"Demo tile '{name}' not found")

@app.post('/api/catalog/index')
async def catalog_index(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    sensor: str = Form('LRO-NAC'),
    resolution_m: float | None = Form(None),
    sun_azimuth: float | None = Form(None),
    sun_elevation: float | None = Form(None),
    current_user: dict = Depends(require_role(["admin", "researcher"]))
):
    data = await file.read()
    validate_uploaded_image(file, data)
    try:
        tid = add_tile(data, file.filename or 'lro_tile', sensor, latitude, longitude, resolution_m, sun_azimuth, sun_elevation)
        return {'status':'indexed','tile_id':tid,'latitude':latitude,'longitude':longitude}
    except Exception as e:
        raise HTTPException(400, str(e))


@app.get('/api/catalog/tile/{tile_id}')
def catalog_tile(tile_id: int):
    tile = get_tile(tile_id)
    if not tile or not tile.get('path'):
        raise HTTPException(404, 'Catalog tile not found')
    p = Path(tile['path'])
    if not p.exists():
        raise HTTPException(404, 'Catalog tile image binary not found')
    return FileResponse(str(p), media_type='image/png', filename=tile.get('filename', 'tile.png'))

@app.get('/api/catalog/tile/{tile_id}/meta')
def catalog_tile_meta(tile_id: int):
    tile=get_tile(tile_id)
    if not tile: raise HTTPException(404, 'Catalog tile not found')
    return tile

@app.post('/api/locate')
async def locate(
    file: UploadFile = File(...),
    sensor: str = Form('OHRC'),
    top_k: int = Form(5),
    current_user: dict = Depends(require_role(["admin", "researcher"]))
):
    data = await file.read()
    validate_uploaded_image(file, data)
    try:
        candidates = search_tiles(data, sensor=None, top_k=max(1,min(top_k,20)))
    except Exception as e:
        raise HTTPException(400, str(e))
    if not candidates:
        return {'status':'catalog_empty','message':'No LRO-NAC tiles are indexed yet. Add selected LRO-NAC tiles through /api/catalog/index.','candidates':[]}
    best=candidates[0]
    return {'status':'success','sensor':sensor,'best_location':{'latitude':best['latitude'],'longitude':best['longitude'],'confidence':best['similarity']},'candidates':candidates,'method':'Embedding retrieval → ranked LRO-NAC candidates → precise correspondence verification'}

@app.get('/api/health')
def health():
    return {
        'status': 'ok',
        'service': 'Lunar Fusion API',
        'matcher': 'SIFT + ratio test + RANSAC',
        'location_retrieval': 'enabled',
        'catalog': '/api/catalog/index',
        'auth': 'enabled'
    }

@app.get('/api/demo/samples')
def demo_samples():
    return {
        'source': '/api/demo/sample-source',
        'reference': '/api/demo/sample-reference',
        'description': 'Deterministic synthetic lunar crater tiles (OHRC simulated source and LRO-NAC reference)'
    }

@app.get('/api/demo/sample-source')
def demo_sample_source():
    p = resolve_demo_file('demo_ohrc_source_0.png')
    return FileResponse(str(p), media_type='image/png', filename='demo_ohrc_source_0.png')

@app.get('/api/demo/sample-reference')
def demo_sample_reference():
    p = resolve_demo_file('demo_lro_nac_0.png')
    return FileResponse(str(p), media_type='image/png', filename='demo_lro_nac_0.png')

@app.post('/api/match')
async def match_images(
    source: UploadFile = File(...),
    reference: UploadFile = File(...),
    sensor: str = Form('OHRC'),
    ratio: float = Form(0.75),
    min_matches: int = Form(8),
    method: str = Form('RANSAC'),
    ransac_thresh: float = Form(2.5),
    max_iters: int = Form(1000),
    confidence: float = Form(0.9999),
    current_user: dict = Depends(require_role(["admin", "researcher"]))
):
    src_data = await source.read()
    ref_data = await reference.read()
    validate_uploaded_image(source, src_data)
    validate_uploaded_image(reference, ref_data)
    try:
        src_raw, src_gray = read_image(src_data)
        ref_raw, ref_gray = read_image(ref_data)
    except Exception as e:
        raise HTTPException(400, str(e))

    src_gray, src_scale = resize_for_processing(src_gray)
    ref_gray, ref_scale = resize_for_processing(ref_gray)
    src_p = normalize(src_gray)
    ref_p = normalize(ref_gray)

    if not hasattr(cv2, 'SIFT_create'):
        raise HTTPException(500, 'OpenCV SIFT is unavailable in this environment')

    sift = cv2.SIFT_create(nfeatures=5000, contrastThreshold=0.02)
    kp1, des1 = sift.detectAndCompute(src_p, None)
    kp2, des2 = sift.detectAndCompute(ref_p, None)
    if des1 is None or des2 is None:
        raise HTTPException(422, 'Not enough visual texture/features for correspondence')

    matcher = cv2.BFMatcher(cv2.NORM_L2)
    knn = matcher.knnMatch(des1, des2, k=2)
    good = [m for m, n in knn if m.distance < ratio * n.distance]
    if len(good) < 4:
        vis = make_match_visual(src_p, ref_p, kp1, kp2, good)
        return JSONResponse({
            'status': 'low_confidence', 'message': f'Only {len(good)} candidate matches found.',
            'sensor': sensor, 'candidate_matches': len(good), 'inliers': 0, 'outliers': len(good),
            'inlier_ratio': 0, 'rmse_px': None, 'subpixel_error_px': None,
            'inlier_mean_error': 0, 'outlier_mean_error': 0,
            'source_preview': encode_png(src_p), 'reference_preview': encode_png(ref_p),
            'matches_preview': encode_png(vis), 'inliers_preview': encode_png(vis),
            'outliers_preview': encode_png(vis), 'registered_preview': None,
            'difference_preview': None, 'homography_matrix': None,
            'error_distribution': [], 'sector_rmse': [0]*8,
            'inlier_points': [], 'outlier_points': []
        })

    pts1 = np.float32([kp1[m.queryIdx].pt for m in good])
    pts2 = np.float32([kp2[m.trainIdx].pt for m in good])

    # Select OpenCV robust estimator method
    m_clean = (method or 'RANSAC').strip().upper()
    if m_clean in ['MAGSAC', 'USAC_MAGSAC']:
        cv_method = getattr(cv2, 'USAC_MAGSAC', cv2.RANSAC)
    elif m_clean in ['GC-RANSAC', 'USAC_ACCURATE', 'ACCURATE']:
        cv_method = getattr(cv2, 'USAC_ACCURATE', getattr(cv2, 'USAC_MAGSAC', cv2.RANSAC))
    elif m_clean == 'LMEDS':
        cv_method = cv2.LMEDS
    elif m_clean == 'RHO':
        cv_method = getattr(cv2, 'RHO', cv2.RANSAC)
    else:
        cv_method = cv2.RANSAC

    th = max(0.1, float(ransac_thresh or 2.5))
    it = max(50, min(int(max_iters or 1000), 20000))
    conf = max(0.5, min(float(confidence or 0.9999), 0.99999))

    H, mask = cv2.findHomography(pts1, pts2, cv_method, th, maxIters=it, confidence=conf)
    inlier_mask = mask.ravel().astype(bool) if mask is not None else np.zeros(len(good), dtype=bool)
    inliers = int(inlier_mask.sum())
    outliers = len(good) - inliers
    inlier_ratio = inliers / max(1, len(good))

    if H is not None and inliers >= 4:
        pred = cv2.perspectiveTransform(pts1.reshape(-1, 1, 2), H).reshape(-1, 2)
        residuals = np.linalg.norm(pred - pts2, axis=1)
        inlier_res = residuals[inlier_mask]
        outlier_res = residuals[~inlier_mask] if outliers > 0 else np.array([], dtype=np.float32)

        rmse = float(np.sqrt(np.mean(inlier_res**2))) if len(inlier_res) > 0 else None
        subpixel = float(np.median(inlier_res)) if len(inlier_res) > 0 else None
        inlier_mean_err = float(np.mean(inlier_res)) if len(inlier_res) > 0 else 0.0
        outlier_mean_err = float(np.mean(outlier_res)) if len(outlier_res) > 0 else 0.0

        registered, _ = register(src_p, ref_p, H)
        diff = cv2.absdiff(ref_p, registered)
    else:
        residuals = np.zeros(len(good), dtype=np.float32)
        rmse, subpixel = None, None
        inlier_mean_err, outlier_mean_err = 0.0, 0.0
        registered, diff = None, None

    # Lightweight spatial coverage score: fraction of a 4x4 grid containing an inlier.
    gh, gw = 4, 4
    occupied = set()
    for i, flag in enumerate(inlier_mask):
        if flag:
            x, y = kp1[good[i].queryIdx].pt
            occupied.add((min(gw-1, int(x / max(1, src_p.shape[1]) * gw)), min(gh-1, int(y / max(1, src_p.shape[0]) * gh))))
    spatial_coverage = len(occupied) / (gw * gh)

    # Sector RMSE distribution across 8 regions (2x4 grid)
    sector_rmse = []
    for r in range(2):
        for c in range(4):
            sec_mask = inlier_mask & (
                (pts1[:, 0] >= c * src_p.shape[1] / 4) & (pts1[:, 0] < (c + 1) * src_p.shape[1] / 4) &
                (pts1[:, 1] >= r * src_p.shape[0] / 2) & (pts1[:, 1] < (r + 1) * src_p.shape[0] / 2)
            )
            if np.sum(sec_mask) > 0:
                s_rmse = float(np.sqrt(np.mean(residuals[sec_mask]**2)))
            else:
                s_rmse = 0.0
            sector_rmse.append(round(s_rmse, 2))

    # Real error distribution histogram bins
    error_distribution = [
        {"e": "0.0-0.5", "n": int(np.sum((residuals >= 0.0) & (residuals < 0.5)))},
        {"e": "0.5-1.0", "n": int(np.sum((residuals >= 0.5) & (residuals < 1.0)))},
        {"e": "1.0-1.5", "n": int(np.sum((residuals >= 1.0) & (residuals < 1.5)))},
        {"e": "1.5-2.0", "n": int(np.sum((residuals >= 1.5) & (residuals < 2.0)))},
        {"e": "2.0-2.5", "n": int(np.sum((residuals >= 2.0) & (residuals < 2.5)))},
        {"e": "2.5-3.0", "n": int(np.sum((residuals >= 2.5) & (residuals < 3.0)))},
        {"e": "3.0-5.0", "n": int(np.sum((residuals >= 3.0) & (residuals < 5.0)))},
        {"e": "5.0+",    "n": int(np.sum(residuals >= 5.0))},
    ]

    # Detailed keypoint coordinates for inlier / outlier inspection
    inlier_points = []
    outlier_points = []
    for i in range(len(good)):
        item = {
            "id": f"KP-{i+1:03d}",
            "src": [round(float(kp1[good[i].queryIdx].pt[0]), 1), round(float(kp1[good[i].queryIdx].pt[1]), 1)],
            "ref": [round(float(kp2[good[i].trainIdx].pt[0]), 1), round(float(kp2[good[i].trainIdx].pt[1]), 1)],
            "error_px": round(float(residuals[i]), 2),
            "inlier": bool(inlier_mask[i])
        }
        if inlier_mask[i]:
            inlier_points.append(item)
        else:
            outlier_points.append(item)
    outlier_points.sort(key=lambda x: x["error_px"], reverse=True)
    inlier_points.sort(key=lambda x: x["error_px"])

    vis_all = make_match_visual(src_p, ref_p, kp1, kp2, good, inlier_mask, filter_mode='all')
    vis_inliers = make_match_visual(src_p, ref_p, kp1, kp2, good, inlier_mask, filter_mode='inliers')
    vis_outliers = make_match_visual(src_p, ref_p, kp1, kp2, good, inlier_mask, filter_mode='outliers')

    quality = min(100, round((inlier_ratio * 60) + (spatial_coverage * 25) + (max(0, 1 - min((rmse or 20)/20, 1)) * 15), 1))

    return {
        'status': 'success' if inliers >= min_matches else 'low_confidence',
        'sensor': sensor,
        'method': m_clean,
        'ransac_thresh': th,
        'candidate_matches': len(good),
        'inliers': inliers,
        'outliers': outliers,
        'inlier_ratio': round(inlier_ratio * 100, 2),
        'spatial_coverage': round(spatial_coverage * 100, 2),
        'rmse_px': round(rmse, 3) if rmse is not None else None,
        'subpixel_error_px': round(subpixel, 3) if subpixel is not None else None,
        'inlier_mean_error': round(inlier_mean_err, 2),
        'outlier_mean_error': round(outlier_mean_err, 2),
        'quality_score': quality,
        'source_preview': encode_png(src_p),
        'reference_preview': encode_png(ref_p),
        'matches_preview': encode_png(vis_all),
        'inliers_preview': encode_png(vis_inliers),
        'outliers_preview': encode_png(vis_outliers),
        'registered_preview': encode_png(registered) if registered is not None else None,
        'difference_preview': encode_png(diff) if diff is not None else None,
        'homography_matrix': H.tolist() if H is not None else None,
        'error_distribution': error_distribution,
        'sector_rmse': sector_rmse,
        'inlier_points': inlier_points[:100],
        'outlier_points': outlier_points[:100],
        'processing': ['Intensity normalization', 'CLAHE contrast enhancement', 'SIFT correspondence', 'Lowe ratio filtering', f'{m_clean} homography outlier rejection', 'Spatial coverage analysis'],
        'model_note': 'Current runnable baseline uses SIFT + RANSAC/MAGSAC. The API is structured for replacing the matcher with LoFTR/LightGlue when trained/packaged models are available.'
    }

@app.post('/api/metadata')
async def metadata(file: UploadFile = File(...)):
    data = await file.read()
    validate_uploaded_image(file, data)
    try:
        _, gray = read_image(data)
        h, w = gray.shape[:2]
        return {'filename': file.filename, 'width': w, 'height': h, 'channels': 1 if gray.ndim == 2 else gray.shape[2], 'format': (file.filename or '').split('.')[-1].lower()}
    except Exception as e:
        raise HTTPException(400, str(e))
