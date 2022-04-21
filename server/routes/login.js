const bcrypt = require('bcrypt');

const conf = require('../conf');
const db = require('../database');

const express = require('express');
const router = express.Router();

/**
 * POST /login
 */
router.post('/api/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // If a user is already logged in, log them out before processing another login attempt
    if (req.session.user !== undefined) {
      console.log('[/api/login] A previously logged in user is trying to login again; destroying their session.');
      req.session.destroy();
    }

    // Check if the username exists
    db.exec('SELECT * FROM users_testing WHERE username LIKE ?', [ username ], db.connection, function(err, result, fields) {
      if (err) throw err;

      let userObject = JSON.parse(JSON.stringify(result))[0];

      if (result.length !== 1) {
        console.log('[/api/login] Unsuccesful login attempt (invalid username): ' + req.body.username + ':' + req.body.password);
        res.status(401).end();
      }

      bcrypt.compare(password, userObject.hash, function(err, result) {
        if (result === true) {
          console.log(`[/api/login] Succesful login from ${username}, creating a new session`);

          // Create session
          req.session.user = req.body.username;
          res.status(200).end(req.body.username);
        } else {
          console.log('[/api/login] Unsuccesful login attempt (invalid password): ' + req.body.username + ':' + req.body.password);
          res.status(401).end();
        }
      });
    });
});

module.exports = router;
