import io
import sys
import unittest
from pathlib import Path

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from main import app
from auth import create_access_token
import numpy as np
import cv2

class TestLunarPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from database import init_tables
        from init_db import setup_database
        init_tables()
        setup_database()

        cls.client = TestClient(app)
        # Create test tokens
        cls.admin_token = create_access_token(user_id=1, email="admin@lunarfusion.isro.gov.in", role="admin")
        cls.researcher_token = create_access_token(user_id=2, email="researcher@lunarfusion.isro.gov.in", role="researcher")
        cls.viewer_token = create_access_token(user_id=3, email="viewer@lunarfusion.isro.gov.in", role="viewer")

        # Generate a synthetic lunar surface tile with identifiable crater features
        cls.test_img_bytes = cls._generate_synthetic_crater_tile(seed=42)
        cls.test_img_shifted = cls._generate_synthetic_crater_tile(seed=42, shift_x=10, shift_y=5)

    @staticmethod
    def _generate_synthetic_crater_tile(seed: int = 42, shift_x: int = 0, shift_y: int = 0) -> bytes:
        np.random.seed(seed)
        h, w = 300, 300
        canvas = np.full((h, w), 120, dtype=np.uint8)
        # Add craters
        craters = [(70, 70, 35), (180, 120, 50), (220, 220, 25), (80, 210, 40), (140, 180, 30)]
        for cx, cy, r in craters:
            cx += shift_x
            cy += shift_y
            cv2.circle(canvas, (cx, cy), r, (60,), -1)
            cv2.circle(canvas, (cx, cy), r, (180,), 3)
            cv2.circle(canvas, (cx - r//3, cy - r//3), r//2, (40,), -1)
        # Add texture noise
        noise = np.random.normal(0, 8, (h, w)).astype(np.int16)
        textured = np.clip(canvas.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        _, buf = cv2.imencode('.png', textured)
        return buf.tobytes()

    def test_01_health_endpoint(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["service"], "Lunar Fusion API")
        self.assertEqual(data["location_retrieval"], "enabled")

    def test_02_catalog_status(self):
        res = self.client.get("/api/catalog/status")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("indexed_tiles", data)
        self.assertIn("ready", data)

    def test_03_demo_samples(self):
        res = self.client.get("/api/demo/samples")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("source", data)
        self.assertIn("reference", data)

        res_src = self.client.get("/api/demo/sample-source")
        self.assertEqual(res_src.status_code, 200)
        self.assertEqual(res_src.headers["content-type"], "image/png")

        res_ref = self.client.get("/api/demo/sample-reference")
        self.assertEqual(res_ref.status_code, 200)
        self.assertEqual(res_ref.headers["content-type"], "image/png")

    def test_04_metadata_endpoint(self):
        # Valid PNG metadata
        res = self.client.post(
            "/api/metadata",
            files={"file": ("test_crater.png", io.BytesIO(self.test_img_bytes), "image/png")}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["width"], 300)
        self.assertEqual(data["height"], 300)
        self.assertEqual(data["format"], "png")

        # Empty file validation error
        res_empty = self.client.post(
            "/api/metadata",
            files={"file": ("empty.png", io.BytesIO(b""), "image/png")}
        )
        self.assertEqual(res_empty.status_code, 400)

        # Invalid file extension validation error
        res_invalid_ext = self.client.post(
            "/api/metadata",
            files={"file": ("malicious.exe", io.BytesIO(b"MZ12345"), "application/octet-stream")}
        )
        self.assertEqual(res_invalid_ext.status_code, 415)

    def test_05_locate_endpoint(self):
        headers = {"Authorization": f"Bearer {self.researcher_token}"}
        res = self.client.post(
            "/api/locate",
            headers=headers,
            data={"sensor": "OHRC", "top_k": 3},
            files={"file": ("query_tile.png", io.BytesIO(self.test_img_bytes), "image/png")}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("status", data)
        self.assertIn("candidates", data)

    def test_06_match_pipeline_with_ransac(self):
        headers = {"Authorization": f"Bearer {self.researcher_token}"}
        res = self.client.post(
            "/api/match",
            headers=headers,
            data={
                "sensor": "OHRC",
                "method": "RANSAC",
                "ratio": 0.85,
                "ransac_thresh": 4.0,
                "min_matches": 4,
            },
            files={
                "source": ("ohrc_source.png", io.BytesIO(self.test_img_bytes), "image/png"),
                "reference": ("lro_reference.png", io.BytesIO(self.test_img_shifted), "image/png")
            }
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("status", data)
        self.assertIn("candidate_matches", data)
        self.assertIn("inliers", data)
        self.assertIn("source_preview", data)
        self.assertIn("reference_preview", data)
        self.assertIn("matches_preview", data)

    def test_07_viewer_role_forbidden_on_matching(self):
        # Viewer is read-only and cannot execute matching
        headers = {"Authorization": f"Bearer {self.viewer_token}"}
        res = self.client.post(
            "/api/match",
            headers=headers,
            data={"sensor": "OHRC"},
            files={
                "source": ("src.png", io.BytesIO(self.test_img_bytes), "image/png"),
                "reference": ("ref.png", io.BytesIO(self.test_img_shifted), "image/png")
            }
        )
        self.assertEqual(res.status_code, 403)

if __name__ == "__main__":
    unittest.main()
