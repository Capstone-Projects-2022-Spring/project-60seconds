const fs = require('fs');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.60seconds.io/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api.60seconds.io/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/api.60seconds.io/chain.pem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const authenticationCheck = function(req, res, next) {
  console.log('[auth] A client is attempting to access an authenticated endpoint');

  if (req.session.user !== undefined) {
    console.log(`[auth] '${req.session.user}' authenticated, continuing`)
    return next();
  }

  else {
    console.log('[auth] User unauthorized, sending 401');
    return res.status(401).end('Unauthorized');
  }
}


exports.privateKey = privateKey;
exports.certificate = certificate;
exports.ca = ca;
exports.credentials = credentials;
exports.authenticationCheck = authenticationCheck;
