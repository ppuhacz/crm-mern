import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Login({ setStatus }: any) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<boolean>(false);

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
        });
        window.location.href = "/crm";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='login-container'>
      <div className='login-wrapper'>
        <h2>Login</h2>
        <small>Demo account: email: demo@demo.com, pass: demo</small>
        <form onSubmit={(e) => handleSubmit(e)}>
          {login && <h3>You have logged in successfully!</h3>}
          <div className='form-email'>
            <label htmlFor='email'>Email address</label>
            <input
              type='email'
              placeholder='Enter email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='form-password'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Enter pasword'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' onClick={(e) => handleSubmit(e)}>
            Login
          </button>
        </form>
        <small>
          Don't have an account?{" "}
          <span className='change-status' onClick={() => setStatus("Register")}>
            Click here to register!
          </span>
        </small>
      </div>
    </div>
  );
}

export default Login;
