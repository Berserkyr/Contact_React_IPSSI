import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ReportList from './components/ReportList';
import ReportForm from './components/ReportForm';
import Logout from './components/Logout';
import LocalForageService from './services/LocalForageService';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedAppointments = await LocalForageService.getStoredAppointments();
        setAppointments(storedAppointments || []); // Assurez-vous de gérer le cas où storedAppointments est null ou undefined
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous depuis LocalForage:', error);
      }
    };

    const fetchCurrentUser = async () => {
      const user = await LocalForageService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
      setIsLoading(false);
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

  const handleLogout = async () => {
    await LocalForageService.clearCurrentUser();
    setCurrentUser(null);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

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
                  <Link to="/reports">Comptes Rendus</Link>
                </li>
                <li>
                  <Link to="/logout" onClick={handleLogout} className='btn btn-danger'>Se déconnecter</Link>
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
              <AppointmentList
                appointments={appointments}
                onUpdateAppointment={handleUpdateAppointment}
                onDeleteAppointment={handleDeleteAppointment}
                contacts={contacts}
              />
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
            element={<ContactList contacts={contacts} setContacts={setContacts} />}
          />
          <Route
            path="/contact-form/:contactId/:contactAction"
            element={<ContactForm />}
          />
          <Route
            path="/login"
            element={<LoginPage onLogin={setCurrentUser} />}
          />
          <Route
            path="/signup"
            element={<SignupPage />}
          />
          <Route
            path="/logout"
            element={<Logout />}
          />
          <Route
            path="/reports"
            element={<ReportList appointments={appointments} />}
          />
          <Route
            path="/add-report/:appointmentId"
            element={<ReportForm />}
          />
          <Route
            path="/edit-report/:reportId"
            element={<ReportForm />}
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