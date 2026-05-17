import { useState } from "react";

function NewOrderModal({ setShowModal, menuItems, setOrders }) {
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

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
    position: 'relative'
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalBoxStyle}>
        <button style={closeButtonStyle} onClick={() => setShowModal(false)}>
          ✕
        </button>
        <div>
          <h2>New Order</h2>

          <input
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          {menuItems.map((item) => (
            <div key={item.id}>
              <input
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
              <label>
                {item.name} - ₹{item.price}
              </label>
            </div>
          ))}

          <p>Total: ₹{/* Calculate total here */}</p>

          <button
            onClick={() => {
              if (!customerName.trim()) {
                alert("Please enter customer name");
                return;
              }

              if (selectedItems.length === 0) {
                alert("Please select items");
                return;
              }

              const total = selectedItems.reduce((sum, itemName) => {
                const item = menuItems.find((m) => m.name === itemName);
                return sum + (item ? item.price : 0);
              }, 0);

              const newOrder = {
                name: customerName,
                items: selectedItems,
                total: total,
              };

              // Send to Django
              fetch("http://127.0.0.1:8000/api/orders/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrder),
              })
                .then(() => {
                  // Close modal and refresh
                  setShowModal(false);
                  setCustomerName("");
                  setSelectedItems([]);
                  // Refresh orders
                  fetch("http://127.0.0.1:8000/api/orders/")
                    .then((r) => r.json())
                    .then((data) => setOrders(data));
                })
                .catch((error) => console.log("Error:", error));
            }}
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewOrderModal;
