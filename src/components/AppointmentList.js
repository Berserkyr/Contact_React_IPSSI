import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';
import './AppointmentList.css';
import { toast } from 'react-toastify';
import moment from 'moment';

function AppointmentList({ appointments, onUpdateAppointment, onDeleteAppointment }) {
  const [editMode, setEditMode] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState({});
  const [contacts, setContacts] = useState([]);
  const notify = (message) => {
    toast( message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: { backgroundColor: 'lightblue', color: 'darkblue' },
      icon: "📅"
  });
};
    
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      const storedContacts = await LocalForageService.getStoredContacts();
      setContacts(storedContacts);
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const checkTodayAppointments = () => {
      const today = moment().startOf('day');
      appointments.forEach(appointment => {
        const appointmentDate = moment(appointment.date);
        if (appointmentDate.isSame(today, 'day')) {
          notify(`Vous avez un rendez-vous aujourd'hui à ${appointment.time}: ${appointment.description}`);
        ;
      }
    });
  };
    checkTodayAppointments();
  }, [appointments]);

  const handleEdit = (appointment) => {
    setEditedAppointment(appointment);
    setEditMode(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdateAppointment(editedAppointment);
    setEditMode(false);
  };

  const getContactName = (contactId) => {
    if (!contacts || contacts.length === 0) {
      return 'Contact inconnu';
    }
    const contact = contacts.find((contact) => Number(contact.id) === Number(contactId));
    return contact ? `${contact.attributes.PRENOM} ${contact.attributes.NOM} - ${contact.email}` : 'Contact inconnu';
  };

  const handleAddReport = (appointmentId) => {
    navigate(`/add-report/${appointmentId}`);
  };

  return (
    <div className="container mt-5">
      {editMode ? (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              className="form-control"
              value={editedAppointment.date || ''}
              onChange={(e) => setEditedAppointment({ ...editedAppointment, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group mt-2">
            <label>Heure:</label>
            <input
              type="time"
              className="form-control"
              value={editedAppointment.time || ''}
              onChange={(e) => setEditedAppointment({ ...editedAppointment, time: e.target.value })}
              required
            />
          </div>
          <div className="form-group mt-2">
            <label>Description du rendez-vous:</label>
            <input
              type="text"
              className="form-control"
              value={editedAppointment.description || ''}
              onChange={(e) => setEditedAppointment({ ...editedAppointment, description: e.target.value })}
              placeholder="Description du rendez-vous"
              required
            />
          </div>
          <div className="btnUpdate mt-3">
            <button type="submit" className="btn btn-primary">Enregistrer</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Annuler</button>
          </div>
        </form>
      ) : (
        <ul className="list-group mt-3">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span>Date: {appointment.date} | Heure: {appointment.time}</span>
                  <p className="mb-0">Description: {appointment.description}</p>
                  <p className="mb-0">Contact: {getContactName(appointment.contactId)}</p>
                </div>
                <div className="btnUpdate">
                  <button className="btn btn-info" onClick={() => handleEdit(appointment)}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => onDeleteAppointment(appointment.id)}>Supprimer</button>
                  <button className="btn btn-primary" onClick={() => handleAddReport(appointment.id)}>Ajouter compte rendu</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AppointmentList;
