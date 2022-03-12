// server.js
// Main file; handles incoming API requests to the server

// TODO: Needs a lot of refactoring

const mysql = require('mysql');
const AWS = require('aws-sdk');
const fs = require('fs');

const creds = require('./creds');

const dbConnection = mysql.createConnection({
  host: 'sixtyseconds.cvdaqyvuh6xj.us-east-1.rds.amazonaws.com', // host for connection
  port: 3306, // default port for mysql is 3306
  database: 'main', // database from which we want to connect out node application
  user: creds.dbUser, // username of the mysql connection
  password: creds.dbPassword // password of the mysql connection
});

// TODO: Fix glaring SQL injection vulnerabilities
let checkCredentials = (dbConnection, username, password) => {
  let sql = `SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`;

  dbConnection.query(sql, function (err, result, fields) {
    if (err) throw err;
    let parsedResult = JSON.parse(JSON.stringify(result))[0];

    console.log(parsedResult);

    if (parsedResult === undefined) {
      return false;
    }

    return true;
  });
}

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.prefix = '/api';

app.get(app.prefix, (req, res) => {
  res.send('Do nothing!');
});

// Handle login attempts
app.post('/api/login', (req, res) => {
  console.log(req.body);
  if (checkCredentials(dbConnection, req.body.username, req.body.password)) {
    res.status(200)
      .end(req.body.username);
  } else {
    res.status(401)
      .end();
  }
});

const port = 8080; // TODO: change for production

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

module.exports = app;
