import { useState, useEffect } from "react";

// ── Design tokens (matches the rest of the dashboard) ──────
const C = {
  bg: "#FBF8F4",
  surface: "#FFFFFF",
  ink: "#2A2118",
  muted: "#9B9389",
  border: "#EFE7DD",
  accent: "#FF8C42",
  accentDeep: "#E8722A",
  red: "#D9534F",
  redTint: "#FBEAEA",
};

function Settings() {
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(
      "https://bitefy-backend.onrender.com/api/restaurants/my_restaurant/",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        setRestaurant(data);
        setRestaurantName(data.name);
        setSlug(data.slug || "");
        setAccountNumber(data.account_number || "");
        setIfscCode(data.ifsc_code || "");
        setAccountHolderName(data.account_holder_name || "");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSave = () => {
    const token = localStorage.getItem("access_token");
    setIsSaving(true);

    fetch(
      `https://bitefy-backend.onrender.com/api/restaurants/${restaurant.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: restaurantName,
          slug: slug,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          account_holder_name: accountHolderName,
        }),
      },
    )
      .then((r) => r.json())
      .then((data) => {
        setRestaurant(data);
        alert("Settings saved successfully!");
        setIsSaving(false);
        window.location.reload();
      })
      .catch((error) => {
        console.log("Error:", error);
        alert("Failed to save settings");
        setIsSaving(false);
      });
  };

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
    overflowY: 'auto'
  };
  const eyebrow = {
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    fontSize: "11px",
    fontWeight: 700,
    color: C.muted,
    margin: 0,
  };
  const card = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "26px 28px",
    maxWidth: "560px",
  };
  const formGroupStyle = { marginBottom: "22px" };
  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: C.ink,
    marginBottom: "8px",
  };
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    fontSize: "14px",
    boxSizing: "border-box",
    background: C.bg,
    color: C.ink,
    outline: "none",
  };
  const helperStyle = {
    fontSize: "12px",
    color: C.muted,
    marginTop: "7px",
  };
  const buttonStyle = {
    background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`,
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    marginTop: "6px",
    boxShadow: "0 6px 16px rgba(255,140,66,0.28)",
  };
  const logoutButtonStyle = {
    color: C.red,
    border: `1px solid ${C.red}`,
    backgroundColor: C.redTint,
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    marginTop: "28px",
    padding: "11px 18px",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  };

  if (isLoading)
    return (
      <div style={page}>
        <p style={{ color: C.muted }}>Loading settings…</p>
      </div>
    );

  return (
    <div style={page}>
      <style>{`
        .bf-input:focus { border-color: ${C.accent} !important;
          background: #fff !important; }
        .bf-save:active { transform: scale(0.98); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={eyebrow}>Restaurant</p>
        <h1
          style={{
            margin: "4px 0 0",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Settings
        </h1>
      </div>

      {/* Settings card */}
      <div style={card}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Restaurant Name</label>
          <input
            type="text"
            className="bf-input"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            style={inputStyle}
            placeholder="Enter restaurant name"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Restaurant Slug (URL)</label>
          <input
            type="text"
            className="bf-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={inputStyle}
            placeholder="e.g., tech-cafe"
          />
          <p style={helperStyle}>
            Your customer order link: bitefy.vercel.app/order/
            <strong style={{ color: C.accentDeep }}>
              {slug || "your-slug"}
            </strong>
          </p>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Account Holder Name</label>
          <input
            type="text"
            className="bf-input"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            style={inputStyle}
            placeholder="e.g., Tech Cafe"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Account Number</label>
          <input
            type="text"
            className="bf-input"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            style={inputStyle}
            placeholder="e.g., 12345678901234"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>IFSC Code</label>
          <input
            type="text"
            className="bf-input"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            style={inputStyle}
            placeholder="e.g., AXIS0001234"
          />
          <p style={helperStyle}>Your bank's IFSC code for split payments</p>
        </div>

        <button
          className="bf-save"
          style={{
            ...buttonStyle,
            opacity: isSaving ? 0.6 : 1,
            cursor: isSaving ? "not-allowed" : "pointer",
          }}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "⏳ Saving..." : "💾 Save Settings"}
        </button>
      </div>

      {/* Logout — separated from settings to avoid accidental clicks */}
      <div>
        <button
          style={logoutButtonStyle}
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            window.location.href = "/auth";
          }}
        >
          Log Out <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
}

export default Settings;
