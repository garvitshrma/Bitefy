import { act, useState } from "react";

function Auth() {
  // Signup state
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState("signup");

  const pageStyle = {
    backgroundColor: "#ecf1fe",
    margin: "0",
    padding: "0",
    height: "100vh",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const mainCard = {
    backgroundColor: "#ffffff",
    minHeight: "auto",
    paddingBottom: "32px",
    width: "31%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };

  const loginToggleStyle = {
    backgroundColor: "#5582fd",
    color: "#ffffff",
    width: "175px",
    padding: "12px",
    marginTop: "30px",
    marginRight: "5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const signupToggleStyle = {
    backgroundColor: "#5582fd",
    color: "#ffffff",
    width: "175px",
    padding: "12px",
    marginTop: "30px",
    marginRight: "5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const loginPageStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "32px",
    width: "360px",
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  };

  const h4style = {
    margin: "4px",
  };

  const finalButton = {
    backgroundColor: "#5582fd",
    height: "50px",
    borderRadius: "4px",
    color: "#ffffff",
    border: "none",
    marginTop: "10px",
    cursor: "pointer"
  };

  const inputStyle = {
    height: "50pxpx", // Taller input
    padding: "10px", // Space inside
    fontSize: "14px", // Text size
    border: "1px solid #ddd", // Light gray border
    borderRadius: "4px", // Rounded corners
    width: "100%", // Full width
    boxSizing: "border-box", // Include padding in width
  };

  const lineStyle = {
    flex: 1,
    height: "1px",
    backgroundColor: "#ddd",
  };

  const dividerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "20px 0", // spacing around it
  };

  const guestButtonStyle = {
    height: "50px",
    borderRadius: "4px",
    border: "none",
    marginTop: "10px",
  };

  const selectedStyle = {
    backgroundColor: "#5582fd",
  }

  const notSelectedStyle = {
    backgroundColor: "#b9cbfc59",
    color: "#000000",
    width: "175px",
    padding: "12px",
    marginTop: "30px",
    marginRight: "5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }

  return (
    <div style={pageStyle}>
      <h3 style={{fontSize:'35px', marginBottom: '10px'}}><i class="fa-solid fa-burger"></i> Bitefy</h3>

      <div style={mainCard}>
          <div>
            <button
              style={activeTab === 'login' ? loginToggleStyle : notSelectedStyle}
              onClick={() => setActiveTab("login")}
            >
              Log In
            </button>
            <button
              style={activeTab === 'signup' ? signupToggleStyle : notSelectedStyle}
              onClick={() => setActiveTab("signup")}
            >
            Sign Up
          </button>
        </div>

        {activeTab === "login" && (
          <div style={loginPageStyle}>
            <div style={inputGroupStyle}>
              <h4 style={h4style}>Email</h4>
              <input
                style={inputStyle}
                placeholder="Enter email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              ></input>
            </div>

            <div style={inputGroupStyle}>
              <h4 style={h4style}>Password</h4>
              <input
                style={inputStyle}
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              ></input>
            </div>
            <button
              style={finalButton}
              onClick={() => {
                const loginData = {
                  email: loginEmail,
                  password: loginPassword,
                };
                fetch(
                  // "http://localhost:8000/api/auth/login/"
                  "https://bitefy.onrender.com/api/auth/login/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(loginData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Full login response:", data);
                    if (data.error) {
                      alert("Error: " + data.error);
                      return;
                    }
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    console.log("Login response:", data);
                    console.log("Login successful!");
                    // Later: redirect to dashboard
                    window.location.href = "/dashboard";
                  })
                  .catch((error) => console.log("Error:", error));
              }}
            >
              LOG IN
            </button>

            <div style={dividerStyle}>
              <div style={lineStyle}></div>
              <span>or</span>
              <div style={lineStyle}></div>
            </div>

            <button style={guestButtonStyle}>Continue as Guest</button>
          </div>
        )}

        {activeTab === "signup" && (
          <div style={loginPageStyle}>
            <div>
              <h4 style={h4style}>Your Name</h4>
              <input
                style={inputStyle}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <h4 style={h4style}>Email</h4>
              <input
                style={inputStyle}
                placeholder="Enter email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              ></input>
            </div>

            <div>
              <h4 style={h4style}>Password</h4>
              <input
                style={inputStyle}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <div>
              <h4 style={h4style}>Confirm Password</h4>
              <input
                style={inputStyle}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>

            <div>
              <h4 style={h4style}>Restaurant Name</h4>
              <input
                style={inputStyle}
                placeholder="Restraunt Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              ></input>
            </div>

            <button
              style={finalButton}
              onClick={() => {
                const signupData = {
                  username: username,
                  email: signupEmail,
                  password: password,
                  restaurant_name: restaurantName ,
                };

                if (password !== confirmPassword) {
                  console.log("Passwords do not match!");
                  return;
                }

                console.log("Sending:", signupData);

                fetch(
                  // "http://localhost:8000/api/auth/signup/"
                  "https://bitefy.onrender.com/api/auth/signup/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(signupData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Django response:", data);
                  })
                  .catch((error) => console.log("Error:", error));
              }}
            >
              Sign Up
            </button>

            <div style={dividerStyle}>
              <div style={lineStyle}></div>
              <span>or</span>
              <div style={lineStyle}></div>
            </div>

            <button style={guestButtonStyle}>Continue as Guest</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
