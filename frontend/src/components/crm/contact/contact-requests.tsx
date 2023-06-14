import React from "react";
import axios from "axios";

interface ContactRequest {
  _id: string;
  username: string;
}

interface Contact {
  username: string;
  addedTimestamp: Date;
  status: string;
  _id: string;
  isDeleted: boolean; // Add this property to each contact
}

interface Props {
  setRequests: React.Dispatch<React.SetStateAction<ContactRequest[]>>;
  setContactList: React.Dispatch<React.SetStateAction<Contact[]>>;
  userID: string;
  contactList: Contact[];
  requests: ContactRequest[];
}

export default function ContactRequests({
  requests,
  setRequests,
  contactList,
  setContactList,
  userID,
}: Props) {
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

        const newContact = response.data.contact;
        setContactList((prevContactList) => [...prevContactList, newContact]);
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
    <div className='contact-requests-container'>
      <h2>Contact invitations</h2>
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
        <p>No pending contact requests.</p>
      )}
    </div>
  );
}
