import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ── Design tokens ──────────────────────────────────────────
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
};

const PERIOD_LABEL = {
  day: "Last 24 hours",
  week: "Last 7 days",
  month: "Last 30 days",
  year: "Last 12 months",
};

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

  const getFilteredOrders = () => {
    const now = new Date();
    const spans = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };
    const cutoff = new Date(now.getTime() - spans[filter]);
    return completedOrders.filter((o) => new Date(o.created_at) >= cutoff);
  };

  const filtered = getFilteredOrders();
  const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filtered.length;
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const onlineOrders = filtered.filter((o) => o.order_type === "online").length;
  const offlineOrders = filtered.filter((o) => o.order_type === "offline").length;

  const getItemCounts = () => {
    const counts = {};
    filtered.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          counts[item.name] = (counts[item.name] || 0) + item.quantity;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  };
  const itemCounts = getItemCounts();
  const maxItem = itemCounts.length ? itemCounts[0].quantity : 0;

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
    overflowY: 'auto'
  };
  const eyebrow = {
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    fontSize: "11px",
    fontWeight: 700,
    color: C.muted,
    margin: 0,
  };
  const card = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "22px 24px",
  };

  const segBtn = (active) => ({
    height: "36px",
    padding: "0 18px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    background: active ? C.surface : "transparent",
    color: active ? C.accentDeep : C.muted,
    boxShadow: active ? "0 1px 3px rgba(42,33,24,0.12)" : "none",
    transition: "all 0.18s ease",
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div
        style={{
          background: C.ink,
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "13px",
        }}
      >
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ color: C.accent }}>{payload[0].value} sold</div>
      </div>
    );
  };

  return (
    <div style={page}>
      <style>{`
        .bf-card { transition: transform .18s ease, box-shadow .18s ease; }
        .bf-card:hover { transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(42,33,24,0.08); }
        .bf-seg { transition: all .18s ease; }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <p style={eyebrow}>Performance</p>
          <h1
            style={{
              margin: "4px 0 0",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Statistics
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: C.accentTint,
            padding: "4px",
            borderRadius: "12px",
          }}
        >
          {["day", "week", "month", "year"].map((f) => (
            <button
              key={f}
              className="bf-seg"
              style={segBtn(filter === f)}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Hero revenue + supporting cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Hero */}
        <div
          style={{
            background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
            borderRadius: "16px",
            padding: "24px 26px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(255,140,66,0.28)",
          }}
        >
          <div>
            <p style={{ ...eyebrow, color: "rgba(255,255,255,0.85)" }}>
              Total revenue
            </p>
            <div
              style={{
                fontSize: "44px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: "6px",
                lineHeight: 1,
              }}
            >
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.9)",
              marginTop: "18px",
            }}
          >
            {PERIOD_LABEL[filter]} · {totalOrders} orders
          </div>
        </div>

        {/* Orders */}
        <div className="bf-card" style={card}>
          <p style={eyebrow}>Completed orders</p>
          <div style={{ fontSize: "34px", fontWeight: 800, marginTop: "8px",
            letterSpacing: "-0.02em" }}>
            {totalOrders}
          </div>
        </div>

        {/* Avg value */}
        <div className="bf-card" style={card}>
          <p style={eyebrow}>Avg order value</p>
          <div style={{ fontSize: "34px", fontWeight: 800, marginTop: "8px",
            letterSpacing: "-0.02em", color: C.accentDeep }}>
            ₹{avgOrderValue}
          </div>
        </div>
      </div>

      {/* Channel split */}
      <div
        className="bf-card"
        style={{ ...card, marginBottom: "16px", display: "flex", gap: "40px" }}
      >
        <div>
          <p style={eyebrow}>Online orders</p>
          <div style={{ fontSize: "26px", fontWeight: 700, marginTop: "6px" }}>
            {onlineOrders}
          </div>
        </div>
        <div style={{ width: "1px", background: C.border }} />
        <div>
          <p style={eyebrow}>Offline orders</p>
          <div style={{ fontSize: "26px", fontWeight: 700, marginTop: "6px" }}>
            {offlineOrders}
          </div>
        </div>
      </div>

      {/* Top items chart */}
      <div className="bf-card" style={{ ...card, marginBottom: "16px" }}>
        <p style={eyebrow}>Top selling items</p>
        {itemCounts.length === 0 ? (
          <p style={{ color: C.muted, marginTop: "16px" }}>
            No sales in this period yet.
          </p>
        ) : (
          <div style={{ marginTop: "16px" }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={itemCounts.slice(0, 8)}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.accent} />
                    <stop offset="100%" stopColor="#FFB07A" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: C.muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: C.muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: C.accentTint }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="quantity" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {itemCounts.slice(0, 8).map((_, i) => (
                    <Cell key={i} fill="url(#barFill)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Item breakdown with rank + mini bars */}
      {itemCounts.length > 0 && (
        <div className="bf-card" style={card}>
          <p style={eyebrow}>Item breakdown</p>
          <div style={{ marginTop: "14px" }}>
            {itemCounts.map((item, i) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "12px 0",
                  borderBottom:
                    i === itemCounts.length - 1
                      ? "none"
                      : `1px solid ${C.border}`,
                }}
              >
                <span
                  style={{
                    width: "24px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: i === 0 ? C.accentDeep : C.muted,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ flex: 1, fontWeight: 500 }}>{item.name}</span>
                <div
                  style={{
                    flex: 2,
                    height: "8px",
                    background: C.accentTint,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.quantity / maxItem) * 100}%`,
                      height: "100%",
                      background: C.accent,
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <span
                  style={{
                    width: "60px",
                    textAlign: "right",
                    fontWeight: 700,
                    color: C.ink,
                  }}
                >
                  {item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistics;