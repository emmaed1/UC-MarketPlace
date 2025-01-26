import "./Login.css";
import user_icon from "../../assets/user.png";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/padlock.png";
import Swal from "sweetalert2";
import React, { useState, useRef } from "react";

const Login = () => {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fname = useRef("");
  const femail = useRef("");
  const fpassword = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, email, password };
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
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="submit-container">
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => {
              setAction("Sign Up");
            }}
          >
            Sign Up
          </div>
          <div
            className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={() => {
              setAction("Login");
            }}
          >
            Login
          </div>
        </div>

        <div className="inputs">
          {action === "Login" ? (
            <div></div>
          ) : (
            <div className="input">
              <img src={user_icon} alt=""></img>
              <input
                type="text"
                name="name"
                ref={fname}
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                required
              ></input>
            </div>
          )}
        </div>

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

        {action === "Sign Up" ? (
          <div></div>
        ) : (
          <div className="forgot-password">
            Lost Password? <span>Click Here!</span>
          </div>
        )}
        <button className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default Login;
