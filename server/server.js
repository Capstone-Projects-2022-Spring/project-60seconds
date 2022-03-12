// server.js
// Main file; handles incoming API requests to the server

// TODO: Needs a lot of refactoring; split logic between multiple files, fix vulnerabilities, clean things up

const mysql = require('mysql2');
const AWS = require('aws-sdk');
const fs = require('fs');

const creds = require('./creds');

const connection = mysql.createConnection({
  host: 'sixtyseconds.cvdaqyvuh6xj.us-east-1.rds.amazonaws.com', // host for connection
  port: 3306, // default port for mysql is 3306
  database: 'main', // database from which we want to connect out node application
  user: creds.dbUser, // username of the mysql connection
  password: creds.dbPassword // password of the mysql connection
});

// TODO: Fix glaring SQL injection vulnerabilities
// let checkCredentials = (username, password) => {
//
//
//   let sql = `SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`;
//   let check = false;
//
//   connection.query(sql, function (err, result, fields) {
//     if (err) throw err;
//
//     let parsedResult = JSON.parse(JSON.stringify(result))[0];
//     console.log(result.length);
//
//     if (result.length === 1) {
//       check = true;
//     }
//   });
//
//   return check;
// }

// let checkAccountExists = (dbConnection, username) => {
//   let sql = `SELECT * FROM users WHERE username LIKE '${username}'`;
//
//   dbConnection.query(sql, function (err, result, fields) {
//     if (err) throw err;
//     let parsedResult = JSON.parse(JSON.stringify(result))[0];
//
//     console.log(parsedResult);
//
//     if (parsedResult === undefined) {
//       return false;
//     }
//
//     return true;
//   });
// }

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
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

const port = 8080; // TODO: change for production

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

module.exports = app;
