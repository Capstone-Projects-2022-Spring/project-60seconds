const db = require('../database');
const auth = require('../auth');

const express = require('express');
const router = express.Router();

/**
 * GET /api/get_tags
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
 // Kind of insecure because any user see any tag for any audio clip
router.get('/api/get_tags', (req, res) => {
  let audio_id = req.query.audio_id;

  if (audio_id === undefined) {
    res.status(400).end('Error: No audio_id specified.');
  }

  db.exec('SELECT tag FROM tags WHERE audio_id LIKE ?', [ audio_id ], db.connection, function(err, result, fields) {
    let parsedResult = JSON.parse(JSON.stringify(result));
    res.status(200).end(JSON.stringify(parsedResult));
  });
});

router.get('/api/search_by_tag', auth.authenticationCheck, (req, res) => {
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

    // Very, very hacky way of dealing with this. Should find another way to wait for all db statements to execute before responding.
    setTimeout(function() { res.status(200).end(JSON.stringify(audioObjects)); }, 1000);
  });
});

module.exports = router;
