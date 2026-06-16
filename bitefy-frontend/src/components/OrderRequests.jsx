import { useState, useEffect } from "react";

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
  red: "#D9534F",
  redTint: "#FBEAEA",
};

const API = "https://bitefy-backend.onrender.com";

function OrderRequests() {
  const [requests, setRequests] = useState([]);
  const [processing, setProcessing] = useState(null); // id currently being accepted/rejected

  const token = localStorage.getItem("access_token");

  // ── fetch pending (unaccepted) orders ──────────────────────
  const fetchRequests = () => {
    fetch(`${API}/api/orders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        // waiting-for-decision = pending status AND not yet accepted
        const pending = data.filter(
          (o) => o.status === "pending" && !o.is_accepted && o.order_type === "online"
        );
        setRequests(pending);
      })
      .catch((err) => console.log("Error fetching requests:", err));
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000); // auto-refresh every 3s
    return () => clearInterval(interval);
  }, []);

  // ── accept / reject handlers ───────────────────────────────
  const handleAccept = (orderId) => {
    setProcessing(orderId);
    fetch(`${API}/api/orders/${orderId}/accept/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        // optimistically remove from the list right away
        setRequests((prev) => prev.filter((o) => o.id !== orderId));
      })
      .catch((err) => console.log("Accept error:", err))
      .finally(() => setProcessing(null));
  };

  const handleReject = (orderId) => {
    setProcessing(orderId);
    fetch(`${API}/api/orders/${orderId}/reject/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setRequests((prev) => prev.filter((o) => o.id !== orderId));
      })
      .catch((err) => console.log("Reject error:", err))
      .finally(() => setProcessing(null));
  };

  // ── helpers ────────────────────────────────────────────────
  const summarizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) return "No items";
  return items
    .map((it) => {
      const name = it.name || it.item_name || it.item || "Item";
      const qty = it.quantity || it.qty || 1;
      return `${qty}× ${name}`;
    })
    .join(", ");
};

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ── styles ─────────────────────────────────────────────────
  const sidebarStyle = {
    width: "340px",
    flexShrink: 0,
    height: "100%",
    boxSizing: "border-box",
    background: C.surface,
    borderLeft: `1px solid ${C.border}`,
    display: "flex",
    flexDirection: "column",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
  };

  const headerStyle = {
    padding: "18px 20px",
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const eyebrowStyle = {
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    fontSize: "11px",
    fontWeight: 700,
    color: C.muted,
    margin: 0,
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: 800,
    margin: "4px 0 0",
    color: C.ink,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const countBadge = {
    background: C.accentTint,
    color: C.accentDeep,
    fontSize: "13px",
    fontWeight: 700,
    borderRadius: "999px",
    padding: "4px 12px",
  };

  const listStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const cardStyle = {
    border: `1px solid ${C.border}`,
    borderRadius: "14px",
    padding: "14px",
    background: C.bg,
    borderLeft: `4px solid ${C.accent}`,
  };

  const rowBetween = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const nameStyle = { fontWeight: 700, fontSize: "15px", color: C.ink };
  const idStyle = { fontSize: "12px", color: C.muted, fontWeight: 600 };
  const timeStyle = { fontSize: "12px", color: C.muted };
  const itemsStyle = {
    fontSize: "13px",
    color: C.ink,
    margin: "8px 0 12px",
    lineHeight: 1.4,
  };

  const btnRow = { display: "flex", gap: "8px" };

  const acceptBtn = {
    flex: 1,
    padding: "9px",
    border: "none",
    borderRadius: "9px",
    background: C.green,
    color: "#fff",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
  };

  const rejectBtn = {
    flex: 1,
    padding: "9px",
    border: `1px solid ${C.red}`,
    borderRadius: "9px",
    background: "transparent",
    color: C.red,
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
  };

  const emptyStyle = {
    textAlign: "center",
    color: C.muted,
    fontSize: "14px",
    marginTop: "40px",
    padding: "0 20px",
    lineHeight: 1.5,
  };

  return (
    <div style={sidebarStyle}>
      <style>{`
        .bf-accept:hover { background: #2f9a5e !important; }
        .bf-reject:hover { background: ${C.redTint} !important; }
        .bf-req-card { transition: box-shadow 0.18s ease; }
        .bf-req-card:hover { box-shadow: 0 6px 18px rgba(42,33,24,0.08); }
        @keyframes bf-pulse {
          0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; }
        }
        .bf-live-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: ${C.green}; animation: bf-pulse 1.6s infinite;
        }

         .bf-accept:hover { background: #2f9a5e !important; }
  .bf-reject:hover { background: ${C.redTint} !important; }
  .bf-req-card { transition: box-shadow 0.18s ease; }
  .bf-req-card:hover { box-shadow: 0 6px 18px rgba(42,33,24,0.08); }

  @keyframes bf-pulse {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }

  .bf-live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${C.green};
    animation: bf-pulse 1.6s infinite;
  }

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
      `}</style>

      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Online</p>
          <h3 style={titleStyle}>
            <span className="bf-live-dot"></span> Order Requests
          </h3>
        </div>
        {requests.length > 0 && (
          <span style={countBadge}>{requests.length}</span>
        )}
      </div>

      <div className="bf-scrollbar" style={listStyle}>
        {requests.length === 0 ? (
          <div style={emptyStyle}>
            No new requests right now.
            <br />
            New online orders will appear here for you to accept.
          </div>
        ) : (
          requests.map((order) => (
            <div key={order.id} className="bf-req-card" style={cardStyle}>
              <div style={rowBetween}>
                <span style={nameStyle}>{order.name || "Customer"}</span>
                <span style={idStyle}>#{order.id}</span>
              </div>

              <div style={{ ...rowBetween, marginTop: "2px" }}>
                <span style={timeStyle}>{formatTime(order.created_at)}</span>
                {order.total != null && (
                  <span style={{ ...idStyle, color: C.accentDeep }}>
                    ₹{order.total}
                  </span>
                )}
              </div>

              <div style={itemsStyle}>{summarizeItems(order.items)}</div>

              <div style={btnRow}>
                <button
                  className="bf-accept"
                  style={acceptBtn}
                  disabled={processing === order.id}
                  onClick={() => handleAccept(order.id)}
                >
                  {processing === order.id ? "..." : "Accept"}
                </button>
                <button
                  className="bf-reject"
                  style={rejectBtn}
                  disabled={processing === order.id}
                  onClick={() => handleReject(order.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderRequests;
