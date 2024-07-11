import React from 'react';
import localforage from 'localforage';
import { confirmAlert } from 'react-confirm-alert'; // Importez le composant de confirmation
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importez le style du composant de confirmation
import './ClearLocalForage.css';

const ClearLocalForage = () => {

  const handleClearData = () => {
    // Fonction pour vider le localforage
    localforage.clear().then(() => {
      alert('Données supprimées avec succès');
    }).catch((err) => {
      console.error('Erreur lors de la suppression des données:', err);
    });
  };

  const handleConfirmClear = () => {
    // Fonction pour montrer le pop-up de confirmation
    confirmAlert({
      title: 'Confirmation de suppression',
      message: 'Êtes-vous sûr de vouloir supprimer toutes les données?',
      buttons: [
        {
          label: 'Oui',
          onClick: () => handleClearData()
        },
        {
          label: 'Non',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div className="clear-localforage-container">
      <button className="clear-localforage-button" onClick={handleConfirmClear}>
        Supprimer les données
      </button>
    </div>
  );
};

export default ClearLocalForage;
