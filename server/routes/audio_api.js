const db = require('../database');
const auth = require('../auth');

const express = require('express');
const router = express.Router();

/**
 * GET /api/get_links
 * (authentication required)
 */
router.get('/api/get_links', auth.authenticationCheck, (req, res) => {
  let username = req.query.username;
  let date = req.query.date;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  if (date === undefined) {
    res.status(400).end('Error: no date specified.');
  }

  db.exec('SELECT * FROM audio WHERE creator LIKE ? AND upload_date = ?', [ username, date ], db.connection, function (err, result, fields) {
    res.status(200).end(JSON.stringify(result));
  });
});

/**
 * GET /api/get_recording_dates
 * (authentication required)
 */
router.get('/api/get_recording_dates', auth.authenticationCheck, (req, res) => {
  let username = req.query.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  db.exec('SELECT DISTINCT upload_date FROM audio WHERE creator LIKE ?', [ username ], db.connection, function (err, result, fields) {
    res.status(200).end(JSON.stringify(result));
  });
});

module.exports = router;
