import React from "react";
import Layout from "../../components/layout/layout";
import ContactRequestForm from "../../components/crm/contact/contact-request-form";
import ContactRequests from "../../components/crm/contact/contacts";

const ContactsPage = () => {
  return (
    <Layout>
      <div className='contact'>
        <ContactRequestForm />
        <ContactRequests />
      </div>
    </Layout>
  );
};

export default ContactsPage;
