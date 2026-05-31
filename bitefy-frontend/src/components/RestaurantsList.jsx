import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://bitefy-backend.onrender.com/api/public/restaurants/")
      .then((r) => r.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.log("Error:", error));
  }, []);

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "40px 20px",
  };

  const headingStyle = {
    color: "#ffffff",
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "30px",
    textAlign: "center",
    letterSpacing: "1px",
  };

  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px 24px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "600px",
    margin: "0 auto 16px auto",
  };

  const restaurantNameStyle = {
    color: "#ffffff",
    fontSize: "1.1rem",
    fontWeight: "600",
  };

  const buttonStyle = {
    backgroundColor: "#5582fd",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.5px",
  };

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>Choose a Restaurant</h2>
      {restaurants.map((restaurant) => (
        <div style={cardStyle} key={restaurant.slug}>
          <h3 style={restaurantNameStyle}>{restaurant.name}</h3>
          <button 
          style={buttonStyle}
          onClick={() => navigate(`/order/${restaurant.slug}`)}>
            Order Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default RestaurantList;
