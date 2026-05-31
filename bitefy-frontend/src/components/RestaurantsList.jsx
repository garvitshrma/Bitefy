import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://bitefy-backend.onrender.com/api/public/restaurants/")
      .then(r => r.json())
      .then(data => setRestaurants(data))
      .catch(error => console.log("Error:", error));
  }, []);

  return (
    <div>
      <h2>Choose a Restaurant</h2>
      {restaurants.map((restaurant) => (
        <div key={restaurant.slug}>
          <h3>{restaurant.name}</h3>
          <button onClick={() => navigate(`/order/${restaurant.slug}`)}>
            Order Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default RestaurantList;