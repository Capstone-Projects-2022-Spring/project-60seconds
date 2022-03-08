import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Navbar from '../components/navbar'

export default function Calendar() {
  return (
    <View style={styles.container}>
      <div className="App">
        <Navbar/>
		<p>Calendar</p>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}