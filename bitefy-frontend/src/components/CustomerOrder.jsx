import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function CustomerOrder() {
  const { slug } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetch(`https://bitefy-backend.onrender.com/api/public/menu/${slug}/`)
      .then(r => r.json())
      .then(data => {
        setMenuItems(data);
        setIsLoading(false);
      })
  }, [slug]);

  // Calculate total
  const total = menuItems.reduce((sum, item) => {
    return sum + (item.price * (quantities[item.id] || 0));
  }, 0);

  // Increase quantity
  const increaseQty = (item) => {
    setQuantities(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  // Decrease quantity
  const decreaseQty = (item) => {
    setQuantities(prev => ({
      ...prev,
      [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
    }));
  };

  if (isLoading) return <p>Loading menu...</p>;

  if (orderPlaced) return (
    <div>
      <h2>🎉 Order Placed!</h2>
      <p>Your order is being prepared!</p>
    </div>
  );

  return (
    <div>
      <h1>Menu</h1>
      
      {menuItems.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>₹{item.price}</span>
          <button onClick={() => decreaseQty(item)}>-</button>
          <span>{quantities[item.id] || 0}</span>
          <button onClick={() => increaseQty(item)}>+</button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button onClick={() => {
        const items = menuItems
          .filter(item => quantities[item.id] > 0)
          .map(item => ({
            name: item.name,
            quantity: quantities[item.id],
            price: item.price
          }));

        if (items.length === 0) {
          alert("Please select items!");
          return;
        }

        const orderNumber = Math.floor(Math.random() * 900000) + 100000;

        fetch(`https://bitefy-backend.onrender.com/api/public/order/${slug}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `Order #${orderNumber}`,
            items: items,
            total: total
          })
        })
          .then(r => r.json())
          .then(data => {
            console.log("Order placed:", data);
            setOrderPlaced(true);
            setQuantities({});
          })
          .catch(error => console.log("Error:", error));
      }}>
        Place Order
      </button>
    </div>
  );
}

export default CustomerOrder;