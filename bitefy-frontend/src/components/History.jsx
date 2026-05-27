import { useState, useEffect } from "react";

function History() {
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("https://bitefy-backend.onrender.com/api/orders/completed/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const completed = data.filter((order) => order.is_completed === true);
          setCompletedOrders(completed);
        }
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  const historyTabStyle = {
    width: '100%',
    overflow: 'auto'
  }

  const orderBoxStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginRight: "15px",
    marginBottom: "10px",
    backgroundColor: "#85f36ac5",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginLeft: '15px'
  };

  const customerNameStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
  };

  const itemsStyle = {
    fontSize: "14px",
    color: "#666",
  };

  const totalStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#FF8C42",
  };

   const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={historyTabStyle}>
      <h2>COMPLETED ORDERS</h2>
      <div
        style={{
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ color: "#FF8C42", fontSize: "24px" }}>
          Total Revenue: ₹
          {completedOrders.reduce((sum, order) => sum + order.total, 0)}
        </h3>
      </div>

      {completedOrders.length > 0 ? (
        <div>
          {completedOrders.map((order, index) => (
            <div key={index} style={orderBoxStyle}>
              <p style={customerNameStyle}>Customer: {order.name}</p>
              <p style={itemsStyle}>
                Items:{" "}
                {Array.isArray(order.items)
                  ? order.items
                      .map((item) => `${item.name} x${item.quantity}`)
                      .join(", ")
                  : "No items"}
              </p>
              <p>🕐 {formatTime(order.created_at)} | 📅 {formatDate(order.created_at)}</p>
              <p style={totalStyle}>total: ₹{order.total}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#ffffff", fontSize: "18px" }}>
          No completed orders yet
        </p>
      )}
    </div>
  );
}

export default History;
