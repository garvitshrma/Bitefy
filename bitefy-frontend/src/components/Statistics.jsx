function Statistics() {
  const topContainerStyle = {
    display: "flex",
        width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingTop: "20px",
    paddingRight: "100px",
    paddingLeft: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    marginBottom: "10px",
    overflowY: "auto",
    alignItems: 'center'
  };


  const mainStyle = {
    width: '98%'
  }
  const titleStyle = {
    color: "#000000",
    marginBottom: "20px",
    fontSize: "20px",
    marginTop: "0px",
  };

  const filterButtonStyle = {
    height: "40px",
    width: "80px",
    border: "none",
    borderRadius: "5px",
  };

  const filterStyle = {
    display: "flex",
    gap: "10px",
  };

  return (
    <div style={mainStyle}>
      <div style={topContainerStyle}>
        <h2 style={titleStyle}>Statistics & Analytics</h2>
        <div style={filterStyle}>
          <button style={filterButtonStyle}>Week</button>
          <button style={filterButtonStyle}>Month</button>
          <button style={filterButtonStyle}>Year</button>
        </div>
      </div>

      <div>
        <div>Total Revenue</div>
        <div>Completed Orders</div>
        <div>Avg Order Value</div>
      </div>
    </div>
  );
}

export default Statistics;
