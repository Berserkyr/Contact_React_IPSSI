import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocalForageService from '../services/LocalForageService';

function ReportForm() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({ title: '', content: '', appointmentId: '' });

  useEffect(() => {
    const fetchReport = async () => {
      if (reportId) {
        const storedReports = await LocalForageService.getStoredReports();
        const reportToEdit = storedReports.find(report => report.id === reportId);
        if (reportToEdit) {
          setReport(reportToEdit);
        }
      }
    };
    fetchReport();
  }, [reportId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reportId) {
      await LocalForageService.updateReport(report);
    } else {
      await LocalForageService.addReport({ ...report, id: Date.now().toString() });
    }
    navigate('/reports');
  };

  return (
    <div className="container mt-5">
        <form onSubmit={handleSubmit}>
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
            <button type="submit" className='btn btn-primary'>Enregistrer</button>
        </form>
    </div>
  );
}

export default ReportForm;
