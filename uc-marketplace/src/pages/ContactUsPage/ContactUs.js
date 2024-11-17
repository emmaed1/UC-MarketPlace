import "./ContactUs.css";
import React from "react";
import Swal from "sweetalert2";

export default function ContactUs() {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "9f643b93-2834-42c8-8ffd-db7d2d433b02");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
      Swal.fire({
        title: "Success!",
        text: "Your message was sent successfully!",
        icon: "success",
      });
    }
  };

  return (
    <section className="contact">
      <form className="contact-form" onSubmit={onSubmit}>
        <h1>Contact Us</h1>
        <div className="input-box">
          <label>Name</label>
          <input
            required
            type="text"
            className="field"
            placeholder="Enter your Name"
            name="name"
          ></input>
        </div>

        <div className="input-box">
          <label>Email</label>
          <input
            required
            type="email"
            className="field"
            placeholder="Email Address"
            name="email"
          ></input>
        </div>

        <div className="input-box">
          <label>Message</label>
          <textarea
            required
            type="text"
            className="field mess"
            placeholder="Enter your message"
            name="message"
          ></textarea>
        </div>

        <button type="submit">Submit</button>
      </form>
    </section>
  );
}
