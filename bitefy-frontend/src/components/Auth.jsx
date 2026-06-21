import { act, useState } from "react";
import bg from "../assets/bg.png";
import { GoogleLogin } from "@react-oauth/google";

// ── Flip this to choose your background ────────────────────
const USE_BG_IMAGE = false; // false = warm gradient · true = bg.png

// ── Design tokens (matches the dashboard) ──────────────────
const C = {
  bg: "#FBF8F4",
  surface: "#FFFFFF",
  ink: "#2A2118",
  muted: "#9B9389",
  border: "#EFE7DD",
  accent: "#FF8C42",
  accentDeep: "#E8722A",
  accentTint: "#FFF1E6",
};

function Auth() {
  // Signup state
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [activeTab, setActiveTab] = useState("signup");

  // ── styles ───────────────────────────────────────────────
  const pageStyle = {
    margin: "0",
    padding: "24px 16px",
    minHeight: "100vh",
    boxSizing: "border-box",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
    background: USE_BG_IMAGE
      ? `url(${bg})`
      : `linear-gradient(160deg, ${C.bg}, ${C.accentTint})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const logoStyle = {
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: C.accentDeep,
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const mainCard = {
    backgroundColor: C.surface,
    width: "100%",
    maxWidth: "460px",
    padding: "32px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "20px",
    border: `1px solid ${C.border}`,
    boxShadow: "0 20px 50px rgba(42,33,24,0.12)",
  };

  const toggleWrap = {
    display: "flex",
    gap: "4px",
    background: C.accentTint,
    padding: "4px",
    borderRadius: "12px",
    width: "100%",
  };

  const toggleBtn = (active) => ({
    flex: 1,
    padding: "11px",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    background: active
      ? `linear-gradient(135deg, ${C.accent}, #FF6F3C)`
      : "transparent",
    color: active ? "#fff" : C.muted,
    boxShadow: active ? "0 4px 12px rgba(255,140,66,0.3)" : "none",
    transition: "all 0.18s ease",
  });

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "28px",
    width: "100%",
  };

  const labelStyle = {
    margin: "0 0 6px",
    fontSize: "13px",
    fontWeight: 700,
    color: C.ink,
  };

  const inputStyle = {
    height: "48px",
    padding: "10px 14px",
    fontSize: "14px",
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    width: "100%",
    boxSizing: "border-box",
    background: C.bg,
    color: C.ink,
    outline: "none",
  };

  const finalButton = {
    background: `linear-gradient(135deg, ${C.accent}, #fe6d38)`,
    height: "50px",
    borderRadius: "10px",
    color: "#ffffff",
    border: "none",
    marginTop: "6px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    boxShadow: "0 6px 16px rgba(255,140,66,0.28)",
  };

  const lineStyle = { flex: 1, height: "1px", backgroundColor: C.border };

  const dividerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "18px 0",
    color: C.muted,
    fontSize: "13px",
  };

  return (
    <div style={pageStyle}>
      <style>{`
        .bf-input:focus { border-color: ${C.accent} !important;
          background: #fff !important; }
        .bf-cta:active { transform: scale(0.98); }
      `}</style>

      <h3 style={logoStyle}>
        <i className="fa-solid fa-burger"></i> Bitefy
      </h3>

      <div style={mainCard}>
        <div style={toggleWrap}>
          <button
            style={toggleBtn(activeTab === "login")}
            onClick={() => setActiveTab("login")}
          >
            Log In
          </button>
          <button
            style={toggleBtn(activeTab === "signup")}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "login" && (
          <div style={formStyle}>
            <div>
              <h4 style={labelStyle}>Email</h4>
              <input
                className="bf-input"
                style={inputStyle}
                placeholder="Enter email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              ></input>
            </div>

            <div>
              <h4 style={labelStyle}>Password</h4>
              <input
                className="bf-input"
                style={inputStyle}
                placeholder="Enter password"
                value={loginPassword}
                type="password"
                onChange={(e) => setLoginPassword(e.target.value)}
              ></input>
            </div>
            <button
              className="bf-cta"
              style={finalButton}
              onClick={() => {
                const loginData = {
                  email: loginEmail,
                  password: loginPassword,
                };
                fetch(
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

            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log("Google login success!", credentialResponse);
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
          </div>
        )}

        {activeTab === "signup" && (
          <div style={formStyle}>
            <div>
              <h4 style={labelStyle}>Username (only one word is allowed)</h4>
              <input
                className="bf-input"
                style={inputStyle}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <h4 style={labelStyle}>Email</h4>
              <input
                className="bf-input"
                style={inputStyle}
                placeholder="Enter email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              ></input>
            </div>

            <div>
              <h4 style={labelStyle}>Password</h4>
              <input
                className="bf-input"
                style={inputStyle}
                placeholder="Create password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <div>
              <h4 style={labelStyle}>Confirm Password</h4>
              <input
                className="bf-input"
                style={inputStyle}
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>

            <div>
              <h4 style={labelStyle}>Restaurant Name</h4>
              <input
                className="bf-input"
                style={inputStyle}
                placeholder="Restaurant name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              ></input>
            </div>

            <button
              className="bf-cta"
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