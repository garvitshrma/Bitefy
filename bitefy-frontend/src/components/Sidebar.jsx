import { useState } from "react";

function Sidebar({ activeTab, setActiveTab }) {

  
  // Track active

  const mainStyle = {
    display: "flex",
    flexDirection: "row",
    paddingTop: "20px",
    paddingRight: "20px",
    paddingLeft: "20px",
    borderBottom: "0.3px solid #000000",
    gap: "45px",
  };

  const inactiveButtonStyle = {
    border: "none",
    borderBottom: "none",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    color: "#0000009e",
    cursor: "pointer",
    paddingBottom: "10px",
    paddingLeft: "30px",
    paddingRight: "30px",
  };

  const activeButtonStyle = {
    border: "none",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    color: "#0066ff",
    cursor: "pointer",
    borderBottom: "1.5px solid #0066ff",
    paddingBottom: "10px",
    paddingLeft: "30px",
    paddingRight: "30px",
  };

  const handleTabClick = (tab) => {
    console.log("Clicked tab:", tab);
    setActiveTab(tab);
  };
  return (
    <div style={mainStyle}>
      <button
        style={activeTab === "order" ? activeButtonStyle : inactiveButtonStyle}
        onClick={() => handleTabClick('order')}
      >
        <i class="fa-solid fa-clipboard"></i> Order Queue
      </button>
      <button
        style={activeTab === "menu" ? activeButtonStyle : inactiveButtonStyle}
        onClick={() => setActiveTab("menu")}
      >
        <i class="fa-solid fa-utensils"></i> Menu
      </button>
      <button
        style={
          activeTab === "statistics" ? activeButtonStyle : inactiveButtonStyle
        }
        onClick={() => setActiveTab("statistics")}
      >
        <i class="fa-solid fa-chart-line"></i> Statistics
      </button>
    </div>
  );
}

export default Sidebar;
