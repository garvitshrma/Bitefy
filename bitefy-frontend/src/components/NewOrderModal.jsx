import { useState } from "react";

function NewOrderModal({ setShowModal, menuItems, setOrders }) {
  console.log("NewOrderModal mounted!");
  console.log("setOrders:", setOrders);

  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const modalBackdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalBoxStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
    position: "relative",
  };

  // const closeButtonStyle = {
  //   position: "absolute",
  //   top: "15px",
  //   right: "15px",
  //   backgroundColor: "transparent",
  //   border: "none",
  //   fontSize: "24px",
  //   cursor: "pointer",
  //   color: "#666",
  // };

  // const inputCustNameStyle = {
  //   width: "500px",
  //   maxWidth: "90%",
  //   height: "30px",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginBottom: "20px",
  //   borderRadius: "5px",
  // };

  const inputContainerCustNameStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    width: "500px",
    maxWidth: "90%",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    position: "relative",
  };

  const headingStyle = {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#f3f4f6",
    fontSize: "24px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const inputCustNameStyle = {
    width: "100%",
    height: "50px",
    padding: "0 16px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
  };

  const searchInputStyle = {
    width: "100%",
    height: "45px",
    padding: "0 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  };

  const menuContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "300px",
    overflowY: "auto",
  };

  const menuItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    cursor: "pointer",
    transition: "0.2s",
  };

  const selectedMenuItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "2px solid #00c903",
    backgroundColor: "#fff3ee",
    cursor: "pointer",
    transition: "0.2s",
  };

  const itemNameStyle = {
    fontSize: "18px",
    fontWeight: "500",
    color: "#1f2937",
  };

  const itemPriceStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ff6b35",
  };

  const totalContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
  };

  const totalTextStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
  };

  const createOrderButtonStyle = {
    width: "100%",
    height: "55px",
    border: "none",
    borderRadius: "14px",
    backgroundColor: "#00c903",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "600",
    transition: "0.2s",
  };

  const qtyButtonStyle = {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1.5px solid #d1d5db",
    backgroundColor: "#ffffff",
    fontSize: "24px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1f2937",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  const increaseQty = (item) => {
    setQuantities((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const decreaseQty = (item) => {
    setQuantities((prev) => ({
      ...prev,
      [item.id]: Math.max(0, (prev[item.id] || 0) - 1),
    }));
  };

  const total = menuItems.reduce((sum, item) => {
    return sum + item.price * (quantities[item.id] || 0);
  }, 0);

  return (
    <div style={modalBackdropStyle}>
      <div style={modalBoxStyle}>
        <button style={closeButtonStyle} onClick={() => setShowModal(false)}>
          ✕
        </button>
        <div>
          <h2>New Order</h2>

          <div style={inputContainerCustNameStyle}>
            <input
              type="text"
              style={inputCustNameStyle}
              placeholder="Enter customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div style={menuContainerStyle}>
            {menuItems
            .filter(item => item.is_available !== false)
            .map((item) => (
              <div key={item.id}>
                {/* <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, item.name]);
                    } else {
                      setSelectedItems(
                        selectedItems.filter((name) => name !== item.name),
                      );
                    }
                  }}
                />
                <label style={menuItemStyle}>
                  <span style={itemNameStyle}>{item.name} - </span>
                  <span style={itemPriceStyle}>₹{item.price}</span>
                </label> */}

                <div style={menuItemStyle}>
                  <span style={itemNameStyle}>{item.name}</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={itemPriceStyle}>₹{item.price}</span>
                    <button style={qtyButtonStyle} onClick={() => decreaseQty(item)}>-</button>
                    <span>{quantities[item.id] || 0}</span>
                    <button style={qtyButtonStyle} onClick={() => increaseQty(item)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={totalContainerStyle}>
            <p style={totalTextStyle}>Total: ₹{total}</p>
          </div>

          <button
            style={{
              ...createOrderButtonStyle,
              opacity: isLoading ? 0.6 : 1, // ← Make it look disabled
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              const orderNumber = Math.floor(Math.random() * 900000) + 100000;

              const items = menuItems
                .filter((item) => quantities[item.id] > 0)
                .map((item) => ({
                  name: item.name,
                  quantity: quantities[item.id],
                  price: item.price,
                }));

              if (items.length === 0) {
                alert("Please select items");
                return;
              }

              const newOrder = {
                name: customerName.trim()
                  ? customerName
                  : `Order #${orderNumber}`,
                items: items, // ← Change from selectedItems to items!
                total: total,
              };

              console.log("About to get token"); // ← ADD THIS!

              const token = localStorage.getItem("access_token");
              // Send to Django
              console.log("Token:", token); // ← Add here!
              console.log("New order:", newOrder);
              setIsLoading(true);
              fetch("https://bitefy-backend.onrender.com/api/orders/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newOrder),
                targetAddressSpace: "public",
              })
                .then((r) => r.json()) // ← Parse response!
                .then((data) => {
                  setIsLoading(false);
                  console.log("POST response:", data);
                  console.log("Type:", typeof data); // ← What type?
                  console.log("Is array:", Array.isArray(data));
                  setOrders((prev) => {
                    console.log("Previous orders:", prev);
                    return [...prev, data];
                  }); // ← Add to state!
                  setShowModal(false);
                  setCustomerName("");
                  setSelectedItems([]);
                  setQuantities({});
                  // Remove the old refresh fetch completely!
                })
                .catch((error) => {
                  console.log("Error:", error);
                  setIsLoading(false);
                });
            }}
          >
            {isLoading ? "⏳ Creating..." : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewOrderModal;
