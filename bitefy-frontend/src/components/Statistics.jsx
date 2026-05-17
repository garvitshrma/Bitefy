function Statistics() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    marginLeft: "10px",
    marginBottom: "10px",
    overflowY: "auto",
  };

  const titleStyle = {
    color: "#000000",
    marginBottom: "20px",
    fontSize: "20px",
    marginTop: "0px",
  };

  return (
    <div style={containerStyle}>
      <div>
        <h2 style={titleStyle}>Statistics & Analytics</h2>
        <div><button>Week</button>
        <button>Month</button>
        <button>Year</button></div>
      </div>
    </div>
  );
}

export default Statistics;
