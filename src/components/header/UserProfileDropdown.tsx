import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface UserProfileDropdownProps {
  onOpenSecurity: () => void;
  onOpenAdmin: () => void;
  onOpenSettings: () => void;
}

export default function UserProfileDropdown({
  onOpenSecurity,
  onOpenAdmin,
  onOpenSettings,
}: UserProfileDropdownProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return { bg: "rgba(230, 167, 93, 0.2)", color: "#e6a75d", border: "rgba(230, 167, 93, 0.4)" };
      case "researcher":
        return { bg: "rgba(61, 90, 254, 0.2)", color: "#7ca5ff", border: "rgba(61, 90, 254, 0.4)" };
      case "viewer":
      default:
        return { bg: "rgba(255, 255, 255, 0.1)", color: "#8a8a8e", border: "rgba(255, 255, 255, 0.2)" };
    }
  };

  const badge = getRoleBadgeStyle(user.role);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      {/* Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255, 255, 255, 0.05)",
          border: `1px solid ${isOpen ? "#3d5afe" : "rgba(255, 255, 255, 0.1)"}`,
          borderRadius: 9999,
          padding: "3px 10px 3px 3px",
          cursor: "pointer",
          transition: "all 0.15s ease",
          color: "#fff",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: user.role === "admin" ? "#e6a75d" : "#3d5afe",
            color: user.role === "admin" ? "#0b0e17" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            userSelect: "none",
          }}
        >
          {initials}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
          <span style={{ fontSize: 12, fontWeight: 700, lineHeight: "14px", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.name.split(" ")[0]}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: badge.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {user.role}
          </span>
        </div>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 260,
            background: "rgba(14, 18, 30, 0.98)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            padding: "16px 14px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(61, 90, 254, 0.12)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontFamily: '"Geist", system-ui, sans-serif',
          }}
        >
          {/* User Info Header */}
          <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#8a8a8e", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: badge.bg,
                  color: badge.color,
                  border: `1px solid ${badge.border}`,
                  textTransform: "uppercase",
                }}
              >
                {user.role} ACCESS
              </span>
              {user.is_verified && (
                <span style={{ fontSize: 10, color: "#68c389", fontWeight: 600 }}>✓ Verified</span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSecurity();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 10px",
                background: "transparent",
                border: "none",
                borderRadius: 8,
                color: "#e2e8f0",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span>🔒</span> Security & Sessions
            </button>

            {user.role === "admin" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdmin();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: "#e6a75d",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(230, 167, 93, 0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span>⚡</span> Admin Control Console
              </button>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 10px",
                background: "transparent",
                border: "none",
                borderRadius: 8,
                color: "#e2e8f0",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span>⚙️</span> System Settings
            </button>
          </div>

          {/* Logout Section */}
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 8 }}>
            <button
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 10px",
                background: "rgba(255, 92, 108, 0.08)",
                border: "none",
                borderRadius: 8,
                color: "#ff5c6c",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 92, 108, 0.18)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 92, 108, 0.08)")}
            >
              <span>⎋</span> Terminate Session (Logout)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
