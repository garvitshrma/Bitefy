import Navbar from "./Navbar";
import OrderList from "./OrderList";
import Menu from "./Menu";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Statistics from "./Statistics";
import NewOrderModal from "./NewOrderModal";
import bg from "../assets/bg.png"
import { useState, useEffect } from "react";

function Dashboard() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("order");
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Chai", price: 50 },
    { id: 2, name: "Maggi", price: 100 },
    { id: 3, name: "Sandwich", price: 120 },
    { id: 4, name: "Cold Coffee", price: 80 },
    { id: 5, name: "Samosa", price: 30 },
    { id: 6, name: "Dosa", price: 150 },
  ]);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("https://bitefy.onrender.com/api/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Orders response:", data); // ← Check what's coming!
        if (Array.isArray(data)) {
          // ← Only set if it's an array!
          setOrders(data);
        } else {
          setOrders([]); // ← Set empty array if error!
          console.log("Error from API:", data);
        }
      })

      .catch((error) => console.log("Error:", error));
  }, []);

  const appStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  };

  return (
    <div style={appStyle}>
      <Header setShowModal={setShowModal} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div
        style={{ display: "flex", flex: 1, gap: "15px", overflow: "hidden", backgroundImage: `url(${bg}`}}
      >
        {activeTab === "order" && (
          <OrderList
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            orders={orders}
            setOrders={setOrders}
            menuItems={menuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "menu" && (
          <Menu
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            menuItems={menuItems}
            setMenuItems={setMenuItems}
          />
        )}

        {activeTab === "statistics" && <Statistics />}

        {showModal && (
          <NewOrderModal
            setShowModal={setShowModal}
            menuItems={menuItems}
            setOrders={setOrders}
            orders={orders}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
