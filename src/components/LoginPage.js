import React, { useState } from 'react';
import LocalForageService from '../services/LocalForageService';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

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
      navigate('/contacts');
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
            <label >Nom d'utilisateur:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              value={password}
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
