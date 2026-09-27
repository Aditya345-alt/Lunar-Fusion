import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecuritySettingsModal({ isOpen, onClose }: SecuritySettingsModalProps) {
  const { authFetch, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"password" | "sessions">("password");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  // Sessions state
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessLoading, setSessLoading] = useState(false);
  const [sessMessage, setSessMessage] = useState("");
  const [sessError, setSessError] = useState("");

  useEffect(() => {
    if (isOpen && activeTab === "sessions") {
      fetchSessions();
    }
  }, [isOpen, activeTab]);

  const fetchSessions = async () => {
    setSessLoading(true);
    setSessError("");
    try {
      const res = await authFetch("/api/auth/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.data?.sessions || []);
      } else {
        setSessError("Failed to retrieve active session list.");
      }
    } catch {
      setSessError("Network error loading sessions.");
    } finally {
      setSessLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwLoading(true);
    setPwError("");
    setPwMessage("");

    try {
      const res = await authFetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPwError(data?.error?.message || "Failed to change password.");
        return;
      }
      setPwMessage("Password updated successfully. Other sessions have been signed out.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwError(err?.message || "Network error changing password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setSessLoading(true);
    setSessMessage("");
    setSessError("");
    try {
      const res = await authFetch("/api/auth/revoke-other-sessions", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSessMessage("All other sessions successfully revoked.");
        await fetchSessions();
      } else {
        setSessError(data?.error?.message || "Failed to revoke sessions.");
      }
    } catch {
      setSessError("Network error revoking sessions.");
    } finally {
      setSessLoading(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!window.confirm("This will log you out of all devices including this current window. Continue?")) return;
    try {
      await authFetch("/api/auth/revoke-all-sessions", { method: "POST" });
    } finally {
      await logout();
      onClose();
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1050,
      background: "rgba(0, 0, 0, 0.8)",
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
        maxWidth: 580,
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
              Security & Identity Center
            </span>
            <h3 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700 }}>
              Access Controls & Credentials
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

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: 10 }}>
          <button
            onClick={() => setActiveTab("password")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: activeTab === "password" ? "#3d5afe" : "rgba(255, 255, 255, 0.05)",
              color: activeTab === "password" ? "#fff" : "#8a8a8e",
              transition: "all 0.15s ease",
            }}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: activeTab === "sessions" ? "#3d5afe" : "rgba(255, 255, 255, 0.05)",
              color: activeTab === "sessions" ? "#fff" : "#8a8a8e",
              transition: "all 0.15s ease",
            }}
          >
            Active Devices & Sessions
          </button>
        </div>

        {activeTab === "password" ? (
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {pwMessage && (
              <div style={{ padding: "10px 14px", background: "rgba(104, 195, 137, 0.12)", border: "1px solid rgba(104, 195, 137, 0.3)", borderRadius: 8, fontSize: 12, color: "#68c389" }}>
                {pwMessage}
              </div>
            )}
            {pwError && (
              <div style={{ padding: "10px 14px", background: "rgba(255, 92, 108, 0.12)", border: "1px solid rgba(255, 92, 108, 0.3)", borderRadius: 8, fontSize: 12, color: "#ff5c6c" }}>
                {pwError}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a8a8e", marginBottom: 6, textTransform: "uppercase" }}>
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
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

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 18px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 10,
                  color: "#8a8a8e",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pwLoading}
                style={{
                  padding: "10px 20px",
                  background: "#3d5afe",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: pwLoading ? "not-allowed" : "pointer",
                  opacity: pwLoading ? 0.6 : 1,
                }}
              >
                {pwLoading ? "Saving…" : "Update Password"}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sessMessage && (
              <div style={{ padding: "10px 14px", background: "rgba(104, 195, 137, 0.12)", border: "1px solid rgba(104, 195, 137, 0.3)", borderRadius: 8, fontSize: 12, color: "#68c389" }}>
                {sessMessage}
              </div>
            )}
            {sessError && (
              <div style={{ padding: "10px 14px", background: "rgba(255, 92, 108, 0.12)", border: "1px solid rgba(255, 92, 108, 0.3)", borderRadius: 8, fontSize: 12, color: "#ff5c6c" }}>
                {sessError}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#8a8a8e" }}>
                {sessions.length} active session{sessions.length === 1 ? "" : "s"} authenticated
              </span>
              <button
                onClick={fetchSessions}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3d5afe",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ↻ Refresh List
              </button>
            </div>

            <div style={{
              maxHeight: 220,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingRight: 4,
            }}>
              {sessLoading && sessions.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: "#8a8a8e", fontSize: 12 }}>
                  Loading session data…
                </div>
              ) : sessions.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: "#8a8a8e", fontSize: 12 }}>
                  No other active sessions detected.
                </div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: s.is_current ? "rgba(61, 90, 254, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      border: `1px solid ${s.is_current ? "rgba(61, 90, 254, 0.35)" : "rgba(255, 255, 255, 0.06)"}`,
                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>
                          {s.ip_address || "Unknown IP"}
                        </span>
                        {s.is_current && (
                          <span style={{
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "#3d5afe",
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}>
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "#8a8a8e", marginTop: 2, maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.user_agent || "Web Browser"}
                      </div>
                      <div style={{ fontSize: 10, color: "#6a6a6e", marginTop: 2 }}>
                        Signed in: {new Date(s.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                type="button"
                onClick={handleRevokeOtherSessions}
                disabled={sessLoading || sessions.length <= 1}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "rgba(230, 167, 93, 0.15)",
                  border: "1px solid rgba(230, 167, 93, 0.3)",
                  borderRadius: 10,
                  color: "#e6a75d",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: (sessLoading || sessions.length <= 1) ? "not-allowed" : "pointer",
                  opacity: sessions.length <= 1 ? 0.5 : 1,
                }}
              >
                Revoke Other Sessions
              </button>
              <button
                type="button"
                onClick={handleRevokeAllSessions}
                disabled={sessLoading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "rgba(255, 92, 108, 0.15)",
                  border: "1px solid rgba(255, 92, 108, 0.3)",
                  borderRadius: 10,
                  color: "#ff5c6c",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: sessLoading ? "not-allowed" : "pointer",
                }}
              >
                Sign Out Everywhere
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
