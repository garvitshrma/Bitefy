import { act, useState } from "react";
import bg from "../assets/bg.png";
import { GoogleLogin } from "@react-oauth/google";

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
    minHeight: "100vh",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundImage: `url(${bg}`,
  };

  const mainCard = {
    backgroundColor: "#ffffff",
    width: "90%",
    maxWidth: "500px",
    padding: "32px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  };

  const loginToggleStyle = {
    backgroundColor: "#5582fd",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "32px",
    padding: "12px",
    marginTop: "30px",
    marginRight: "5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
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
    cursor: "pointer",
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
    cursor: "pointer",
  };

  const inputStyle = {
    height: "50px",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    width: "100%",
    boxSizing: "border-box",
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
    background: "#5582fd",
    color: "white",
  };

  const notSelectedStyle = {
    backgroundColor: "#dde7ff",
    color: "#000000",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
    marginTop: "32px",
    padding: "12px",
    marginTop: "30px",
    marginRight: "5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={pageStyle}>
      <h3 style={{ fontSize: "35px", marginBottom: "10px" }}>
        <i class="fa-solid fa-burger"></i> Bitefy
      </h3>

      <div style={mainCard}>
        <div
          style={{
            display: "flex",
            background: "#ffffff",
            borderRadius: "12px",
            width: "100%",
          }}
        >
          <button
            style={activeTab === "login" ? loginToggleStyle : notSelectedStyle}
            onClick={() => setActiveTab("login")}
          >
            Log In
          </button>
          <button
            style={
              activeTab === "signup" ? loginToggleStyle : notSelectedStyle
            }
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
                type="password"
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
                  "https://bitefy-backend.onrender.com/api/auth/login/",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                  },
                )
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

            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Google login success!", credentialResponse);
                // Send to Django next!
              }}
              onError={() => {
                alert("Google login failed!");
              }}
              onSuccess={(credentialResponse) => {
                fetch("https://bitefy-backend.onrender.com/api/auth/google/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    token: credentialResponse.credential,
                  }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    console.log("Django response:", data);
                    if (data.access) {
                      localStorage.setItem("access_token", data.access);
                      localStorage.setItem("user", JSON.stringify(data.user));
                      window.location.href = "/dashboard";
                    } else {
                      alert("Google login failed: " + data.error);
                    }
                  })
                  .catch((error) => console.log("Error:", error));
              }}
            />
          </div>
        )}

        {activeTab === "signup" && (
          <div style={loginPageStyle}>
            <div>
              <h4 style={h4style}>Username (only one word is allowed)</h4>
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
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <div>
              <h4 style={h4style}>Confirm Password</h4>
              <input
                style={inputStyle}
                placeholder="Confirm Password"
                type="password"
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
                  restaurant_name: restaurantName,
                };

                if (password !== confirmPassword) {
                  console.log("Passwords do not match!");
                  return;
                }

                console.log("Sending:", signupData);

                fetch(
                  // "http://localhost:8000/api/auth/signup/"
                  "https://bitefy-backend.onrender.com/api/auth/signup/",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(signupData),
                  },
                )
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Django response:", data);
                    alert("You are Signed Up, Please Login!!");
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

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log("Google login success!", credentialResponse);

                  // Send Google token to Django!
                  fetch(
                    "https://bitefy-backend.onrender.com/api/auth/google/",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        token: credentialResponse.credential,
                      }),
                    },
                  )
                    .then((r) => r.json())
                    .then((data) => {
                      console.log("Django response:", data);
                      if (data.access) {
                        localStorage.setItem("access_token", data.access);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        window.location.href = "/dashboard";
                      } else {
                        alert("Google login failed: " + data.error);
                      }
                    })
                    .catch((error) => console.log("Error:", error));
                }}
                onError={() => {
                  alert("Google login failed!");
                }}
                onSuccess={(credentialResponse) => {
                  fetch(
                    "https://bitefy-backend.onrender.com/api/auth/google/",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        token: credentialResponse.credential,
                      }),
                    },
                  )
                    .then((r) => r.json())
                    .then((data) => {
                      console.log("Django response:", data);
                      if (data.access) {
                        localStorage.setItem("access_token", data.access);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        window.location.href = "/dashboard";
                      } else {
                        alert("Google login failed: " + data.error);
                      }
                    })
                    .catch((error) => console.log("Error:", error));
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
