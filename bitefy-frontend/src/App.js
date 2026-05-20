import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const token = localStorage.getItem('access_token');

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/auth" element={token ? <Dashboard /> : <Auth />}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;