import { Button, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import * as React from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Recording } from 'expo-av/build/Audio';
import { StatusBar } from 'expo-status-bar';
import "@pathofdev/react-tag-input/build/index.css";
import ReactTagInput from "@pathofdev/react-tag-input";
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';


import axios from 'axios';
import { duration } from '@mui/material';

axios.defaults.withCredentials = true;


// Made these global variables for testing
let globalTranscript = '';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.continuous = true;


export default function recorder() {

	const [recording, setRecording] = React.useState();
	const [recordings, setRecordings] = React.useState([]);

	const [tags, setTags] = React.useState([])
	const Completionist = () => <span>Times Up!</span>;
	var timerBool = false;


	async function startRecording() {

		timerBool = true;
		startTimer(timerBool);

		try {
			console.log('Requesting permissions..');
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});
			console.log('Starting recording..');

			const { recording } = await Audio.Recording.createAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			setRecording(recording);
			console.log('Recording started');
			transcription();
		} catch (err) {
			console.error('Failed to start recording', err);
		}



	}

	async function sendToServer(recording, username) {
		const fileName = '60seconds-audio.mp3'

		console.log("Tags: " + tags);

		// SO snippet
		let blobToFile = function (blob, fileName) {
			const file = new File([blob], fileName, { type: blob.type });

			return file;
		}

		// Get URI of the recording
		let audioURI = recording.getURI();

		// Convert URI to blob
		let audioBlob = await fetch(audioURI).then(r => r.blob());

		// Convert blob to file
		let audioFile = blobToFile(audioBlob, fileName);

		let uploadData = new FormData();
		uploadData.append('username', username);
		uploadData.append('transcript', globalTranscript);
		uploadData.append('audio', audioFile);
		uploadData.append('tags', tags);

		let apiUploadPath = 'https://api.60seconds.io/api/upload';
		axios.post(apiUploadPath, uploadData);
		console.log("successfuly sent to server!");
	}

	async function stopRecording() {

		let updatedRecordings = [...recordings];

		console.log('Stopping recording..');
		setRecording(undefined);
		await recording.stopAndUnloadAsync();
		const { sound, status } = await recording.createNewLoadedSoundAsync();

		recording.getStatusAsync()
			.then(function (result) {
				console.log("The duration is: " + result.durationMillis)

				if (result.durationMillis > 60000) {
					alert("Recordings must be less than 60 seconds in duration");
				} else {
					updatedRecordings.pop();
					updatedRecordings.push({
						sound: sound,
						duration: getDurationFormatted(result.durationMillis),
						file: recording.getURI()
					});
					setRecordings(updatedRecordings);
				}
			})
			.catch(failureCallback);


		function failureCallback(error) {
			console.error("Error generating audio file: " + error);
		}



		setRecordings(updatedRecordings);
		let user = await axios.get('https://api.60seconds.io/api/user');

		recognition.stop();

		console.log(`Waiting 2s then sending the recording to the server`);
		setTimeout(function () {
			console.log(`globalTranscript before sent: ${globalTranscript}`);
			sendToServer(recording, user.data.username);

		}, 2000);
		// sendToServer(recording, user.data.username);

	}

	function getDurationFormatted(millis) {
		console.log("FORMATTING..." + millis);
		const minutes = millis / 1000 / 60;
		const minutesDisplay = Math.floor(minutes);
		const seconds = Math.round((minutes - minutesDisplay) * 60);
		const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
		var formattedDuration = `${minutesDisplay}:${secondsDisplay}`;
		return formattedDuration;
	}

	function startTimer() {
		console.log("BOOL: " + timerBool);
		const renderer = ({ seconds, completed }) => {

			if (completed) {
				// Render a completed state
				return <Completionist />;
			} else {
				// Render a countdown
				return <span>{seconds} Seconds</span>;
			}
		};

		if (timerBool == true) {
			return (
				<View style={StyleSheet.row}>
					<Countdown
						date={Date.now() + 60000}
						renderer={renderer}
					/>
				</View>

			);
		}
	}

	function getRecordingLines() {
		return recordings.map((recordingLine, index) => {
			return (
				<View key={index} style={StyleSheet.row}>
					<Text style={styles.fill}>Recording - {recordingLine.duration}</Text>
					<Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
				</View>
			);
		});
	}

	function transcription() {
		globalTranscript = '';

		var speech = true;

		const words = document.querySelector('.words');
		words.appendChild(content);

		// Weird trick for inserting periods at natural pause points
		let periodIndices = [];

		let insertPeriods = function (transcript, periodIndices) {
			let fixedTranscript = transcript;

			for (let i = periodIndices.length - 1; i >= 0; i--) {
				fixedTranscript = fixedTranscript.slice(0, periodIndices[i]) + '.' + fixedTranscript.slice(periodIndices[i]);

			}

			return fixedTranscript;
		}

		recognition.addEventListener('result', e => {
			const transcript = Array.from(e.results)
				.map(result => result[0])
				.map(result => result.transcript)
				.join('');

			console.log(`[transcription] Period index: ${transcript.length}`);
			periodIndices.push(transcript.length);

			console.log(`[transcription] Result event received: ${transcript}`);
			globalTranscript = transcript;

			document.getElementById('content').innerHTML = globalTranscript;

		});

		if (speech === true) {
			recognition.start();
			recognition.addEventListener('end', function (e) {
				globalTranscript = insertPeriods(globalTranscript, periodIndices);

				periodIndices = [];

				document.getElementById('content').innerHTML = globalTranscript;
				console.log(`[transcription] Recognition 'end' event received. globalTranscript: ${globalTranscript}`);
			});

		}
		// console.log(transcriptFinal);
	}

	return (
		<Container component="main" maxWidth="sm">
			<Box
				sx={{
					marginTop: 8,
					marginBottom: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				
				<Button
					title={recording ? 'Stop Recording' : 'Start Recording'}
					onPress={recording ? stopRecording : startRecording}
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
				/>

				{getRecordingLines()}
				<div className="words" contentEditable suppressContentEditableWarning>
					<p id='content'></p>

				</div>
				<ReactTagInput
					tags={tags}
					placeholder="Custom Tagging"
					onChange={(newTags) => setTags(newTags)}
				/>


			</Box>
		</Container >

	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	fill: {
		flex: 1,
		margin: 1,
	},
	button: {
		margin: 16,
	}
});


//
// var transcript = "";
//
// window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition = new SpeechRecognition();
// recognition.interimResults = true;
// const words = document.querySelector('.words');
// words.appendChild(content);
//
// recognition.addEventListener('result', e => {
//  const transcript = String.from(e.results);
//  // Array.from(e.results)
//  // .map(result => result[0])
//  // .map(result => result.transcript)
//  // .join('');
//  document.getElementById("content").innerHTML = transcript;
//  console.log(transcript);
// });
//
// console.log('Starting Transcription');
// recognition.start();
// recognition.addEventListener('end', recognition.start);
