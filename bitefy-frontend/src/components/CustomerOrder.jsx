import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import deliveryAnimation from "./order-placed.json";

function CustomerOrder() {
  const { slug } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetch(`https://bitefy-backend.onrender.com/api/public/menu/${slug}/`)
      .then((r) => r.json())
      .then((data) => {
        setMenuItems(data);
        setIsLoading(false);
      });
  }, [slug]);

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
    backgroundColor: "rgba(0, 0, 0, 0.85)"
  }

  if (isLoading) return <p>Loading menu...</p>;

  if (orderPlaced)
    return (
      <div>
        <h2>🎉 Order Placed!</h2>
        <p>Your order is being prepared!</p>
        <Lottie
      animationData={deliveryAnimation}
      loop={true}
      style={{ width: 200 }}
    />
      </div>
    );

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
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

  const menuCardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px 24px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "600px",
    margin: "0 auto 16px auto",
  };

  const itemNameStyle = {
    color: "#ffffff",
    fontSize: "1.1rem",
    fontWeight: "600",
  };

  const priceStyle = {
    color: "#5582fd",
    fontWeight: "bold",
    fontSize: "1.1rem",
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
    backgroundColor: "rgba(85, 130, 253, 0.15)",
    color: "#5582fd",
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "600px",
    margin: "24px auto 0 auto",
  };

  const totalStyle = {
    color: "#ffffff",
    fontSize: "1.3rem",
    fontWeight: "700",
  };

  const orderButtonStyle = {
    width: "100%",
    backgroundColor: "#5582fd",
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

  

  return (
    <div style={pageStyle}>
      <div>
        <div>
          <h1 style={headingStyle}>Menu</h1>

          {menuItems.map((item) => (
            <div style={menuCardStyle} key={item.id}>
              <span style={itemNameStyle}>{item.name}</span>
              <span style={priceStyle}>₹{item.price}</span>
              <div style={quantityContainerStyle}>
                <button
                  style={quantityButtonStyle}
                  onClick={() => decreaseQty(item)}
                >
                  -
                </button>
                <span style={quantityTextStyle}>{quantities[item.id] || 0}</span>
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
            <h3 style={totalStyle}>Total: ₹{total}</h3>

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
