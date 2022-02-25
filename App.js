import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from './App.style';
import Navbar from './components/navbar';

export default function App() {
  return (
    <View style={styles.container}>
      <div className="App">
        <Navbar />
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}