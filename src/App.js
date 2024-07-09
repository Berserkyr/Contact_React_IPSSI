// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import ContactList from './components/ContactList';
import LocalForageService from './services/LocalForageService';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedAppointments = await LocalForageService.getStoredAppointments();
        setAppointments(storedAppointments);
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous depuis LocalForage:', error);
      }
    };

    fetchAppointments();
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

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/appointments">Liste des Rendez-vous</Link>
            </li>
            <li>
              <Link to="/contacts">Liste des Contacts</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/appointments"
            element={<AppointmentList appointments={appointments} onUpdateAppointment={handleUpdateAppointment} onDeleteAppointment={handleDeleteAppointment} contacts={contacts} />}
          />
          <Route
            path="/add-appointment/:contactId"
            element={<AppointmentForm onAddAppointment={handleAddAppointment} />}
          />
          <Route
            path="/contacts"
            element={<ContactList contacts={contacts} setContacts={setContacts} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
