import Router from "./components/Router";
import Context from "./components/Context";
import "./App.css";
import { CartProvider } from "./components/ShoppingCart/Context/CartContext";
import Cart from "./components/ShoppingCart/ShoppingCart";
import Login from "./pages/LoginPage/login";
import React, { useState } from "react";
import SignUp from "./pages/SignUpPage/signup";

function setToken(userToken) {
  sessionStorage.setItem("token", JSON.stringify(userToken));
}
function getToken() {
  const tokenVal = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenVal);
  return userToken?.token;
}

function App() {
  const token = getToken();
  const [isLogin, setIsLogin] = useState(false);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  if (!token) {
    return (
      <div className="welcome-screen">
        <h1 className="title">Welcome to UC MarketPlace</h1>
        {isLogin ? <Login setToken={setToken} /> : <SignUp />}
        <div className="toggle">
          <button onClick={handleToggle}>
            {isLogin ? "Need an account?" : "Already have an account?"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <CartProvider>
        <Context.Provider>
          <Router />
          <Cart />
        </Context.Provider>
      </CartProvider>
    </div>
  );
}

export default App;
