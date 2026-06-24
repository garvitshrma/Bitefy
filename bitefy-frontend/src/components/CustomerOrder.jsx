import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import deliveryAnimation from "./order-placed.json";
import preparingAnimation from "./coffee.json";
import readyAnimation from "./food-truck.json";
import cancelAnimation from "./cancel.json";

import appleAnimation from "../assets/animations/apple.json";
import frenchAnimation from "../assets/animations/french-fries.json";
import redWineAnimation from "../assets/animations/red-wine.json";
import easterEggAnimation from "../assets/animations/easter-egg.json";
import blackTeaAnimation from "../assets/animations/black-tea.json";
import pumpkinAnimation from "../assets/animations/pumpkin.json";
import vegetableAnimation from "../assets/animations/vegetable.json";
import bonfireAnimation from "../assets/animations/bonfire.json";
import restaurantAnimation from "../assets/animations/restaurant.json";

// ── Design tokens (matches the app) ────────────────────────
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
  red: "#D9534F",
  redTint: "#FBEAEA",
};

// The 5-stage journey every order travels through.
const STAGES = ["Placed", "Accepted", "Paid", "Cooking", "Ready"];

// Map a derived status → how far along the stepper it is.
const STAGE_INDEX = {
  placed: 0,
  awaiting_payment: 1,
  pending: 2, // paid, waiting for kitchen
  preparing: 3,
  ready: 4,
};

// Friendly copy + colour for each derived status.
const STATUS_META = {
  placed: { label: "Waiting for confirmation", color: C.accent, anim: deliveryAnimation },
  awaiting_payment: { label: "Payment needed", color: C.accentDeep, anim: deliveryAnimation },
  pending: { label: "Confirmed — in the queue", color: C.green, anim: preparingAnimation },
  preparing: { label: "Cooking your food", color: C.blue, anim: preparingAnimation },
  ready: { label: "Ready for pickup!", color: C.green, anim: readyAnimation },
  cancelled: { label: "Order cancelled", color: C.red, anim: cancelAnimation },
};

// A few facts to keep customers entertained while they wait.
const FOOD_FACTS = [
  { fact: "French fries are actually Belgian — invented there in the 1600s.", icon: frenchAnimation },
  { fact: "Apples are 85% water.", icon: appleAnimation },
  { fact: "Black tea has more caffeine than green tea because it's more oxidised.", icon: blackTeaAnimation },
  { fact: "Pumpkins are technically fruits, not vegetables.", icon: pumpkinAnimation },
  { fact: "Red wine gets its colour from grape skins — white wine skips them.", icon: redWineAnimation },
  { fact: "Tomatoes are botanically a fruit, used like a vegetable.", icon: vegetableAnimation },
  { fact: "Roasting over a bonfire gives food a smoky flavour you can't fake.", icon: bonfireAnimation },
  { fact: "The world's oldest restaurant still running opened in 1725.", icon: restaurantAnimation },
  { fact: "Easter eggs are decorated to symbolise rebirth and new life.", icon: easterEggAnimation },
];

