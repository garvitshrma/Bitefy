import { useState, useEffect } from "react";

// ── Design tokens (matches Statistics) ─────────────────────
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
};

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
          const sorted = data.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          });
          setCompletedOrders(sorted);
        }
      })
      .catch((error) => console.log("Error:", error));
  }, []);

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

  // ── styles ───────────────────────────────────────────────
  const page = {
    width: "100%",
    minHeight: "100%",
    background: C.bg,
    borderRadius: "10px",
    padding: "28px 32px 40px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
    overflow: "auto",
  };
  const eyebrow = {
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    fontSize: "11px",
    fontWeight: 700,
    color: C.muted,
    margin: 0,
  };
  const orderCard = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "18px 22px",
    marginBottom: "12px",
  };

  return (
    <div style={page}>
      <style>{`
        .bf-order { transition: transform .18s ease, box-shadow .18s ease; }
        .bf-order:hover { transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(42,33,24,0.08); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={eyebrow}>Order log</p>
        <h1
          style={{
            margin: "4px 0 0",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Completed Orders
        </h1>
      </div>

      {completedOrders.length > 0 ? (
        <div>
          {completedOrders.map((order, index) => (
            <div key={index} className="bf-order" style={orderCard}>
              {/* Top row: name + completed badge */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: C.ink,
                  }}
                >
                  {order.name}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: C.green,
                    background: C.greenTint,
                    padding: "4px 10px",
                    borderRadius: "999px",
                  }}
                >
                  Completed
                </span>
              </div>

              {/* Items */}
              <p
                style={{
                  fontSize: "14px",
                  color: C.muted,
                  margin: "0 0 14px",
                  lineHeight: 1.5,
                }}
              >
                {Array.isArray(order.items)
                  ? order.items
                      .map((item) => `${item.name} ×${item.quantity}`)
                      .join("  ·  ")
                  : "No items"}
              </p>

              {/* Bottom row: time/date + total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "12px",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: "13px", color: C.muted }}>
                  🕐 {formatTime(order.created_at)} &nbsp;·&nbsp; 📅{" "}
                  {formatDate(order.created_at)}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: C.accentDeep,
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{order.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: C.surface,
            border: `1px dashed ${C.border}`,
            borderRadius: "16px",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: 600, color: C.ink, margin: 0 }}>
            No completed orders yet
          </p>
          <p style={{ fontSize: "14px", color: C.muted, margin: "6px 0 0" }}>
            Orders you mark as ready will show up here.
          </p>
        </div>
      )}
    </div>
  );
}

export default History;