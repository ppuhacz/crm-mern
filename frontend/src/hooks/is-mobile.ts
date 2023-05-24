import { useState, useEffect } from "react";

function useIsMobile(props:number) {
  const [isMobile, setIsMobile] = useState<boolean>(true);

  const width = props

  useEffect(() => {
    const handleResize = () => {
      // check if screen is lower than the width given in props, therefore if it's a movile or desktop device
      const windowWidth = window.innerWidth < width;
      setIsMobile(windowWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return isMobile;
}

export default useIsMobile;