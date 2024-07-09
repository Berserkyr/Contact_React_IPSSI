// ContactList.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from './Contact/SearchBar';
import Findcontact from './Contact/FindContact';



const ContactList = ({ contacts, setContacts }) => {
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const apiKey = process.env.REACT_APP_BREVO_API_KEY;
        const listId = 5;
        const url = `https://api.brevo.com/v3/contacts/lists/${listId}/contacts`;

        const response = await axios.get(url, {
          headers: {
            'api-key': apiKey
          }
        });

        setContacts(response.data.contacts); // Mettez à jour l'état des contacts dans App.js
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts:', error);
      }
    };

    fetchContacts();
  }, [setContacts]);
     

  return (
    <>
    <section>
      <Findcontact/>
      <SearchBar/>
    </section>
    <div>       
        <h1>Liste des Contacts</h1>
        <p>Nombre de contacts: {contacts ? contacts.length : 0}</p>
        <ul>
          {contacts && contacts.map(contact => (
            <li key={contact.id}>
              {contact.id} - {contact.email}
              <Link to={`/add-appointment/${contact.id}`}>Prendre un rendez-vous</Link>
            </li>
          ))}
        </ul>
      </div></>
  );
};

export default ContactList;