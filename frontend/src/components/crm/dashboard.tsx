import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import FirstLogin from "./first-login/first-login";
import leadLinkLogo from "../../img/LeadLink-logo-nightmode.svg";
import Panel from "./dashboard-panel";
import MessagesPanel from "./dashboard-msg-panel";
const cookies = new Cookies();

interface Data {
  email: string;
  fullname: string;
}

const Crm = () => {
  const [msg, setMsg] = useState<string>("");
  const token = cookies.get("LOGIN-TOKEN");
  const userID = cookies.get("USER-ID");
  const [data, setData] = useState<Data | null>(null);
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
      })
      .catch((error) => {
        setError("Error retrieving user data, please try again 😥");
        error = new Error();
      });
  }, [token, userID]);

  const { email, fullname } = data || {};

  console.log(userID);
  return (
    <>
      {isLoading ? (
        <div className='dashboard-container'>
          <div className='dashboard-bg-img'>
            <img src={leadLinkLogo} alt='logo' height='50' width='140' />
          </div>
          <div>Loading...</div>
        </div>
      ) : !fullname ? (
        <div className='dashboard-container'>
          <div className='dashboard-bg-img'>
            <img src={leadLinkLogo} alt='logo' height='50' width='140' />
          </div>
          <FirstLogin data={data} userID={userID} />
        </div>
      ) : (
        <div className='dashboard-container'>
          <div className='dashboard-bg-img'>
            <img src={leadLinkLogo} alt='logo' height='50' width='140' />
          </div>
          <div className='dashboard-wrapper'>
            <div className='dashboard-welcome'>
              <h2>
                Hi <span className='users-fullname'>{fullname}</span>!
              </h2>
            </div>
            <div className='dashboard-content'>
              <div className='dashboard-panels'>
                <Panel
                  title='My workspaces'
                  content={["Workspace 1", "Workspace 2"]}
                />
                <Panel
                  title='My tasks'
                  content={[
                    "Task 1",
                    "Task 2",
                    "Task 3",
                    "Task 4",
                    "Task 5",
                    "Task 6",
                    "Task 7",
                    "Task 8",
                    "Task 9",
                    "Task 10",
                    "Task 11",
                    "Task 12",
                  ]}
                />
                <MessagesPanel
                  title='Latest messages'
                  content={[
                    {
                      sender: "Demo",
                      date: new Date(0),
                      lastMessage:
                        "Hi! This is a veryyyy long demo message to check if slice method works fine",
                    },
                    {
                      sender: "Demo 2",
                      date: new Date(0),
                      lastMessage: "2nd demo message",
                    },
                    {
                      sender: "Patryk Puhacz",
                      date: new Date(0),
                      lastMessage: "Pozdrawiam 😊",
                    },
                    {
                      sender: "Demo",
                      date: new Date(0),
                      lastMessage:
                        "Hi! This is a veryyyy long demo message to check if slice method works fine",
                    },
                    {
                      sender: "Demo",
                      date: new Date(0),
                      lastMessage: "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
                    },
                    {
                      sender: "Demo",
                      date: new Date(0),
                      lastMessage:
                        "Hi! This is a veryyyy long demo message to check if slice method works fine",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Crm;
