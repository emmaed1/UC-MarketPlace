import './ContactUs.css'

export default function AccountView() {
  return (
    <div className="container">
      <div className="header">
        <h1>Contact Us</h1>
      </div>

      <div className="inputs">
          <div className="input">
            <input type="text" placeholder="Name"></input>
          </div>
      </div>

      <div className="inputs">
        <div className="input">
          <input type="email" placeholder="Email"></input>
        </div>
      </div>

      <div className="inputs">
        <div className="input">
          <input type="text" placeholder="Description"></input>
        </div>
      </div>
</div>
  );
}
