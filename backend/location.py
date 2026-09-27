import os
import shutil
import tempfile
from pathlib import Path
import sqlite3, json, base64

import cv2, numpy as np

BACKEND_DIR = Path(__file__).resolve().parent
DEFAULT_DB_PATH = BACKEND_DIR / 'lunar_catalog.db'
DEFAULT_INDEX_DIR = BACKEND_DIR / 'catalog_tiles'

def is_dir_writable(path: Path) -> bool:
    try:
        path.mkdir(parents=True, exist_ok=True)
        test_file = path / f".write_test_{os.getpid()}"
        test_file.touch()
        test_file.unlink()
        return True
    except Exception:
        return False

def get_catalog_db_path() -> Path:
    if os.getenv("VERCEL") == "1" or not is_dir_writable(DEFAULT_DB_PATH.parent):
        tmp_dir = Path(tempfile.gettempdir()) / "lunar_fusion"
        tmp_dir.mkdir(parents=True, exist_ok=True)
        tmp_db = tmp_dir / "lunar_catalog.db"
        if not tmp_db.exists() and DEFAULT_DB_PATH.exists():
            try:
                shutil.copy2(DEFAULT_DB_PATH, tmp_db)
            except Exception as e:
                print(f"[WARN] Failed to copy lunar_catalog.db to temp dir: {e}")
        return tmp_db
    return DEFAULT_DB_PATH

def get_index_dir() -> Path:
    if os.getenv("VERCEL") == "1" or not is_dir_writable(DEFAULT_INDEX_DIR):
        tmp_tiles = Path(tempfile.gettempdir()) / "lunar_fusion" / "catalog_tiles"
        tmp_tiles.mkdir(parents=True, exist_ok=True)
        return tmp_tiles
    DEFAULT_INDEX_DIR.mkdir(parents=True, exist_ok=True)
    return DEFAULT_INDEX_DIR

def resolve_tile_path(raw_path: str) -> Path | None:
    p = Path(raw_path)
    candidates = [
        p,
        DEFAULT_INDEX_DIR / p.name,
        Path(tempfile.gettempdir()) / "lunar_fusion" / "catalog_tiles" / p.name,
        BACKEND_DIR / "catalog_tiles" / p.name,
        BACKEND_DIR / "demo_tiles" / p.name,
    ]
    for cand in candidates:
        if cand.exists():
            return cand.resolve()
    return None

def db():
    db_path = get_catalog_db_path()
    c = sqlite3.connect(str(db_path), timeout=30.0)
    c.execute('''CREATE TABLE IF NOT EXISTS tiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, sensor TEXT,
        latitude REAL NOT NULL, longitude REAL NOT NULL, resolution_m REAL,
        sun_azimuth REAL, sun_elevation REAL, path TEXT NOT NULL, embedding TEXT NOT NULL)''')
    c.commit(); return c


def embedding(gray):
    gray = cv2.resize(gray, (64, 64), interpolation=cv2.INTER_AREA)
    gray = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    # illumination-tolerant multi-scale representation: gradients + coarse intensity histogram
    gx = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
    mag = cv2.magnitude(gx, gy)
    small = cv2.resize(gray, (16, 16), interpolation=cv2.INTER_AREA).astype(np.float32) / 255.0
    hist = cv2.calcHist([gray], [0], None, [32], [0,256]).ravel().astype(np.float32)
    hist /= max(hist.sum(), 1.0)
    vec = np.concatenate([small.ravel(), hist, cv2.resize(mag,(16,16)).ravel()])
    vec = vec.astype(np.float32); vec /= max(np.linalg.norm(vec), 1e-8)
    return vec


def add_tile(data: bytes, filename: str, sensor: str, lat: float, lon: float, resolution_m=None, sun_azimuth=None, sun_elevation=None):
    arr = np.frombuffer(data, np.uint8); img = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
    if img is None: raise ValueError('Unsupported/corrupt image')
    vec = embedding(img)
    key = f'{abs(hash((filename,lat,lon))) & 0xffffffff:08x}'
    idx_dir = get_index_dir()
    path = idx_dir / f'{key}_{Path(filename).name}'
    path.write_bytes(data)
    c=db(); c.execute('INSERT INTO tiles(filename,sensor,latitude,longitude,resolution_m,sun_azimuth,sun_elevation,path,embedding) VALUES(?,?,?,?,?,?,?,?,?)',
        (filename,sensor,lat,lon,resolution_m,sun_azimuth,sun_elevation,str(path),json.dumps(vec.tolist())))
    c.commit(); tid=c.execute('SELECT last_insert_rowid()').fetchone()[0]; c.close(); return tid


def search_tiles(data: bytes, sensor: str|None, top_k=5):
    arr=np.frombuffer(data,np.uint8); img=cv2.imdecode(arr,cv2.IMREAD_GRAYSCALE)
    if img is None: raise ValueError('Unsupported/corrupt image')
    q=embedding(img)
    c=db(); rows=c.execute('SELECT id,filename,sensor,latitude,longitude,resolution_m,sun_azimuth,sun_elevation,path,embedding FROM tiles').fetchall(); c.close()
    scored=[]
    for r in rows:
        if sensor and r[2] not in ('LRO-NAC','REFERENCE',sensor): continue
        v=np.asarray(json.loads(r[9]),dtype=np.float32); sim=float(np.dot(q,v)/(np.linalg.norm(q)*max(np.linalg.norm(v),1e-8)))
        scored.append((sim,r))
    scored.sort(reverse=True,key=lambda x:x[0])
    out=[]
    for sim,r in scored[:top_k]:
        preview=None
        p = resolve_tile_path(r[8])
        if p and p.exists():
            try: preview='data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode('ascii')
            except Exception: pass
        out.append({'tile_id':r[0],'filename':r[1],'sensor':r[2],'latitude':r[3],'longitude':r[4],'resolution_m':r[5],'sun_azimuth':r[6],'sun_elevation':r[7],'similarity':round(sim*100,2),'path':str(p or r[8]),'preview':preview})
    return out


def get_tile(tile_id):
    c=db(); r=c.execute('SELECT id,filename,sensor,latitude,longitude,resolution_m,sun_azimuth,sun_elevation,path FROM tiles WHERE id=?',(tile_id,)).fetchone(); c.close()
    if not r: return None
    p = resolve_tile_path(r[8])
    return {'tile_id':r[0],'filename':r[1],'sensor':r[2],'latitude':r[3],'longitude':r[4],'resolution_m':r[5],'sun_azimuth':r[6],'sun_elevation':r[7],'path':str(p or r[8])}


if __name__ == '__main__':
    print("==================================================")
    print(" Lunar Fusion — Location Retrieval Engine")
    print("==================================================")
    print(f"Database:  {DB_PATH.resolve()}")
    print(f"Tile Dir:  {INDEX_DIR.resolve()}")
    conn = db()
    count = conn.execute("SELECT count(*) FROM tiles").fetchone()[0]
    print(f"Status:    {count} indexed tiles available")
    if count > 0:
        print("\nSample Indexed Tiles:")
        rows = conn.execute("SELECT id, filename, sensor, latitude, longitude, resolution_m FROM tiles LIMIT 4").fetchall()
        for r in rows:
            print(f"  * Tile #{r[0]}: {r[1]} [{r[2]}] at Lat {r[3]:.2f}°, Lon {r[4]:.2f}° ({r[5]} m/px)")
    conn.close()
    print("\nReady! Starting API server: python -m uvicorn main:app --reload --port 8000")

