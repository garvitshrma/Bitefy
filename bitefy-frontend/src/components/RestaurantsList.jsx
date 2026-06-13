import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://bitefy-backend.onrender.com/api/public/restaurants/")
      .then((r) => r.json())
      .then((data) => {
        const activeRestaurants = data.filter((r) => r.is_active === true);
        setRestaurants(activeRestaurants);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "40px 20px",
    overflowX: "hidden",
  };

  const logoStyle = {
    textAlign: "center",
    marginBottom: "40px",
  };

  const headingStyle = {
    color: "#ffffff",
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "10px",
  };

  const subtitleStyle = {
    color: "#94a3b8",
    fontSize: "1rem",
  };

  const searchStyle = {
    width: "100%",
    maxWidth: "600px",
    display: "block",
    margin: "0 auto 30px auto",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "1rem",
    boxSizing: "border-box",
  };

  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "700px",
    margin: "0 auto 18px auto",
    transition: "all 0.2s ease",
  };

  const restaurantNameStyle = {
    color: "#ffffff",
    fontSize: "1.2rem",
    fontWeight: "700",
    marginBottom: "8px",
  };

  const restaurantMetaStyle = {
    color: "#94a3b8",
    fontSize: "0.9rem",
  };

  const buttonStyle = {
    background: "#5582fd",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    // boxShadow: "0 6px 18px rgba(85,130,253,0.35)",
  };

  return (
    <div style={pageStyle}>
      <div style={logoStyle}>
        <h1 style={headingStyle}>🍔 Bitefy</h1>
        <p style={subtitleStyle}>Scan • Order • Enjoy</p>
      </div>

      <input
        type="text"
        placeholder="🔍 Search restaurants..."
        style={searchStyle}
      />

      {restaurants.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginTop: "50px",
          }}
        >
          🍽️ No restaurants available
        </div>
      ) : (
        restaurants.map((restaurant) => (
          <div
            key={restaurant.slug}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#5582fd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <div>
              <h3 style={restaurantNameStyle}>🍽️ {restaurant.name}</h3>

              <div style={restaurantMetaStyle}>Fast Ordering • QR Menu</div>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.85rem",
                  marginTop: "8px",
                }}
              >
                ⭐ 4.5 • 🕒 10-15 mins
              </div>
            </div>

            <button
              style={buttonStyle}
              onClick={() => navigate(`/order/${restaurant.slug}`)}
            >
              🍴 Order Now
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default RestaurantList;
