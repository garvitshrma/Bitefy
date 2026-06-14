import { useState } from "react";

// ── Design tokens (matches Statistics & History) ───────────
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
  red: "#D9534F",
  redTint: "#FBEAEA",
};

function Menu({ selectedItems, setSelectedItems, menuItems, setMenuItems }) {
  const [newItemName, setNewItemName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // ── styles ───────────────────────────────────────────────
  const page = {
    width: "100%",
    minHeight: "100%",
    background: C.bg,
    borderRadius: "10px",
    padding: "28px 32px 40px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
    overflowY: "auto",
  };
  const eyebrow = {
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    fontSize: "11px",
    fontWeight: 700,
    color: C.muted,
    margin: 0,
  };
  const formCard = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "22px 24px",
    marginBottom: "24px",
  };
  const input = {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "12px",
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    boxSizing: "border-box",
    fontSize: "14px",
    background: C.bg,
    color: C.ink,
    outline: "none",
  };
  const addBtn = {
    background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    boxShadow: "0 6px 16px rgba(255,140,66,0.28)",
  };
  const itemCard = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "14px",
    padding: "14px 18px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const pill = (on) => ({
    background: on ? C.greenTint : C.redTint,
    color: on ? C.green : C.red,
    border: "none",
    padding: "7px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "12px",
    letterSpacing: "0.02em",
  });
  const trashBtn = {
    background: "transparent",
    color: C.muted,
    border: `1px solid ${C.border}`,
    cursor: "pointer",
    fontSize: "14px",
    padding: "8px 12px",
    marginLeft: "10px",
    borderRadius: "10px",
  };

  return (
    <div style={page}>
      <style>{`
        .bf-item { transition: transform .18s ease, box-shadow .18s ease; }
        .bf-item:hover { transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(42,33,24,0.07); }
        .bf-input:focus { border-color: ${C.accent} !important;
          background: #fff !important; }
        .bf-trash:hover { color: ${C.red} !important;
          border-color: ${C.red} !important; background: ${C.redTint} !important; }
        .bf-add:active { transform: scale(0.97); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={eyebrow}>Your menu</p>
        <h1
          style={{
            margin: "4px 0 0",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Menu Management
        </h1>
      </div>

      {/* Add item form */}
      <div style={formCard}>
        <p style={{ ...eyebrow, marginBottom: "14px" }}>Add a new item</p>
        <input
          type="text"
          placeholder="Item name"
          className="bf-input"
          style={input}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price (₹)"
          className="bf-input"
          style={input}
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <button
          className="bf-add"
          style={addBtn}
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
          <i className="fa-solid fa-plus" style={{ marginRight: "8px" }}></i>
          Add Item
        </button>
      </div>

      {/* Item list */}
      <p style={{ ...eyebrow, marginBottom: "14px" }}>
        {menuItems.length} {menuItems.length === 1 ? "item" : "items"}
      </p>

      {menuItems.map((item, index) => (
        <div key={item.id} className="bf-item" style={itemCard}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: C.ink }}>
              {item.name}
            </span>
            <span
              style={{ fontSize: "15px", fontWeight: 800, color: C.accentDeep }}
            >
              ₹{item.price}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              style={pill(item.is_available)}
              onClick={() => {
                const token = localStorage.getItem("access_token");
                fetch(
                  `https://bitefy-backend.onrender.com/api/menu-items/${item.id}/`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ is_available: !item.is_available }),
                  },
                )
                  .then((r) => r.json())
                  .then((data) => {
                    const updatedItems = menuItems.map((m) =>
                      m.id === item.id
                        ? { ...m, is_available: !m.is_available }
                        : m,
                    );
                    setMenuItems(updatedItems);
                  });
              }}
            >
              {item.is_available ? "✅ Available" : "❌ Unavailable"}
            </button>
            <button
              className="bf-trash"
              style={trashBtn}
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
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;