import { useState, useEffect, useMemo } from "react";

// ── Design tokens (matches the dashboard) ──────────────────
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
  blueTint: "#E8F1FA",
};

const API = "https://bitefy-backend.onrender.com";

// local YYYY-MM-DD from an ISO timestamp (respects the viewer's timezone)
const localDate = (iso) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayStr = () => localDate(new Date().toISOString());

function SalesMonitor() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate] = useState(todayStr());

  // ── fetch completed (finished) orders once ────────────────
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/orders/completed/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Couldn't load sales data. Please refresh.");
        setIsLoading(false);
      });
  }, []);

  // ── date presets ──────────────────────────────────────────
  const setPreset = (preset) => {
    const now = new Date();
    const fmt = (d) => localDate(d.toISOString());
    if (preset === "today") {
      setFromDate(fmt(now));
      setToDate(fmt(now));
    } else if (preset === "yesterday") {
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      setFromDate(fmt(y));
      setToDate(fmt(y));
    } else if (preset === "7days") {
      const s = new Date(now);
      s.setDate(now.getDate() - 6);
      setFromDate(fmt(s));
      setToDate(fmt(now));
    } else if (preset === "month") {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      setFromDate(fmt(s));
      setToDate(fmt(now));
    }
  };

  // ── filter orders into the selected window ────────────────
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (!o.created_at) return false;
      const d = localDate(o.created_at);
      return d >= fromDate && d <= toDate;
    });
  }, [orders, fromDate, toDate]);

  // ── aggregates ────────────────────────────────────────────
  const stats = useMemo(() => {
    let revenue = 0;
    let itemsSold = 0;
    let online = 0;
    let offline = 0;
    const itemMap = {}; // name → { qty, revenue }
    const hourly = Array(24).fill(0); // revenue per hour

    filtered.forEach((o) => {
      const total = parseFloat(o.total) || 0;
      revenue += total;
      if (o.order_type === "online") online += total;
      else offline += total;

      const hr = new Date(o.created_at).getHours();
      hourly[hr] += total;

      if (Array.isArray(o.items)) {
        o.items.forEach((it) => {
          const qty = parseFloat(it.quantity) || 0;
          const price = parseFloat(it.price) || 0;
          itemsSold += qty;
          if (!itemMap[it.name]) itemMap[it.name] = { qty: 0, revenue: 0 };
          itemMap[it.name].qty += qty;
          itemMap[it.name].revenue += qty * price;
        });
      }
    });

    const topItems = Object.entries(itemMap)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.revenue - a.revenue);

    return {
      revenue,
      orders: filtered.length,
      avg: filtered.length ? revenue / filtered.length : 0,
      itemsSold,
      online,
      offline,
      topItems,
      hourly,
    };
  }, [filtered]);

  // ── CSV export ────────────────────────────────────────────
  const downloadCSV = () => {
    if (filtered.length === 0) {
      alert("No sales in the selected period to export.");
      return;
    }
    const header = ["Order", "Date", "Time", "Type", "Items", "Total (INR)"];
    const rows = filtered.map((o) => {
      const d = new Date(o.created_at);
      const items = Array.isArray(o.items)
        ? o.items.map((it) => `${it.name} x${it.quantity}`).join("; ")
        : "";
      return [
        o.name || `#${o.id}`,
        localDate(o.created_at),
        d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        o.order_type || "",
        `"${items}"`,
        o.total,
      ].join(",");
    });
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bitefy-sales-${fromDate}-to-${toDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── styles ────────────────────────────────────────────────
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
    overflowY: "auto",
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
    padding: "20px 22px",
  };
  const dateInput = {
    padding: "10px 12px",
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    fontSize: "14px",
    background: C.surface,
    color: C.ink,
    outline: "none",
  };
  const presetBtn = (active) => ({
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    border: `1px solid ${active ? C.accent : C.border}`,
    background: active ? C.accentTint : C.surface,
    color: active ? C.accentDeep : C.muted,
  });

  const maxHourly = Math.max(...stats.hourly, 1);

  if (isLoading)
    return (
      <div style={page}>
        <p style={{ color: C.muted }}>Loading sales…</p>
      </div>
    );

  if (error)
    return (
      <div style={page}>
        <p style={{ color: C.muted }}>{error}</p>
      </div>
    );

  return (
    <div style={page}>
      <style>{`.bf-bar { transition: height .3s ease; }`}</style>

      {/* header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={eyebrow}>Insights</p>
        <h1
          style={{
            margin: "4px 0 0",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Sales Monitor
        </h1>
      </div>

      {/* date controls */}
      <div style={{ ...card, marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            <div>
              <label
                style={{ ...eyebrow, display: "block", marginBottom: "6px" }}
              >
                From
              </label>
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={dateInput}
              />
            </div>
            <div>
              <label
                style={{ ...eyebrow, display: "block", marginBottom: "6px" }}
              >
                To
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                max={todayStr()}
                onChange={(e) => setToDate(e.target.value)}
                style={dateInput}
              />
            </div>
          </div>
          <button
            onClick={downloadCSV}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(255,140,66,0.28)",
            }}
          >
            <i
              className="fa-solid fa-download"
              style={{ marginRight: "8px" }}
            ></i>
            Export CSV
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginTop: "16px",
          }}
        >
          <button
            style={presetBtn(fromDate === todayStr() && toDate === todayStr())}
            onClick={() => setPreset("today")}
          >
            Today
          </button>
          <button
            style={presetBtn(false)}
            onClick={() => setPreset("yesterday")}
          >
            Yesterday
          </button>
          <button style={presetBtn(false)} onClick={() => setPreset("7days")}>
            Last 7 days
          </button>
          <button style={presetBtn(false)} onClick={() => setPreset("month")}>
            This month
          </button>
        </div>
      </div>

      {/* stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <StatCard
          label="Total Sales"
          value={`₹${stats.revenue.toFixed(2)}`}
          accent={C.accentDeep}
        />
        <StatCard label="Orders" value={stats.orders} accent={C.ink} />
        <StatCard
          label="Avg Order"
          value={`₹${stats.avg.toFixed(2)}`}
          accent={C.ink}
        />
        <StatCard label="Items Sold" value={stats.itemsSold} accent={C.ink} />
      </div>

      {stats.orders === 0 ? (
        <div
          style={{
            ...card,
            textAlign: "center",
            padding: "50px 20px",
            color: C.muted,
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🍽️</div>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: C.ink,
              margin: 0,
            }}
          >
            No sales in this period
          </p>
          <p style={{ margin: "6px 0 0" }}>Try a different date or range.</p>
        </div>
      ) : (
        <>
          {/* online vs offline split */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                ...card,
                flex: 1,
                minWidth: "200px",
                borderLeft: `4px solid ${C.accent}`,
              }}
            >
              <p style={eyebrow}>Online (QR) Sales</p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  margin: "6px 0 0",
                  color: C.accentDeep,
                }}
              >
                ₹{stats.online.toFixed(2)}
              </p>
            </div>
            <div
              style={{
                ...card,
                flex: 1,
                minWidth: "200px",
                borderLeft: `4px solid ${C.blue}`,
              }}
            >
              <p style={eyebrow}>Counter (Offline) Sales</p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  margin: "6px 0 0",
                  color: C.blue,
                }}
              >
                ₹{stats.offline.toFixed(2)}
              </p>
            </div>
          </div>

          {/* hourly chart */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <p style={{ ...eyebrow, marginBottom: "16px" }}>Sales by Hour</p>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "3px",
                height: "140px",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {stats.hourly.map((val, hr) => (
                <div
                  key={hr}
                  className="bf-bar"
                  title={`${hr}:00 — ₹${val.toFixed(0)}`}
                  style={{
                    flex: 1,
                    height: `${(val / maxHourly) * 100}%`,
                    minHeight: val > 0 ? "3px" : "0px",
                    background:
                      val > 0
                        ? `linear-gradient(180deg, ${C.accent}, #FF6F3C)`
                        : "transparent",
                    borderRadius: "4px 4px 0 0",
                    alignSelf: "flex-end",
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: "3px", marginTop: "6px" }}>
              {stats.hourly.map((_, hr) => (
                <div
                  key={hr}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: "9px",
                    color: C.muted,
                  }}
                >
                  {hr % 3 === 0 ? hr : ""}
                </div>
              ))}
            </div>
          </div>

          {/* top items */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <p style={{ ...eyebrow, marginBottom: "14px" }}>Top Items</p>
            {stats.topItems.slice(0, 10).map((it, i) => (
              <div
                key={it.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < 9 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: C.muted,
                      width: "20px",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>
                      {it.name}
                    </div>
                    <div style={{ fontSize: "12px", color: C.muted }}>
                      {it.qty} sold
                    </div>
                  </div>
                </div>
                <span style={{ fontWeight: 800, color: C.accentDeep }}>
                  ₹{it.revenue.toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          {/* order list */}
          <div style={card}>
            <p style={{ ...eyebrow, marginBottom: "14px" }}>
              Orders ({filtered.length})
            </p>
            {filtered
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((o) => (
                <div
                  key={o.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>
                      {o.name || `#${o.id}`}
                    </div>
                    <div style={{ fontSize: "12px", color: C.muted }}>
                      {new Date(o.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      <span
                        style={{
                          color:
                            o.order_type === "online" ? C.accentDeep : C.blue,
                          fontWeight: 700,
                        }}
                      >
                        {o.order_type === "online" ? "QR" : "Counter"}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: C.accentDeep }}>
                    ₹{o.total}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: "16px",
        padding: "18px 20px",
      }}
    >
      <p
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          fontSize: "10.5px",
          fontWeight: 700,
          color: C.muted,
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "24px",
          fontWeight: 800,
          margin: "8px 0 0",
          color: accent,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default SalesMonitor;
