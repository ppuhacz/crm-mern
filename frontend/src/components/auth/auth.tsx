import React, { useState } from "react";
import Login from "./login/login";
import Register from "./register/register";

const Auth = () => {
  const [status, setStatus] = useState("Login");
  return (
    <div>
      {status === "Login" ? (
        <Login setStatus={setStatus} />
      ) : (
        <Register setStatus={setStatus} />
      )}
    </div>
  );
};

export default Auth;
