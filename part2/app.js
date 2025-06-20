const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const walkRoutes = require('./routes/walkRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'dog-walk-secret',
  resave: false,
  saveUninitialized: false
}));

// Main routes
app.use('/', userRoutes);
app.use('/api', walkRoutes);

// Start server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});