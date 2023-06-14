import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const ContactRequestForm = () => {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<String>("");

  const token = cookies.get("LOGIN-TOKEN");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError(""); // Clear any previous errors
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
        setError(error.response.data.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>{error && error}</div> <br />
      <label htmlFor='username'>Username:</label>
      <input
        type='text'
        id='username'
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button type='submit'>Invite</button>
      {msg && <h1>{msg}</h1>}
    </form>
  );
};

export default ContactRequestForm;
