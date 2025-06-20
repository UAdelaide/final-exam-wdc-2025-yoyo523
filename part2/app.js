const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// === MySQL database connection ===
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'your_database_name'
    });
    console.log('MySQL connected');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

// === Middleware ===
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 允许表单提交
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, '/public')));

// === External Routes ===
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// === Login route ===
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
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

// === Logout route ===
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

// === API: Get current owner's dogs ===
app.get('/api/mydogs', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const ownerId = req.session.user.id;
    const [rows] = await db.execute(
      'SELECT id, name FROM dogs WHERE owner_id = ?',
      [ownerId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch dogs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = app;