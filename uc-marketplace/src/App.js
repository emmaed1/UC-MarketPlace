import Router from "./components/Router";
import Context from "./components/Context";
import "./App.css";
import { CartProvider } from './components/ShoppingCart/Context/cartContext'
import Cart from './components/ShoppingCart/ShoppingCart'

function App() {
  const userInfo = {
    name: "Test",
    email: "codrkai@gmail.com",
    loggedIn: true,
    cartItems: 4,
  };

  return (
    <div className="App">
      <CartProvider>
      <Context.Provider value={userInfo}>
        <Router />
        <Cart/>
      </Context.Provider>
      </CartProvider>
    </div>
  );
}

export default App;
