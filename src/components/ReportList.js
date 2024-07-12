import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';
import './ReportList.css'; // Import du fichier de style CSS

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

  return (
    <div className="report-list-container mt-4">
      <h2 className="report-list-title">Comptes Rendus</h2>
      <ul className="report-list">
        {reports.map(report => (
          <li key={report.id} className="report-item">
            <h3 className='report-title'> <span className="report-title-email">Email du rendez-vous : </span>{report.title}</h3>
            <p className="report-content">Contenu du compte rendu : </p>
            <p className="report-content">{report.content}</p>
            <div className="report-actions">
              <Link to={`/edit-report/${report.id}`} className="report-action-link">Modifier</Link>
              <button onClick={() => handleDelete(report.id)} className="report-action-button">Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportList;
