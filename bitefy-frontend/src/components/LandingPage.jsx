import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg.png"; // now unused — safe to delete if you like

// ── Design tokens (matches the app) ────────────────────────
const C = {
  bg: "#FBF8F4",
  surface: "#FFFFFF",
  ink: "#2A2118",
  muted: "#9B9389",
  border: "#EFE7DD",
  accent: "#FF8C42",
  accentDeep: "#E8722A",
  accentTint: "#FFF1E6",
  green: "#3DAA6D",
};

function LandingPage() {
  const navigate = useNavigate();

  // ── styles ───────────────────────────────────────────────
  const mainStyle = {
    minHeight: "100vh",
    margin: 0,
    background: `linear-gradient(180deg, ${C.bg} 0%, ${C.accentTint} 100%)`,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 28px",
    background: C.surface,
    borderBottom: `1px solid ${C.border}`,
  };

  const logoStyle = {
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: C.accentDeep,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const navLinkStyle = {
    background: "transparent",
    border: "none",
    color: C.muted,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  };

  const heroStyle = {
    maxWidth: "760px",
    margin: "0 auto",
    textAlign: "center",
    padding: "72px 20px 40px",
  };

  const eyebrow = {
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontSize: "12px",
    fontWeight: 700,
    color: C.accentDeep,
    margin: 0,
  };

  const heroTitle = {
    fontSize: "clamp(34px, 7vw, 56px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.05,
    margin: "14px 0 0",
  };

  const heroSub = {
    fontSize: "clamp(16px, 2.5vw, 19px)",
    color: C.muted,
    maxWidth: "540px",
    margin: "18px auto 0",
    lineHeight: 1.5,
  };

  const primaryCta = {
    background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
    color: "white",
    border: "none",
    padding: "16px 34px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: 700,
    marginTop: "28px",
    boxShadow: "0 10px 24px rgba(255,140,66,0.32)",
  };

  const featureRow = {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "44px",
  };

  const featureChip = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "999px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: 600,
    color: C.ink,
  };

  const chipIcon = {
    color: C.accentDeep,
    fontSize: "14px",
  };

  // restaurant band (secondary)
  const restBand = {
    maxWidth: "880px",
    margin: "20px auto 60px",
    padding: "26px 28px",
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  };

  const restIconCircle = {
    width: "48px",
    height: "48px",
    minWidth: "48px",
    borderRadius: "12px",
    background: "#E7F5EC",
    color: C.green,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  };

  const restCta = {
    background: "transparent",
    color: C.accentDeep,
    border: `1.5px solid ${C.accent}`,
    padding: "12px 22px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  };

  return (
    <div style={mainStyle}>
      <style>{`
        .bf-cta:active { transform: scale(0.98); }
        .bf-navlink:hover { color: ${C.ink} !important; }
        @media (max-width: 640px) {
          .bf-restband {
            flex-direction: column;
            align-items: flex-start !important;
            text-align: left;
          }
          .bf-restband .bf-restcta { width: 100%; }
        }
      `}</style>

      {/* Top nav */}
      <div style={navStyle}>
        <h2 style={logoStyle}>
          <i className="fa-solid fa-burger"></i> Bitefy
        </h2>
        <button
          className="bf-navlink"
          style={navLinkStyle}
          onClick={() => navigate("/auth")}
        >
          For restaurants →
        </button>
      </div>

      {/* Hero — customer focused */}
      <div style={heroStyle}>
        <p style={eyebrow}>Order ahead, skip the wait</p>
        <h1 style={heroTitle}>Great food from the spots near you</h1>
        <p style={heroSub}>
          Browse menus, place your order, and pick it up the moment it's ready.
          No queues, no waiting around.
        </p>
        <button
          className="bf-cta"
          style={primaryCta}
          onClick={() => (window.location.href = "/restaurants")}
        >
          Browse restaurants
        </button>

        <div style={featureRow}>
          <div style={featureChip}>
            <i className="fa-solid fa-magnifying-glass" style={chipIcon}></i>
            Search local restaurants
          </div>
          <div style={featureChip}>
            <i className="fa-solid fa-utensils" style={chipIcon}></i>
            Browse menus &amp; prices
          </div>
          <div style={featureChip}>
            <i className="fa-solid fa-arrow-trend-up" style={chipIcon}></i>
            Personalized picks
          </div>
        </div>
      </div>

      {/* Restaurant band — secondary */}
      <div className="bf-restband" style={restBand}>
        <div
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          <div style={restIconCircle}>
            <i className="fa-solid fa-champagne-glasses"></i>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
              Run a restaurant?
            </h3>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "14px",
                color: C.muted,
                lineHeight: 1.45,
              }}
            >
              Manage your order queue, menu, and sales analytics — all in one
              dashboard.
            </p>
          </div>
        </div>
        <button
          className="bf-cta bf-restcta"
          style={restCta}
          onClick={() => navigate("/auth")}
        >
          Continue as restaurant
        </button>
      </div>
    </div>
  );
}

export default LandingPage;