import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';
import './ContactList.css'; // Importer le fichier CSS
import SearchBar from './Contact/SearchBar';
import Contact from './Contact/Contact';

function ContactList() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filters, setFilters] = useState({ nom: '', prenom: '', ville: '', categorie: '' });

  const categoryMap = useMemo(() => ({
    1: ' Famille ',
    2: ' Amis ',
    3: ' Travail ',
    4: ' Autre '
  }), []);

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
        console.log('Fetched Contacts:', fetchedContacts);
        setContacts(fetchedContacts);

        fetchedContacts.forEach(contact => {
          if (!contact.attributes.CATEGORIE || !contact.attributes.VILLE) {
            console.log('Aucun Contact correspond à la recherche :', contact);
          }
        });

        // Ajouter les contacts récupérés dans LocalForage
        for (const contact of fetchedContacts) {
          await LocalForageService.addContact(contact);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    const apiKey = process.env.REACT_APP_BREVO_API_KEY;
    try {
      await axios.delete(`https://api.brevo.com/v3/contacts/${id}`, {
        headers: {
          'api-key': apiKey
        }
      });
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Erreur lors de l\'action sur le contact', error);
    }
  };

  useEffect(() => {
    setFilteredContacts(
      contacts.filter(contact =>
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.attributes.PRENOM && contact.attributes.PRENOM.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.attributes.NOM && contact.attributes.NOM.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.attributes.VILLE && contact.attributes.VILLE.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.attributes.CATEGORIE && categoryMap[contact.attributes.CATEGORIE].toLowerCase().includes(searchTerm.toLowerCase()))
      )
    ); 
;}, [searchTerm, contacts, categoryMap, filters] );
  
if (loading) {
  return <div>Chargement...</div>;
}
  return (
        <div className="container">
           
            <SearchBar/>
            <input
                type="text"
                placeholder="Rechercher par nom ou email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
            />
            <div className='contact-list-top mb-2'>
                <p>Nombre de contacts: {filteredContacts ? filteredContacts.length : 0}</p>
                <Link to={`/contact-form/null/add`} className="btn btn-success">Ajouter un contact</Link>
            </div>
            <ul className="contact-list">
                {filteredContacts && filteredContacts.map(contact => (
                    <li key={contact.id} className="contact-item">
                        <div className="contact-details">
                            {contact.attributes.PRENOM} {contact.attributes.NOM} - {contact.email} - {contact.attributes.VILLE} - {contact.attributes.CATEGORIE ? categoryMap[contact.attributes.CATEGORIE] : 'Catégorie non définie'}
                        </div>
                        <Link to={`/add-appointment/${contact.id}`} className="contact-link btn btn-success">Prendre un rendez-vous</Link>
                        <Link to={`/contact-form/${contact.id}/update`} className="contact-link btn btn-outline-primary">Modifier</Link>
                        <button onClick={() => deleteContact(contact.id)} className="contact-link btn btn-danger">Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );


  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearch = () => {
    setFilteredContacts(
      contacts.filter(contact =>
        (filters.nom === '' || (contact.attributes.NOM && contact.attributes.NOM.toLowerCase().includes(filters.nom.toLowerCase()))) &&
        (filters.prenom === '' || (contact.attributes.PRENOM && contact.attributes.PRENOM.toLowerCase().includes(filters.prenom.toLowerCase()))) &&
        (filters.ville === '' || (contact.attributes.VILLE && contact.attributes.VILLE.toLowerCase().includes(filters.ville.toLowerCase()))) &&
        (filters.categorie === '' || (contact.attributes.CATEGORIE && categoryMap[contact.attributes.CATEGORIE] && categoryMap[contact.attributes.CATEGORIE].toLowerCase().includes(filters.categorie.toLowerCase())))
      )
    );
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container">
      <h1>Liste des Contacts</h1>
      <Link to={`/contact-form/null/add`} className="contact-link btn btn-primary mb-2">Ajouter un contact</Link>

      <SearchBar filters={filters} handleFilterChange={(e) => handleFilterChange(e.target.name, e.target.value)} handleSearch={handleSearch} />
      <input
        type="text"
        placeholder="Rechercher par nom, email, ville ou catégorie"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control"
      />
      <p>Nombre de contacts: {filteredContacts.length}</p>
      <ul className="contact-list">
        {filteredContacts.map(contact => (
          <li key={contact.id} className="contact-item">
            <div className="contact-details">
              {contact.attributes.PRENOM} {contact.attributes.NOM} - {contact.email} -  
              {contact.attributes.CATEGORIE ? categoryMap[contact.attributes.CATEGORIE] : 'Catégorie non définie'} -  
              {contact.attributes.VILLE ? contact.attributes.VILLE : ' Ville non définie '}
            </div>
            <Link to={`/add-appointment/${contact.id}`} className="contact-link btn btn-success">Prendre un rendez-vous</Link>
            <Link to={`/contact-form/${contact.id}/update`} className="contact-link btn btn-primary">Modifier</Link>
            <button onClick={() => deleteContact(contact.id)} className="contact-link btn btn-danger">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ContactList;
