import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import arrow from "../../img/arrow.svg";
import messageIcon from "../../img/message-icon2.svg";
import contactsIcon from "../../img/contacts-icon.svg";
import logoutIcon from "../../img/logout-icon.svg";
import homeIcon from "../../img/home-icon.svg";
import workspaceIcon from "../../img/workspace-icon.svg";
import "./styles/header-styles.scss";
const cookies = new Cookies();

const Header = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const location = useLocation();

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const logout = () => {
    cookies.remove("LOGIN-TOKEN");
    cookies.remove("USER-ID");
  };

  // Check if the current path is the root path
  if (location.pathname === "/") {
    return null; // Return null to hide the component
  }

  return (
    <header>
      <div className={`header-wrapper ${isActive ? "shown" : "hidden"}`}>
        <button className='open-close-button' onClick={handleClick}>
          <img
            src={arrow}
            alt='menu control'
            width={15}
            height={25}
            className={`menu-control ${isActive ? "close" : "open"}`}
          />
        </button>
        <div className='header-navigation-wrapper'>
          <ul className='navigation-list'>
            <li>
              <NavLink to='/dashboard'>
                <div className='header-icon'>
                  <img src={homeIcon} height='18' alt='home' />
                </div>
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/dashboard/workspaces'>
                <div className='header-icon'>
                  <img src={workspaceIcon} height='18' alt='workspace' />
                </div>
                <span>My workspaces</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/dashboard/contacts'>
                <div className='header-icon'>
                  <img src={contactsIcon} height='18' alt='contacts' />
                </div>
                <span>My contacts</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/dashboard/messages'>
                <div className='header-icon'>
                  <img src={messageIcon} height='18' alt='messages' />
                </div>
                <span>Messages</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className='logout-button'>
          <NavLink to='/' onClick={logout}>
            <div className='header-icon'>
              <img src={logoutIcon} height='18' alt='logout' />
            </div>
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
