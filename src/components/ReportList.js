import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const storedReports = await LocalForageService.getStoredReports();
      setReports(storedReports);
    };

    const fetchAppointments = async () => {
      const storedAppointments = await LocalForageService.getStoredAppointments();
      setAppointments(storedAppointments);
    };

    const fetchContacts = async () => {
      const storedContacts = await LocalForageService.getStoredContacts();
      setContacts(storedContacts);
    };

    fetchReports();
    fetchAppointments();
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    await LocalForageService.deleteReport(id);
    setReports(reports.filter(report => report.id !== id));
  };

  const getAppointmentInfo = (appointmentId) => {
    const appointment = appointments.find(appointment => appointment.id === appointmentId);
    if (!appointment) {
      return 'Rendez-vous inconnu';
    }

    const contact = contacts.find(contact => contact.id === appointment.contactId);
    if (!contact) {
      return 'Contact inconnu';
    }

    return `${contact.attributes.PRENOM} ${contact.attributes.NOM} - ${contact.email}`;
  };

  return (
    <div>
      <h2>Comptes Rendus</h2>
      <ul>
        {reports.map(report => (
          <li key={report.id}>
            <h3>{report.title}</h3>
            <p>{report.content}</p>
            <p>Rendez-vous: {getAppointmentInfo(report.appointmentId)}</p>
            <Link to={`/edit-report/${report.id}`}>Modifier</Link>
            <button onClick={() => handleDelete(report.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportList;