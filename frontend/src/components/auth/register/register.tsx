import React, { useState } from "react";
import axios from "axios";
import exclamationMarkIcon from "../../../img/exclamation-mark-rounded.svg";
import "../styles/auth-styles.scss";

function Register({ setStatus }: any) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [register, setRegister] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // Clear any previous errors
    setEmailError("");
    setPasswordError("");

    // Validate email and password
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (password.length < 4) {
      setPasswordError("Password must be at least 4 character long");
      return;
    }

    const config = {
      method: "post",
      url: "http://localhost:3000/register",
      data: {
        email,
        password,
      },
    };

    axios(config)
      .then(() => {
        setRegister(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className='register-container'>
      <div className='register-wrapper'>
        <h2>Register</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='form-email'>
            {register && (
              <h3 className='register-succes'>
                You have registered successfully!
              </h3>
            )}
            <br></br>
            <label htmlFor='email'>Email address</label>
            <input
              type='email'
              placeholder='Enter email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && (
              <p className='error-message'>
                <img
                  src={exclamationMarkIcon}
                  width={15}
                  height={15}
                  alt='exclamation mark'
                />
                {emailError}
              </p>
            )}
          </div>
          <div className='form-password'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Enter password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && (
              <p className='error-message'>
                <img
                  src={exclamationMarkIcon}
                  width={15}
                  height={15}
                  alt='exclamation mark'
                />
                {passwordError}
              </p>
            )}
          </div>
          <button type='submit' onClick={(e) => handleSubmit(e)}>
            Register
          </button>
        </form>
        <small className='account-question'>
          Already have an account? <br />
          <div className='change-status' onClick={() => setStatus("Login")}>
            Click here to sign in!
          </div>
        </small>
      </div>
    </div>
  );
}

export default Register;
