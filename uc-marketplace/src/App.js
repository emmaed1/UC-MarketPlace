import Router from './components/Router';
import Context from './components/Context'
import './App.css';

function App() {
  const userInfo = {
    name: "Test",
    email: "codrkai@gmail.com",
    loggedIn: true,
    cartItems: 4
  }
  
  return (
    <div className="App">
      <Context.Provider value={userInfo}>
        <Router />
      </Context.Provider>
      <div className="content">
        <p>Hello World</p>
        {/* This is where images or welcome part is */}
      </div>
      <div>
        {/* This is where categories will go */}
      </div>
    </div>
  );
}

export default App;
