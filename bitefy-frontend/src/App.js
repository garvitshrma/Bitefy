import Navbar from "./components/Navbar";
import OrderList from "./components/OrderList";
import Menu from "./components/Menu";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const token = localStorage.getItem('access_token');
    const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Chai", price: 50 },
    { id: 2, name: "Maggi", price: 100 },
    { id: 3, name: "Sandwich", price: 120 },
    { id: 4, name: "Cold Coffee", price: 80 },
    { id: 5, name: "Samosa", price: 30 },
    { id: 6, name: "Dosa", price: 150 },
  ]);

  const [orders, setOrders] = useState([]);
  const appStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Add this
    color: "#333",
  };

  return (
    <div>
      {token ? <Dashboard /> : <Auth />}
    </div>
  );
}

export default App;
