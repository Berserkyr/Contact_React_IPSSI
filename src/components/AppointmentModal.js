/* AppointmentModal.js
import React from 'react';
import Modal from 'react-modal';
import appointments from './AppointmentList';
Modal.setAppElement('#root'); // Assurez-vous de définir l'élément racine pour l'accessibilité

const AppointmentModal = ({ isOpen, onRequestClose, appointments }) => {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Planning de rendez-vous"
    >
      <h2>Planning de rendez-vous</h2>
      <button onClick={onRequestClose}>Fermer</button>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            {appointment.date} à {appointment.time} - {appointment.description}
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default AppointmentModal;
*/