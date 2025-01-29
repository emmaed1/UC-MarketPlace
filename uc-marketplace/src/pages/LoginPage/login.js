import "./Login.css";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/padlock.png";
import React, { useState, useRef } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fname = useRef("");
  const femail = useRef("");
  const fpassword = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { email, password };
    console.log(data);
    try {
      fetch("http://localhost:3001/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    } catch (error) {
      console.log("Error: ", error);
    }
    fname.current.value = "";
    femail.current.value = "";
    fpassword.current.value = "";
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt=""></img>
            <input
              type="email"
              name="email"
              ref={femail}
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
          </div>
        </div>

        <div className="inputs">
          <div className="input">
            <img src={password_icon} alt=""></img>
            <input
              type="password"
              name="password"
              ref={fpassword}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
          </div>
        </div>

        <div className="forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>
        <div className="sign-up">
          Need an account? <a href="/signup">Sign Up!</a>
        </div>
        <button className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default Login;
