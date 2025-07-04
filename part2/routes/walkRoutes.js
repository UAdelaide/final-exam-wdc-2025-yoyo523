const express = require('express');
const router = express.Router();
const db = require('../models/db');

/**
 * GET /api/walkrequests/open
 * Return all open walk requests with dog and owner info
 */
router.get('/open', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT wr.request_id, d.name AS dog_name, wr.requested_time,
             wr.duration_minutes, wr.location, u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch walk requests' });
  }
});
/**
 * POST /api/:id/apply
 * Walker applies for a walk request and it gets marked as accepted
 */
router.post('/:id/apply', async (req, res) => {
  const requestId = req.params.id;
  const { walker_id } = req.body;

  try {
    await db.query(`
      INSERT INTO WalkApplications (request_id, walker_id)
      VALUES (?, ?)
    `, [requestId, walker_id]);

    await db.query(`
      UPDATE WalkRequests
      SET status = 'accepted'
      WHERE request_id = ?
    `, [requestId]);

    res.status(201).json({ message: 'Application submitted' });
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to apply for walk' });
  }
});
router.get('/walks', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const ownerId = req.session.user.user_id;

  try {
    const [rows] = await db.query(`
      SELECT wr.request_id, d.name AS dog_name, d.size, wr.requested_time,
             wr.duration_minutes, wr.location, wr.status
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      WHERE d.owner_id = ?
      ORDER BY wr.requested_time DESC
    `, [ownerId]);

    res.json(rows);
  } catch (err) {
    console.error('Error loading walk requests:', err);
    res.status(500).json({ error: 'Failed to load walk requests' });
  }
});
/**
 * GET /api/
 * Return all open walk requests (basic default version for testing)
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        wr.request_id,
        d.name AS dog_name,
        d.size,
        wr.requested_time,
        wr.duration_minutes,
        wr.location,
        wr.status,
        u.username AS owner_name
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
      ORDER BY wr.requested_time DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching walk requests:', err);
    res.status(500).json({ error: 'Failed to fetch walk requests' });
  }
});

module.exports = router;