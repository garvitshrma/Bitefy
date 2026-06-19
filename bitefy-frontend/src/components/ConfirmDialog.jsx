const C = {
  surface: "#FFFFFF",
  ink: "#2A2118",
  muted: "#9B9389",
  border: "#EFE7DD",
  red: "#D9534F",
  green: "#3DAA6D",
};

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isDangerous = false }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: "16px",
          padding: "28px",
          maxWidth: "380px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: "20px", fontWeight: 800, color: C.ink }}>
          {title}
        </h2>
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: C.muted, lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              border: `1px solid ${C.border}`,
              borderRadius: "10px",
              background: "transparent",
              color: C.ink,
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: isDangerous ? C.red : C.green,
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {isDangerous ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;