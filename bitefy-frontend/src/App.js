import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we already showed loading in THIS browser session
    const hasShownLoading = sessionStorage.getItem("hasShownLoading");

    if (!hasShownLoading) {
      // First time this session: show loading
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasShownLoading", "true");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Already shown in this session: skip loading
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/dashboard" 
          element={
            localStorage.getItem("access_token") ? <Dashboard /> : <Auth />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;