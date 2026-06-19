import { useState, useEffect } from "react";
import bg from "../assets/bg.png"; // now unused — safe to delete if you want
import nothingAnimation from "./trolley.json";
import Lottie from "lottie-react";
import { printOrder } from "../utils/printReceipt";

// ── Design tokens (matches Statistics, History, Menu) ──────
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
  blue: "#3B82C4",
};

function OrderList({
  selectedItems,
  setSelectedItems,
  menuItems,
  orders,
  setOrders,
  activeTab,
  setActiveTab,
}) {


  const [customerName, setCustomerName] = useState("");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [numberOfOrders, setNumberOfOrders] = useState("1");
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [manualSeq, setManualSeq] = useState([]);
  const [draggedId, setDraggedId] = useState(null);

  const [clickedButton, setClickedButton] = useState(null);

  const handleButtonClick = (buttonId, callback) => {
    setClickedButton(buttonId);
    callback();
    setTimeout(() => setClickedButton(null), 200);
  };

  const handleDrop = (targetId) => {
    if (draggedId == null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    const ids = visibleOrders.map((o) => o.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from === -1 || to === -1) return;
    ids.splice(from, 1);
    ids.splice(to, 0, draggedId); 
    setManualSeq(ids);
    setDraggedId(null);

    const token = localStorage.getItem("access_token");
    ids.forEach((id, index) => {
      fetch(`https://bitefy-backend.onrender.com/api/orders/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: index }),
      }).catch((err) => console.log("Error updating priority:", err));
    });
  };

  const updateStatus = (orderId, status) => {
    const token = localStorage.getItem("access_token");
    return fetch(
      `https://bitefy-backend.onrender.com/api/orders/${orderId}/update_status/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      },
    ).then((r) => r.json());
  };

  // ── presentation helpers ─────────────────────────────────
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    background: C.bg,
    borderRadius: "10px",
    marginLeft: "10px",
    marginBottom: "10px",
    width: "80%",
    flex: 1,
    padding: "24px 26px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
  };

  const eyebrow = {
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    fontSize: "11px",
    fontWeight: 700,
    color: C.muted,
    margin: 0,
  };

  const orderBoxStyle = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "18px 20px",
    marginBottom: "14px",
    boxShadow: "0 1px 3px rgba(42,33,24,0.04)",
  };

  const customerNameStyle = {
    fontSize: "17px",
    fontWeight: 700,
    color: C.ink,
    margin: 0,
  };

  const itemsStyle = {
    fontSize: "14px",
    color: C.muted,
    margin: "10px 0",
    lineHeight: 1.5,
  };

  const totalStyle = {
    fontSize: "18px",
    fontWeight: 800,
    color: C.accentDeep,
    letterSpacing: "-0.02em",
    margin: 0,
  };

  // shared button base
  const btnBase = {
    color: "white",
    border: "none",
    padding: "9px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "12.5px",
    letterSpacing: "0.04em",
  };
  const printButtonStyle = { ...btnBase };
  const deleteButtonStyle = { ...btnBase };
  const preparingButtonStyle = { ...btnBase };
  const completeButtonStyle = { ...btnBase };

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

  // accent + label for the status strip/badge (display only)
  const statusAccent = (status) => {
    if (status === "preparing") return { bar: C.blue, label: "Preparing" };
    if (status === "completed") return { bar: C.green, label: "Ready" };
    return { bar: C.accent, label: "New" };
  };

  const baseOrders = orders.filter(
    (o) => o.is_accepted || o.order_type === "offline",
  );

  const byId = {};
  baseOrders.forEach((o) => {
    byId[o.id] = o;
  });

  // manually-arranged orders that still exist, in your drag order
  const seqIds = manualSeq.filter((id) => byId[id]);

  // brand-new orders (not yet dragged) → sorted oldest→newest so newest sits at the bottom
  const newIds = baseOrders
    .filter((o) => !manualSeq.includes(o.id))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((o) => o.id);

  const visibleOrders = [...seqIds, ...newIds].map((id) => byId[id]);

  return (
    <div className="bf-scrollbar" style={containerStyle}>
      <style>{`
        .bf-order { transition: transform .15s ease, box-shadow .15s ease; }
        .bf-order:hover { box-shadow: 0 6px 20px rgba(42,33,24,0.08); }

        .bf-order {
    transition: transform .15s ease, box-shadow .15s ease;
  }

  .bf-order:hover {
    box-shadow: 0 6px 20px rgba(42,33,24,0.08);
  }

  /* Scrollbar */
  .bf-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .bf-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .bf-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 140, 66, 0.45);
    border-radius: 999px;
  }

  .bf-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 140, 66, 0.8);
  }

  .bf-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 140, 66, 0.45) transparent;
  }
      `}</style>

      {activeTab === "order" && (
        <div>
          {/* Header */}
          <p style={eyebrow}>Live queue</p>
          <h1
            style={{
              margin: "4px 0 2px",
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Order Queue
          </h1>
          <p style={{ marginTop: "2px", color: C.muted, fontSize: "14px" }}>
            Drag orders to adjust priority
          </p>

          {visibleOrders.every(
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
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: C.ink,
                  marginTop: "0px",
                }}
              >
                No Orders
              </p>
              <p style={{ color: C.muted, marginTop: "4px" }}>
                New orders will appear here as they come in.
              </p>
            </div>
          )}

          {visibleOrders.map((order, index) => {
            const accent = statusAccent(order.status);
            return (
              <div
                key={order.id || index}
                className="bf-order"
                draggable
                onDragStart={() => setDraggedId(order.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(order.id)}
                style={{
                  ...orderBoxStyle,
                  borderLeft: `5px solid ${accent.bar}`,
                  backgroundColor: getOrderColor(order.status),
                  opacity: draggedId === order.id ? 0.5 : 1,
                  cursor: "grab",
                }}
              >
                {/* Top row: customer + status badge */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={customerNameStyle}>{order.name}</p>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: accent.bar,
                      background: "rgba(255,255,255,0.7)",
                      padding: "4px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    {accent.label}
                  </span>
                </div>

                <p style={itemsStyle}>
                  {Array.isArray(order.items)
                    ? order.items
                        .map((item) => `${item.name} ×${item.quantity}`)
                        .join("  ·  ")
                    : "No items"}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "13px", color: C.muted }}>
                    <i class="fa-regular fa-clock"></i>{" "}
                    {formatTime(order.created_at)} &nbsp;·&nbsp;{" "}
                    <i class="fa-regular fa-calendar"></i>{" "}
                    {formatDate(order.created_at)}
                  </span>
                  <p style={totalStyle}>₹{order.total}</p>
                </div>

                {/* Action row */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: `1px solid ${C.border}`,
                  }}
                >
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
                          `https://bitefy-backend.onrender.com/api/orders/${orderId}/update_status/`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status: "cancelled" }),
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
                            console.log(
                              "✅ Order cancelled and moved to removed",
                            );
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
                        const orderId = order.id;
                        const token = localStorage.getItem("access_token");

                        fetch(
                          `https://bitefy-backend.onrender.com/api/orders/${orderId}/update_status/`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status: "preparing" }),
                          },
                        ).then(() => {
                          const updatedOrders = orders.map((o) =>
                            o.id === orderId
                              ? { ...o, status: "preparing" }
                              : o,
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
                      ...completeButtonStyle,
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
                    onMouseEnter={() =>
                      setHoveredButton(`complete-${order.id}`)
                    }
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() =>
                      handleButtonClick(`complete-${order.id}`, () => {
                        console.log("Complete clicked!");
                        const orderId = order.id;
                        const token = localStorage.getItem("access_token");

                        console.log("Complete clicked!");
                        console.log("orderId:", orderId);
                        console.log("token:", token);

                        fetch(
                          `https://bitefy-backend.onrender.com/api/orders/${orderId}/update_status/`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status: "ready" }),
                          },
                        )
                          .then((r) => {
                            console.log("PATCH status:", r.status); // ← add this
                            return r.json();
                          })

                          .then((result) => {
                            console.log("PATCH response:", result);
                            setOrders((prev) =>
                              prev.filter((o) => o.id !== orderId),
                            );
                          })
                          .catch((error) => console.log("Error:", error));
                      })
                    }
                  >
                    COMPLETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderList;
