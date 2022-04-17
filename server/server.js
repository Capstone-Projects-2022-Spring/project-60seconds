// server.js
// Main file; handles incoming API requests to the server

// TODO: Needs a lot of refactoring; split logic between multiple files, fix vulnerabilities, clean things up
// TODO: Fix glaring SQL injection vulnerabilities

// const mysql = require('mysql2');
const crypto = require('crypto');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const session = require('express-session');
const http = require('http');
const https = require('https');

// Custom Imports
const creds = require('./creds');
const conf = require('./conf');

const db = require('./database');
const auth = require('./auth')

// New for NLP handling
const nlp = require('./nlp');

const app = express();

// Enable express-session middleware
app.use(session({
    secret: creds.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: 'none', secure: true } // should be secure for production
}));

// Other middleware
app.use(bodyParser.json());
app.use(fileUpload());

// If client is locally hosted (development), allow local request origins instead of foreign
let origin = conf.mode === 'development' ? 'https://localhost:19006' : 'https://60seconds.io';
app.use(cors( { credentials: true, origin: origin, } ));

// Serve static files from /public
app.use(express.static('public'))

/**
 * API
 */
app.prefix = '/api/';

/**
 * GET /
 */
app.get('/api', (req, res) => {
  res.send('API server is up!');
});

/**
 * POST /login
 */
app.post(app.prefix + 'login', async (req, res) => {
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

/**
 * GET /api/logout
 */
app.get(app.prefix + 'logout', (req, res) => {
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
app.get(app.prefix + 'user', auth.authenticationCheck, (req, res) => {
  res.status(200).end(JSON.stringify({ 'username': req.session.user }));
});

/**
 * POST /api/create_account
 */
app.post(app.prefix + 'create_account', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  db.exec('SELECT * FROM users WHERE username LIKE ?', [ username ], db.connection, function (err, result, fields) {
    if (err) throw err;

    let parsedResult = JSON.parse(JSON.stringify(result))[0];

    if (result.length === 1) { // Account already exists, return 400 error
        console.log('[/api/create_account] Error: user already exists ' + username + ':' + password);

        res.status(400).end(req.body.username);
    } else { // Create a new account
        console.log('[/api/create_account] Creating new account ' + username + ':' + password);

        db.exec('INSERT INTO users (username, password) VALUES (?, ?)', [ username, password ], db.connection, function (err, result, fields) {
          res.status(200).end();
        });
    }
  });
});

/**
 * POST /api/upload
 * (authentication required)
 */
app.post(app.prefix + 'upload', auth.authenticationCheck, (req, res) => {
  let username = req.body.username;
  let transcript = req.body.transcript || undefined;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  // Send a 400 error code if no files included
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files');
    return res.status(400).end('Error: No files were uploaded.');
  }

  baseURL =  `https://${conf.host}/audio/`;

  let audioFile = req.files.audio;

  let uuid = crypto.randomUUID();
  let uniqueFileName = uuid + '.mp3';

  uploadPath = __dirname + '/public/audio/' + uniqueFileName;

  audioFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    let audioObject = {
      "link": baseURL + uniqueFileName,
      "creator": username,
      "tags": "",
      "transcript": transcript
    }

    // Legacy handler
    if (audioObject.ranscript === undefined) {
      console.log(`[/api/upload] Request received with no transcript; using legacy handler`);
      db.exec('INSERT INTO audio (link, creator, tags) VALUES (?, ?, ?)',
              [ audioObject.link, audioObject.creator, audioObject.tags ],
              db.connection,
              function (err, result, fields) {

        res.status(200);
        res.end(JSON.stringify(audioObject));
      });
    }

    // New handler for transcript uploads
    if (transcript !== undefined) {
      console.log(`[/api/upload] Request received with transcript; using new handler.`);
      console.log(`[/api/upload] => Transcript received: ${transcript}`);

      db.exec('INSERT INTO audio (link, creator, tags, transcript) VALUES (?, ?, ?, ?)',
              [ audioObject.link, audioObject.creator, audioObject.tags, audioObject.transcript ],
              db.connection,
              function (err, result, fields) {
        // console.log(`err: ${err}, res: ${result}, fields: ${fields}`);
      });

      let events = [];
      let transcriptEvents = nlp.extractEvents(audioObject.transcript, audioObject.creator);
      events.push.apply(events, transcriptEvents);

      events.forEach((event, i) => {
        db.exec('INSERT INTO events (audio_id, creator, timestamp, description) VALUES (?, ?, ?, ?)', [ 0, audioObject.creator, event.time, event.description ], db.connection, function(err, result, fields) {
          // Do nothing
        });
      });

      res.status(200);
      res.end(JSON.stringify(audioObject));

    }
  });
});

// Legacy handler for getting NLP events. Should have authentication check but disabled for testing
app.get(app.prefix + 'get_events', (req, res) => {
  let username = req.query.username;

  db.exec('SELECT transcript FROM audio WHERE creator LIKE ?', [ username ], db.connection, function (err, results, fields) {
    console.log(`[/api/get_events] Result: ${JSON.stringify(results)}`);

    let events = [];

    results.forEach(function(result, index) {
      let transcriptEvents = nlp.extractEvents(result.transcript, username);
      events.push.apply(events, transcriptEvents);
    });

    res.status(200).end(JSON.stringify(events));
  });
});

// New handler for getting NLP events correctly from the database. Should have authentication check but disabled for testing
app.get(app.prefix + 'get_all_events', (req, res) => {
  let username = req.query.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  db.exec('SELECT * FROM events WHERE creator LIKE ?', [ username ], db.connection, function (err, result, fields) {
    res.status(200).end(JSON.stringify(result));
  });
});

/**
 * GET /api/get_links
 * (authentication required)
 */
app.get(app.prefix + 'get_links', auth.authenticationCheck, (req, res) => {
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
app.get(app.prefix + 'get_recording_dates', auth.authenticationCheck, (req, res) => {
  let username = req.query.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  db.exec('SELECT DISTINCT upload_date FROM audio WHERE creator LIKE ?', [ username ], db.connection, function (err, result, fields) {
    res.status(200).end(JSON.stringify(result));
  });
});

// Server
const httpServer = http.createServer(app);
const httpsServer = https.createServer(auth.credentials, app);

httpsServer.addContext('api.60seconds.io', auth.credentials);
httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

module.exports = app;
