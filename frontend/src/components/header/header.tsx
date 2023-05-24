import React, { useState } from "react";
import "./styles/header-styles.scss";

const Header = () => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <header>
      <div className={`header-wrapper ${!isActive ? "shown" : "hidden"}`}>
        <button className='open-close-button' onClick={handleClick}>
          {isActive ? ">" : "<"}
        </button>
        <div className='header-navigation-wrapper'>
          <ul className='navigation-list'>
            <li>
              <div className='header-icon'>H</div>
              <span>Home</span>
            </li>
            <li>
              <i>W</i>
              <span>My workspaces</span>
            </li>
            <li>
              <i>C</i>
              <span>My contacts</span>
            </li>
            <li>
              <i>M</i>
              <span>Messages</span>
            </li>
          </ul>
          <button className='logout-button'>
            <i>L</i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
