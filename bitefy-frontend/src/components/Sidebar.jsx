import { useState } from "react";

// ── Design tokens (matches the rest of the dashboard) ──────
const C = {
  surface: "#FFFFFF",
  ink: "#2A2118",
  muted: "#9B9389",
  border: "#EFE7DD",
  accent: "#FF8C42",
  accentDeep: "#E8722A",
};

function Sidebar({ activeTab, setActiveTab }) {
  // Track active

  const mainStyle = {
    display: "flex",
    flexDirection: "row",
    padding: "0 24px",
    paddingTop: "6px",
    backgroundColor: C.surface,
    borderBottom: `1px solid ${C.border}`,
    gap: "8px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  const baseTab = {
    border: "none",
    fontSize: "15px",
    fontWeight: 600,
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "12px 22px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "2.5px solid transparent", // reserve space so active doesn't shift
    transition: "color 0.18s ease, border-color 0.18s ease",
  };

  const inactiveButtonStyle = {
    ...baseTab,
    color: C.muted,
  };

  const activeButtonStyle = {
    ...baseTab,
    color: C.accentDeep,
    borderBottom: `2.5px solid ${C.accent}`,
  };

  const handleTabClick = (tab) => {
    console.log("Clicked tab:", tab);
    setActiveTab(tab);
  };

  return (
    <div style={mainStyle}>
      <style>{`
        .bf-tab:hover { color: ${C.ink} !important; }
      `}</style>

      <button
        className="bf-tab"
        style={activeTab === "order" ? activeButtonStyle : inactiveButtonStyle}
        onClick={() => handleTabClick("order")}
      >
        <i className="fa-solid fa-clipboard"></i> Order Queue
      </button>
      <button
        className="bf-tab"
        style={activeTab === "menu" ? activeButtonStyle : inactiveButtonStyle}
        onClick={() => setActiveTab("menu")}
      >
        <i className="fa-solid fa-utensils"></i> Menu
      </button>
      <button
        className="bf-tab"
        style={
          activeTab === "statistics" ? activeButtonStyle : inactiveButtonStyle
        }
        onClick={() => setActiveTab("statistics")}
      >
        <i className="fa-solid fa-chart-line"></i> Statistics
      </button>
      <button
        className="bf-tab"
        style={
          activeTab === "history" ? activeButtonStyle : inactiveButtonStyle
        }
        onClick={() => setActiveTab("history")}
      >
        <i className="fa-regular fa-clock"></i> History
      </button>
    </div>
  );
}

export default Sidebar;