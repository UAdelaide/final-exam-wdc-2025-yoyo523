const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const walkRoutes = require('./routes/walkRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'dog-walk-secret',
  resave: false,
  saveUninitialized: false
}));

// Routes
app.use('/', userRoutes);
app.use('/api', walkRoutes);

module.exports = app;