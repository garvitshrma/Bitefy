import { useState, useEffect } from "react";
import bg from "../assets/bg.png";
import nothingAnimation from "./trolley.json";
import Lottie from "lottie-react";
import { printOrder } from "../utils/printReceipt";
import { data } from "react-router-dom";

function OrderList({
  selectedItems,
  setSelectedItems,
  menuItems,
  orders,
  setOrders,
  activeTab,
  setActiveTab,
}) {
  // const [orders, setOrders] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [numberOfOrders, setNumberOfOrders] = useState("1");
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  const [clickedButton, setClickedButton] = useState(null);

  const handleButtonClick = (buttonId, callback) => {
    setClickedButton(buttonId);
    callback();
    setTimeout(() => setClickedButton(null), 200); // ← Resets after 200ms
  };

  const updateStatus = (orderId, status) => {
    return fetch(
      // ← add return here
      `https://bitefy-backend.onrender.com/api/orders/${orderId}/update_status/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    ).then((r) => r.json());
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    // padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    marginLeft: "10px",
    marginBottom: "10px",
    width: "80%",
    flex: 1,
    backgroundImage: `url(${bg}`,
  };

  const orderBoxStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginRight: "15px",
    marginBottom: "10px",
    backgroundColor: "#fcf8c8",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const customerNameStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "5px 0",
  };

  const itemsStyle = {
    fontSize: "14px",
    fontWeight: "normal",
    color: "#666",
    margin: "5px 0",
  };

  const totalStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#FF8C42",
    margin: "5px 0",
  };

  const printButtonStyle = {
    backgroundColor: "#FF8C42",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "10px",
    marginLeft: "10px",
  };

  const formStyle = {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  const selectedItemsStyle = {
    marginBottom: "10px",
    color: "#2c3e50",
    fontSize: "14px",
    fontWeight: "500",
  };

  const addOrderButtonStyle = {
    backgroundColor: "#FF8C42",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const deleteButtonStyle = {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "10px",
    marginLeft: "10px",
    transition: "all 0.2s ease",
  };

  const preparingButtonStyle = {
    backgroundColor: "#b522de",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "10px",
    marginLeft: "10px",
    transition: "all 0.2s ease",
  };

  const completeButtonStyle = {
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "10px",
    marginLeft: "10px",
    transition: "all 0.2s ease",
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

  const getOrderColor = (status) => {
    if (status === "preparing") return "#cce5ff";
    if (status === "completed") return "#d4edda";
    return "#fcf8c8";
  };

  return (
    <div style={containerStyle}>
      {activeTab === "order" && (
        <div>
          <h4
            style={{
              color: "#000000",
              fontSize: "20px",
              marginTop: "10px",
              marginBottom: "0px",
            }}
          >
            Order Queue
          </h4>

          <p style={{ marginTop: "5px" }}>Drag orders to adjust priority</p>
          {orders.every(
            (order) => !Array.isArray(order.items) || order.items.length === 0,
          ) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "80px",
              }}
            >
              <Lottie
                animationData={nothingAnimation}
                loop={true}
                style={{ width: 200 }}
              />
              <p>No Orders</p>
            </div>
          )}
          {orders.map((order, index) => (
            <div
              key={order.id || index}
              style={{
                ...orderBoxStyle,
                backgroundColor: getOrderColor(order.status),
              }}
            >
              <p style={customerNameStyle}>Customer: {order.name}</p>
              <p>
                Items:{" "}
                {Array.isArray(order.items)
                  ? order.items
                      .map((item) => `${item.name} x${item.quantity}`)
                      .join(", ")
                  : "No items"}
              </p>
              <p style={totalStyle}>total: ₹{order.total}</p>
              <p>
                🕐 {formatTime(order.created_at)} | 📅{" "}
                {formatDate(order.created_at)}
              </p>
              <button
                style={{
                  ...printButtonStyle,
                  backgroundColor:
                    hoveredButton === `print-${order.id}`
                      ? "#ff7a1a"
                      : "#FF8C42",
                  transform:
                    hoveredButton === `print-${order.id}`
                      ? "scale(1.05)"
                      : "scale(1)",
                  transition: "all 0.1s ease",
                  transform:
                    clickedButton === `print-${order.id}`
                      ? "scale(0.95)"
                      : hoveredButton === `print-${order.id}`
                        ? "scale(1.05) translateY(-2px)"
                        : "scale(1)",
                }}
                onMouseEnter={() => setHoveredButton(`print-${order.id}`)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() =>
                  handleButtonClick(`print-${order.id}`, () => {
                    printOrder(order);
                  })
                }
              >
                PRINT
              </button>
              <button
                style={{
                  ...deleteButtonStyle,
                  backgroundColor:
                    hoveredButton === `remove-${order.id}`
                      ? "rgb(255, 64, 26)"
                      : "#e74c3c",
                  transform:
                    hoveredButton === `remove-${order.id}`
                      ? "scale(1.05)"
                      : "scale(1)",
                  transition: "all 0.1s ease",
                  transform:
                    clickedButton === `remove-${order.id}`
                      ? "scale(0.95)"
                      : hoveredButton === `remove-${order.id}`
                        ? "scale(1.05) translateY(-2px)"
                        : "scale(1)",
                }}
                onMouseEnter={() => setHoveredButton(`remove-${order.id}`)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() =>
                  handleButtonClick(`remove-${order.id}`, () => {
                    const token = localStorage.getItem("access_token");
                    const orderId = order.id;

                    // 1. FIRST: Update order status to "cancelled"
                    fetch(
                      `https://bitefy-backend.onrender.com/api/orders/${orderId}/`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          status: "cancelled", // ← Update status!
                        }),
                      },
                    )
                      .then(() => {
                        // 2. THEN: Create removed order record
                        return fetch(
                          `https://bitefy-backend.onrender.com/api/removed-orders/`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              order: orderId,
                              reason: "Staff removed",
                            }),
                          },
                        );
                      })
                      .then(() => {
                        console.log("✅ Order cancelled and moved to removed");
                        // 3. THEN: Remove from active orders UI
                        setOrders((prev) =>
                          prev.filter((o) => o.id !== orderId),
                        );
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                        alert("Failed to remove order!");
                      });
                  })
                }
              >
                REMOVE
              </button>

              <button
                style={{
                  ...preparingButtonStyle,
                  backgroundColor:
                    hoveredButton === `prepare-${order.id}`
                      ? "#c209f5"
                      : "#b522de",
                  transition: "all 0.1s ease",
                  transform:
                    clickedButton === `prepare-${order.id}`
                      ? "scale(0.95)"
                      : hoveredButton === `prepare-${order.id}`
                        ? "scale(1.05) translateY(-2px)"
                        : "scale(1)",
                }}
                onMouseEnter={() => setHoveredButton(`prepare-${order.id}`)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() =>
                  handleButtonClick(`prepare-${order.id}`, () => {
                    const orderId = orders[index].id;
                    const token = localStorage.getItem("access_token");
                    updateStatus(order.id, "preparing");

                    fetch(
                      `https://bitefy-backend.onrender.com/api/orders/${orderId}/`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: "preparing" }),
                      },
                    ).then(() => {
                      // Update order in state
                      const updatedOrders = orders.map((o, i) =>
                        i === index ? { ...o, status: "preparing" } : o,
                      );
                      setOrders(updatedOrders);
                    });
                  })
                }
              >
                PREPARE
              </button>

              <button
                style={{
                  ...preparingButtonStyle,
                  backgroundColor:
                    hoveredButton === `complete-${order.id}`
                      ? "#0ad65f"
                      : "#27ae60",
                  transition: "all 0.1s ease",
                  transform:
                    clickedButton === `complete-${order.id}`
                      ? "scale(0.95)"
                      : hoveredButton === `complete-${order.id}`
                        ? "scale(1.05) translateY(-2px)"
                        : "scale(1)",
                }}
                onMouseEnter={() => setHoveredButton(`complete-${order.id}`)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() =>
                  handleButtonClick(`complete-${order.id}`, () => {
                    const orderId = order.id;
                    const token = localStorage.getItem("access_token");

                    fetch(
                      `https://bitefy-backend.onrender.com/api/orders/${orderId}/`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          status: "ready", // ← Update status
                          is_completed: true, // ← Mark completed
                        }),
                      },
                    )
                      .then(() => {
                        // Remove from active orders
                        setOrders((prev) => prev.filter((_, i) => i !== index));
                      })
                      .catch((error) => console.log("Error:", error));
                  })
                }
              >
                COMPLETE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderList;
