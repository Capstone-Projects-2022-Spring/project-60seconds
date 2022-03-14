import { Button, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import * as React from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Recording } from 'expo-av/build/Audio';
import { StatusBar } from 'expo-status-bar';


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
		} catch (err) {
		console.error('Failed to start recording', err);
		}
	}

	async function stopRecording() {
		console.log('Stopping recording..');
		setRecording(undefined);
		await recording.stopAndUnloadAsync();
		const { sound, status } = await recording.createNewLoadedSoundAsync();
		console.log("recording length: " + status.durationMillis);

		let updatedRecordings = [...recordings];
		
		updatedRecordings.push({
			sound: sound,
			duration: getDurationFormatted(status.durationMillis),
			file: recording.getURI()
		});

		setRecordings(updatedRecordings);

		
		let formRequest = new FormData();
		formRequest.append('audio', {
			uri: recording.getURI,
			name: 'file.mp3',
			type: 'audio/mp3'
		})
		formRequest.append('username', 'testRegister');

		return await fetch('http://54.226.36.70/api/upload', {
			method: 'POST',
			body: formRequest,
			
		  }).then(data => console.log(data)).then(data => console.log(data))
		  .catch((error) => {
			  console.log(error);
		  });

		  /*axios.post('http://54.226.36.70/api/upload', {
			uri: recording.getURI,
			name: 'file.mp3',
			type: 'audio/mp3'
		  })
		  .then(function (response) {
			console.log(response);
		  })
		  .catch(function (error) {
			console.log(error);
		  });*/


	}

	function getDurationFormatted(millis) {
		console.log("Millis is: " + millis);
		const minutes = millis / 1000 / 60;
		const minutesDisplay = Math.floor(minutes);
		const seconds = Math.round((minutes - minutesDisplay) * 60);
		const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
		return `${minutesDisplay}:${secondsDisplay}`;
	}

	function getRecordingLines() {
		return recordings.map((recordingLine, index) => {
			return (
				<View key={index} style={StyleSheet.row}>
					<Text style={styles.fill}>Recording {index+1} - {recordingLine.duration}</Text>
					<Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
				</View>
			);
		});
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