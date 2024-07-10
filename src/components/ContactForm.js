import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ContactAction = () => {
    const { contactId, contactAction } = useParams();
    const navigate = useNavigate();
    const [contactData, setContactData] = useState({ firstname: '', lastname: '', email: '' });

    useEffect(() => {
        const fetchContactData = async () => {
            const apiKey = {
                headers: {
                    'api-key': process.env.REACT_APP_BREVO_API_KEY
                }
            };
            if (contactAction === 'update' && contactId) {
                try {
                    const response = await axios.get(`https://api.brevo.com/v3/contacts/${contactId}`, apiKey);
                    setContactData({ firstname: response.data.attributes.FIRSTNAME, lastname: response.data.attributes.LASTNAME, email: response.data.email });
                } catch (error) {
                    console.error('Erreur lors de la récupération des données du contact:', error);
                }
            }
        };
    
        fetchContactData();
    }, [contactId, contactAction]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiKey = {
            headers: {
                'api-key': process.env.REACT_APP_BREVO_API_KEY
            }
        };
        const listId = process.env.REACT_APP_BREVO_LIST_ID;
        if (contactAction === 'add') {
            try {
                await axios.post('https://api.brevo.com/v3/contacts', {
                    email: contactData.email,
                    attributes: {
                        FIRSTNAME: contactData.firstname,
                        LASTNAME: contactData.lastname
                    }
                }, apiKey);
                await axios.post(`https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`,
                    { emails: [contactData.email] }, apiKey);
                navigate('/contacts');
            } catch (error) {
                console.error('Erreur lors de l\'ajout du contact:', error);
            }
        } else if (contactAction === 'update') {
            try {
                await axios.put(`https://api.brevo.com/v3/contacts/${contactId}`, {
                    email: contactData.email,
                    attributes: {
                        FIRSTNAME: contactData.firstname,
                        LASTNAME: contactData.lastname
                    }
                }, apiKey);
                const response = await axios.get(`https://api.brevo.com/v3/contacts/${contactId}`, apiKey);
                console.log(response.data);
                navigate('/contacts');
            } catch (error) {
                console.error('Erreur lors de la mise à jour du contact:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <div className="form-group">
                <label htmlFor="firstname">Prenom :</label>
                <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={contactData.firstname}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="lastname">Nom :</label>
                <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={contactData.lastname}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email :</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                />
            </div>
            <button type="submit" className="btn btn-primary">
                {contactAction === 'add' ? 'Ajouter' : 'Mettre à jour'} le contact
            </button>
        </form>
    );
};

export default ContactAction;