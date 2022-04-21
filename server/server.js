// server.js
// Main file; handles incoming API requests to the server

// TODO: ===> split logic between multiple files <===
// TODO: Fix vulnerabilities, clean things up

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

// Password hashing
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

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
app.use(cors( { credentials: true, origin: origin } ));

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
    // TODO: Modularize this mess

    let username = req.body.username;
    let password = req.body.password;

    // If a user is already logged them in, log them out before processing another login attempt
    if (req.session.user !== undefined) {
      console.log('[/api/login] A previously logged in user is trying to login again; destroying their session.');
      req.session.destroy();
    }

    db.exec('SELECT * FROM users_testing WHERE username LIKE ?', [ username ], db.connection,function(err, result, fields) {
      console.log(`${JSON.stringify(result)}`);
      if (err) throw err;

      let parsedResult = JSON.parse(JSON.stringify(result))[0];

      // Login information correct
      if (result.length === 1) {
          let userObject = parsedResult;

          bcrypt.compare(password, userObject.hash, function(err, result) {
            if (result === true) {
              // Probably shouldn't print passwords to log files but I'm leaving this here for now
              console.log(`[/api/login] Succesful login from ${username}:${password}, creating a new session`);
              req.session.user = req.body.username;
              res.status(200).end(req.body.username);
            } else {
              console.log('[/api/login] Unsuccesful login attempt (invalid password): ' + req.body.username + ':' + req.body.password);
              res.status(401).end();
            }
          });

      } else {
          console.log('[/api/login] Unsuccesful login attempt (invalid username): ' + req.body.username + ':' + req.body.password);
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
 * GET /api/get_user_info
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
app.get(app.prefix + 'get_user_info', (req, res) => {
  let username = req.session.user;
  username = 'newuser'

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
app.post(app.prefix + 'update_user_info', auth.authenticationCheck, (req, res) => {
  let username = req.session.user;

  // Unfortunately for some weird security reasons (SQL Injection, prototype pollution), I have to do this in a pretty convoluted way.
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

/**
 * POST /api/create_account
 */
app.post(app.prefix + 'create_account', (req, res) => {
  let username = req.body.username;
  let password = req.body.password || null;
  let firstName = req.body.first_name || null;
  let lastname = req.body.last_name || null;

  if (password === null) {
    res.status(400).end('Error: No password specified');
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

/**
 * POST /api/upload
 * (authentication required)
 */
app.post(app.prefix + 'upload', auth.authenticationCheck, (req, res) => {
  // TODO: Modularize this mess

  let username = req.body.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  // Send a 400 error code if no files included
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files');
    return res.status(400).end('Error: No files were uploaded.');
  }

  // Pretty ugly way of handling this, basically just parse the csv without adding any empty strings
  let tags = req.body.tags;

  let cleanedTags = [];

  if (tags !== undefined) {
    tags = tags.split(',');
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] !== '') {
        cleanedTags.push(tags[i]);
      }
    }

    cleanedTags = cleanedTags.join(',');
  } else {
    cleanedTags = [];
  }

  console.log(`[/api/upload] Tags: ${cleanedTags}`);

  let transcript = req.body.transcript || undefined;

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
      "transcript": transcript || 'none'
    }

    // Handle transcripts
    console.log(`[/api/upload] => Transcript received: ${audioObject.transcript}`);

    db.exec('INSERT INTO audio (link, creator, transcript) VALUES (?, ?, ?)',
            [ audioObject.link, audioObject.creator, audioObject.transcript ],
            db.connection,
            function (err, result, fields) {
      console.log(`err: ${err}, res: ${JSON.stringify(result)}`);

      // Now that the recording has been inserted, the audio_id has been generated and can be retrieved
      db.exec('SELECT audio_id FROM audio WHERE link LIKE ?', [ audioObject.link ], db.connection, function(err, result, fields) {
        let parsedResult = JSON.parse(JSON.stringify(result))[0];
        let audio_id = parsedResult.audio_id;
        console.log(`[/api/upload] Parsed Result: ${JSON.stringify(parsedResult)}`);

        cleanedTags.forEach((tag, i) => {
          if (tag.length > 50) {
            res.status(500).end('Error: Tag too long');
          }

          db.exec('INSERT INTO tags (audio_id, tag) VALUES (?, ?)', [ audio_id, tag ], db.connection, function(err, result, fields) {
            // Do nothing
          });
        });

        let events = [];
        let transcriptEvents = nlp.extractEvents(audioObject.transcript, audioObject.creator);
        events.push.apply(events, transcriptEvents);

        events.forEach((event, i) => {
          db.exec('INSERT INTO events (audio_id, creator, timestamp, description) VALUES (?, ?, ?, ?)', [ audio_id, audioObject.creator, event.time, event.description ], db.connection, function(err, result, fields) {
            // Do nothing
          });
        });

      });
    });

    res.status(200);
    res.end(JSON.stringify(audioObject));
  });
});

/**
 * GET /api/get_tags
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
 // Kind of insecure because any user see any tag for any audio clip, but oh well
app.get(app.prefix + 'get_tags', (req, res) => {
  let audio_id = req.query.audio_id;

  if (audio_id === undefined) {
    res.status(400).end('Error: No audio_id specified.');
  }

  db.exec('SELECT tag FROM tags WHERE audio_id LIKE ?', [ audio_id ], db.connection, function(err, result, fields) {
    let parsedResult = JSON.parse(JSON.stringify(result));
    res.status(200).end(JSON.stringify(parsedResult));
  });
});

app.get(app.prefix + 'search_by_tag', auth.authenticationCheck, (req, res) => {
  let tag = req.query.tag;
  let username = req.session.user;

  if (tag === undefined) {
    res.status(400).end('Error: No tag specified.');
  }

  db.exec('SELECT audio_id FROM tags WHERE tag LIKE ? AND creator LIKE ?', [ tag, username ], db.connection, function(err, result, fields) {
    let parsedResults = JSON.parse(JSON.stringify(result));

    let searchHits = [];

    parsedResults.forEach((resultObject, i) => {
      searchHits.push(resultObject.audio_id);
    });

    let audioObjects = [];

    searchHits.forEach((audio_id, i) => {
      db.exec('SELECT * FROM audio WHERE audio_id LIKE ?', [ audio_id ], db.connection, function(err, result, fields) {
        let parsedResult = JSON.parse(JSON.stringify(result));
        audioObjects.push(parsedResult);
      });
    });

    // Very, very hacky way of dealing with this
    setTimeout(function() { res.status(200).end(JSON.stringify(audioObjects)); }, 1000);
  });
});

// *** REMOVE THIS ONCE THE CALENDAR IS WORKING ***
// Legacy handler for getting NLP events - only here so the calendar keeps working before it gets updated. Should have authentication check but disabled for testing
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
/**
 * GET /api/get_all_events
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
app.get(app.prefix + 'get_all_events', (req, res) => {
  let username = req.query.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  db.exec('SELECT * FROM events WHERE creator LIKE ?', [ username ], db.connection, function(err, result, fields) {
    res.status(200).end(JSON.stringify(result));
  });
});

// New handler for deleting NLP generated events from the database.
/**
 * POST /api/delete_event
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
app.post(app.prefix + 'delete_event', (req, res) => {
  let event_id = req.body.event_id;
  let username = req.body.username;

  // TODO: Return 400 if no events can be deleted

  db.exec('DELETE FROM events WHERE event_id LIKE ? and creator LIKE ?', [ event_id, username ], db.connection, function(err, result, fields) {
    console.log('[/api/get_all_events] Deleted an event');
    res.status(200).end('true');
  });
});

/**
 * POST /api/update_event
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
app.post(app.prefix + 'update_event', (req, res) => {
  let event_id = req.body.event_id;
  let username = req.body.username
  let eventJSON = req.body.event;

  let eventObject;

  try {
    decoded = decodeURIComponent(eventJSON); // print(eventObject);
    eventObject = JSON.parse((decoded));
  } catch (e) {
    console.error(new Error(`Error parsing JSON: {e}`));

    res.status(400).end('Error parsing JSON')
  }

  if (typeof eventObject !== undefined && typeof eventObject.timestamp !== undefined && typeof eventObject.description !== undefined) {
    db.exec('UPDATE events SET timestamp = ?, description = ? WHERE creator = ? AND event_id = ?', [ eventObject.timestamp, eventObject.description, username, event_id ], db.connection, function(err, result, fields) {
      console.log(`Updated!`);
      res.status(200).end('updated');
    });
  }
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
