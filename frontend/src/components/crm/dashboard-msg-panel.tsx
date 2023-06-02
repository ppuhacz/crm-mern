import React, { useState } from "react";
import useIsMobile from "../../hooks/is-mobile";

interface ContentTypes {
  sender: string;
  date: Date;
  lastMessage: string;
}

interface PanelProps {
  title: string;
  content: ContentTypes[];
}

const MessagesPanel = (props: PanelProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const isMobile = useIsMobile(768);

  const { title, content } = props;

  const handlePanelClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`dashboard-panel ${isMobile ? `mobile ` : "desktop"}`}>
      <div className={`panel-title`} onClick={() => handlePanelClick()}>
        <h3>{title}</h3>
      </div>

      <ul
        className={`panel-content ${
          isActive ? "panel-active" : "panel-hidden"
        }`}
      >
        {content.map((item, index) => {
          const { sender, date, lastMessage } = item;
          return (
            <li key={index} className='msg-panel'>
              <div className='msg-panel-top-section'>
                <div className='msg-panel-sender'>{sender}</div>
                <div className='msg-panel-date'>
                  {date.toLocaleDateString()}
                </div>
              </div>
              <div className='msg-panel-message'>
                {lastMessage.length > 20
                  ? lastMessage.slice(0, 20) + "..."
                  : lastMessage}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MessagesPanel;
