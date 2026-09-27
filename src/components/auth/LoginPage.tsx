import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Wallpaper from "../../Wallpaper";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface LoginPageProps {
  onSuccess?: () => void;
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // UX & status states
  const [loading, setLoading] = useState(false);
  const [authStage, setAuthStage] = useState<"idle" | "authenticating" | "success">("idle");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devVerifToken, setDevVerifToken] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Password requirements live check
  const hasMinLen = regPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(regPassword);
  const hasLower = /[a-z]/.test(regPassword);
  const hasNum = /[0-9]/.test(regPassword);
  const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(regPassword);
  const passwordsMatch = regPassword && regPassword === regConfirmPassword;
  const passwordScore = [hasMinLen, hasUpper, hasLower, hasNum, hasSpec].filter(Boolean).length;

  const handleQuickFill = (role: "admin" | "researcher" | "viewer") => {
    setError("");
    if (role === "admin") {
      setLoginEmail("admin@lunarfusion.isro.gov.in");
      setLoginPassword("Admin@Lunar2026!");
    } else if (role === "researcher") {
      setLoginEmail("researcher@lunarfusion.isro.gov.in");
      setLoginPassword("Research@Lunar2026!");
    } else {
      setLoginEmail("viewer@lunarfusion.isro.gov.in");
      setLoginPassword("Viewer@Lunar2026!");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setError("");
    setLoading(true);
    setAuthStage("authenticating");

    const result = await login(loginEmail, loginPassword, rememberMe);
    if (result.success) {
      setAuthStage("success");
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 500);
    } else {
      setAuthStage("idle");
      setError(result.error || "Invalid email or password.");
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordScore < 5) {
      setError("Password does not meet all security requirements.");
      return;
    }

    setError("");
    setLoading(true);
    setAuthStage("authenticating");

    const result = await register(regName, regEmail, regPassword, regConfirmPassword);
    if (result.success) {
      setAuthStage("success");
      setSuccessMsg(result.message || "Please verify your email address.");
      if (result.tokenDev) {
        setDevVerifToken(result.tokenDev);
      }
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 800);
    } else {
      setAuthStage("idle");
      setError(result.error || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: '"Geist", system-ui, sans-serif' }}>
      <Wallpaper />

      {/* Subtle Orbital Reticle Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(61, 90, 254, 0.08) 0%, transparent 60%),
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        zIndex: 1,
      }} />

      {/* Main Authentication Card */}
      <div style={{
        position: "relative",
        zIndex: 10,
        maxWidth: 460,
        width: "90%",
        margin: "40px auto",
        background: "rgba(12, 16, 28, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 24,
        padding: "36px 36px 30px",
        boxShadow: "0 24px 70px rgba(0, 0, 0, 0.75), 0 0 40px rgba(61, 90, 254, 0.12)",
        color: "#ffffff",
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 12px",
            borderRadius: 20,
            background: "rgba(61, 90, 254, 0.12)",
            border: "1px solid rgba(61, 90, 254, 0.3)",
            marginBottom: 12,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3d5afe" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#8bb2ff", textTransform: "uppercase" }}>
              SIH 2026 · ISRO Dept. of Space
            </span>
          </div>

          <h1 style={{
            margin: 0,
            fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
          }}>
            LUNAR FUSION
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#8a8a8e", lineHeight: 1.4 }}>
            AI-Powered Multi-Modal Lunar Image Correspondence
          </p>
          <div style={{ fontSize: 11, color: "#60729e", marginTop: 4, fontWeight: 600, letterSpacing: "0.04em" }}>
            Secure Access to Lunar Vision Systems
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: 12,
          padding: 3,
          marginBottom: 20,
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 9,
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: mode === "login" ? "#3d5afe" : "transparent",
              color: mode === "login" ? "#ffffff" : "#8a8a8e",
              transition: "all 0.18s ease",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 9,
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: mode === "register" ? "#3d5afe" : "transparent",
              color: mode === "register" ? "#ffffff" : "#8a8a8e",
              transition: "all 0.18s ease",
            }}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(255, 92, 108, 0.12)",
            border: "1px solid rgba(255, 92, 108, 0.3)",
            borderRadius: 10,
            fontSize: 12,
            color: "#ff5c6c",
            marginBottom: 16,
            lineHeight: 1.4,
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(104, 195, 137, 0.12)",
            border: "1px solid rgba(104, 195, 137, 0.3)",
            borderRadius: 10,
            fontSize: 12,
            color: "#68c389",
            marginBottom: 16,
            lineHeight: 1.4,
          }}>
            {successMsg}
            {devVerifToken && (
              <div style={{ marginTop: 6, fontSize: 11, fontFamily: "monospace", color: "#a3e635" }}>
                Dev Token: {devVerifToken}
              </div>
            )}
          </div>
        )}

        {/* Form Body */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Identity / Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="researcher@lunarfusion.isro.gov.in"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#8a8a8e", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "#7ca5ff",
                    fontSize: 11,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 40px 11px 14px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#8a8a8e",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "#3d5afe", cursor: "pointer" }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: 12, color: "#8a8a8e", cursor: "pointer", userSelect: "none" }}>
                Remember this terminal session
              </label>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: 6,
                borderRadius: 12,
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                background: authStage === "success" ? "#10b981" : "#3d5afe",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 20px rgba(61, 90, 254, 0.4)",
              }}
            >
              {authStage === "authenticating"
                ? "Authenticating Lunar Fusion…"
                : authStage === "success"
                ? "Authentication Successful ✓"
                : "Authorize Access →"}
            </button>

            {/* Quick-Fill Dev Role Accounts */}
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: 12, paddingTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#6b7280", textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>
                Quick-Load Evaluation Personnel
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => handleQuickFill("researcher")}
                  style={{
                    padding: "6px 4px",
                    borderRadius: 8,
                    border: "1px solid rgba(61, 90, 254, 0.3)",
                    background: "rgba(61, 90, 254, 0.08)",
                    color: "#7ca5ff",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Researcher
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("admin")}
                  style={{
                    padding: "6px 4px",
                    borderRadius: 8,
                    border: "1px solid rgba(230, 167, 93, 0.3)",
                    background: "rgba(230, 167, 93, 0.08)",
                    color: "#e6a75d",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("viewer")}
                  style={{
                    padding: "6px 4px",
                    borderRadius: 8,
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#cbd5e1",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Viewer
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 5, textTransform: "uppercase" }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Dr. K. Sivan"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 9,
                  color: "#fff",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 5, textTransform: "uppercase" }}>
                Official Email
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@isro.gov.in"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 9,
                  color: "#fff",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 5, textTransform: "uppercase" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 9,
                  color: "#fff",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 5, textTransform: "uppercase" }}>
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${regConfirmPassword ? (passwordsMatch ? "rgba(104, 195, 137, 0.5)" : "rgba(255, 92, 108, 0.5)") : "rgba(255, 255, 255, 0.12)"}`,
                  borderRadius: 9,
                  color: "#fff",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            {/* Password Strength Checklist */}
            <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: 10, padding: "8px 12px", fontSize: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#8a8a8e" }}>
                <span>Security Standard</span>
                <span style={{ color: passwordScore === 5 ? "#68c389" : passwordScore >= 3 ? "#e6a75d" : "#ff5c6c", fontWeight: 700 }}>
                  {passwordScore === 5 ? "Strong" : passwordScore >= 3 ? "Medium" : "Weak"}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, fontSize: 10 }}>
                <span style={{ color: hasMinLen ? "#68c389" : "#6a6a70" }}>{hasMinLen ? "✓" : "○"} 8+ Characters</span>
                <span style={{ color: hasUpper ? "#68c389" : "#6a6a70" }}>{hasUpper ? "✓" : "○"} Uppercase (A-Z)</span>
                <span style={{ color: hasLower ? "#68c389" : "#6a6a70" }}>{hasLower ? "✓" : "○"} Lowercase (a-z)</span>
                <span style={{ color: hasNum ? "#68c389" : "#6a6a70" }}>{hasNum ? "✓" : "○"} Number (0-9)</span>
                <span style={{ color: hasSpec ? "#68c389" : "#6a6a70" }}>{hasSpec ? "✓" : "○"} Symbol (!@#$)</span>
                <span style={{ color: passwordsMatch ? "#68c389" : "#6a6a70" }}>{passwordsMatch ? "✓" : "○"} Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || passwordScore < 5 || !passwordsMatch}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: 4,
                borderRadius: 12,
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                background: passwordScore === 5 && passwordsMatch ? "#3d5afe" : "rgba(255, 255, 255, 0.1)",
                cursor: (loading || passwordScore < 5 || !passwordsMatch) ? "not-allowed" : "pointer",
                opacity: (passwordScore < 5 || !passwordsMatch) ? 0.6 : 1,
              }}
            >
              {loading ? "Registering Personnel…" : "Create Research Account →"}
            </button>
          </form>
        )}
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
      />
    </div>
  );
}
