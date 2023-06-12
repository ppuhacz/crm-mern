import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
interface ContactRequest {
  _id: string;
  username: string;
}

function ContactRequests(): JSX.Element {
  const [requests, setRequests] = useState<ContactRequest[]>([]);

  const userID = cookies.get("USER-ID");

  useEffect(() => {
    axios
      .get<ContactRequest[]>(`http://localhost:3000/contact-requests/${userID}`)
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userID]);

  const handleAcceptRequest = (requestId: string): void => {
    axios
      .put(`http://localhost:3000/contact/${requestId}`, {
        userId: userID,
        action: "accept",
      })
      .then((response) => {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeclineRequest = (requestId: string): void => {
    axios
      .put(`http://localhost:3000/contact/${requestId}`, {
        userId: userID,
        action: "decline",
      })
      .then((response) => {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <h1>Contact requests</h1>
      {requests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.username}</td>
                <td>
                  <button onClick={() => handleAcceptRequest(request._id)}>
                    Accept
                  </button>
                  <button onClick={() => handleDeclineRequest(request._id)}>
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No contact requests.</p>
      )}
    </div>
  );
}

export default ContactRequests;
