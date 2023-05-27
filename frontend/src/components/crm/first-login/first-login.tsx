import React, { FormEvent, useState } from "react";
import axios from "axios";
import exclamationMarkIcon from "../../../img/exclamation-mark-rounded.svg";
import "../styles/first-login-styles.scss";

const FirstLogin = ({ data, userID }: any) => {
  const [fullname, setFullname] = useState<string>("");
  const [fullnameError, setFullnameError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (
    e: FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // Clear any previous errors
    setFullnameError("");
    setUsernameError("");

    if (fullname.length < 1 || fullname.length > 50) {
      setFullnameError("Incorrect full name");
      return;
    }

    if (username.length < 3 || username.length > 16) {
      setUsernameError("Username must be between 3 and 16 characters long");
      return;
    }

    const config = {
      method: "POST",
      url: `http://localhost:3000/postname/${userID}`,
      data: {
        fullname: fullname,
        username: username,
      },
    };

    axios(config)
      .then((result) => {
        console.log(result);
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        console.log(error);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className='set-account-info-container'>
      <div className='set-account-info-wrapper'>
        <div className='set-account-welcome-text'>
          <h2>Welcome to LeadLink!</h2>
          <p>
            Before moving forward, please provide us with more information about
            you 🙂
          </p>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          {usernameError && (
            <p className='error-message'>
              <img
                src={exclamationMarkIcon}
                width={15}
                height={15}
                alt='exclamation mark'
              />
              {usernameError}
            </p>
          )}
          <label htmlFor='fullName'>
            Full name <span className='required'>*</span>
          </label>
          <input
            type='text'
            name='fullName'
            placeholder='Enter full name'
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          {usernameError && (
            <p className='error-message'>
              <img
                src={exclamationMarkIcon}
                width={15}
                height={15}
                alt='exclamation mark'
              />
              {usernameError}
            </p>
          )}
          <label htmlFor='fullname'>
            Username <span className='required'>*</span>
          </label>
          <input
            type='text'
            name='username'
            placeholder='Enter full name'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type='submit' onSubmit={(e) => handleSubmit(e)}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstLogin;
