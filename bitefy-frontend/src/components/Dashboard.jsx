import Navbar from "./Navbar";
import OrderList from "./OrderList";
import Menu from "./Menu";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Statistics from "./Statistics";
import History from "./History";
import NewOrderModal from "./NewOrderModal";
import Settings from "./Settings";
import OrderRequests from "./OrderRequests";

import { useState, useEffect } from "react";

function Dashboard() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("order");
  const [menuItems, setMenuItems] = useState([]);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchOrders = () => {
      fetch("https://bitefy-backend.onrender.com/api/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Orders response:", data);
          if (Array.isArray(data)) {
            const sorted = data.sort((a, b) => {
              return new Date(b.created_at) - new Date(a.created_at);
            });
            setOrders(sorted);
          } else {
            setOrders([]);
          }
        })
        .catch((error) => console.log("Error:", error));
    };

    fetch("https://bitefy-backend.onrender.com/api/menu-items/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMenuItems(data);
      })

      .catch((error) => console.log("Error:", error));

    fetchOrders();

    const interval = setInterval(fetchOrders, 3000);

    return () => clearInterval(interval);
  }, []);

  const appStyle = {
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  };

  return (
    <div className="bf-app" style={appStyle}>
      <style>{`
        /* Use the real visible viewport height on mobile (fixes cut-off bottom) */
        .bf-app {
          height: 100vh;      /* fallback for old browsers */
          height: 100dvh;     /* dynamic viewport — wins where supported */
          overflow-x: hidden;
          overflow-y: auto;
        }
        .bf-content {
          display: flex;
          flex: 1;
          gap: 15px;
          overflow: hidden;
          min-height: 0;       /* lets inner panels scroll instead of overflowing */
        }
        @media (max-width: 768px) {
          .bf-content { gap: 0; }
        }
      `}</style>

      <Header setShowModal={setShowModal} setActiveTab={setActiveTab} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="bf-content">
        {activeTab === "order" && (
          <>
            <OrderList
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              orders={orders}
              setOrders={setOrders}
              menuItems={menuItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <OrderRequests />
          </>
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

        {activeTab === "history" && <History />}
        {activeTab === "settings" && (
          <Settings activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
