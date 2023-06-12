import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const ContactRequestForm = () => {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");

  const token = cookies.get("LOGIN-TOKEN");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const config = {
      method: "POST",
      url: "http://localhost:3000/contact-request",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        username: username,
      },
    };
    axios(config)
      .then((result) => {
        setMsg(result.data.message);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='username'>User ID:</label>
      <input
        type='text'
        id='username'
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button type='submit'>Send Contact Request</button>
      {msg && <h1>{msg}</h1>}
    </form>
  );
};

export default ContactRequestForm;
