import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
            const apiKey = process.env.REACT_APP_BREVO_API_KEY;
            const listId = 2;
            const url = `https://api.brevo.com/v3/contacts/lists/${listId}/contacts`;

            const response = await axios.get(url, {
                headers: {
                'api-key': apiKey
                }
            });

            setContacts(response.data);
            } catch (error) {
            console.error('Erreur lors de la récupération des contacts:', error);
            }
        };

        fetchContacts();
    }, []);

    return (
        <div>
            <h1>Liste des Contacts</h1>
            <p>Nombre de contacts: {contacts.count}</p>
            <ul>
                {contacts.contacts && contacts.contacts.map(contact => (
                    <li key={contact.id}>{contact.id} - {contact.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default ContactList;