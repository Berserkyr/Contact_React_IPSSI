import React from 'react';
import LocalForageService from '../services/LocalForageService';

const exportData = async () => {
  try {
    const appointments = await LocalForageService.getStoredAppointments();
    const contacts = await LocalForageService.getStoredContacts();
    const reports = await LocalForageService.getStoredReports();
    const users = await LocalForageService.getUsers();
    const currentUser = await LocalForageService.getCurrentUser();

    const data = {
      appointments,
      contacts,
      reports,
      users,
      currentUser,
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    a.click();
    URL.revokeObjectURL(url);

    console.log('Exportation réussie!');
  } catch (error) {
    console.error('Erreur lors de l\'exportation des données:', error);
  }
};

const ExportDataButton = () => {
  return (
    <button onClick={exportData} className="btn btn-primary">Exporter les données</button>
  );
};

export default ExportDataButton;
