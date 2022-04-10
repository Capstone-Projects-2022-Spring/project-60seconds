import { Button, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import * as React from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Recording } from 'expo-av/build/Audio';
import { StatusBar } from 'expo-status-bar';

import axios from 'axios';
import { duration } from '@mui/material';

axios.defaults.withCredentials = true;

export default function recorder() {

	const [recording, setRecording] = React.useState();
	const [recordings, setRecordings] = React.useState([]);

	async function startRecording() {
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
		uploadData.append('audio', audioFile);

		let apiUploadPath = 'https://api.60seconds.io/api/upload';
		axios.post(apiUploadPath, uploadData);
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
				updatedRecordings.push({
					sound: sound,
					duration: getDurationFormatted(result.durationMillis),
					file: recording.getURI()
				});
			})
			.catch(failureCallback);

		function failureCallback(error) {
			console.error("Error generating audio file: " + error);
		}



		setRecordings(updatedRecordings);

		let user = await axios.get('https://api.60seconds.io/api/user');
		sendToServer(recording, user.data.username);
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

	function getRecordingLines() {
		return recordings.map((recordingLine, index) => {
			return (
				<View key={index} style={StyleSheet.row}>
					<Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
					<Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
				</View>
			);
		});
	}

	function transcription() {
		var speech = true;
		var transcriptFinal = '';
		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.interimResults = true;
		const words = document.querySelector('.words');
		words.appendChild(content);

		recognition.addEventListener('result', e => {
			const transcript = Array.from(e.results)
				.map(result => result[0])
				.map(result => result.transcript)
				.join('');

			document.getElementById('content').innerHTML = transcript;
			console.log(transcript);
			transcriptFinal = transcriptFinal + transcript;
		});

		if (speech === true) {
			recognition.start();
			recognition.addEventListener('end', recognition.start);
		}
		console.log(transcriptFinal);
	}

	return (
		<Container component="main" maxWidth="sm">
			<Box
				sx={{
					marginTop: 8,
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
				<h1 id='header'>Text To Speech</h1>
				<div className="words" contentEditable suppressContentEditableWarning>
					<p id='content'></p>
				</div>
			</Box>
		</Container>

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
		alignItems: 'center',
		justifyContent: 'center',
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
// 	const transcript = String.from(e.results);
// 	// Array.from(e.results)
// 	// .map(result => result[0])
// 	// .map(result => result.transcript)
// 	// .join('');
// 	document.getElementById("content").innerHTML = transcript;
// 	console.log(transcript);
// });
//
// console.log('Starting Transcription');
// recognition.start();
// recognition.addEventListener('end', recognition.start);
