import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';
import './Style.css'

function ReportForm() {
  const { appointmentId, contactEmail } = useParams();
  const [report, setReport] = useState({ title: contactEmail || '', content: '', appointmentId });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      if (appointmentId && contactEmail) {
        setReport({ ...report, appointmentId, contactEmail });
      }
    };
    fetchReport();
  }, [appointmentId, contactEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await LocalForageService.addReport({ ...report, id: Date.now().toString() });
    navigate('/reports');
  };

  return (
    <div className="container mt-5">
      <form className='form-container' onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email du rendez-vous</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={report.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contenu du compte rendu :</label>
          <textarea
            className="form-control"
            name="content"
            value={report.content}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Enregistrer</button>
      </form>
    </div>
  );
}

export default ReportForm;
