import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const Crm = () => {
  const token = cookies.get("LOGIN-TOKEN");
  return <h2>{token.slice(0, 5)}</h2>;
};

export default Crm;
