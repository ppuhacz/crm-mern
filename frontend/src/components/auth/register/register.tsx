import React, { useState } from "react";
import axios from "axios";

function Register({ setStatus }: any) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [register, setRegister] = useState<boolean>(false);

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

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

  return (
    <div className='register-container'>
      <div className='register-wrapper'>
        <h2>Register</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='form-email'>
            {register && <h3>You have registered successfully!</h3>}
            <br></br>
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
            Register
          </button>
        </form>
        <small>
          Already have an account?
          <span className='change-status' onClick={() => setStatus("Login")}>
            {" "}
            Click here to login!
          </span>
        </small>
      </div>
    </div>
  );
}

export default Register;
