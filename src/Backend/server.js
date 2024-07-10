// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/contacts', async (req, res) => {
  try {
    const response = await axios.get('https://api.brevo.com/v3/contacts/lists/5', {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data.contacts);
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
