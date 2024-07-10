import React, { useState } from 'react';
import LocalForageService from '../services/LocalForageService';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css'; // Importer le fichier CSS

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const users = await LocalForageService.getUsers();
    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
      setError('Nom d\'utilisateur déjà pris.');
    } else {
      await LocalForageService.addUser({ username, password });
      navigate('/login');
    }
  };

  return (
    <div className="signup-container">
      <div className="card">
        <h2 className="card-title">Inscription</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
