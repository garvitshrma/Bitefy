import { useState, useEffect } from "react";

function Header({ setShowModal }) {
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

  const mainStyle = {
    display: "flex",
    flexDirection: "row", // ← Items LEFT to RIGHT
    justifyContent: "space-between", // ← LEFT and RIGHT ends!
    alignItems: "center", // ← Vertical center
    paddingRight: "20px",
    paddingLeft: "20px",
    backgroundColor: "#ffffff",
    borderBottom: "0.3px solid #000000",
    paddingTop: "10px",
    paddingBottom: "10px",
  };

  const firstSectionStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "16px",
  };

  const rightSectionStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "15px",
  };

  const defaultPaddingMargin = {
    margin: "0px",
    padding: "0px",
  };

  const openButtonStyle = {
    backgroundColor: isOpen ? "#ffa9986c" : "#b2ffa1",
    height: "50px",
    padding: "10px",
    border: "none",
    margin: "10px",
    paddingRight: "15px",
    paddingLeft: "15px",
    borderRadius: "10px",
    fontSize: "15px",
    color: isOpen ? "#ff2a00ad" : "#188500",
    cursor: "pointer",
  };

  const newOrderButtonStyle = {
    backgroundColor: "#00c903",
    color: "#ffffff",
    height: "50px",
    border: "none",
    paddingRight: "15px",
    paddingLeft: "15px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const logoutButtonStyle = {
    color: "#e73838",
    border: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "20px",
  };

  const settingsButtonStyle = {
    border: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "20px",
  };
  return (
    <div style={mainStyle}>
      <div style={firstSectionStyle}>
        <div>
          <h2 style={defaultPaddingMargin}>
            {loading ? "Loading..." : restaurant?.name || "My Restaurant"}
          </h2>
          <p style={defaultPaddingMargin}>Management Dashboard</p>
        </div>
        <div>
          <button style={openButtonStyle} onClick={() => setIsOpen(!isOpen)}>
            <i
              className={isOpen ? "fa-solid fa-lock" : "fa-solid fa-lock-open"}
            ></i>{" "}
            {isOpen ? "Closed" : "Open"}
          </button>
        </div>
      </div>

      <div style={rightSectionStyle}>
        <button style={newOrderButtonStyle} onClick={() => setShowModal(true)}>
          <i class="fa-solid fa-plus"></i> New Order
        </button>
        <button style={settingsButtonStyle}>
          <i className="fa-solid fa-gear"></i>
        </button>
        <button
          style={logoutButtonStyle}
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            window.location.href = "/auth";
          }}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
}
export default Header;
