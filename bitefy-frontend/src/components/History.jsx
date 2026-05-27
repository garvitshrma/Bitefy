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

  const orderBoxStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "#fcf8c8",
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

  return (
    <div>
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
