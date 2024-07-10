import React, { useState } from 'react';
import LocalForageService from '../services/LocalForageService';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Importer le fichier CSS

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = await LocalForageService.findUser(username, password);

    if (user) {
      await LocalForageService.setCurrentUser(user);
      onLogin(user);
      navigate('/appointments');
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <h2 className="card-title">Connexion</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn-primary">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
