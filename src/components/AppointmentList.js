import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';
import './AppointmentList.css';
import './Style.css';
import { toast } from 'react-toastify';
import moment from 'moment';
import ClearLocalForage from './ClearLocalForage';
function AppointmentList({ appointments, onUpdateAppointment, onDeleteAppointment }) {
  const [editMode, setEditMode] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState({});
  const [contacts, setContacts] = useState([]);
  const [reports, setReports] = useState([]);
  const notify = (message) => {
    toast(message, {
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

    const fetchReports = async () => {
      const storedReports = await LocalForageService.getStoredReports();
      setReports(storedReports);
    };

    fetchContacts();
    fetchReports();
  }, []);

  useEffect(() => {
    const checkTodayAppointments = () => {
      const today = moment().startOf('day');
      appointments.forEach(appointment => {
        const appointmentDate = moment(appointment.date);
        if (appointmentDate.isSame(today, 'day')) {
          notify(`Vous avez un rendez-vous aujourd'hui à ${appointment.time}: ${appointment.description}`);
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

  const getContactEmail = (contactId) => {
    if (!contacts || contacts.length === 0) {
      return 'Contact inconnu';
    }
    const contact = contacts.find((contact) => Number(contact.id) === Number(contactId));
    return contact ? contact.email : 'Contact inconnu';
  };

  const getReportForAppointment = (appointmentId) => {
    return reports.find(report => report.appointmentId === appointmentId);
  };

  const handleAddReport = (appointmentId, contactId) => {
    const existingReport = getReportForAppointment(appointmentId);
    if (existingReport) {
      // Il y a déjà un compte rendu existant, rediriger vers l'édition du compte rendu
      navigate(`/edit-report/${existingReport.id}`);
    } else {
      // Aucun compte rendu existant, rediriger vers l'ajout de compte rendu avec l'email du contact
      const contactEmail = getContactEmail(contactId);
      navigate(`/add-report/${appointmentId}/${contactEmail}`);
    }
  };

  // Séparation des rendez-vous passés et à venir
  const today = moment().startOf('day');
  const futureAppointments = appointments.filter(appointment => moment(appointment.date).isSameOrAfter(today));
  const pastAppointments = appointments.filter(appointment => moment(appointment.date).isBefore(today));

  return (
    <div className="container mt-5">
      {editMode ? (
        <form className='form-container' onSubmit={handleUpdate}>
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
            <button type="submit" className="btn btn-success">Enregistrer</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Annuler</button>
          </div>
        </form>
      ) : (
        <>
          <div className="future-appointments">
            <h3>Rendez-vous à venir</h3>
            <ul className="list-group mt-3">
              {futureAppointments.map((appointment) => (
                <li key={appointment.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span>Date: {appointment.date} | Heure: {appointment.time}</span>
                      <p className="mb-0">Description: {appointment.description}</p>
                      <p className="mb-0">Contact: {getContactEmail(appointment.contactId)}</p>
                    </div>
                    <div className="btnUpdate">
                      <button className="btn btn-outline-primary" onClick={() => handleEdit(appointment)}>Modifier</button>
                      <button className="btn btn-danger" onClick={() => onDeleteAppointment(appointment.id)}>Supprimer</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="past-appointments">
            <h3>Rendez-vous passés</h3>
            <ul className="list-group mt-3">
              {pastAppointments.map((appointment) => (
                <li key={appointment.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span>Date: {appointment.date} | Heure: {appointment.time}</span>
                      <p className="mb-0">Description: {appointment.description}</p>
                      <p className="mb-0">Contact: {getContactEmail(appointment.contactId)}</p>
                    </div>
                    <div className="btnUpdate">
                      {moment(appointment.date).isBefore(today) && (
                        <button className="btn btn-primary" onClick={() => handleAddReport(appointment.id, appointment.contactId)}>
                          {getReportForAppointment(appointment.id) ? 'Modifier compte rendu' : 'Ajouter compte rendu'}
                        </button>
                      )}
                      <button className="btn btn-outline-primary" onClick={() => handleEdit(appointment)}>Modifier</button>
                      <button className="btn btn-danger" onClick={() => onDeleteAppointment(appointment.id)}>Supprimer</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <section><ClearLocalForage /></section>
    </div>
    
  );
}

export default AppointmentList;