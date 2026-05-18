import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

function App() {
  const token = localStorage.getItem('access_token');

  return (
    <div>
      {token ? <Dashboard /> : <Auth />}
    </div>
  );
}

export default App;