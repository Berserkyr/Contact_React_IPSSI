import React, { useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';
import { v4 as uuidv4 } from 'uuid';
import './Style.css';

function AppointmentForm({ onAddAppointment }) {
  const { contactId } = useParams();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const navigate  = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAppointment = {
      id: uuidv4(),
      date,
      time,
      description,
      contactId,
    };

    try {
      await LocalForageService.addAppointment(newAppointment); 
      onAddAppointment(newAppointment);
      navigate('/appointments');
      setDate('');
      setTime('');
      setDescription('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rendez-vous et de la sauvegarde dans LocalForage:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container mt-5">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description du rendez-vous"
        required
      />
      <button type="submit" className='btn btn-success'>Ajouter Rendez-vous</button>
    </form>
  );
}

export default AppointmentForm;