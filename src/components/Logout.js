import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      navigate('/login');
    };
    logout();
  }, [navigate]);

}

export default Logout;
