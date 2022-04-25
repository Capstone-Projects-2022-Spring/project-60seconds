const fs = require('fs');

// UUID Generation
const crypto = require('crypto');

const auth = require('../auth');
const conf = require('../conf');
const db = require('../database');
const nlp = require('../nlp');


const express = require('express');
const router = express.Router();

/**
 * @function cleanTags - Remove empty strings from incoming csv tags
 * @param {string} tags - CSV list of tags
 * @returns {string} - Array of tags
 */
function cleanTags(tags) {
  tags = tags.split(',');

  let cleanedTags = [];

  for (let i = 0; i < tags.length; i++) {
    if (tags[i] !== '') {
      cleanedTags.push(tags[i]);
    }
  }

  return cleanedTags;
}


/**
 * POST /api/upload
 * (authentication required)
 */
router.post('/api/upload', auth.authenticationCheck, (req, res) => {
  let username = req.body.username;

  // Handle bad calls
  if (username === undefined) {
    res.status(400).end('Error: no user specified');
  }

  // Send a 400 error code if no files included
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files');
    return res.status(400).end('Error: No files were uploaded.');
  }

  // Parse CSV
  let tags = req.body.tags;

  let cleanedTags = [];

  if (tags !== undefined) {
    cleanedTags = cleanTags(tags)
  } else {
    cleanedTags = [];
  }

  console.log(`[/api/upload] Tags: ${cleanedTags}`);

  let transcript = req.body.transcript || undefined;
  let audioFile = req.files.audio;

  let baseURL =  `https://${conf.host}/audio/`;

  let uuid = crypto.randomUUID();
  let uniqueFileName = uuid + '.mp3';

  // Store the file
  uploadPath = __dirname + '/../public/audio/' + uniqueFileName;
  audioFile.mv(uploadPath, function(err) {
    console.log(`[/api/upload] File stored succesfully at ${uploadPath}`);

    let audioObject = {
      "link": baseURL + uniqueFileName,
      "creator": username,
      "transcript": transcript || 'none'
    }

    console.log(`[/api/upload] => Transcript received: ${audioObject.transcript}`);



    db.exec('INSERT INTO audio (link, creator, transcript) VALUES (?, ?, ?)',
            [ audioObject.link, audioObject.creator, audioObject.transcript ],
            db.connection,
            function (err, result, fields) {
      console.log(`[/api/upload] err: ${err}, res: ${JSON.stringify(result)}`);

      // Now that the recording has been inserted, the audio_id has been generated and can be retrieved
      db.exec('SELECT audio_id FROM audio WHERE link LIKE ?', [ audioObject.link ], db.connection, function(err, result, fields) {
        console.log(`[/api/upload] err: ${err}, res: ${JSON.stringify(result)}`);


        let parsedResult = JSON.parse(JSON.stringify(result))[0];
        let audio_id = parsedResult.audio_id;
        console.log(`[/api/upload] Parsed Result: ${JSON.stringify(parsedResult)}`);

        // For each tag, insert it into the database associated with the recording's audio_id
        cleanedTags.forEach((tag, i) => {
          if (tag.length > 50) {
            console.log(`[/api/upload] Error: a user submitted a tag that was too long`);
            res.status(500).end('Error: Tag too long');
          }

          db.exec('INSERT INTO tags (audio_id, tag) VALUES (?, ?)', [ audio_id, tag ], db.connection, function(err, result, fields) {
            console.log(`[/api/upload] ${err}`);
          });
        });

        // Extract events with NLP
        let events = [];
        let transcriptEvents = nlp.extractEvents(audioObject.transcript, audioObject.creator);
        events.push.apply(events, transcriptEvents);

        // Insert events into the database
        events.forEach((event, i) => {
          db.exec('INSERT INTO events (audio_id, creator, timestamp, description) VALUES (?, ?, ?, ?)',
                 [ audio_id, audioObject.creator, event.time, event.description ],
                 db.connection, function(err, result, fields) {
            console.log(`[/api/upload] ${err}`);
          });
        });
      });
    });

    res.status(200);
    res.end(JSON.stringify(audioObject));
  });
});

module.exports = router
