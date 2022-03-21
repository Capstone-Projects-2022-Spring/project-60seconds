import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import styles from '../styles/calendar.css';
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