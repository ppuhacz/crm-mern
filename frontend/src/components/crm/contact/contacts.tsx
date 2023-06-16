import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import ContactRequests from "./contact-requests";
import ContactsList from "./contacts-list";
import ContactRequestForm from "./contact-request-form";
import leadLinkLogo from "../../../img/LeadLink-logo-nightmode.svg";
import invitationIcon from "../../../img/invitation-icon.svg";

interface ContactInvites {
  _id: string;
  username: string;
}

interface Contact {
  username: string;
  addedTimestamp: Date;
  status: string;
  _id: string;
  isDeleted: boolean;
}

const cookies = new Cookies();

const Contacts = () => {
  const [invites, setInvites] = useState<ContactInvites[]>([]);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [showInvitation, setShowInvitation] = useState<boolean>(false);

  const userID: string = cookies.get("USER-ID");

  useEffect(() => {
    const invitesPromise = axios.get<ContactInvites[]>(
      `http://localhost:3000/contact-requests/${userID}`
    );
    const contactListPromise = axios.get<Contact[]>(
      `http://localhost:3000/contact/${userID}`
    );

    Promise.all([invitesPromise, contactListPromise])
      .then(([requestsResponse, contactListResponse]) => {
        setInvites(requestsResponse.data);
        setContactList(contactListResponse.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userID]);

  const handleShowInvitationClick = () => {
    setShowInvitation(!showInvitation);
  };

  let invitesCount: string | number = 0;

  if (invites.length > 0) {
    invitesCount = invites.length.toString();
  } else if (invites.length > 9) {
    invitesCount = "9+";
  }

  return (
    <div className='contacts-container'>
      <div className='contacts-bg-img'>
        <img src={leadLinkLogo} alt='logo' height='50' width='140' />
      </div>
      <ContactsList
        requests={invites}
        setRequests={setInvites}
        contactList={contactList}
        setContactList={setContactList}
        userID={userID}
      />
      <br />
      <div className='invitations'>
        <div className='invitation-icon'>
          <img
            src={invitationIcon}
            width={30}
            height={30}
            alt='invitation'
            onClick={handleShowInvitationClick}
          />
          {invites.length > 0 && (
            <p className='invites-count'>{invitesCount}</p>
          )}
        </div>

        {showInvitation && (
          <div className='invitations-wrapper'>
            <ContactRequestForm />
            <ContactRequests
              requests={invites}
              setRequests={setInvites}
              contactList={contactList}
              setContactList={setContactList}
              userID={userID}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