function CustomerOrder() {
  const { slug } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // orders = the customer's own placed orders (persisted to localStorage)
  // statuses = live status for each, keyed by order_id (fetched, not persisted)
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState({});

  const storageKey = `bitefy_orders_${slug}`;

  // ── load menu ──────────────────────────────────────────────
  useEffect(() => {
    fetch(`https://bitefy-backend.onrender.com/api/public/menu/${slug}/`)
      .then((r) => r.json())
      .then((data) => {
        setMenuItems(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Couldn't load the menu. Please refresh.");
        setIsLoading(false);
      });
  }, [slug]);

  // ── restore the customer's orders on load ─────────────────
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch {
        /* ignore corrupt storage */
      }
    }
  }, [storageKey]);

  // ── load Razorpay checkout script once ────────────────────
  useEffect(() => {
    if (document.getElementById("razorpay-checkout")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  // ── poll status for every active order every 3s ───────────
  useEffect(() => {
    if (orders.length === 0) return;

    const poll = () => {
      orders.forEach((o) => {
        fetch(
          `https://bitefy-backend.onrender.com/api/public/order-status/${o.order_id}/`,
        )
          .then((r) => r.json())
          .then((data) =>
            setStatuses((prev) => ({ ...prev, [o.order_id]: data })),
          )
          .catch(() => {});
      });
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [orders]);

  // ── derive a single status string from a status payload ───
  const deriveStatus = (s) => {
    if (!s) return "placed";
    if (s.status === "cancelled") return "cancelled";
    if (!s.is_accepted) return "placed";
    if (s.payment_status !== "completed") return "awaiting_payment";
    return s.status; // pending | preparing | ready
  };

  const persist = (next) => {
    setOrders(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const dismissOrder = (orderId) => {
    persist(orders.filter((o) => o.order_id !== orderId));
    setStatuses((prev) => {
      const n = { ...prev };
      delete n[orderId];
      return n;
    });
  };

  // ── cart helpers ──────────────────────────────────────────
  const total = menuItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0,
  );
  const increaseQty = (item) =>
    setQuantities((p) => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }));
  const decreaseQty = (item) =>
    setQuantities((p) => ({ ...p, [item.id]: Math.max(0, (p[item.id] || 0) - 1) }));

  const placeOrder = () => {
    const items = menuItems
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        name: item.name,
        quantity: quantities[item.id],
        price: item.price,
      }));

    if (items.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    const orderTotal = total;
    const orderNumber = Math.floor(Math.random() * 900000) + 100000;

    fetch(`https://bitefy-backend.onrender.com/api/public/order/${slug}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Order #${orderNumber}`,
        items,
        total: orderTotal,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const newOrder = {
          order_id: data.order_id,
          order_number: data.order_number || `Order #${orderNumber}`,
          items,
          total: orderTotal,
        };
        persist([...orders, newOrder]);
        setQuantities({});
        // scroll the customer up to their freshly-placed order
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => alert("Couldn't place your order. Please try again."));
  };

  // ── payment ───────────────────────────────────────────────
  const handlePayment = async (order) => {
    try {
      const res = await fetch(
        `https://bitefy-backend.onrender.com/api/public/initiate-payment/${order.order_id}/`,
        { method: "POST" },
      );
      const data = await res.json();

      const options = {
        key: data.key_id,
        amount: data.amount * 100,
        currency: "INR",
        order_id: data.razorpay_order_id,
        name: "Bitefy",
        description: order.order_number,
        handler: async (response) => {
          try {
            const vr = await fetch(
              `https://bitefy-backend.onrender.com/api/public/verify-payment/${order.order_id}/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );
            const vd = await vr.json();
            if (vd.payment_status === "completed") {
              // optimistic update — next poll will confirm
              setStatuses((prev) => ({
                ...prev,
                [order.order_id]: {
                  ...(prev[order.order_id] || {}),
                  is_accepted: true,
                  payment_status: "completed",
                  status: "pending",
                },
              }));
            } else {
              alert("Payment couldn't be verified. Please show this to the counter.");
            }
          } catch (err) {
            console.error("Verify error:", err);
          }
        },
        theme: { color: C.accent },
      };

      if (!window.Razorpay) {
        alert("Payment is still loading — please try again in a moment.");
        return;
      }
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  // ── styles ────────────────────────────────────────────────
  const pageStyle = {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${C.bg} 0%, ${C.accentTint} 100%)`,
    padding: "32px 16px 60px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
    boxSizing: "border-box",
  };

  // ── loading / error gates ─────────────────────────────────
  if (isLoading)
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: C.muted, fontSize: "16px" }}>Loading menu…</p>
      </div>
    );

  if (error)
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "18px", fontWeight: 700 }}>{error}</p>
          <button onClick={() => window.location.reload()} style={primaryBtn}>
            Try again
          </button>
        </div>
      </div>
    );

  // ── progress stepper ──────────────────────────────────────
  const Stepper = ({ idx, color }) => (
    <div style={{ display: "flex", alignItems: "center", margin: "14px 0 6px" }}>
      {STAGES.map((label, i) => {
        const reached = i <= idx;
        const isCurrent = i === idx;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STAGES.length - 1 ? 1 : "0 0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
              <div
                className={isCurrent ? "bf-dot-pulse" : ""}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: reached ? color : C.border,
                  boxShadow: isCurrent ? `0 0 0 4px ${color}22` : "none",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.02em", color: reached ? C.ink : C.muted, whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div style={{ flex: 1, height: "2px", margin: "0 4px", marginBottom: "16px", background: i < idx ? color : C.border, borderRadius: "2px" }} />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── one order card ────────────────────────────────────────
  const OrderCard = ({ order }) => {
    const factData = FOOD_FACTS[order.order_id % FOOD_FACTS.length];
    const status = deriveStatus(statuses[order.order_id]);
    const meta = STATUS_META[status];
    const idx = STAGE_INDEX[status] ?? 0;
    const cancelled = status === "cancelled";
    const done = status === "ready";

    const itemSummary = (order.items || [])
      .map((it) => `${it.name} ×${it.quantity}`)
      .join(" · ");

    return (
      <div
        style={{
          background: cancelled ? C.redTint : done ? C.greenTint : C.surface,
          border: `1px solid ${cancelled ? C.red + "44" : C.border}`,
          borderLeft: `5px solid ${meta.color}`,
          borderRadius: "18px",
          padding: "18px 18px 16px",
          marginBottom: "14px",
          boxShadow: "0 4px 16px rgba(42,33,24,0.06)",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <Lottie
  animationData={status === "placed" ? factData.icon : meta.anim}
  loop={!done && !cancelled}
  style={{ width: 52, height: 52, flexShrink: 0 }}
/>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: "16px" }}>{order.order_number}</div>
              <div style={{ fontSize: "12px", color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "190px" }}>
                {itemSummary}
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: meta.color,
              background: "rgba(255,255,255,0.75)",
              padding: "5px 10px",
              borderRadius: "999px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {meta.label}
          </span>
        </div>

        {/* stepper (hidden when cancelled) */}
        {!cancelled && <Stepper idx={idx} color={meta.color} />}

        {/* waiting-state food fact */}
        {(status === "placed" || status === "pending") && (
          <p style={{ fontSize: "12.5px", color: C.muted, fontStyle: "italic", margin: "8px 2px 0", lineHeight: 1.5 }}>
            ✨ {factData.fact}
          </p>
        )}

        {/* footer: total + action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
          <span style={{ fontWeight: 800, fontSize: "17px", color: C.accentDeep }}>₹{order.total}</span>

          {status === "awaiting_payment" && (
            <button onClick={() => handlePayment(order)} style={{ ...primaryBtn, marginTop: 0, padding: "11px 22px" }}>
              Pay ₹{order.total}
            </button>
          )}
          {(done || cancelled) && (
            <button onClick={() => dismissOrder(order.order_id)} style={ghostBtn}>
              {done ? "Got it" : "Dismiss"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      <style>{`
        .bf-menucard:hover { transform: translateY(-3px);
          box-shadow: 0 10px 26px rgba(42,33,24,0.08); border-color: ${C.accent} !important; }
        .bf-qty:active { transform: scale(0.92); }
        .bf-place:active { transform: scale(0.99); }
        @keyframes bf-pulse { 0%{opacity:1} 50%{opacity:0.45} 100%{opacity:1} }
        .bf-dot-pulse { animation: bf-pulse 1.4s infinite; }
      `}</style>

      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ color: C.accentDeep, fontSize: "clamp(30px, 7vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "6px" }}>
            <i className="fa-solid fa-burger"></i> Bitefy
          </h1>
          <p style={{ color: C.muted, fontWeight: 600, margin: 0 }}>Scan • Order • Enjoy</p>
        </div>

        {/* active orders */}
        {orders.length > 0 && (
          <div style={{ marginBottom: "30px" }}>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.09em", fontSize: "11px", fontWeight: 700, color: C.muted, margin: "0 0 12px 2px" }}>
              Your Orders ({orders.length})
            </p>
            {orders.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        )}

        {/* menu */}
        <p style={{ textTransform: "uppercase", letterSpacing: "0.09em", fontSize: "11px", fontWeight: 700, color: C.muted, margin: "0 0 12px 2px" }}>
          {orders.length > 0 ? "Order More" : "Menu"}
        </p>

        {menuItems.map((item) => (
          <div key={item.id} className="bf-menucard" style={menuCardStyle}>
            <div>
              <div style={{ color: C.ink, fontSize: "1.05rem", fontWeight: 700 }}>{item.name}</div>
              <div style={{ color: C.accentDeep, fontWeight: 700, fontSize: "0.95rem", marginTop: "4px" }}>₹{item.price}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button className="bf-qty" style={qtyBtn} onClick={() => decreaseQty(item)}>-</button>
              <span style={{ color: C.ink, minWidth: "22px", textAlign: "center", fontWeight: 700, fontSize: "16px" }}>
                {quantities[item.id] || 0}
              </span>
              <button className="bf-qty" style={qtyBtn} onClick={() => increaseQty(item)}>+</button>
            </div>
          </div>
        ))}

        {/* cart */}
        <div style={cartStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: C.muted, fontSize: "1rem", fontWeight: 600 }}>Order total</span>
            <span style={{ color: C.ink, fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>₹{total}</span>
          </div>
          <button className="bf-place" style={{ ...primaryBtn, width: "100%", padding: "16px", fontSize: "17px" }} onClick={placeOrder}>
            Place order
          </button>
        </div>
      </div>
    </div>
  );
}

// ── shared button + card styles ─────────────────────────────
const primaryBtn = {
  background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
  boxShadow: "0 8px 20px rgba(255,140,66,0.32)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "13px 24px",
  fontWeight: 700,
  cursor: "pointer",
  marginTop: "18px",
  letterSpacing: "0.3px",
};

const ghostBtn = {
  background: "transparent",
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  padding: "10px 18px",
  fontWeight: 700,
  fontSize: "14px",
  color: C.ink,
  cursor: "pointer",
};

const qtyBtn = {
  width: "40px",
  height: "40px",
  border: "none",
  borderRadius: "10px",
  background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
  color: "#fff",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "bold",
  boxShadow: "0 4px 10px rgba(255,140,66,0.28)",
};

const menuCardStyle = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: "16px",
  padding: "16px 20px",
  margin: "0 auto 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  transition: "all 0.18s ease",
};

const cartStyle = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: "20px",
  padding: "24px",
  margin: "20px auto 0",
  boxShadow: "0 10px 30px rgba(42,33,24,0.06)",
};

export default CustomerOrder;
