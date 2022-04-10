#!/usr/bin/env node

const natural = require('natural');
const chrono = require('chrono-node');

class Event {
  /**
   * @property {number} time - The time of the event (in epoch)
   * @property {string} description - A simple description of the event (e.g. "Appointment")
   * @property {string} user - Creator of the audio clip
   */
  constructor(obj) {
    if (typeof obj.time === undefined || typeof obj.description === undefined || typeof obj.user === undefined) {
      throw 'time, description, and user of events must be specified.';
    }

    this.time = obj.time;
    this.description = obj.description;
    this.user = obj.user;

    // this.date = obj.date.toString();  // Debugging
  }
}



/**
 * @function extractAppointmentSubtype - Extract the appointment subtype from an appointment (if applicable). Helper function for extractAppointmentEvents()
 * @param {string} sentence - A sentence containing the reference to an appointment
 * @returns {string} - Returns the prefix (e.g. "Doctor's " or "Dentist's ") or undefined if an applicable subtype is not found
 */
function extractAppointmentSubtype(sentence) {
  let prefix;

  // Appointment subtypes
  // [ [stem(s), prefix] ]
  const subtypes = [
    ['doctor|medical', `Doctor's `],
    ['dentist|dental', `Dentist's `],
    ['hair|salon', 'Salon '],
    ['auto|car', 'Car '],
    ['barber', 'Barber ']
  ]

  // Split sentence into words; accounts for words like "Doctor's" that the built in natural tokenizer does not
  const words = sentence.replace('\'', '').trim().split(' ');
  const appointmentWordIndex = words.indexOf('appointment');

  // "Appointment" is the first word in the sentence, meaning there is likely no subtype to extract
  if (appointmentWordIndex === 0) {
    console.log(`[extractAppointmentSubtype] Unable to extract appointment subtype.`);
    return undefined;
  }

  // Check the stem of the word before "Appointment"
  const stem = natural.PorterStemmer.stem(words[appointmentWordIndex - 1]);

  subtypes.forEach(function(subtype, index) {
    if (subtype[0].indexOf(stem) > -1) {
      console.log(`[extractAppointmentSubtype] Found ${stem} => ${subtype[1]} Appointment`);
      prefix = subtype[1];
    }
  });

  if (prefix === undefined) {
    console.log(`[extractAppointmentSubtype] Subtype not found for sentence: ${sentence}`);
  }

  return prefix;
}



/**
 * @function extractAppointmentEvents - Extract appointment events from the transcript. Helper function for extractEvents()
 * @param {string[]} sentences - Array of sentences in the transcript
 * @param {string} user - Creator of the audio clip
 * @returns {Event[]} - Returns an array of Event objects
 */
function extractAppointmentEvents(sentences, user) {
  let appointmentEvents = [];

  sentences.forEach(function(sentence, index) {
    console.log(`[extractAppointmentEvents] Parsing sentence: ${sentence}`);

    // If no appointments are mentioned, continue to the next sentence
    if (!sentence.toLowerCase().includes('appointment')) {
      console.log(`[extractAppointmentEvents] No appointments extracted from sentence #${index}.`);
      return;
    }

    const date = chrono.parseDate(sentence);

    // If no timestamp can be extracted, continue to the next sentence
    if (date === null) {
      return;
    }

    // Timestamp extracted succesfully! Now try to extract the appointment subtype.
    const subtype = extractAppointmentSubtype(sentence);

    console.log(`[extractAppointmentEvents] Found a timestamp: ${date}`);
    const description = (subtype === undefined ? '' : subtype) + 'Appointment';

    appointmentEvents.push(new Event({
      time: date.getTime(),
      description: description,
      user: user,
      date: date // Debugging
    }));
  });

  return appointmentEvents;
}



/**
 * @function extractOtherEvents - Extract other events from the transcript. Helper function for extractEvents()
 * @param {string[]} sentences - Array of sentences in the transcript
 * @param {string} user - Creator of the audio clip
 * @returns {Event[]} - Returns an array of Event objects
 */
function extractOtherEvents(sentences, user) {
  let otherEvents = [];

  // Types of events. If one is found in a given sentence, events with higher indices will NOT be checked for.
  const eventTypes = [
    ['wedding', 'Wedding'],
    ['party', 'Party'],
    ['meeting', 'Meeting'],
    ['concert', 'Concert']
  ]

  sentences.forEach(function(sentence) {
    console.log(`[extractOtherEvents] Parsing sentence: ${sentence}`);

    const date = chrono.parseDate(sentence);

    // If no timestamp can be extracted, continue to the next sentence
    if (date === null) {
      return;
    }


    eventTypes.forEach(function(type, index) {
      if (sentence.toString().toLowerCase().includes(type[0])) {
        console.log(`[extractOtherEvents] Extracting event ${type[0]}`);
        otherEvents.push(new Event({
          time: date.getTime(),
          description: type[1],
          user: user,
          date: date // Debugging
        }));
      }
    });
  });

  return otherEvents;
}




/**
 * @function extractEvents - Extract events from the transcript
 * @param {string} transcriptLink - Link to the transcript
 * @param {string} user - Creator of the audio clip
 * @returns {Event[]} - Returns an array of Event objects
 */
function extractEvents(transcript, user) {
  let events = [];

  console.log(transcript);

  transcript += '. this is a padding sentence.';

  // sentences = transcript.split('then');

  const st = new natural.SentenceTokenizer();
  let sentences = st.tokenize(transcript);

  console.log(`[extractEvents] Sentences: ${sentences}`);

  events.push.apply(events, extractAppointmentEvents(sentences, user)); // sentences instead of clauses
  events.push.apply(events, extractOtherEvents(sentences, user)); // sentences instead of clauses

  return events;
}

module.exports.extractEvents = extractEvents;

// Good working transcript
// let testTranscript = `Man I've got a busy week coming up. I have a doctor's appointment tomorrow at 8 p.m. Then I have a dentist appointment next Wednesday at 7:30 a.m. Then of course I have that big meeting on Thursday. I sure have my work cut out for me. At least I've got that party to look forward to on Saturday.`;

// console.log(extractEvents(testTranscript, 'testUser'));
