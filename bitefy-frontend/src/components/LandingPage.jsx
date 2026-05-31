import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg.png"

function LandingPage() {

    const navigate = useNavigate();

  const headerstyle = {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderBottom: "0.1px solid #41414199",
  };

  const aboveCardsTextStyle = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
    paddingBottom: "0",
    marginBottom: "0px",
    marginTop: "100px",
  };

  const mainStyle = {
    backgroundColor: '#f4f8fe',
    height: "100vh",
    padding: "0",
    margin: "0",
    backgroundImage: `url(${bg}`
  };

  const cardsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "30px", // Space between cards
    marginTop: "16px",
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    width: "400px", // Fixed width
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };



  const custbuttonStyle = { 
    backgroundColor: "#5582fd",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
  };

    const restbuttonStyle = {
    backgroundColor: '#00a410',
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
  };

  const threePointStyle = {
    display: "flex",
    flexDirection: "column",
    margin: "0",
    padding: "0",
    alignItems: "flex-start",
    textAlign: "left",
    marginTop: '25px',
    marginBottom: '20px'
  };

  const defaultPaddingMarginStyle = {
    margin: 0,
    padding: 0,
  };

  const customerImageStyle = {
    width: "60px",
    height: "60px",
    backgroundColor: "#e8f0ff", // Light blue background
    borderRadius: "50%", // Makes it circular
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto", // Centers the circle itself
    marginBottom: "25px",
    color: '#2761ff'
  };

    const restaurantImageStyle = {
    width: "60px",
    height: "60px",
    backgroundColor: "#1dcf2948", // Light blue background
    borderRadius: "50%", // Makes it circular
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto", // Centers the circle itself
    marginBottom: "25px",
    color: '#00a410'
  };

  const resticonsStyle = {
    color: '#00a410'
  }

    const custiconsStyle = {
    color: '#2761ff'
  }

  return (
    <div style={mainStyle}>
      <div style={headerstyle}>
        <h2 style={{fontSize: '40px', padding: '0', margin: '0', paddingTop: '10px', paddingBottom: '10px'}}><i class="fa-solid fa-burger"></i> Bitefy</h2>
      </div>

      <div style={aboveCardsTextStyle}>
        <h3 style={defaultPaddingMarginStyle}>
          Your Complete Restaurant Solution
        </h3>
        <p style={defaultPaddingMarginStyle}>
          Whether you're managing a restaurant or looking for your next great
          meal, Bitefy connects diners with exceptional dining
          experiences.
        </p>
      </div>

      <div style={cardsContainerStyle}>
        {/* Customer Card */}
        <div style={cardStyle}>
          <h1 style={customerImageStyle}>
            <i class="fa-solid fa-users"></i>
          </h1>
          <h3>I'm a Customer</h3>
          <p>
            Discover amazing restaurants, browse menus, and enjoy personalized
            recommendations
          </p>
          <div style={threePointStyle}>
            <p style={defaultPaddingMarginStyle}>
              <i style={custiconsStyle}  class="fa-solid fa-magnifying-glass"></i> Search local
              restaurants
            </p>
            <p style={defaultPaddingMarginStyle}>
              <i style={custiconsStyle} class="fa-solid fa-utensils"></i> Browse menus & prices
            </p>
            <p style={defaultPaddingMarginStyle}>
              <i style={custiconsStyle} class="fa-solid fa-arrow-trend-up"></i> Get personalized
              recommendations
            </p>
          </div>
          <button style={custbuttonStyle}
          onClick={() => window.location.href = '/order/giantruffian'}>
            Continue as Customer</button>
        </div>

        {/* Restaurant Card */}
        <div style={cardStyle}>
          <h1 style={restaurantImageStyle}>
            <i class="fa-solid fa-champagne-glasses"></i>
          </h1>
          <h3>I'm a Restaurant</h3>
          <p>
            Powerful management tools to streamline operations and grow your
            business
          </p>
          <div style={threePointStyle}>
            <p style={defaultPaddingMarginStyle}>
              <i style={resticonsStyle} class="fa-regular fa-clock"></i> Manage order queue
            </p>
            <p style={defaultPaddingMarginStyle}>
              <i style={resticonsStyle} class="fa-solid fa-utensils"></i> Update menu & pricing
            </p>
            <p style={defaultPaddingMarginStyle}>
              <i style={resticonsStyle} class="fa-solid fa-arrow-trend-up"></i> Track sales & analytics
            </p>
          </div>
          <button onClick={() => navigate("/auth")} style={restbuttonStyle}>Continue as Restaurant</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
