import { useState, useEffect } from "react";

function Statistics() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [filter, setFilter] = useState("day");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("https://bitefy-backend.onrender.com/api/orders/completed/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCompletedOrders(data);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  // Calculate based on filter
  const getFilteredOrders = () => {
    const now = new Date();
    return completedOrders.filter((order) => {
      const orderDate = new Date(order.created_at);

      if (filter === "day") {
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return orderDate >= dayAgo;
      } else if (filter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      } else if (filter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= monthAgo;
      } else {
        // year
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return orderDate >= yearAgo;
      }
    });
  };

  const filtered = getFilteredOrders();
  const totalRevenue = filtered.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filtered.length;
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const topContainerStyle = {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingTop: "20px",
    paddingRight: "100px",
    paddingLeft: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    marginBottom: "10px",
    overflowY: "auto",
    alignItems: "center",
  };

  const mainStyle = {
    width: "98%",
  };
  const titleStyle = {
    color: "#000000",
    marginBottom: "20px",
    fontSize: "20px",
    marginTop: "0px",
  };

  const filterButtonStyle = {
    height: "40px",
    width: "80px",
    border: "none",
    borderRadius: "5px",
    cursor: 'pointer'
  };

  const filterStyle = {
    display: "flex",
    gap: "10px",
  };

  const statCardStyle = {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
  };

  const statLabelStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  };

  const statValueStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#FF8C42",
  };

  return (
    <div style={mainStyle}>
      {/* Header with filters */}
      <div style={topContainerStyle}>
        <h2 style={titleStyle}>Statistics & Analytics</h2>
        <div style={filterStyle}>
          <button
            style={{
              ...filterButtonStyle,
              backgroundColor: filter === "day" ? "#FF8C42" : "#ddd",
              color: filter === "day" ? "white" : "#333",
              transition: "all 0.2s ease",
            }}
            onClick={() => setFilter("day")}
          >
            Day
          </button>
          <button
            style={{
              ...filterButtonStyle,
              backgroundColor: filter === "week" ? "#FF8C42" : "#ddd",
              color: filter === "week" ? "white" : "#333",
              transition: "all 0.2s ease",
            }}
            onClick={() => setFilter("week")}
          >
            Week
          </button>
          <button
            style={{
              ...filterButtonStyle,
              backgroundColor: filter === "month" ? "#FF8C42" : "#ddd",
              color: filter === "month" ? "white" : "#333",
              transition: "all 0.2s ease",
            }}
            onClick={() => setFilter("month")}
          >
            Month
          </button>
          <button
            style={{
              ...filterButtonStyle,
              backgroundColor: filter === "year" ? "#FF8C42" : "#ddd",
              color: filter === "year" ? "white" : "#333",
              transition: "all 0.2s ease",
            }}
            onClick={() => setFilter("year")}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
        }}
      >
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Total Revenue</div>
          <div style={statValueStyle}>₹{totalRevenue}</div>
        </div>

        <div style={statCardStyle}>
          <div style={statLabelStyle}>Completed Orders</div>
          <div style={statValueStyle}>{totalOrders}</div>
        </div>

        <div style={statCardStyle}>
          <div style={statLabelStyle}>Avg Order Value</div>
          <div style={statValueStyle}>₹{avgOrderValue}</div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
