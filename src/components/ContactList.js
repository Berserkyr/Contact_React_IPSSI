// ContactList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from './Contact/SearchBar';
import Findcontact from './Contact/FindContact';
import Contact from './Contact/Contact';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contacts'); // Assurez-vous que l'URL correspond à votre backend
        setContacts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts :', error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <section>
        <Findcontact />
        <SearchBar />
      </section>
      <div>
        <h1>Liste des Contacts</h1>
        <p>Nombre de contacts: {contacts ? contacts.length : 0}</p>
        <Contact/>
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
}

export default ContactList;