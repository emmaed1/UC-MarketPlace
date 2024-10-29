import Router from "./components/Router";
import Context from "./components/Context";
import "./App.css";
import CartContext from './components/ShoppingCart/Context/CartContext'

function App() {
  const userInfo = {
    name: "Test",
    email: "codrkai@gmail.com",
    loggedIn: true,
    cartItems: 4,
  };

  return (
    <div className="App">
      <CartContext.Provider>
      <Context.Provider value={userInfo}>
        <Router />
      </Context.Provider>
      </CartContext.Provider>
    </div>
  );
}

export default App;
