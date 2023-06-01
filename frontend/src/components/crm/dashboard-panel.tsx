import React, { useState } from "react";
import useIsMobile from "../../hooks/is-mobile";

interface PanelProps {
  title: string;
  content: string[];
}

const Panel = (props: PanelProps) => {
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
        {content.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Panel;
