// server.js
// Main file; handles incoming API requests to the server

// TODO: Needs a lot of refactoring; split logic between multiple files, fix vulnerabilities, clean things up
// TODO: Fix glaring SQL injection vulnerabilities

const mysql = require('mysql2');
const AWS = require('aws-sdk');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const http = require('http');
const https = require('https');


const crypto = require('crypto');

// Authentication
const session = require('express-session');

// JSON Imports
const creds = require('./creds');
const conf = require('./conf');

const connection = mysql.createConnection({
  host: 'sixtyseconds.cvdaqyvuh6xj.us-east-1.rds.amazonaws.com', // host for connection
  port: 3306, // default port for mysql is 3306
  database: 'main', // database from which we want to connect out node application
  user: creds.dbUser, // username of the mysql connection
  password: creds.dbPassword // password of the mysql connection
});


// SSL Authentication

const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.60seconds.io/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api.60seconds.io/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/api.60seconds.io/chain.pem', 'utf8');
const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
};

// / SSL Authentication


const app = express();

// Enable express-session middleware
app.use(session({
    secret: creds.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // should be secure for production
}));

app.use(bodyParser.json());
app.use(fileUpload());

// If locally hosted, use development setting for request origins

let origin = conf.mode === 'development' ? 'https://localhost:19006' : 'https://60seconds.io';

app.use(cors( { credentials: true, origin: origin, } ));

// Serve static files from /public
app.use(express.static('public'))

app.prefix = '/api/';

let authenticationCheck = function(req, res, next) {
  console.log('A client is attempting to access an authenticated endpoint');

  if (req.session.user !== undefined) {
    console.log('Authenticated, continuing')
    return next();
  }

  else {
    console.log('Not authenticated')
    return res.status(401).end('Unauthorized');
  }
}

app.get(app.prefix, (req, res) => {
  res.send('API server is up!');
});

// Handle login attempts
app.post(app.prefix + 'login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (req.session.user !== undefined) {
      res.status(400).end('Already logged in');
    }

    let sql = `SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`;
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;

      let parsedResult = JSON.parse(JSON.stringify(result))[0];

      // Login information correct
      if (result.length === 1) {
          console.log('[/api/login] Succesful login: ' + username + ':' + password)

          console.log('Session created')

          // Update user's session status
          req.session.user = req.body.username;

          // Return 200 OK
          res.status(200).end(req.body.username);
      } else {
          console.log('[/api/login] Unsuccesful login attempt: ' + req.body.username + ':' + req.body.password);
          res.status(401).end();
      }
    });
});

// Deauthenticate Caller
app.get('/api/logout', (req, res) => {
  if (req.session.user === undefined) {
    res.status(400).end();
  }

  req.session.destroy();
  res.status(200).end();
});

app.get(app.prefix + 'authenticated', authenticationCheck,  (req, res) => {
  res.status(200).end();
});

app.post(app.prefix + 'create_account', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let statement = `SELECT * FROM users WHERE username LIKE '${username}'`;
  connection.query(statement, function (err, result, fields) {
    if (err) throw err;

    let parsedResult = JSON.parse(JSON.stringify(result))[0];

    // Account already exists, return 400 error
    if (result.length === 1) {
        console.log('[/api/create_account] Error: user already exists ' + username + ':' + password);


        res.status(400).end(req.body.username);

    } else { // Create a new account
        console.log('[/api/create_account] Creating new account ' + username + ':' + password);

        let statement = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
        console.log('Running statement ' + statement);
        connection.query(statement, function (err, result, fields) {
          // User created, return 200 OK
          console.log('Query executed');

          res.status(200).end();
        });
    }
  });
});

// Authentication required
app.post('/api/upload', authenticationCheck, (req, res) => {
  let username = req.body.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  // Send a 400 error code if no files included
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files');
    return res.status(400).end('Error: No files were uploaded.');
  }

  baseURL = 'https://api.60seconds.io/audio/';

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
      "tags": ""
    }

    let statement = `INSERT INTO audio (link, creator, tags) VALUES ('${audioObject.link}', '${audioObject.creator}', '${audioObject.tags}')`;
    console.log('Running statement ' + statement);
    connection.query(statement, function (err, result, fields) {

      res.status(200);
      res.end(JSON.stringify(audioObject));
    });
  });

});

// Authentication required
app.get('/api/get_links', authenticationCheck, (req, res) => {
  let username = req.query.username;
  let date = req.query.date;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  if (date === undefined) {
    res.status(400).end('Error: no date specified.');
  }

  let statement = `SELECT * FROM audio WHERE creator LIKE '${username}' AND upload_date = '${date}'`;
  console.log('Running statement ' + statement);
  connection.query(statement, function (err, result, fields) {

    console.log('Query executed');
    console.log(result);

    res.status(200).end(JSON.stringify(result));
  });
});

//api call added by Aaron on 3/30/22 to return a the dates that a specific user has made recordings on
// Authentication Required
app.get('/api/get_recording_dates', authenticationCheck, (req, res) => {
  let username = req.query.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  let statement = `SELECT DISTINCT upload_date FROM audio WHERE creator LIKE '${username}'`;
  console.log('Running statement ' + statement);
  connection.query(statement, function (err, result, fields) {
    console.log('Query executed');
    console.log(result);

    res.status(200).end(JSON.stringify(result));
  });
});

const port = conf.port || 80;

// Server

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpsServer.addContext('api.60seconds.io', credentials); // if you have the second domain.
// httpsServer.addContext('<domain3.com>', credentials3); if you have the thrid domain.
// httpsServer.addContext('<domain4.com>', credentials4); if you have the fourth domain.
//..
httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});


// / Server

//app.listen(port, () => {
//  console.log(`API server listening on port ${port}`);
//});

module.exports = app;
