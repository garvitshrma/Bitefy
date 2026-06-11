import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import deliveryAnimation from "./order-placed.json";
import preparingAnimation from "./coffee.json";
import readyAnimation from "./food-truck.json";

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

  const backgroundStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  };

  const statusText = {
    pending: "Order Received",
    placed: "Waiting for Confirmation",
    preparing: "Preparing Your Food",
    ready: "Ready for Pickup",
  };

  if (isLoading) return <p>Loading menu...</p>;

  if (orderPlaced)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#0f172a,#1e293b)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "white",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            textAlign: "center",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "10px",
              color: "#f97316",
            }}
          >
            🎉 Order Placed!
          </h1>
          <p
            style={{
              color: "#64748b",
              marginBottom: "20px",
            }}
          >
            {placedOrder?.order_number}
          </p>
          <h2>{statusText[orderStatus] || orderStatus}</h2>
          <div>
            <h3>Order Summary:</h3>
            {placedOrder?.items?.map((item, index) => (
              <div key={index}>
                <p>
                  {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                </p>
              </div>
            ))}

            <hr
              style={{
                border: "none",
                borderTop: "1px solid #a0a2a6",
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
              <h3>Total: ₹{placedOrder?.total}</h3>
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
        </div>
      </div>
    );

  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    padding: "40px 20px",
  };

  const headingStyle = {
    color: "#ffffff",
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "30px",
    textAlign: "center",
    letterSpacing: "1px",
  };

  const itemNameStyle = {
    color: "#ffffff",
    fontSize: "1.25rem",
    fontWeight: "700",
  };

  const priceStyle = {
    color: "#22c55e",
    fontWeight: "700",
    fontSize: "1.2rem",
  };

  const quantityContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const quantityButtonStyle = {
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg,#5582fd,#7c97ff)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  };

  const quantityTextStyle = {
    color: "#ffffff",
    minWidth: "20px",
    textAlign: "center",
    fontWeight: "600",
  };

  const cartStyle = {
    backgroundColor: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "28px",
    maxWidth: "700px",
    margin: "30px auto 0 auto",
  };

  const totalStyle = {
    color: "#ffffff",
    fontSize: "1.3rem",
    fontWeight: "700",
  };

  const orderButtonStyle = {
    width: "100%",
    background: "linear-gradient(135deg,#5582fd,#7c97ff)",
    boxShadow: "0 8px 20px rgba(85,130,253,0.35)",
    padding: "18px",
    fontSize: "17px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "16px",
    letterSpacing: "0.5px",
  };

  const menuCardStyle = {
    backgroundColor: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "22px 24px",
    maxWidth: "700px",
    margin: "0 auto 18px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s ease",
  };

  return (
    <div style={pageStyle}>
      <div>
        <div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <h1
              style={{
                color: "#ffffff",
                fontSize: "3rem",
                marginBottom: "10px",
              }}
            >
              🍔 Bitefy
            </h1>

            <p
              style={{
                color: "#94a3b8",
                marginBottom: "25px",
              }}
            >
              Select your items
            </p>
          </div>

          {menuItems.map((item) => (
            <div
              key={item.id}
              style={menuCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#5582fd";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
              key={item.id}
            >
              <span style={itemNameStyle}>{item.name}</span>
              <span style={priceStyle}>₹{item.price}</span>
              <div style={quantityContainerStyle}>
                <button
                  style={quantityButtonStyle}
                  onClick={() => decreaseQty(item)}
                >
                  -
                </button>
                <span style={quantityTextStyle}>
                  {quantities[item.id] || 0}
                </span>
                <button
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
                  color: "#94a3b8",
                  fontSize: "1rem",
                }}
              >
                Order Total
              </span>

              <span
                style={{
                  color: "#ffffff",
                  fontSize: "1.6rem",
                  fontWeight: "700",
                }}
              >
                ₹{total}
              </span>
            </div>

            <button
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
