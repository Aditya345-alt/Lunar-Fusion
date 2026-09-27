import os
import sys
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Use isolated test database with long secure secret
os.environ["DATABASE_URL"] = "sqlite:///./test_auth_suite.db"
os.environ["JWT_SECRET_KEY"] = "test-jwt-secret-key-12345-super-secure-32bytes!"
os.environ["COOKIE_SECURE"] = "false"

from fastapi.testclient import TestClient
from database import init_tables, get_connection
from main import app
from auth import hash_token, create_password_reset_token

class LunarFusionAuthTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Reset test database
        test_db_path = BACKEND_DIR / "test_auth_suite.db"
        for p in [test_db_path, BACKEND_DIR / "test_auth_suite.db-wal", BACKEND_DIR / "test_auth_suite.db-shm"]:
            if p.exists():
                try:
                    p.unlink()
                except Exception:
                    pass
        init_tables()
        from init_db import setup_database
        setup_database()
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        test_db_path = BACKEND_DIR / "test_auth_suite.db"
        for p in [test_db_path, BACKEND_DIR / "test_auth_suite.db-wal", BACKEND_DIR / "test_auth_suite.db-shm"]:
            if p.exists():
                try:
                    p.unlink()
                except Exception:
                    pass

    def setUp(self):
        # Clear cookies before each test for clean isolation
        self.client.cookies.clear()

    def test_01_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ok")
        self.assertIn("auth", data)

    def test_02_login_seeded_accounts(self):
        # Test Admin Login
        res = self.client.post("/api/auth/login", json={
            "email": "admin@lunarfusion.isro.gov.in",
            "password": "Admin@Lunar2026!"
        })
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertTrue(body["success"])
        self.assertEqual(body["data"]["user"]["role"], "admin")
        self.assertIn("access_token", body["data"])

        # Test Researcher Login
        res_r = self.client.post("/api/auth/login", json={
            "email": "researcher@lunarfusion.isro.gov.in",
            "password": "Research@Lunar2026!"
        })
        self.assertEqual(res_r.status_code, 200)
        self.assertEqual(res_r.json()["data"]["user"]["role"], "researcher")

        # Test Viewer Login
        res_v = self.client.post("/api/auth/login", json={
            "email": "viewer@lunarfusion.isro.gov.in",
            "password": "Viewer@Lunar2026!"
        })
        self.assertEqual(res_v.status_code, 200)
        self.assertEqual(res_v.json()["data"]["user"]["role"], "viewer")

    def test_03_login_failure_cases(self):
        # Wrong password
        res = self.client.post("/api/auth/login", json={
            "email": "admin@lunarfusion.isro.gov.in",
            "password": "WrongPassword123!"
        })
        self.assertEqual(res.status_code, 401)
        self.assertFalse(res.json()["success"])
        self.assertEqual(res.json()["error"]["code"], "AUTHENTICATION_FAILED")

        # Non-existent email
        res2 = self.client.post("/api/auth/login", json={
            "email": "nonexistent@lunarfusion.isro.gov.in",
            "password": "Password123!"
        })
        self.assertEqual(res2.status_code, 401)

    def test_04_user_registration(self):
        # Weak password rejection (missing number/special char)
        res_weak = self.client.post("/api/auth/register", json={
            "name": "Dr. Vikram Sarabhai",
            "email": "vikram@isro.gov.in",
            "password": "SimplePassword",
            "confirm_password": "SimplePassword"
        })
        self.assertEqual(res_weak.status_code, 422)

        # Successful registration
        res = self.client.post("/api/auth/register", json={
            "name": "Dr. Vikram Sarabhai",
            "email": "vikram@isro.gov.in",
            "password": "SecureLunar2026!#",
            "confirm_password": "SecureLunar2026!#"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()["data"]
        self.assertEqual(data["user"]["email"], "vikram@isro.gov.in")
        self.assertIn("access_token", data)
        self.assertIn("verification_token_dev", data)

        # Duplicate email rejection
        res_dup = self.client.post("/api/auth/register", json={
            "name": "Another Vikram",
            "email": "vikram@isro.gov.in",
            "password": "SecureLunar2026!#",
            "confirm_password": "SecureLunar2026!#"
        })
        self.assertEqual(res_dup.status_code, 400)
        self.assertEqual(res_dup.json()["error"]["code"], "EMAIL_ALREADY_REGISTERED")

    def test_05_email_verification(self):
        res = self.client.post("/api/auth/register", json={
            "name": "Test Verif",
            "email": "verif@isro.gov.in",
            "password": "SecureLunar2026!#",
            "confirm_password": "SecureLunar2026!#"
        })
        self.assertEqual(res.status_code, 200)
        raw_token = res.json()["data"]["verification_token_dev"]
        
        v_res = self.client.post("/api/auth/verify-email", json={"token": raw_token})
        self.assertEqual(v_res.status_code, 200)
        self.assertTrue(v_res.json()["success"])

    def test_06_current_user_and_sessions(self):
        # Login as researcher
        login_res = self.client.post("/api/auth/login", json={
            "email": "researcher@lunarfusion.isro.gov.in",
            "password": "Research@Lunar2026!"
        })
        token = login_res.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # /api/auth/me
        me_res = self.client.get("/api/auth/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.json()["data"]["user"]["email"], "researcher@lunarfusion.isro.gov.in")

        # /api/auth/sessions
        sess_res = self.client.get("/api/auth/sessions", headers=headers)
        self.assertEqual(sess_res.status_code, 200)
        self.assertGreater(len(sess_res.json()["data"]["sessions"]), 0)

    def test_07_rbac_endpoint_protection(self):
        # Unauthenticated request to /api/locate should fail with 401
        self.client.cookies.clear()
        res_unauth = self.client.post(
            "/api/locate",
            files={"file": ("dummy.png", b"\x89PNG\r\n\x1a\nfake", "image/png")}
        )
        self.assertEqual(res_unauth.status_code, 401)
        self.assertEqual(res_unauth.json()["error"]["code"], "AUTHENTICATION_REQUIRED")

        # Viewer request to /api/locate should fail with 403 Forbidden
        v_login = self.client.post("/api/auth/login", json={
            "email": "viewer@lunarfusion.isro.gov.in",
            "password": "Viewer@Lunar2026!"
        })
        v_token = v_login.json()["data"]["access_token"]
        res_viewer = self.client.post(
            "/api/locate",
            headers={"Authorization": f"Bearer {v_token}"},
            files={"file": ("dummy.png", b"\x89PNG\r\n\x1a\nfake", "image/png")}
        )
        self.assertEqual(res_viewer.status_code, 403)
        self.assertEqual(res_viewer.json()["error"]["code"], "FORBIDDEN")

    def test_08_admin_panel_endpoints(self):
        # Researcher trying to access /api/admin/users should be forbidden (403)
        r_login = self.client.post("/api/auth/login", json={
            "email": "researcher@lunarfusion.isro.gov.in",
            "password": "Research@Lunar2026!"
        })
        r_token = r_login.json()["data"]["access_token"]
        res_r_admin = self.client.get("/api/admin/users", headers={"Authorization": f"Bearer {r_token}"})
        self.assertEqual(res_r_admin.status_code, 403)

        # Admin accessing /api/admin/users should succeed (200)
        a_login = self.client.post("/api/auth/login", json={
            "email": "admin@lunarfusion.isro.gov.in",
            "password": "Admin@Lunar2026!"
        })
        a_token = a_login.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {a_token}"}
        
        users_res = self.client.get("/api/admin/users", headers=headers)
        self.assertEqual(users_res.status_code, 200)
        users = users_res.json()["data"]["users"]
        self.assertGreaterEqual(len(users), 3)

        # Admin accessing /api/admin/system
        sys_res = self.client.get("/api/admin/system", headers=headers)
        self.assertEqual(sys_res.status_code, 200)
        self.assertEqual(sys_res.json()["data"]["status"], "HEALTHY")

    def test_09_forgot_and_reset_password(self):
        # Forgot password request (generic message)
        res = self.client.post("/api/auth/forgot-password", json={
            "email": "researcher@lunarfusion.isro.gov.in"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("If an account exists", res.json()["data"]["message"])

        # Generate a test raw token for reset
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT id FROM users WHERE email = 'researcher@lunarfusion.isro.gov.in'")
        uid = c.fetchone()["id"]
        conn.close()
        raw_reset_token = create_password_reset_token(uid)

        # Reset password
        reset_res = self.client.post("/api/auth/reset-password", json={
            "token": raw_reset_token,
            "new_password": "NewResearchPassword@2026!",
            "confirm_password": "NewResearchPassword@2026!"
        })
        self.assertEqual(reset_res.status_code, 200)

        # Verify old password fails
        self.client.cookies.clear()
        fail_login = self.client.post("/api/auth/login", json={
            "email": "researcher@lunarfusion.isro.gov.in",
            "password": "Research@Lunar2026!"
        })
        self.assertEqual(fail_login.status_code, 401)

        # Verify new password succeeds
        ok_login = self.client.post("/api/auth/login", json={
            "email": "researcher@lunarfusion.isro.gov.in",
            "password": "NewResearchPassword@2026!"
        })
        self.assertEqual(ok_login.status_code, 200)

if __name__ == "__main__":
    unittest.main()
