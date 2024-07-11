import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';
import './ContactList.css'; // Importer le fichier CSS
import SearchBar from './Contact/SearchBar';
import Findcontact from './Contact/FindContact';
//import Contact from './Contact/Contact';

function ContactList () {
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const apiKey = process.env.REACT_APP_BREVO_API_KEY;
                const listId = process.env.REACT_APP_BREVO_LIST_ID;
                const url = `https://api.brevo.com/v3/contacts/lists/${listId}/contacts`;

                const response = await axios.get(url, {
                    headers: {
                        'api-key': apiKey
                    }
                });

        const fetchedContacts = response.data.contacts;
        setContacts(fetchedContacts);

        // Ajouter les contacts récupérés dans LocalForage
        for (const contact of fetchedContacts) {
          await LocalForageService.addContact(contact);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts :', error); }
        finally {
        setLoading(false);
      }
    };

        fetchContacts();
    }, [setContacts]);

    const deleteContact = async (id) => {
        const apiKey = process.env.REACT_APP_BREVO_API_KEY;
        try {
            await axios.delete(`https://api.brevo.com/v3/contacts/${id}`, {
                headers: {
                    'api-key': apiKey
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de l\'action sur le contact', error);
        }
    };

    useEffect(() => {
        setFilteredContacts(
            contacts.filter(contact =>
                contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (contact.attributes.PRENOM && contact.attributes.PRENOM.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (contact.attributes.NOM && contact.attributes.NOM.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    }, [searchTerm, contacts]);

  
if (loading) {
  return <div>Chargement...</div>;
}
  return (
        <div className="container">
            <h1>Liste des Contacts</h1>
            <Link to={`/contact-form/null/add`} className="contact-link btn btn-primary mb-2">Ajouter un contact</Link>
            <Findcontact/>
            <SearchBar/>
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
                        <Link to={`/contact-form/${contact.id}/update`} className="contact-link btn btn-primary">Modifier</Link>
                        <button onClick={() => deleteContact(contact.id)} className="contact-link btn btn-danger">Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactList;
