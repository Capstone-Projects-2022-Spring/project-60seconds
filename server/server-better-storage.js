// server.js
// Main file; handles incoming API requests to the server

// TODO: Needs a lot of refactoring; split logic between multiple files, fix vulnerabilities, clean things up
// TODO: Fix glaring SQL injection vulnerabilities

const mysql = require('mysql2');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const crypto = require('crypto');

const creds = require('./creds');
const conf = require('./conf');

const connection = mysql.createConnection({
  host: 'sixtyseconds.cvdaqyvuh6xj.us-east-1.rds.amazonaws.com', // host for connection
  port: 3306, // default port for mysql is 3306
  database: 'main', // database from which we want to connect out node application
  user: creds.dbUser, // username of the mysql connection
  password: creds.dbPassword // password of the mysql connection
});

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

app.use(bodyParser.json());
app.use(fileUpload());

app.use(cors());

// Serve static files from /public
app.use(express.static('public'))

app.prefix = '/api';

app.get(app.prefix, (req, res) => {
  res.send('Do nothing!');
});

// Handle login attempts
app.post('/api/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let sql = `SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`;

    connection.query(sql, function (err, result, fields) {
      if (err) throw err;

      let parsedResult = JSON.parse(JSON.stringify(result))[0];

      if (result.length === 1) {
          console.log('[/api/login] Succesful login: ' + username + ':' + password)
          res.status(200)
            .end(req.body.username);
      } else {
          console.log('[/api/login] Unsuccesful login attempt: ' + req.body.username + ':' + req.body.password);
          res.status(401)
            .end();
      }
    });
});

app.post('/api/create_account', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let statement = `SELECT * FROM users WHERE username LIKE '${username}'`;
  connection.query(statement, function (err, result, fields) {
    if (err) throw err;

    let parsedResult = JSON.parse(JSON.stringify(result))[0];

    // Account already exists, return 400 error
    if (result.length === 1) {
        console.log('[/api/create_account] Error: user already exists ' + username + ':' + password);


        res.status(400)
          .end(req.body.username);

    // Create a new account
    } else {
        console.log('[/api/create_account] Creating new account ' + username + ':' + password);

        let statement = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
        console.log('Running statement ' + statement);
        connection.query(statement, function (err, result, fields) {
          // User created, return 200 OK
          console.log('Query executed');

          res.status(200)
            .end();
        });
    }
  });
});

app.post('/api/upload', (req, res) => {
  let username = req.body.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  // Send a 400 error code if no files included
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files');
    return res.status(400).end('Error: No files were uploaded.');
  }

  baseURL = 'http://54.226.36.70/audio/';

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

app.get('/api/get_links', (req, res) => {
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
    // User created, return 200 OK
    console.log('Query executed');
    console.log(result);

    res.status(200)
      .end(JSON.stringify(result));
  });
});

const port = conf.port || 80;

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

module.exports = app;
