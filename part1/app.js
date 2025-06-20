const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

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

app.get('/api/Dogs', async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT
          Dogs.name AS dog_name,
          Dogs.size,
          users.name AS owner_username
        FROM Dogs
        JOIN users ON Dogs.owner_id = users.user_id
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch Dogs' });
    }
  });

app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        walk_requests.request_id,
        Dogs.name AS dog_name,
        walk_requests.requested_time,
        walk_requests.duration_minutes,
        walk_requests.location,
        users.username AS owner_username
      FROM walk_requests
      JOIN Dogs ON walk_requests.dog_id = Dogs.dog_id
      JOIN users ON Dogs.owner_id = users.user_id
      WHERE walk_requests.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch walk requests' });
  }
});

// /api/walkers/summary 路由
app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        users.username AS walker_username,
        COUNT(ratings.rating_id) AS total_ratings,
        ROUND(AVG(ratings.score), 1) AS average_rating,
        COUNT(DISTINCT walk_assignments.assignment_id) AS completed_walks
      FROM users
      LEFT JOIN walk_assignments ON users.user_id = walk_assignments.walker_id
      LEFT JOIN ratings ON walk_assignments.assignment_id = ratings.walk_assignment_id
      WHERE users.role = 'walker'
      GROUP BY users.username
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch walker summary' });
  }
});

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});