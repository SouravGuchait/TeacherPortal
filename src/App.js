import "./App.css";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { checkSession } from "./api";

function App() {
  const [loggedIn, setLoggedIn] = useState(null); // null = loading
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const res = await checkSession();
      setLoggedIn(res.logged_in);
    };
    verifySession();
  }, []);

  if (loggedIn === null) return <div>Loading...</div>;

  return (
    <div className="app">
      {loggedIn ? (
        <Dashboard onLogout={() => setLoggedIn(false)} />
      ) : showRegister ? (
        <Register
          onRegistered={() => setShowRegister(false)}
          switchToLogin={() => setShowRegister(false)}
        />
      ) : (
        <Login
          onLogin={() => setLoggedIn(true)}
          switchToRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  );
}

export default App;
