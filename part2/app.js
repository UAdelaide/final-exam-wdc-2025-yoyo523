const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// DB connection
let db;
(async () => {
  db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'your_database_name'
  });
})();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, '/public')));

// Routes from separate files
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// === Add login route ===
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? AND password_hash = ?',
      [username, password]
    );

    if (rows.length === 1) {
      req.session.user = rows[0];
      const role = rows[0].role;

      if (role === 'owner') {
        return res.redirect('/owner-dashboard.html');
      } else if (role === 'walker') {
        return res.redirect('/walker-dashboard.html');
      } else {
        return res.status(403).send('Unknown role');
      }
    } else {
      res.send('Login failed: Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// === My Dogs (for dropdown) ===
app.get('/api/mydogs', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const ownerId = req.session.user.id;
  const [rows] = await db.execute(
    'SELECT id, name FROM dogs WHERE owner_id = ?',
    [ownerId]
  );

  res.json(rows);
});

// === Logout ===
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = app;