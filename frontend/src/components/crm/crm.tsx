import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const Crm = () => {
  const [msg, setMsg] = useState<string>("");
  const token = cookies.get("LOGIN-TOKEN");
  const userID = cookies.get("USER-ID");
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<any>([]);

  useEffect(() => {
    const tokenConfig = {
      method: "GET",
      url: "http://localhost:3000/auth-endpoint",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const dataConfig = {
      method: "GET",
      url: `http://localhost:3000/data/${userID}`,
    };

    axios(tokenConfig)
      .then((result) => {
        setMsg(result.data.message);
        console.log(result);
      })
      .catch((error) => {
        error = new Error();
      });

    axios(dataConfig)
      .then((result) => {
        setData(result.data);
        console.log(result);
      })
      .catch((error) => {
        setError("Error retrieving user data!");
        error = new Error();
      });
  }, [token, userID]);

  return (
    <h2>
      {userID}, {data.email} {error && error}
    </h2>
  );
};

export default Crm;
