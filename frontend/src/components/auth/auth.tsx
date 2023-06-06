import React, { useState } from "react";
import Login from "./login/login";
import Register from "./register/register";
import useIsMobile from "../../hooks/is-mobile";
import desktopLoginBg from "../../img/login-background-desktop-v2.webp";
import logoNightMode from "../../img/LeadLink-logo-nightmode.svg";

const Auth = () => {
  const [status, setStatus] = useState("Login");
  const isMobile: boolean = useIsMobile(768);

  return (
    <div className='login-page'>
      {!isMobile ? (
        <div className='desktop-login-bg'>
          <img
            src={desktopLoginBg}
            alt='login page background'
            className='desktop-background'
          />
          <img
            src={logoNightMode}
            alt='LeadLink logo'
            className='background-logo'
          />
          <div className='welcome-text'>
            <h2>WELCOME</h2>
            <h3>Sing in to continue</h3>
          </div>
        </div>
      ) : (
        <div className='mobile-login-bg'>
          <img
            src={logoNightMode}
            alt='LeadLink logo'
            className='background-logo'
          />
        </div>
      )}
      {status === "Login" ? (
        <Login setStatus={setStatus} />
      ) : (
        <Register setStatus={setStatus} />
      )}
    </div>
  );
};

export default Auth;
