import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from './App.style';
import Navbar from './components/Navbar.js'
import Login from './components/login';

export default function App() {
  return (
    <View style={styles.container}>
      <div className="App">
        <Navbar/>
        <Login />
        <StatusBar style="auto" />
      </div>
    </View>
  );
}