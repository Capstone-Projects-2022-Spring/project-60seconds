import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../components/calendar.css';
import CalendarComponent from '../components/CalendarComponent';

export default function Calendar() {
  return (
    <View style={styles.container}>
      <div className="App">
        <CalendarComponent/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}