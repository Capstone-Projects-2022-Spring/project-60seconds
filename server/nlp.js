/*
NLP Logic for smart processing of audio transcriptions.
*/

const natural = require('natural');
const chrono = require('chrono-node');

class Event {
  /**
   * @property {number} time - The time of the event (in epoch)
   * @property {string} description - A simple description of the event (e.g. "Appointment")
   */
  constructor(time, description) {
    this.time = time;
    this.description = description;
  }
}

let testTranscript = `I have a doctor's appointment for tomorrow at 8 p.m. Then I have a dentist appointment next Wednesday at 7:30 a.m. I also have a wedding this Monday.`;

/**
 * @function extractAppointmentSubtype - Extract the appointment subtype from an appointment (if applicable). Helper function for extractAppointmentEvents()
 * @param {string} sentence - A sentence containing the reference to an appointment
 * @returns {string} - Returns the prefix (e.g. "Doctor's " or "Dentist's ") or undefined if an applicable subtype is not found
 */
function extractAppointmentSubtype(sentence) {
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
  const words = sentence.replace('\'', '').split(' ');
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

  // Subtype not found
  return prefix;
}

/**
 * @function extractAppointmentEvents - Extract appointment events from the transcript. Helper function for extractEvents()
 * @param {string[]} sentences - Array of sentences in the transcript
 * @returns {Event[]} - Returns an array of Event objects
 */
function extractAppointmentEvents(sentences) {
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

    appointmentEvents.push(new Event(date.getTime(), description));
  });

  return appointmentEvents;
}


/**
 * @function extractOtherEvents - Extract other events from the transcript. Helper function for extractEvents()
 * @param {string[]} sentences - Array of sentences in the transcript
 * @returns {Event[]} - Returns an array of Event objects
 */
function extractOtherEvents(sentences) {
  let otherEvents = [];

  // Types of events. If one is found in a given sentence, events with higher indices will NOT be checked for.
  const eventTypes = [
    ['wedding', 'Wedding'],
    ['party', 'Party'],
    ['meeting', 'Meeting'],
    ['concert', 'Concert']
  ]

  sentences.forEach(function(sentence, index) {
    console.log(`[extractOtherEvents] Parsing sentence ${sentence}`);

    const date = chrono.parseDate(sentence);

    // If no timestamp can be extracted, continue to the next sentence
    if (date === null) {
      return;
    }

    eventTypes.forEach(function(type, index) {
      if (sentence.toLowerCase().includes(type[0])) {
        otherEvents.push(new Event(date.getTime(), type[1]));
      }
    });
  });

  return otherEvents;
}




/**
 * @function extractEvents - Extract events from the transcript
 * @param {string} transcriptLink - Link to the transcript
 * @returns {Event[]} - Returns an array of Event objects
 */
function extractEvents() {
  let events = [];

  let transcript = testTranscript;

  // Properly parse sentences with a.m. and p.m. (the format used during transcription)
  console.log(`${transcript}`);


  const st = new natural.SentenceTokenizer();

  const sentences = st.tokenize(transcript);

  events.push.apply(events, extractAppointmentEvents(sentences));
  events.push.apply(events, extractOtherEvents(sentences));

  return events;
}

console.log(extractEvents());

module.exports.extractEvents = extractEvents;
