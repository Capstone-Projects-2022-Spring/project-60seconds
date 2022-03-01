// server.js
// Main file; handles incoming API requests to the server

const express = require('express');
const app = express();

app.prefix = '/api'

const port = 8080; // TODO: change for production

app.get(app.prefix, (req, res) => {
  res.send('Do nothing!');
})

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
})

module.exports = app;
