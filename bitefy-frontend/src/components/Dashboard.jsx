import Navbar from './Navbar';
import OrderList from './OrderList';
import Menu from './Menu';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [selectedItems, setSelectedItems] = useState([]);
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  };

  return (
    <div style={appStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
        <Navbar />
        <button onClick={() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }}>
          Logout
        </button>
      </div>
      <div style={{ display: "flex", flex: 1, gap: "15px", overflow: "hidden" }}>
        <OrderList
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          orders={orders}
          setOrders={setOrders}
          menuItems={menuItems}
        />
        <Menu
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItems={menuItems}
          setMenuItems={setMenuItems}
        />
      </div>
    </div>
  );
}

export default Dashboard;