import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import LoadingScreen from "./components/LoadingScreen";
import { useState, useEffect } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    // Show loading for 2 seconds, then hide
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, []);

    if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/auth" element={token ? <Dashboard /> : <Auth />}></Route>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;