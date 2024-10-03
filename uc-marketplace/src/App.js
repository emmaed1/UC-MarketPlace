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
      <div>
        <p>Hello</p>
      </div>
    </div>
  );
}

export default App;
