function Navbar() {
  const navbarStyle = {
    backgroundColor: "#FF8C42",
    color: "white",
    padding: "20px",
    textAlign: "center",
    fontSize: "42px",
    fontWeight: "bold",
    borderRadius: "12px", // Add this
    margin: "15px", // Add this
    boxShadow: "0 4px 8px rgba(255, 140, 66, 0.3)", // Add this
    width: "40%",
    textShadow: "0 0 10px rgba(15, 30, 84, 0.5)",
  };

  return <div style={navbarStyle}>Bitefy</div>;
}

export default Navbar;
