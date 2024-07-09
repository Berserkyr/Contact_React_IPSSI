import React, { useState } from 'react';

function AddContactForm({ addContact }) {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addContact({
            email,
            attributes: {
                FIRSTNAME: firstName,
                LASTNAME: lastName
            }
        });
        setEmail('');
        setFirstName('');
        setLastName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Ajouter un Contact</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <button type="submit">Ajouter</button>
        </form>
    );
}

export default AddContactForm;
