import { useState, useEffect } from "react";

function Settings() {
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("https://bitefy-backend.onrender.com/api/restaurants/my_restaurant/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setRestaurant(data);
        setRestaurantName(data.name);
        setSlug(data.slug || "");
        setIsLoading(false);
      })
      .catch(error => {
        console.log("Error:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSave = () => {
    const token = localStorage.getItem("access_token");
    setIsSaving(true);

    fetch(`https://bitefy-backend.onrender.com/api/restaurants/${restaurant.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: restaurantName,
        slug: slug,
      }),
    })
      .then(r => r.json())
      .then(data => {
        setRestaurant(data);
        alert("Settings saved successfully!");
        setIsSaving(false);
        window.location.reload();
      })
      .catch(error => {
        console.log("Error:", error);
        alert("Failed to save settings");
        setIsSaving(false);
      });
  };

  const containerStyle = {
    padding: "20px",
    width: "80%",
    maxWidth: "600px",
  };

  const headingStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "30px",
  };

  const formGroupStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    backgroundColor: "#FF8C42",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "20px",
  };

    const logoutButtonStyle = {
    color: "#ffffff",
    border: "none",
    backgroundColor: "#fc3b3bf3",
    cursor: "pointer",
    fontSize: "20px",
    marginTop: '30px',
    padding: '10px',
    borderRadius: '5px'
  };

  if (isLoading) return <p>Loading settings...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Settings</h2>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Restaurant Name</label>
        <input
          type="text"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          style={inputStyle}
          placeholder="Enter restaurant name"
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Restaurant Slug (URL)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={inputStyle}
          placeholder="e.g., tech-cafe"
        />
        <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          Used in customer order URL: bitefy.vercel.app/order/{slug}
        </p>
      </div>

      <button
        style={{
          ...buttonStyle,
          opacity: isSaving ? 0.6 : 1,
          cursor: isSaving ? "not-allowed" : "pointer",
        }}
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? "⏳ Saving..." : "💾 Save Settings"}
      </button>

     <div>
        <button
          style={logoutButtonStyle}
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            window.location.href = "/auth";
          }}
        >
         Log Out <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
     </div>
    </div>
  );
}

export default Settings;