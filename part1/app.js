const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const axios = require('axios');

app.use(express.json());
app.use(express.static(__dirname));

let db;

(async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed', err);
  }
})();

// GET /api/Dogs
app.get('/api/Dogs', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT Dogs.dog_id, Dogs.name, Dogs.size, Users.username AS owner_name
      FROM Dogs
      JOIN Users ON Dogs.owner_id = Users.user_id
    `);

    const dogsWithPhotos = await Promise.all(rows.map(async (dog) => {
      try {
        const response = await axios.get('https://dog.ceo/api/breeds/image/random');
        dog.photo_url = response.data.message;
      } catch {
        dog.photo_url = '';
      return dog;
    }));

    res.json(dogsWithPhotos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Dogs' });
  }
});

// GET /api/WalkRequests/open
app.get('/api/WalkRequests/open', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        WalkRequests.request_id,
        Dogs.name AS dog_name,
        WalkRequests.requested_time,
        WalkRequests.duration_minutes,
        WalkRequests.location,
        Users.username AS owner_username
      FROM WalkRequests
      JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
      JOIN Users ON Dogs.owner_id = Users.user_id
      WHERE WalkRequests.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch walk requests' });
  }
});

// GET /api/walkers/summary
app.get('/api/walkers/summary', async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT
          Users.username AS walker_username,
          COUNT(WalkRatings.rating_id) AS total_ratings,
          ROUND(AVG(WalkRatings.rating), 1) AS average_rating,
          COUNT(DISTINCT WalkRatings.request_id) AS completed_walks
        FROM Users
        LEFT JOIN WalkRatings ON Users.user_id = WalkRatings.walker_id
        WHERE Users.role = 'walker'
        GROUP BY Users.username
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch walker summary' });
    }
  });

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});