import Navbar from "./Navbar";
import OrderList from "./OrderList";
import Menu from "./Menu";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Statistics from "./Statistics";
import NewOrderModal from "./NewOrderModal";
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
        style={{ display: "flex", flex: 1, gap: "15px", overflow: "hidden" }}
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
