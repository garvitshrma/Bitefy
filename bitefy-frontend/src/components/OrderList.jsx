import { useState, useEffect } from "react";
import bg from "../assets/bg.png";

function OrderList({
  selectedItems,
  setSelectedItems,
  menuItems,
  orders,
  setOrders,
  activeTab,
  setActiveTab,
}) {
  // const [orders, setOrders] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [completedOrders, setCompletedOrders] = useState([]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    // padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    marginLeft: "10px",
    marginBottom: "10px",
    width: "80%",
    flex: 1,
    backgroundImage: `url(${bg}`,
  };

  const orderBoxStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginRight: "15px",
    marginBottom: "10px",
    backgroundColor: "#fcf8c8",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const customerNameStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "5px 0",
  };

  const itemsStyle = {
    fontSize: "14px",
    fontWeight: "normal",
    color: "#666",
    margin: "5px 0",
  };

  const totalStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#FF8C42",
    margin: "5px 0",
  };

  const printButtonStyle = {
    backgroundColor: "#FF8C42",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "10px",
    marginLeft: "10px",
  };

  const formStyle = {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  const selectedItemsStyle = {
    marginBottom: "10px",
    color: "#2c3e50",
    fontSize: "14px",
    fontWeight: "500",
  };

  const addOrderButtonStyle = {
    backgroundColor: "#FF8C42",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const deleteButtonStyle = {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "10px",
    marginLeft: "10px",
  };

  const completeButtonStyle = {
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "10px",
    marginLeft: "10px",
  };


  return (
    <div style={containerStyle}>
      {/* <div style={{ display: "flex", marginBottom: "20px", gap: "10px" }}>
        <button
          onClick={() => setActiveTab("active")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "active" ? "#FF8C42" : "#ddd",
          }}
        >
          ACTIVE QUEUE
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "completed" ? "#FF8C42" : "#ddd",
          }}
        >
          COMPLETED
        </button>
      </div> */}

      {activeTab === "order" && (
        <div>
          <h4
            style={{
              color: "#000000",
              fontSize: "20px",
              marginTop: "10px",
              marginBottom: "0px",
            }}
          >
            Order Queue
          </h4>

          <p style={{ marginTop: "5px" }}>Drag orders to adjust priority</p>

          {/* <div style={formStyle}> */}
          {/* <h3>Add Order</h3> */}

          {/* <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter Customer Name"
              style={inputStyle}
            ></input> */}

          {/* <p style={selectedItemsStyle}>
              Selected Items :{" "}
              {selectedItems.length > 0 ? selectedItems.join(", ") : "None"}
            </p>

            <button
              style={addOrderButtonStyle}
              onClick={() => {
                if (customerName.trim() && selectedItems.length > 0) {
                  let total = 0;
                  for (let itemName of selectedItems) {
                    const item = menuItems.find((m) => m.name === itemName);
                    if (item) { */}
          {/* //     total = total + item.price; */}
          {/* //   } */}
          {/* // } */}

          {/* // const newOrder = { */}
          {/* //   name: customerName,
                  //   items: selectedItems,
                  //   total: total,
                  // }; */}
          {/* 
                  // setOrders([...orders, newOrder]);

                  
          {/* //   method: "POST",
                  //   headers: { "Content-Type": "application/json" },
                  //   body: JSON.stringify(newOrder),
                  // })
                  //   .then((response) => response.json())
                  //   .then((data) => { */}
          {/* //     setCustomerName("");
                  //     setSelectedItems([]);
                  //   })
          //           .catch((error) => console.log("Error:", error));
          //       }
          //     }}
          //   >
          //     Add Order
          //   </button> */}
          {/* // </div> */}
          {orders.map((order, index) => (
            console.log("Order data:", order),
            <div key={order.id || index} style={orderBoxStyle}>
              <p style={customerNameStyle}>Customer: {order.name}</p>
              <p>
                Items:{" "}
                {Array.isArray(order.items)
                  ? order.items
                      .map((item) => `${item.name} x${item.quantity}`)
                      .join(", ")
                  : "No items"}
              </p>
              <p style={totalStyle}>total: ₹{order.total}</p>
              <button style={printButtonStyle}>PRINT</button>
              <button
                style={deleteButtonStyle}
                onClick={() => {
                  const orderId = orders[index].id;
                  const token = localStorage.getItem("access_token");

                  fetch(
                    `https://bitefy-backend.onrender.com/api/orders/${orderId}/`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  )
                    .then(() => {
                      const newOrders = orders.filter((_, i) => i !== index);
                      setOrders(newOrders);
                    })
                    .catch((error) => console.log("Error:", error));
                }}
              >
                REMOVE
              </button>

              <button
                style={completeButtonStyle}
                onClick={() => {
                  const orderId = orders[index].id;
                  const orderToComplete = orders[index];
                  const token = localStorage.getItem("access_token");
                  // Send DELETE to database
                  fetch(
                    `https://bitefy-backend.onrender.com/api/orders/${orderId}/`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ← Add!
                      },
                      body: JSON.stringify({ is_completed: true }),  
                    },
                  )
                    .then(() => {
                      // THEN remove from active and add to completed
                      const newOrders = orders.filter((_, i) => i !== index);
                      setOrders(newOrders);
                      setCompletedOrders([...completedOrders, orderToComplete]);
                    })
                    .catch((error) => console.log("Error:", error));
                }}
              >
                COMPLETE
              </button>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
}

export default OrderList;
