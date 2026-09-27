import React, { useState, useEffect } from "react";
import { useAuth, UserRole } from "../../context/AuthContext";

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const { user, authFetch } = useAuth();
  const [tab, setTab] = useState<"users" | "sessions" | "system">("users");

  // User management state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userMsg, setUserMsg] = useState("");
  const [userErr, setUserErr] = useState("");

  // Sessions state
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // System status state
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [loadingSystem, setLoadingSystem] = useState(false);

  useEffect(() => {
    if (isOpen && user?.role === "admin") {
      if (tab === "users") fetchUsers();
      if (tab === "sessions") fetchAdminSessions();
      if (tab === "system") fetchSystemDiagnostics();
    }
  }, [isOpen, tab, user]);

  if (!isOpen || user?.role !== "admin") return null;

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserErr("");
    try {
      const res = await authFetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.data?.users || []);
      } else {
        setUserErr(data?.error?.message || "Failed to fetch user list.");
      }
    } catch {
      setUserErr("Network error fetching user roster.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAdminSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await authFetch("/api/admin/sessions");
      const data = await res.json();
      if (res.ok && data.success) {
        setSessions(data.data?.sessions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchSystemDiagnostics = async () => {
    setLoadingSystem(true);
    try {
      const res = await authFetch("/api/admin/system");
      const data = await res.json();
      if (res.ok && data.success) {
        setSystemInfo(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingSystem(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      const res = await authFetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserMsg(`Role updated to ${newRole.toUpperCase()} for user #${userId}.`);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      } else {
        setUserErr(data?.error?.message || "Failed to update role.");
      }
    } catch {
      setUserErr("Network error updating role.");
    }
  };

  const handleStatusToggle = async (userId: number, currentActive: boolean) => {
    try {
      const newStatus = !currentActive;
      const res = await authFetch(`/api/admin/users/${userId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserMsg(`User #${userId} has been ${newStatus ? "ACTIVATED" : "DEACTIVATED"}.`);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: newStatus } : u)));
      } else {
        setUserErr(data?.error?.message || "Failed to change status.");
      }
    } catch {
      setUserErr("Network error changing user status.");
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    try {
      const res = await authFetch(`/api/admin/sessions/${sessionId}/revoke`, { method: "POST" });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1100,
      background: "rgba(0, 0, 0, 0.84)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "rgba(12, 16, 28, 0.98)",
        border: "1px solid rgba(61, 90, 254, 0.25)",
        borderRadius: 22,
        padding: "26px 32px",
        maxWidth: 780,
        width: "100%",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        color: "#fff",
        fontFamily: '"Geist", system-ui, sans-serif',
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(61, 90, 254, 0.15)",
      }}>
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, letterSpacing: "0.12em", fontWeight: 800, color: "#e6a75d", background: "rgba(230, 167, 93, 0.15)", padding: "2px 8px", borderRadius: 4 }}>
                RESTRICTED
              </span>
              <span style={{ fontSize: 11, letterSpacing: "0.08em", color: "#8a8a8e", textTransform: "uppercase" }}>
                Command & Telemetry
              </span>
            </div>
            <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700 }}>
              Lunar Fusion Administrative Console
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#8a8a8e",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: 10 }}>
          {[
            { id: "users", label: "User Accounts & Roles" },
            { id: "sessions", label: "Global Sessions" },
            { id: "system", label: "System & API Health" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                background: tab === t.id ? "#3d5afe" : "rgba(255, 255, 255, 0.05)",
                color: tab === t.id ? "#fff" : "#8a8a8e",
                transition: "all 0.15s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* User Notifications */}
        {userMsg && (
          <div style={{ padding: "8px 12px", background: "rgba(104, 195, 137, 0.12)", border: "1px solid rgba(104, 195, 137, 0.3)", borderRadius: 8, fontSize: 12, color: "#68c389" }}>
            {userMsg}
          </div>
        )}
        {userErr && (
          <div style={{ padding: "8px 12px", background: "rgba(255, 92, 108, 0.12)", border: "1px solid rgba(255, 92, 108, 0.3)", borderRadius: 8, fontSize: 12, color: "#ff5c6c" }}>
            {userErr}
          </div>
        )}

        {/* Tab Content */}
        <div style={{ overflowY: "auto", flex: 1, paddingRight: 4 }}>
          {tab === "users" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {loadingUsers ? (
                <div style={{ padding: 24, textAlign: "center", color: "#8a8a8e", fontSize: 13 }}>
                  Loading registered personnel…
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {users.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.07)",
                        borderRadius: 12,
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{u.name}</span>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: u.role === "admin" ? "rgba(230, 167, 93, 0.2)" : u.role === "researcher" ? "rgba(61, 90, 254, 0.2)" : "rgba(255, 255, 255, 0.1)",
                            color: u.role === "admin" ? "#e6a75d" : u.role === "researcher" ? "#7ca5ff" : "#8a8a8e",
                            textTransform: "uppercase",
                          }}>
                            {u.role}
                          </span>
                          {!u.is_active && (
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "rgba(255, 92, 108, 0.2)", color: "#ff5c6c" }}>
                              DEACTIVATED
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "#8a8a8e", marginTop: 2 }}>{u.email}</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                          Registered: {new Date(u.created_at).toLocaleDateString()} · Last: {u.last_login ? new Date(u.last_login).toLocaleTimeString() : "Never"}
                        </div>
                      </div>

                      {/* Controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <select
                          value={u.role}
                          disabled={u.id === user?.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                            outline: "none",
                            cursor: u.id === user?.id ? "not-allowed" : "pointer",
                          }}
                        >
                          <option value="researcher" style={{ background: "#111" }}>Researcher</option>
                          <option value="admin" style={{ background: "#111" }}>Admin</option>
                          <option value="viewer" style={{ background: "#111" }}>Viewer</option>
                        </select>

                        <button
                          type="button"
                          disabled={u.id === user?.id}
                          onClick={() => handleStatusToggle(u.id, !!u.is_active)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "none",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: u.id === user?.id ? "not-allowed" : "pointer",
                            background: u.is_active ? "rgba(255, 92, 108, 0.15)" : "rgba(104, 195, 137, 0.15)",
                            color: u.is_active ? "#ff5c6c" : "#68c389",
                            opacity: u.id === user?.id ? 0.4 : 1,
                          }}
                        >
                          {u.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "sessions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {loadingSessions ? (
                <div style={{ padding: 24, textAlign: "center", color: "#8a8a8e", fontSize: 13 }}>
                  Scanning cluster active tokens…
                </div>
              ) : sessions.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "#8a8a8e", fontSize: 13 }}>
                  No active sessions found.
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
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{s.email}</span>
                        <span style={{ fontSize: 11, color: "#8a8a8e" }}>({s.ip_address})</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#666", marginTop: 2, maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.user_agent}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeSession(s.id)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: "none",
                        background: "rgba(255, 92, 108, 0.15)",
                        color: "#ff5c6c",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Revoke
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "system" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {loadingSystem ? (
                <div style={{ padding: 24, textAlign: "center", color: "#8a8a8e", fontSize: 13 }}>
                  Querying health diagnostics…
                </div>
              ) : systemInfo ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: 14, background: "rgba(255, 255, 255, 0.03)", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div style={{ fontSize: 11, color: "#8a8a8e" }}>SYSTEM STATUS</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#68c389", marginTop: 4 }}>{systemInfo.status}</div>
                  </div>
                  <div style={{ padding: 14, background: "rgba(255, 255, 255, 0.03)", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div style={{ fontSize: 11, color: "#8a8a8e" }}>REGISTERED USERS</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 4 }}>{systemInfo.registered_users}</div>
                  </div>
                  <div style={{ padding: 14, background: "rgba(255, 255, 255, 0.03)", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div style={{ fontSize: 11, color: "#8a8a8e" }}>INDEXED LUNAR TILES</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#3d5afe", marginTop: 4 }}>{systemInfo.indexed_tiles}</div>
                  </div>
                  <div style={{ padding: 14, background: "rgba(255, 255, 255, 0.03)", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div style={{ fontSize: 11, color: "#8a8a8e" }}>ACTIVE SESSIONS</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#e6a75d", marginTop: 4 }}>{systemInfo.active_sessions}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1", padding: 14, background: "rgba(255, 255, 255, 0.03)", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)", fontSize: 12, color: "#8a8a8e" }}>
                    <div><strong>CV Matcher:</strong> {systemInfo.matcher}</div>
                    <div style={{ marginTop: 4 }}><strong>Security Standard:</strong> {systemInfo.security}</div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "rgba(255, 255, 255, 0.06)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
}
