const db = require('../database');
const auth = require('../auth');

const express = require('express');
const router = express.Router();

/**
 * GET /api/logout
 */
router.get('/api/logout', (req, res) => {
  // User not logged in
  if (req.session.user === undefined) {
    res.status(400).end();
  }

  console.log(`[/api/logout] ${req.session.user} logged out.`);

  // End the caller's session
  req.session.destroy();
  res.status(200).end();
});

/**
 * GET /api/user
 * (authentication required)
 */
router.get('/api/user', auth.authenticationCheck, (req, res) => {
  res.status(200).end(JSON.stringify({ 'username': req.session.user }));
});

/**
 * GET /api/get_user_info
 * (authentication required)
 */
router.get('/api/get_user_info', auth.authenticationCheck, (req, res) => {
  let username = req.session.user;

  db.exec('SELECT * FROM users_testing WHERE username LIKE ?', [ username ], db.connection, function(err, result, fields) {
    let parsedResult = JSON.parse(JSON.stringify(result))[0];

    if (result.length !== 1) {
      res.end(400);
    }

    // Don't send hash over the api call
    delete parsedResult.hash;

    let objectString = JSON.stringify(parsedResult);

    res.status(200).end(objectString);
  });
});

/**
 * POST /api/update_user_info
 * (authentication required)
 */
router.post('/api/update_user_info', auth.authenticationCheck, (req, res) => {
  let username = req.session.user;

  // Field whitelist to prevent SQL injection
  let userFields = {
    first_name: req.body.first_name || null,
    last_name: req.body.last_name || null,
    school: req.body.school || null,
    occupation: req.body.occupation || null,
    description: req.body.description || null
  }

  db.exec('SELECT * FROM users_testing WHERE username = ?', [ username ], db.connection, function(err, result, fields) {
    let parsedResult = JSON.parse(JSON.stringify(result))[0];

    Object.keys(userFields).forEach((key) => {
      let value = userFields[key];

      let targetField = null;
      if (key === 'first_name' || key === 'last_name' || key === 'school' || key === 'occupation' || key === 'description') { targetField = key; }

      if (value !== null && targetField !== null) {
        console.log(`[/api/update_user_info] Setting ${key} to ${value} (${username})`);

        db.exec(`UPDATE users_testing SET ${targetField} = ? WHERE username = ?`, [ value, username ], db.connection, function(err, result, fields) {
          console.log(err);
        });
      }
    });

    res.status(200).end();
  });
});

module.exports = router;
