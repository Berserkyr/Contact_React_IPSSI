// AppointmentList.js
import React, { useState } from 'react';
import './AppointmentList.css';

function AppointmentList({ appointments, onUpdateAppointment, onDeleteAppointment, contacts }) {
  const [editMode, setEditMode] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState({});

  const handleEdit = (appointment) => {
    setEditedAppointment({ appointment });
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
    return contact ? contact.email : 'Contact inconnu';
  };

  return (
    <div className="container mt-5">
      <h2>Liste des Rendez-vous</h2>
      {editMode ? (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              className="form-control"
              value={editedAppointment.date}
              onChange={(e) => setEditedAppointment({ ...editedAppointment, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group mt-2">
            <label>Heure:</label>
            <input
              type="time"
              className="form-control"
              value={editedAppointment.time}
              onChange={(e) => setEditedAppointment({ ...editedAppointment, time: e.target.value })}
              required
            />
          </div>
          <div className="form-group mt-2">
            <label>Description du rendez-vous:</label>
            <input
              type="text"
              className="form-control"
              value={editedAppointment.description}
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
