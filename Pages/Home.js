import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Navbar from '../components/navbar'

export default function Home() {
  return (
    <View style={styles.container}>
      <div className="App">
        <Navbar/>
		<p>Home Page</p>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}