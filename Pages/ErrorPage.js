import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';

export default function ErrorPage() {
  return (
    <View style={styles.pages}>
      <div className="App">
		  <p>Error 404. Page not found.</p>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}