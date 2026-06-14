import { useState, useEffect, useRef } from "react";
import settingsAnimation from "./gear.json";
import Lottie from "lottie-react";

// ── Design tokens (matches the rest of the dashboard) ──────
const C = {
  surface: "#FFFFFF",
  ink: "#2A2118",
  muted: "#9B9389",
  border: "#EFE7DD",
  accent: "#FF8C42",
  green: "#3DAA6D",
  greenTint: "#E7F5EC",
  red: "#D9534F",
  redTint: "#FBEAEA",
};

function Header({ setShowModal, setActiveTab }) {
  const lottieRef = useRef();

  const [play, setPlay] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        // "http://localhost:8000/api/restaurants/my_restaurant/"
        "https://bitefy-backend.onrender.com/api/restaurants/my_restaurant/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setRestaurant(data);
    } catch (error) {
      console.log("Error fetching restaurant:", error);
      setRestaurant({ name: "My Restaurant" }); // Fallback
    } finally {
      setLoading(false);
    }
  };

  // ── styles ───────────────────────────────────────────────
  const mainStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    backgroundColor: C.surface,
    borderBottom: `1px solid ${C.border}`,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  const firstSectionStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "20px",
  };

  const rightSectionStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "12px",
  };

  const restaurantNameStyle = {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: C.ink,
  };

  const subtitleStyle = {
    margin: "2px 0 0",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    color: C.muted,
  };

  const openButtonStyle = {
    backgroundColor: isOpen ? C.redTint : C.greenTint,
    color: isOpen ? C.red : C.green,
    border: "none",
    height: "42px",
    padding: "0 18px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.18s ease",
  };

  const newOrderButtonStyle = {
    background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
    color: "#ffffff",
    height: "42px",
    border: "none",
    padding: "0 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 6px 16px rgba(255,140,66,0.28)",
  };

  const settingsButtonStyle = {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "20px",
    padding: 0,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={mainStyle}>
      <style>{`
        .bf-neworder:active { transform: scale(0.97); }
        .bf-open:active { transform: scale(0.97); }
      `}</style>

      <div style={firstSectionStyle}>
        <div>
          <h2 style={restaurantNameStyle}>
            {loading ? "Loading..." : restaurant?.name || "My Restaurant"}
          </h2>
          <p style={subtitleStyle}>Management Dashboard</p>
        </div>
        <div>
          <button
            className="bf-open"
            style={openButtonStyle}
            onClick={() => setIsOpen(!isOpen)}
          >
            <i
              className={isOpen ? "fa-solid fa-lock" : "fa-solid fa-lock-open"}
            ></i>{" "}
            {isOpen ? "Closed" : "Open"}
          </button>
        </div>
      </div>

      <div style={rightSectionStyle}>
        <button
          className="bf-neworder"
          style={newOrderButtonStyle}
          onClick={() => setShowModal(true)}
        >
          <i className="fa-solid fa-plus"></i> New Order
        </button>
        <button
          style={settingsButtonStyle}
          onClick={() => {
            setActiveTab("settings");
            lottieRef.current.goToAndPlay(0); // ← play from start every click
          }}
        >
          <Lottie
            lottieRef={lottieRef} // ← attach the ref
            animationData={settingsAnimation}
            autoplay={false} // ← never autoplay
            loop={false}
            style={{ width: 40 }}
            onComplete={() => lottieRef.current.stop()}
          />
        </button>
      </div>
    </div>
  );
}
export default Header;