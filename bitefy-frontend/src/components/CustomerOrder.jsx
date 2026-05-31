import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

  if (isLoading) return <p>Loading menu...</p>;

  if (orderPlaced)
    return (
      <div>
        <h2>🎉 Order Placed!</h2>
        <p>Your order is being prepared!</p>
      </div>
    );

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px",
  };

  const contentStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const menuCardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const foodImageStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "12px",
    objectFit: "cover",
  };

  const itemInfoStyle = {
    flex: 1,
    marginLeft: "20px",
  };

  const priceStyle = {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: "22px",
    paddingLeft: '20px',
    marginLeft: '20px'
  };

  const quantityContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const quantityButtonStyle = {
    width: "40px",
    height: "40px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  };

  const cartStyle = {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    position: "sticky",
    top: "20px",
    height: "fit-content",
  };

  const orderButtonStyle = {
    width: "100%",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
  };

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div>
          <h1>Menu</h1>

          {menuItems.map((item) => (
            <div style={menuCardStyle} key={item.id}>
              <span >{item.name}</span>
              <span style={priceStyle}>₹{item.price}</span>
              <div style={quantityContainerStyle}>
                <button
                  style={quantityButtonStyle}
                  onClick={() => decreaseQty(item)}
                >
                  -
                </button>
                <span>{quantities[item.id] || 0}</span>
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
            <h3>Total: ₹{total}</h3>

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
