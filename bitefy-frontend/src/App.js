import Navbar from "./components/Navbar";
import OrderList from "./components/OrderList";
import Menu from "./components/Menu";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
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
    // <div style={appStyle}>
    //   <div style={{ display: "flex", justifyContent: "center" }}>
    //     <Navbar />
    //   </div>
    //   <div
    //     style={{ display: "flex", flex: 1, gap: "15px", overflow: "hidden" }}
    //   >
    //     <OrderList
    //       selectedItems={selectedItems}
    //       setSelectedItems={setSelectedItems}
    //       orders={orders}
    //       setOrders={setOrders}
    //       menuItems={menuItems}
    //     />
    //     <Menu
    //       selectedItems={selectedItems}
    //       setSelectedItems={setSelectedItems}
    //       menuItems={menuItems}
    //       setMenuItems={setMenuItems}
    //     />
    //   </div>
    // </div>
  );
}

export default App;
