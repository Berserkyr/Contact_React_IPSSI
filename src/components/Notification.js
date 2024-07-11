import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const appointments = [
    { id: 1, title: "Rendez-vous avec le client A", time: "2024-07-10T10:00:00Z" },
    { id: 2, title: "Réunion d'équipe", time: "2024-07-10T14:00:00Z" },
    // Ajoutez d'autres rendez-vous ici
];

const notifyAppointment = (appointment) => {
    toast(`Rappel: ${appointment.title} à ${new Date(appointment.time).toLocaleTimeString()}`, {
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

const scheduleNotifications = () => {
    const now = new Date().getTime();
    appointments.forEach(appointment => {
        const appointmentTime = new Date(appointment.time).getTime();
        const delay = appointmentTime - now;
        if (delay > 0) {
            setTimeout(() => notifyAppointment(appointment), delay);
        }
    });
};


export default Notification;
