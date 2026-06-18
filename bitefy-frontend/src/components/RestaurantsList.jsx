import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  greenTint: "#E7F5EC",
};

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState(""); // ← new: drives the search box
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://bitefy-backend.onrender.com/api/public/restaurants/")
      .then((r) => r.json())
      .then((data) => {
        setRestaurants(data);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  // client-side filter — purely frontend, no backend involved
  const filtered = restaurants.filter((r) =>
    (r.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  // ── styles ───────────────────────────────────────────────
  const pageStyle = {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${C.bg} 0%, ${C.accentTint} 100%)`,
    padding: "48px 20px",
    overflowX: "hidden",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
  };

  const logoWrap = { textAlign: "center", marginBottom: "32px" };

  const headingStyle = {
    color: C.accentDeep,
    fontSize: "clamp(32px, 7vw, 44px)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  };

  const subtitleStyle = {
    color: C.muted,
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginTop: "10px",
  };

  const searchStyle = {
    width: "100%",
    maxWidth: "600px",
    display: "block",
    margin: "0 auto 36px auto",
    padding: "15px 18px",
    borderRadius: "12px",
    border: `1px solid ${C.border}`,
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    background: C.surface,
    color: C.ink,
  };

  const cardStyle = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "22px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    maxWidth: "700px",
    margin: "0 auto 16px auto",
    transition: "all 0.18s ease",
  };

  const restaurantNameStyle = {
    color: C.ink,
    fontSize: "19px",
    fontWeight: 700,
    margin: 0,
  };

  const restaurantMetaStyle = {
    color: C.muted,
    fontSize: "13px",
    marginTop: "6px",
  };

  const buttonStyle = {
    background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "13px 22px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 6px 16px rgba(255,140,66,0.28)",
  };

  return (
    <div style={pageStyle}>
      <style>{`
        .bf-search:focus { border-color: ${C.accent} !important; }
        .bf-rcard:hover { transform: translateY(-3px);
          box-shadow: 0 10px 26px rgba(42,33,24,0.08);
          border-color: ${C.accent} !important; }
        .bf-order:active { transform: scale(0.97); }
        @media (max-width: 560px) {
          .bf-rcard { flex-direction: column; align-items: stretch !important;
            text-align: left; }
          .bf-rcard .bf-order { width: 100%; }
        }
      `}</style>

      <div style={logoWrap}>
        <h1 style={headingStyle}>
          <i className="fa-solid fa-burger"></i> Bitefy
        </h1>
        <p style={subtitleStyle}>Scan • Order • Enjoy</p>
      </div>

      <input
        type="text"
        className="bf-search"
        placeholder="🔍 Search restaurants..."
        style={searchStyle}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: C.muted,
            marginTop: "50px",
            fontSize: "16px",
          }}
        >
          {restaurants.length === 0
            ? "🍽️ No restaurants available yet"
            : "No restaurants match your search"}
        </div>
      ) : (
        filtered.map((restaurant) => (
          <div key={restaurant.slug} className="bf-rcard" style={cardStyle}>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <h3 style={restaurantNameStyle}>{restaurant.name}</h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    background: restaurant.is_open ? C.greenTint : "#FBEAEA",
                    color: restaurant.is_open ? C.green : "#D9534F",
                  }}
                >
                  {restaurant.is_open ? "Open" : "Closed"}
                </span>
              </div>

              <div style={restaurantMetaStyle}>Fast ordering • QR menu</div>

              <div
                style={{
                  color: C.ink,
                  fontSize: "13px",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ color: C.accentDeep, fontWeight: 700 }}>
                  ⭐ 4.5
                </span>
                <span style={{ color: C.muted }}>🕒 10–15 mins</span>
              </div>
            </div>

            <button
              className="bf-order"
              style={{
                ...buttonStyle,
                opacity: restaurant.is_open ? 1 : 0.5,
                cursor: restaurant.is_open ? "pointer" : "not-allowed",
                background: restaurant.is_open
                  ? `linear-gradient(135deg, ${C.accent}, #FF6F3C)`
                  : C.muted,
                boxShadow: restaurant.is_open
                  ? "0 6px 16px rgba(255,140,66,0.28)"
                  : "none",
              }}
              disabled={!restaurant.is_open}
              onClick={() =>
                restaurant.is_open && navigate(`/order/${restaurant.slug}`)
              }
            >
              {restaurant.is_open ? "Order Now" : "Closed"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default RestaurantList;
