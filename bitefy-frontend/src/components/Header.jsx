function Header({setShowModal}) {
  const mainStyle = {
    display: "flex",
    flexDirection: "row", // ← Items LEFT to RIGHT
    justifyContent: "space-between", // ← LEFT and RIGHT ends!
    alignItems: "center", // ← Vertical center
    paddingRight: "20px",
    paddingLeft: "20px",
    backgroundColor: "#ffffff",
    borderBottom: "0.3px solid #000000",
    paddingTop: "10px",
    paddingBottom: '10px'
  };

  const firstSectionStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "16px",
  };

  const rightSectionStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "15px",
  };

  const defaultPaddingMargin = {
    margin: "0px",
    padding: "0px",
  };

  const openButtonStyle = {
    backgroundColor: "#c1f097",
    height: "50px",
    padding: "10px",
    border: "none",
    margin: "10px",
    paddingRight: "15px",
    paddingLeft: "15px",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#05931d",
    cursor: "pointer",
  };

  const newOrderButtonStyle = {
    backgroundColor: "#00c903",
    color: "#ffffff",
    height: "50px",
    border: "none",
    paddingRight: "15px",
    paddingLeft: "15px",
    borderRadius: "5px",
    cursor: 'pointer',
  };

  const logoutButtonStyle = {
    color: "#e73838",
    border: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: '20px'
  };

  const settingsButtonStyle = {
    border: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: '20px'
  };
  return (
    <div style={mainStyle}>
      <div style={firstSectionStyle}>
        <div>
          <h2 style={defaultPaddingMargin}>Demo Restaurant</h2>
          <p style={defaultPaddingMargin}>Management Dashboard</p>
        </div>
        <div>
          <button style={openButtonStyle}>
            {" "}
            <i class="fa-solid fa-lock-open"></i> Open
          </button>
        </div>
      </div>

      <div style={rightSectionStyle}>
        <button style={newOrderButtonStyle}
        onClick={() => (setShowModal(true))}>
          <i class="fa-solid fa-plus"></i> New Order
        </button>
        <button style={settingsButtonStyle}>
          <i className="fa-solid fa-gear"></i>
        </button>
        <button style={logoutButtonStyle}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
}
export default Header;
