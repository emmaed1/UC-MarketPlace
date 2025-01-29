import "./signup.css";
import user_icon from "../../assets/user.png";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/padlock.png";
import React, { useState, useRef } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
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

  const validateEmail = (v) => {
    const email = /^[a-zA-Z0-9]{8,}\@(mail\.uc\.edu|uc\.edu)$/;
    setIsValid(email.test(v));
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="inputs">
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
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              required
            ></input>
            {!isValid && <p>Enter a UC email</p>}
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
        <div className="submit-btn">
          <button disabled={!isValid}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
