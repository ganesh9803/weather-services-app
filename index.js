const express = require('express');
const axios = require('axios');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// fetch weather information
app.get('/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY; 

    if (!apiKey) {
      return res.status(500).json({ error: 'API Key is missing' });
    }

    const response = await axios.get('http://api.weatherstack.com/current', {
      params: {
        access_key: apiKey,
        query: city,
      },
    });

    const data = response.data;

    if (data.error) {
      return res.status(400).json({ error: data.error.info });
    }

    res.json({
      location: data.location.name,
      temperature: data.current.temperature,
      condition: data.current.weather_descriptions[0],
      humidity: data.current.humidity,
      wind_speed: data.current.wind_speed,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the weather data' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
