const mysql = require('mysql2');
const creds = require('./creds');

const sqlConnection = mysql.createConnection({
  host: 'sixtyseconds.cvdaqyvuh6xj.us-east-1.rds.amazonaws.com', // host for connection
  port: 3306, // default port for mysql is 3306
  database: 'main', // database from which we want to connect out node application
  user: creds.dbUser, // username of the mysql connection
  password: creds.dbPassword // password of the mysql connection
});

/**
 * Callback for handling the response.
 * @callback responseCallback
 * @param {object} err
 * @param {object} result
 * @param {object} fields
 */

/**
 * Execute a statement.
 * @param {string} statement - Statement to be executed.
 * @param {array} parameters - Array of values to execute the statement on.
 * @param {object} connection - MySQL database connection object
 * @param {callback} responseCallback - Callback for handling the results.
 */

function exec(statement, parameters, connection, responseCallback) {
  connection.query(statement, parameters, function(err, result, fields) {
    responseCallback(err, result, fields);
  });
}

module.exports.connection = sqlConnection;
module.exports.exec = exec;
