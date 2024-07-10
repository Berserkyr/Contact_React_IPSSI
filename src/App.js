import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import ContactList from './components/ContactList';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import LocalForageService from './services/LocalForageService';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedAppointments = await LocalForageService.getStoredAppointments();
        setAppointments(storedAppointments);
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous depuis LocalForage:', error);
      }
    };

    const fetchCurrentUser = async () => {
      const user = await LocalForageService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };

    fetchAppointments();
    fetchCurrentUser();
  }, []);

  const handleAddAppointment = async (newAppointment) => {
    try {
      await LocalForageService.addAppointment(newAppointment);
      setAppointments([...appointments, newAppointment]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rendez-vous et de la sauvegarde dans LocalForage:', error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await LocalForageService.deleteAppointment(id);
      const updatedAppointments = appointments.filter((appointment) => appointment.id !== id);
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous et de la sauvegarde dans LocalForage:', error);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      await LocalForageService.updateAppointment(updatedAppointment);
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      );
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous et de la sauvegarde dans LocalForage:', error);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await LocalForageService.clearCurrentUser();
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul className='align-items-center'>
            {currentUser ? (
              <>
                <li>
                  <Link to="/appointments">Liste des Rendez-vous</Link>
                </li>
                <li>
                  <Link to="/contacts">Liste des Contacts</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary">Déconnexion</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Connexion</Link>
                </li>
                <li>
                  <Link to="/signup">Inscription</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route
            path="/appointments"
            element={currentUser ? (
              <AppointmentList appointments={appointments} onUpdateAppointment={handleUpdateAppointment} onDeleteAppointment={handleDeleteAppointment} contacts={contacts} />
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route
            path="/add-appointment/:contactId"
            element={currentUser ? (
              <AppointmentForm onAddAppointment={handleAddAppointment} />
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route
            path="/contacts"
            element={currentUser ? (
              <ContactList contacts={contacts} setContacts={setContacts} />
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={<SignupPage />}
          />
          <Route
            path="*"
            element={<Navigate to={currentUser ? "/contacts" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;