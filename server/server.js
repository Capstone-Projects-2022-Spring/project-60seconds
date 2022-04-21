// server.js
// Main file; handles incoming API requests to the server

// TODO: ===> split logic between multiple files <===
// TODO: Fix vulnerabilities, clean things up

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

const auth = require('./auth');


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
 * API Routes
 */
const create_account = require('./routes/create_account');
app.use('/', create_account);

const login = require('./routes/login');
app.use('/', login);

const upload = require('./routes/upload');
app.use('/', upload);

const account_management = require('./routes/account_management');
app.use('/', account_management);

const event_api = require('./routes/event_api');
app.use('/', event_api);

const tagging_api = require('./routes/tagging_api');
app.use('/', tagging_api);

const audio_api = require('./routes/audio_api');
app.use('/', audio_api);


/**
 * HTTPS Server
 */
// const httpServer = http.createServer(app);
const httpsServer = https.createServer(auth.credentials, app);

httpsServer.addContext('api.60seconds.io', auth.credentials);
httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

module.exports = app;
