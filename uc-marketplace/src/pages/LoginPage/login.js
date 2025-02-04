import "./Login.css";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/padlock.png";
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

async function loginUser(credentials) {
  return fetch("http://localhost:3001/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const femail = useRef("");
  const fpassword = useRef("");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/user/login", options);
      if (!response.ok) {
        if (response.status === 500) {
          console.error("Internal Server Error (500)");
        } else {
          throw new Error("Network response was not ok");
        }
      }

      const data = await response.json();
      console.log(data);

      setEmail("");
      setPassword("");
      const token = await loginUser({
        email: email,
        password: password,
      });
      setToken(token);
      window.location.reload();
    } catch (error) {
      console.error("Error during login:", error);
    }
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
        <div className="submit-btn">
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
