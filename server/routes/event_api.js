const db = require('../database');

// This can be removed once the calendar is working properly without /api/get_events
const nlp = require('../nlp');

const express = require('express');
const router = express.Router();

// *** REMOVE THIS ONCE THE CALENDAR IS WORKING ***
// Legacy handler for getting NLP events - only here so the calendar keeps working before it gets updated. Should have authentication check but disabled for testing
router.get('/api/get_events', (req, res) => {
  let username = req.query.username;

  db.exec('SELECT transcript FROM audio WHERE creator LIKE ?', [ username ], db.connection, function (err, results, fields) {
    console.log(`[/api/get_events] Result: ${JSON.stringify(results)}`);

    let events = [];

    results.forEach(function(result, index) {
      let transcriptEvents = nlp.extractEvents(result.transcript, username);
      events.push.apply(events, transcriptEvents);
    });

    res.status(200).end(JSON.stringify(events));
  });
});

// New handler for getting NLP events correctly from the database. Should have authentication check but disabled for testing
/**
 * GET /api/get_all_events
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
router.get('/api/get_all_events', (req, res) => {
  let username = req.query.username;

  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  db.exec('SELECT * FROM events WHERE creator LIKE ?', [ username ], db.connection, function(err, result, fields) {
    res.status(200).end(JSON.stringify(result));
  });
});

/**
 * POST /api/delete_event
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
router.post('/api/delete_event', (req, res) => {
  let event_id = req.body.event_id;
  let username = req.body.username;

  // TODO: Return 400 if no events can be deleted

  db.exec('DELETE FROM events WHERE event_id LIKE ? and creator LIKE ?', [ event_id, username ], db.connection, function(err, result, fields) {
    console.log('[/api/get_all_events] Deleted an event');
    res.status(200).end('true');
  });
});

/**
 * POST /api/update_event
 * (authentication required)
 */
 // ************** SHOULD HAVE AUTH CHECK, DISABLED FOR TESTING
router.post('/api/update_event', (req, res) => {
  let event_id = req.body.event_id;
  let username = req.body.username
  let eventJSON = req.body.event;

  let eventObject;

  try {
    decoded = decodeURIComponent(eventJSON);
    eventObject = JSON.parse((decoded));
  } catch (e) {
    console.error(new Error(`Error parsing JSON: {e}`));

    res.status(400).end('Error parsing JSON')
  }

  if (typeof eventObject !== undefined && typeof eventObject.timestamp !== undefined && typeof eventObject.description !== undefined) {
    db.exec('UPDATE events SET timestamp = ?, description = ? WHERE creator = ? AND event_id = ?', [ eventObject.timestamp, eventObject.description, username, event_id ], db.connection, function(err, result, fields) {
      console.log(`Updated!`);
      res.status(200).end('updated');
    });
  }
});


module.exports = router;
