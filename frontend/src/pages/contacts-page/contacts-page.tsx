import React from "react";
import Layout from "../../components/layout/layout";
import ContactRequestForm from "../../components/crm/contact/contact-request-form";
import ContactRequests from "../../components/crm/contact/contacts-list";
import Contacts from "../../components/crm/contact/contacts";

const ContactsPage = () => {
  return (
    <Layout>
      <div className='contact'>
        <Contacts />
      </div>
    </Layout>
  );
};

export default ContactsPage;
