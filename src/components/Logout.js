import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      navigate('/login');
    };
    logout();
  }, [navigate]);

  return <div>Déconnexion en cours...</div>;
}

export default Logout;
