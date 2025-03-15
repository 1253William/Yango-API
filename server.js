const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

const YANGO_CLID = process.env.YANGO_CLID;
const YANGO_API_KEY = process.env.YANGO_API_KEY;
const BASE_URL =process.env.BASE_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 3000;
const HEADERS = {
  "X-YaTaxi-API-Key": process.env.YANGO_API_KEY,
  "Accept": "application/json",
};

// Middleware to parse JSON
app.use(express.json());



/**
 * Fetch Yango Trip Info
 * Example: /trip-info?lat1=5.560&lon1=-0.205&lat2=5.570&lon2=-0.200&class=econom
 */
app.get('/trip-info', async (req, res) => {
    try {
        

    const { lat1, lon1, lat2, lon2, class_str = "econom", req_str = "basic" } = req.query;

    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

        const url = `${BASE_URL}/taxi_info`;
        headers: HEADERS;
    const params = {
      clid: YANGO_CLID,
      apikey: YANGO_API_KEY,
      rll: `${lon1},${lat1}~${lon2},${lat2}`,
      class: class_str,
      req: req_str,
    };

    const response = await axios.get(url, { params, headers: HEADERS });
    res.json(response.data);

    } catch (error) {
        console.error('Error fetching trip info:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data || 'Internal Server Error' });
    }
});


/**
 * Fetch Yango Zone Info (NEW)
 * Example: /zone-info?lat=5.560&lon=-0.205
 */
app.get("/zone-info", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    const url = `${BASE_URL}/zone_info`;
    const params = {
      clid: YANGO_CLID,
      apikey: YANGO_API_KEY,
      ll: `${lon},${lat}`,
    };

    const response = await axios.get(url, { params, headers: HEADERS });
      res.json(response.data);
      console.log('Zone Info API Response:', response.data);

  } catch (error) {
    console.error("Error fetching zone info:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
