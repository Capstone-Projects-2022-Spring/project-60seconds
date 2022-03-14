import { Text, View } from 'react-native';
import { Audio } from 'expo-av';
import * as React from 'react';
import { Button } from 'react-native';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Recording } from 'expo-av/build/Audio';


export default function recorder() {

	const [recording, setRecording] = React.useState();

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
		const localUri = recording.getURI(); 
		
		console.log('Recording stopped and stored at', localUri);

		/*
		let formRequest = new FormData();
		formRequest.append('audio', {
			uri: localUri,
			name: 'file.mp3',
			type: 'audio/mp3'
		})
		formRequest.append('username', 'Aaron');

		return await fetch('http://54.226.36.70/api/upload', {
			method: 'POST',
			body: formRequest,
			headers: {
			  'content-type': 'multipart/form-data',
			},
		  }).catch((error) => {
			  console.log(error);
		  });
		*/
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
			</Box>
		</Container>
		
	);
}