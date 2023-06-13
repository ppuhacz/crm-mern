import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

interface ContactRequest {
  _id: string;
  username: string;
}

interface Contact {
  username: string;
  addedTimestamp: Date;
  status: string;
  _id: string;
}

function ContactRequests(): JSX.Element {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [contactList, setContactList] = useState<Contact[]>([]);

  const userID = cookies.get("USER-ID");

  useEffect(() => {
    const requestsPromise = axios.get<ContactRequest[]>(
      `http://localhost:3000/contact-requests/${userID}`
    );
    const contactListPromise = axios.get(
      `http://localhost:3000/contact/${userID}`
    );

    Promise.all([requestsPromise, contactListPromise])
      .then(([requestsResponse, contactListResponse]) => {
        setRequests(requestsResponse.data);
        setContactList(contactListResponse.data);
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

  const handleDeleteContact = (contact: Contact) => {
    const { _id } = contact;
    const FIVE_SECONDS = 5000;
    axios
      .delete(`http://localhost:3000/contact/${_id}`, {
        data: { userId: userID },
      })
      .then((response) => {
        console.log(response.data.message);

        // Changing the status of contact to deleted
        const updatedContactList = contactList.map((contact) =>
          contact._id === _id ? { ...contact, status: "deleted" } : contact
        );
        setContactList(updatedContactList);

        setTimeout(() => {
          setContactList((prevContactList) =>
            prevContactList.filter((contact) => contact._id !== _id)
          );
        }, FIVE_SECONDS);
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
        <p>No pending contact requests.</p>
      )}
      <h1>My Contacts</h1>
      <div>
        {contactList.length > 0
          ? contactList.map((contact: Contact) => {
              if (contact) {
                const { status, username, addedTimestamp } = contact;

                if (status === "accepted" || status === "deleted") {
                  const day = addedTimestamp.toString().slice(8, 10);
                  const month = addedTimestamp.toString().slice(5, 7);
                  const year = addedTimestamp.toString().slice(0, 4);
                  const date = `${day}/${month}/${year}`;

                  return (
                    <span>
                      {status !== "deleted" ? (
                        <span>
                          {username}, added on:
                          {date}
                          <button onClick={() => handleDeleteContact(contact)}>
                            Delete
                          </button>
                        </span>
                      ) : (
                        <h1>Contact deleted</h1>
                      )}
                    </span>
                  );
                }
              }
              return "";
            })
          : ""}
      </div>
    </div>
  );
}

export default ContactRequests;
