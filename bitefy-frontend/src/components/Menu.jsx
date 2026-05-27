import { useState } from "react";

function Menu({ selectedItems, setSelectedItems, menuItems, setMenuItems }) {
  const [newItemName, setNewItemName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const menuContainerStyle = {
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderLeft: "1px solid #ddd",
    overflowY: "auto",
    PaddingLeft: "10px",
    PaddingRight: "10px",
    flex: "None",
    width: "97%",
  };

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "white",
    borderRadius: "10px", // Increase this
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    border: "1px solid #000000",
    display: "flex",
    justifyContent: "space-between",
  };

  const checkboxStyle = {
    marginRight: "10px",
    width: "18px",
    height: "18px",
    cursor: "pointer",
  };

  const labelStyle = {
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    color: "#2c3e50",
  };

  const priceStyle = {
    color: "#FF8C42",
    fontWeight: "bold",
  };

  const menuFormStyle = {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  };

  const menuInputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #000000",
    borderRadius: "5px",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  const addItemButtonStyle = {
    backgroundColor: "#FF8C42",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const removeButtonStyle = {
    backgroundColor: "white",
    color: "red",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "px",
    padding: "12px 24px",
    marginLeft: "20px",
    borderRadius: "6px",
  };

  const menuHeaderStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  };

  const addButtonStyle = {
    paddingRight: "20px",
    paddingLeft: "20px",
    marginLeft: "20px",
    marginRight: "20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0084ff",
    color: "white",
  };

  return (
    <div style={menuContainerStyle}>
      <div style={menuHeaderStyle}>
        <h2
          style={{
            color: "#000000",
            marginBottom: "20px",
            fontSize: "20px",
            marginTop: "0px",
          }}
        >
          Menu Management
        </h2>
      </div>

      <div style={menuFormStyle}>
        <h3>Add Item</h3>
        <input
          type="text"
          placeholder="Item Name"
          style={menuInputStyle}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        ></input>
        <input
          type="number"
          placeholder="Enter Price"
          style={menuInputStyle}
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        ></input>
        <button
          style={addItemButtonStyle}
          onClick={() => {
            const token = localStorage.getItem("access_token");

            fetch("https://bitefy-backend.onrender.com/api/menu-items/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: newItemName,
                price: parseInt(newPrice),
              }),
            })
              .then((r) => r.json())
              .then((data) => {
                setMenuItems([...menuItems, data]); // ← Add real item from Django!
                setNewItemName("");
                setNewPrice("");
              })
              .catch((error) => console.log("Error:", error));
          }}
        >
          Add Item
        </button>
      </div>

      {menuItems.map((item, index) => (
        <div key={item.id} style={menuItemStyle}>
          <div>
            <input
              checked={selectedItems.includes(item.name)}
              type="checkbox"
              style={checkboxStyle}
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
            <label style={labelStyle}>
              {item.name} - <span style={priceStyle}>₹{item.price}</span>
            </label>
          </div>

          <button
            style={removeButtonStyle}
            onClick={() => {
              const token = localStorage.getItem("access_token");

              fetch(
                `https://bitefy-backend.onrender.com/api/menu-items/${item.id}/`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                },
              )
                .then(() => {
                  const newItems = menuItems.filter((_, i) => i !== index);
                  setMenuItems(newItems);
                })
                .catch((error) => console.log("Error:", error));
            }}
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Menu;
