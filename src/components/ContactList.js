import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';
import './ContactList.css'; // Importer le fichier CSS

const ContactList = ({ contacts, setContacts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const apiKey = process.env.REACT_APP_BREVO_API_KEY;
        const listId = 3;
        const url = `https://api.brevo.com/v3/contacts/lists/${listId}/contacts`;

        const response = await axios.get(url, {
          headers: {
            'api-key': apiKey
          }
        });

        const fetchedContacts = response.data.contacts;
        setContacts(fetchedContacts); // Mettez à jour l'état des contacts dans App.js

        // Ajouter les contacts récupérés dans LocalForage
        for (const contact of fetchedContacts) {
          await LocalForageService.addContact(contact);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts:', error);
      }
    };

    fetchContacts();
  }, [setContacts]);

  useEffect(() => {
    setFilteredContacts(
      contacts.filter(contact =>
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.attributes.PRENOM && contact.attributes.PRENOM.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.attributes.NOM && contact.attributes.NOM.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, contacts]);

  return (
    <div className="container">
      <h1>Liste des Contacts</h1>
      <input
        type="text"
        placeholder="Rechercher par nom ou email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control"
      />
      <p>Nombre de contacts: {filteredContacts ? filteredContacts.length : 0}</p>
      <ul className="contact-list">
        {filteredContacts && filteredContacts.map(contact => (
          <li key={contact.id} className="contact-item">
            <div className="contact-details">
              {contact.attributes.PRENOM} {contact.attributes.NOM} - {contact.email}
            </div>
            <Link to={`/add-appointment/${contact.id}`} className="contact-link btn btn-success">Prendre un rendez-vous</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
