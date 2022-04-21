const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const db = require('../database');

const express = require('express');
const router = express.Router();

/**
 * POST /api/create_account
 */
router.post('/api/create_account', (req, res) => {
  let username = req.body.username || null;
  let password = req.body.password || null;
  let firstName = req.body.first_name || null;
  let lastname = req.body.last_name || null;

  if (password === null || username === null) {
    res.status(400).end('Error: Must specify username and password');
  }

  db.exec('SELECT * FROM users_testing WHERE username LIKE ?', [ username ], db.connection, function(err, result, fields) {
    if (err) throw err;

    let parsedResult = JSON.parse(JSON.stringify(result))[0];

    if (result.length === 1) { // Account already exists, return 400 error
        console.log('[/api/create_account] Error: user already exists ' + username + ':' + password);

        res.status(400).end(req.body.username);
    } else { // Create a new account
      console.log('[/api/create_account] Creating new account ' + username + ':' + password);

      bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
        // Store hash in your password DB.
        db.exec('INSERT INTO users_testing (username, hash) VALUES (?, ?)', [ username, hash ], db.connection, function(err, result, fields) {
          res.status(200).end();
        });
      });
    }
  });
});

module.exports = router;
