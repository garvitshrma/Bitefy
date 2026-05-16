import { useState } from "react";

function Menu({ selectedItems, setSelectedItems, menuItems, setMenuItems }) {
  const [newItemName, setNewItemName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const menuContainerStyle = {
    padding: "20px",
    backgroundColor: "#f1984f",
    borderLeft: "1px solid #ddd",
    overflowY: "auto",
    width: "30%",
    borderRadius: "35px",
    marginLeft: "10px",
    marginRight: "10px",
    flex: "None",
  };

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "white",
    borderRadius: "10px", // Increase this
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
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
    border: "1px solid #ddd",
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
    backgroundColor: "#e64d2e",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "12px 24px",
    marginLeft: "20px",
    borderRadius: "6px",
  };

  return (
    <div style={menuContainerStyle}>
      <h2
        style={{
          textAlign: "center",
          color: "#ffffff",
          marginBottom: "20px",
          fontSize: "40px",
        }}
      >
        MENU
      </h2>

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
            const newItem = {
              id: menuItems.length + 1,
              name: newItemName,
              price: parseInt(newPrice),
            };
            setMenuItems([...menuItems, newItem]);
            setNewItemName("");
            setNewPrice("");
          }}
        >
          Add Item
        </button>
      </div>

      {menuItems.map((item, index) => (
        <div key={item.id} style={menuItemStyle}>
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

          <button
            style={removeButtonStyle}
            onClick={() => {
              const newItems = menuItems.filter((_, i) => i !== index);
              setMenuItems(newItems);
            }}
          >
            REMOVE
          </button>
        </div>
      ))}
    </div>
  );
}

export default Menu;
