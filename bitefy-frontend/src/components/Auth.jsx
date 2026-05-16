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

  return (
    <div>
      <h3>Bitefy</h3>
      <button onClick={() => setActiveTab("login")}>Log In</button>
      <button onClick={() => setActiveTab("signup")}>Sign Up</button>

      {activeTab === "login" && (
        <div>
          <input
            placeholder="Enter email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          ></input>
          <input
            placeholder="Enter password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          ></input>
          <button
            onClick={() => {
              const loginData = {
                email: loginEmail,
                password: loginPassword,
              };
              fetch("http://127.0.0.1:8000/api/auth/login/", {
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
        </div>
      )}

      {activeTab === "signup" && (
        <div>
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Enter email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          ></input>
          <input
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
          <input
            placeholder="Restraunt Name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
          ></input>
          <button
            onClick={() => {
              const signupData = {
                username: username,
                email: signupEmail,
                password: password,
              };

              if (password !== confirmPassword) {
                console.log("Passwords do not match!");
                return;
              }

              console.log("Sending:", signupData);

              fetch("http://127.0.0.1:8000/api/auth/signup/", {
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
        </div>
      )}
    </div>
  );
}

export default Auth;
