import React from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const Crm = () => {
  console.log(cookies.get("LOGIN-TOKEN"));
  return <h2>test</h2>;
};

export default Crm;
