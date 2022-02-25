import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from './App.style';
import Navbar from './components/Navbar.js'

export default function App() {
  return (
    <View style={styles.container}>
      <div className="App">
        <Navbar/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}