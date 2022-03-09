import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Recorder from '../components/recorder'

export default function Record() {
  return (
    <View style={styles.container}>
      <div className="App">
        <Recorder/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}