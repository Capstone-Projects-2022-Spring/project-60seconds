import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';

export default function Record() {
  return (
    <View style={styles.container}>
      <div className="App">
		<p>Calendar</p>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}