import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';

export default function About() {
  return (
    <View style={styles.container}>
      <div className="App">
		<p>About Page</p>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}