import React from 'react';
import { Audio } from 'expo-av';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import MicIcon from '@mui/icons-material/Mic';

function recorder() {

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
		const uri = recording.getURI(); 
		console.log('Recording stopped and stored at', uri);
	}

	return (
		<Container maxWidth="xl" align="center">
			<Typography sx={{mt: 5}}>Recording Component</Typography>
			<PlayArrowIcon sx={{ mr: 1 }}/>
			<StopIcon sx={{ mr: 1 }} onClick={stopRecording}/>
			<MicIcon sx={{ mr: 1 }} onClick={startRecording}/>
		</Container>
  	)
}

export default recorder