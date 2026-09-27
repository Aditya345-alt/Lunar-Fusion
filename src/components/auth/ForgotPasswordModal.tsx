import React, { useState } from "react";
import { apiUrl } from "../../config/api";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data?.data?.message || "If an account exists with this email, a password reset link has been sent.");
      setStep("reset");
    } catch (err: any) {
      setError(err?.message || "Failed to process password reset request.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data?.error?.message || "Failed to reset password.");
        return;
      }
      setMessage("Password successfully reset! You can now log in with your new password.");
      setTimeout(() => {
        onClose();
        setStep("request");
        setEmail("");
        setToken("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Network error during password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1100,
      background: "rgba(0, 0, 0, 0.82)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "rgba(14, 18, 30, 0.96)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 20,
        padding: "28px 32px",
        maxWidth: 440,
        width: "100%",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(61, 90, 254, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        color: "#fff",
        fontFamily: '"Geist", system-ui, sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: "0.12em", fontWeight: 700, color: "#3d5afe", textTransform: "uppercase" }}>
              Lunar Fusion Security
            </span>
            <h3 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700 }}>
              {step === "request" ? "Reset Password" : "Set New Password"}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#8a8a8e",
              fontSize: 20,
              cursor: "pointer",
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Feedback message */}
        {message && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(104, 195, 137, 0.12)",
            border: "1px solid rgba(104, 195, 137, 0.3)",
            borderRadius: 8,
            fontSize: 12,
            color: "#68c389",
            lineHeight: 1.4,
          }}>
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(255, 92, 108, 0.12)",
            border: "1px solid rgba(255, 92, 108, 0.3)",
            borderRadius: 8,
            fontSize: 12,
            color: "#ff5c6c",
            lineHeight: 1.4,
          }}>
            {error}
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={handleRequestReset} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: 0, fontSize: 12, color: "#8a8a8e", lineHeight: 1.5 }}>
              Enter your registered ISRO / research email address. If an account is found, a secure reset token will be dispatched.
            </p>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@isro.gov.in"
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
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setStep("reset")}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 10,
                  color: "#8a8a8e",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                I have a token
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "#3d5afe",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 6, textTransform: "uppercase" }}>
                Reset Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token received via email/server log"
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
                  fontFamily: "monospace",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 6, textTransform: "uppercase" }}>
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, uppercase, number & symbol"
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
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 6, textTransform: "uppercase" }}>
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
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
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setStep("request")}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 10,
                  color: "#8a8a8e",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "#3d5afe",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
