import Router from "./components/Router";
import Context from "./components/Context";
import "./App.css";

function App() {
  const userInfo = {
    name: "Test",
    email: "codrkai@gmail.com",
    loggedIn: true,
    cartItems: 4,
  };

  return (
    <div className="App">
      <Context.Provider value={userInfo}>
        <Router />
      </Context.Provider>
      <div className="content">
        
          
        {/* This is where images or welcome part is */}
        <div className="reviews">
          {/* This space is for reviews/testimonials */}
        </div>
        <div className="faq">{/* This space is for FAQ */}</div>
      </div>
    </div>
  );
}

export default App;
