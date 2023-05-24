import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "../styles/auth-styles.scss";
import exclamationMarkIcon from "../../../img/exclamation-mark-rounded.svg";

const cookies = new Cookies();

function Login({ setStatus }: any) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const config = {
      method: "post",
      url: "http://localhost:3000/login",
      data: {
        email,
        password,
      },
    };

    axios(config)
      .then((result) => {
        setLogin(true);
        cookies.set("LOGIN-TOKEN", result.data?.token, {
          path: "/",
          maxAge: 2592000, // 30 days
        });
        window.location.href = "/crm";
      })
      .catch((error) => {
        console.log(error);
        setError("User has not been found");
      });
  };

  return (
    <div className='login-container'>
      <div className='login-wrapper'>
        <h2>Login</h2>
        <small className='demo'>
          <p>email: demo@demo.com</p>
          <p>password: demo</p>
        </small>
        <form onSubmit={(e) => handleSubmit(e)}>
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
          <div className='form-email'>
            <label htmlFor='email'>Email address</label>
            <input
              type='email'
              name='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='form-password'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Enter pasword'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' onClick={(e) => handleSubmit(e)}>
            Login
          </button>
        </form>
        <small className='account-question'>
          Don't have an account? <br />
          <div className='change-status' onClick={() => setStatus("Register")}>
            Click here to register!
          </div>
        </small>
      </div>
    </div>
  );
}

export default Login;
