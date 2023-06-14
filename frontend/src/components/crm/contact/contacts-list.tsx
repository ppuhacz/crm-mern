import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import ContactRequests from "./contact-requests";
import deleteIcon from "../../../img/delete-profile-icon.svg";

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
  isDeleted: boolean; // Add this property to each contact
}

interface Props {
  setRequests: React.Dispatch<React.SetStateAction<ContactRequest[]>>;
  setContactList: React.Dispatch<React.SetStateAction<Contact[]>>;
  userID: string;
  contactList: Contact[];
  requests: ContactRequest[];
}

function ContactsList({
  requests,
  setRequests,
  contactList,
  setContactList,
  userID,
}: Props): JSX.Element {
  const [confirmationMessages, setConfirmationMessages] = useState<any>({});

  const handleDeleteContact = (contact: Contact) => {
    const { _id } = contact;
    const FIVE_SECONDS = 2000;
    axios
      .delete(`http://localhost:3000/contact/${_id}`, {
        data: { userId: userID },
      })
      .then((response) => {
        console.log(response.data.message);

        // Updating the status of the contact in the contact list
        const updatedContactList = contactList.map((contact) =>
          contact._id === _id ? { ...contact, status: "deleted" } : contact
        );
        setContactList(updatedContactList);

        setTimeout(() => {
          // Removing the deleted contact from the contact list
          setContactList((prevContactList) =>
            prevContactList.filter((contact) => contact._id !== _id)
          );
        }, FIVE_SECONDS);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDelete = (contact: Contact) => {
    return (
      <div className='confirm-delete'>
        <h3>Are you sure?</h3>
        <span className='delete-buttons'>
          <button
            onClick={() => {
              handleDeleteContact(contact);
            }}
            className='confirm-button'
          >
            Yes
          </button>
          <button
            onClick={() =>
              setConfirmationMessages({
                ...confirmationMessages,
                [contact._id]: false,
              })
            }
            className='decline-button'
          >
            No
          </button>
        </span>
      </div>
    );
  };

  return (
    <div className='contact-list-wrapper'>
      <h2>My Contacts</h2>
      <div>
        {contactList.length > 0 ? (
          <ul>
            {contactList
              .filter(
                (contact: Contact) =>
                  contact.status === "accepted" || contact.status === "deleted"
              )
              .sort((a: Contact, b: Contact) =>
                a.username.localeCompare(b.username)
              )
              .map((contact: Contact, index) => {
                const confirmationMessage =
                  confirmationMessages[contact._id] || false;

                return (
                  <li key={index}>
                    <span>
                      <p>{contact.username}</p>
                      {contact.status === "accepted" && (
                        <>
                          <button
                            onClick={() =>
                              setConfirmationMessages({
                                ...confirmationMessages,
                                [contact._id]: true,
                              })
                            }
                            className='delete-contact-button'
                          >
                            <img
                              src={deleteIcon}
                              width={15}
                              height={15}
                              alt='delete contact'
                            />
                          </button>
                          {confirmationMessage && confirmDelete(contact)}
                        </>
                      )}
                      {contact.status === "deleted" && (
                        <div className='contact-deleted'>
                          <p>Contact deleted</p>
                        </div>
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ContactsList;
