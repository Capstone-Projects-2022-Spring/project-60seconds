import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Navbar from '../components/navbar'

export default function ErrorPage() {
  return (
    <View style={styles.container}>
      <div className="App">
        <Navbar/>
		<p>Error 404. Page not found.</p>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}