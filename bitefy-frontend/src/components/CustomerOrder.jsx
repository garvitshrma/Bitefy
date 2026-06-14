import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import deliveryAnimation from "./order-placed.json";
import preparingAnimation from "./coffee.json";
import readyAnimation from "./food-truck.json";
import cancelAnimation from "./cancel.json";

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
};

function CustomerOrder() {
  const { slug } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("placed");

  useEffect(() => {
    fetch(`https://bitefy-backend.onrender.com/api/public/menu/${slug}/`)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        setMenuItems(data);
        setIsLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!placedOrder) return;

    const interval = setInterval(() => {
      fetch(
        `https://bitefy-backend.onrender.com/api/public/order-status/${placedOrder.order_id}/`,
      )
        .then((r) => r.json())
        .then((data) => {
          console.log("STATUS RESPONSE:", data);
          setOrderStatus(data.status);
        })
        .catch((err) => console.error(err));
    }, 3000); // 👈 every 3 seconds

    return () => clearInterval(interval);
  }, [placedOrder]);
  // Calculate total
  const total = menuItems.reduce((sum, item) => {
    return sum + item.price * (quantities[item.id] || 0);
  }, 0);

  // Increase quantity
  const increaseQty = (item) => {
    setQuantities((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  // Decrease quantity
  const decreaseQty = (item) => {
    setQuantities((prev) => ({
      ...prev,
      [item.id]: Math.max(0, (prev[item.id] || 0) - 1),
    }));
  };

  const statusText = {
    pending: "Order Received",
    placed: "Waiting for Confirmation",
    preparing: "Preparing Your Food",
    ready: "Ready for Pickup",
    cancelled: "We are sorry, your order has been cancelled.",
  };

  // ── shared styles ────────────────────────────────────────
  const pageStyle = {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${C.bg} 0%, ${C.accentTint} 100%)`,
    padding: "40px 20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
    boxSizing: "border-box",
  };

  if (isLoading)
    return (
      <div
        style={{
          ...pageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: C.muted, fontSize: "16px" }}>Loading menu…</p>
      </div>
    );

  if (orderPlaced)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(180deg, ${C.bg} 0%, ${C.accentTint} 100%)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          boxSizing: "border-box",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: C.surface,
            borderRadius: "24px",
            padding: "32px",
            border: `1px solid ${C.border}`,
            boxShadow: "0 20px 50px rgba(42,33,24,0.12)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "10px",
              color: C.accentDeep,
            }}
          >
            🎉 Order Placed!
          </h1>
          <p
            style={{
              color: C.muted,
              marginBottom: "20px",
              fontWeight: 600,
            }}
          >
            {placedOrder?.order_number}
          </p>
          <h2 style={{ color: C.ink, fontSize: "1.3rem", fontWeight: 700 }}>
            {statusText[orderStatus] || orderStatus}
          </h2>
          <div>
            <h3 style={{ color: C.ink, marginTop: "24px" }}>Order Summary</h3>
            {placedOrder?.items?.map((item, index) => (
              <div key={index}>
                <p style={{ color: C.muted }}>
                  {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                </p>
              </div>
            ))}

            <hr
              style={{
                border: "none",
                borderTop: `1px solid ${C.border}`,
                margin: "16px 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.3rem",
                fontWeight: "bold",
              }}
            >
              <h3 style={{ color: C.accentDeep }}>Total: ₹{placedOrder?.total}</h3>
            </div>
          </div>
          {orderStatus == "placed" && (
            <Lottie
              animationData={deliveryAnimation}
              loop={true}
              style={{
                width: 250,
                margin: "0 auto",
              }}
            />
          )}
          {orderStatus == "pending" && (
            <Lottie
              animationData={deliveryAnimation}
              loop={true}
              style={{
                width: 250,
                margin: "0 auto",
              }}
            />
          )}
          {orderStatus == "preparing" && (
            <Lottie
              animationData={preparingAnimation}
              loop={true}
              style={{
                width: 250,
                margin: "0 auto",
              }}
            />
          )}
          {orderStatus == "ready" && (
            <Lottie
              animationData={readyAnimation}
              loop={true}
              style={{
                width: 250,
                margin: "0 auto",
              }}
            />
          )}

          {orderStatus == "cancelled" && (
            <Lottie
              animationData={cancelAnimation}
              loop={true}
              style={{
                width: 250,
                margin: "0 auto",
              }}
            />
          )}
        </div>
      </div>
    );

  // ── menu view styles ─────────────────────────────────────
  const itemNameStyle = {
    color: C.ink,
    fontSize: "1.1rem",
    fontWeight: 700,
  };

  const priceStyle = {
    color: C.accentDeep,
    fontWeight: 700,
    fontSize: "1rem",
    marginTop: "4px",
  };

  const quantityContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const quantityButtonStyle = {
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

  const quantityTextStyle = {
    color: C.ink,
    minWidth: "22px",
    textAlign: "center",
    fontWeight: 700,
    fontSize: "16px",
  };

  const cartStyle = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "20px",
    padding: "26px",
    maxWidth: "700px",
    margin: "30px auto 0 auto",
    boxShadow: "0 10px 30px rgba(42,33,24,0.06)",
  };

  const orderButtonStyle = {
    width: "100%",
    background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
    boxShadow: "0 8px 20px rgba(255,140,66,0.32)",
    fontSize: "17px",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "18px",
    letterSpacing: "0.3px",
  };

  const menuCardStyle = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "18px 22px",
    maxWidth: "700px",
    margin: "0 auto 14px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    transition: "all 0.18s ease",
  };

  return (
    <div style={pageStyle}>
      <style>{`
        .bf-menucard:hover { transform: translateY(-3px);
          box-shadow: 0 10px 26px rgba(42,33,24,0.08);
          border-color: ${C.accent} !important; }
        .bf-qty:active { transform: scale(0.92); }
        .bf-place:active { transform: scale(0.99); }
      `}</style>

      <div>
        <div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "36px",
            }}
          >
            <h1
              style={{
                color: C.accentDeep,
                fontSize: "clamp(30px, 7vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              <i className="fa-solid fa-burger"></i> Bitefy
            </h1>

            <p
              style={{
                color: C.muted,
                fontWeight: 600,
              }}
            >
              Select your items
            </p>
          </div>

          {menuItems.map((item) => (
            <div key={item.id} className="bf-menucard" style={menuCardStyle}>
              <div>
                <div style={itemNameStyle}>{item.name}</div>
                <div style={priceStyle}>₹{item.price}</div>
              </div>
              <div style={quantityContainerStyle}>
                <button
                  className="bf-qty"
                  style={quantityButtonStyle}
                  onClick={() => decreaseQty(item)}
                >
                  -
                </button>
                <span style={quantityTextStyle}>
                  {quantities[item.id] || 0}
                </span>
                <button
                  className="bf-qty"
                  style={quantityButtonStyle}
                  onClick={() => increaseQty(item)}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div style={cartStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: C.muted,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Order Total
              </span>

              <span
                style={{
                  color: C.ink,
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                ₹{total}
              </span>
            </div>

            <button
              className="bf-place"
              style={orderButtonStyle}
              onClick={() => {
                const items = menuItems
                  .filter((item) => quantities[item.id] > 0)
                  .map((item) => ({
                    name: item.name,
                    quantity: quantities[item.id],
                    price: item.price,
                  }));

                if (items.length === 0) {
                  alert("Please select items!");
                  return;
                }

                const orderTotal = total;
                const orderItems = items;

                const orderNumber = Math.floor(Math.random() * 900000) + 100000;

                fetch(
                  `https://bitefy-backend.onrender.com/api/public/order/${slug}/`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: `Order #${orderNumber}`,
                      items: items,
                      total: total,
                    }),
                  },
                )
                  .then((r) => r.json())
                  .then((data) => {
                    console.log("Order placed:", data);
                    setPlacedOrder({
                      ...data,
                      items: orderItems,
                      total: orderTotal,
                    });
                    setOrderPlaced(true);
                    setQuantities({});
                  })
                  .catch((error) => console.log("Error:", error));
              }}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerOrder;