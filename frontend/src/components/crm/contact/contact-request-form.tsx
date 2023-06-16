import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import exclamationMarkIcon from "../../../img/exclamation-mark-rounded.svg";
import addContact from "../../../img/add-contact.svg";

const cookies = new Cookies();

const ContactRequestForm = () => {
  const [username, setUsername] = useState("");
  const [succesMessage, setSuccesMessage] = useState("");
  const [error, setError] = useState<String>("");

  const token = cookies.get("LOGIN-TOKEN");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError(""); // Clear any previous errors
    setSuccesMessage(""); // Clear any previous success messages
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
        setSuccesMessage(result.data.message);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className='contact-invite-form'>
      {error && (
        <p className='error-message'>
          <img
            src={exclamationMarkIcon}
            width={15}
            height={15}
            alt='exclamation mark'
          />
          {error}
        </p>
      )}
      {succesMessage && <p className='success-message'>{succesMessage}</p>}
      <span>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder='Invite a user'
          required
        />
        <button type='submit'>
          <img src={addContact} height={15} width={15} alt='add contact' />
        </button>
      </span>
    </form>
  );
};

export default ContactRequestForm;
