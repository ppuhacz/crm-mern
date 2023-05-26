import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import FirstLogin from "./first-login/first-login";
const cookies = new Cookies();
const Crm = () => {
  const [msg, setMsg] = useState<string>("");
  const token = cookies.get("LOGIN-TOKEN");
  const userID = cookies.get("USER-ID");
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
      })
      .catch((error) => {
        error = new Error();
      });

    axios(dataConfig)
      .then((result) => {
        setData(result.data);
        setIsLoading(false);
        console.log(result.data);
      })
      .catch((error) => {
        setError("Error retrieving user data");
        error = new Error();
      });
  }, [token, userID]);

  const { email, fullname } = data;

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : fullname === "" ? (
        <FirstLogin data={data} userID={userID} />
      ) : (
        <div className='dashboard-container'>
          <h2>Hi {fullname}!</h2>
        </div>
      )}
    </>
  );
};

export default Crm;
