// Main file; handles incoming API requests to the server

// TODO: Needs a lot of refactoring; split logic between multiple files, fix vulnerabilities, clean things up

const mysql = require('mysql2');

const creds = require('./creds');

// TODO: Fix glaring SQL injection vulnerabilities
let checkCredentials = (dbConnection, username, password) => {
  const connection = mysql.createConnection({
    host: 'sixtyseconds.cvdaqyvuh6xj.us-east-1.rds.amazonaws.com', // host for connection
    port: 3306, // default port for mysql is 3306
    database: 'main', // database from which we want to connect out node application
    user: creds.dbUser, // username of the mysql connection
    password: creds.dbPassword // password of the mysql connection
  });

  let sql = `SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`;

  connection.query(sql, function (err, result, fields) {
    if (err) throw err;

    let parsedResult = JSON.parse(JSON.stringify(result))[0];
    console.log(result);
  });
}
