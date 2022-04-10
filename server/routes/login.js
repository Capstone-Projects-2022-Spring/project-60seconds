const express = require('express');
const db = require('../database');

let router = express.Router();

/**
* POST /api/login
*/
router.post('/api/login', async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    // If a user is already logged them in, log them out before processing another login attempt
    if (req.session.user !== undefined) {
      console.log('[/api/login] A previously logged in user is trying to login again; destroying their session.');
      req.session.destroy();
    }

    db.exec('SELECT * FROM users WHERE username LIKE ? AND password LIKE ?', [ username, password ], db.connection, function(err, result, fields) {
      if (err) throw err;

      let parsedResult = JSON.parse(JSON.stringify(result))[0];

      // Login information correct
      if (result.length === 1) {
          console.log(`[/api/login] Succesful login from ${username}:${password}, creating a new session`);
          req.session.user = req.body.username;
          res.status(200).end(req.body.username);
      } else {
          console.log('[/api/login] Unsuccesful login attempt: ' + req.body.username + ':' + req.body.password);
          res.status(401).end();
      }
    });
});

module.exports = router;
