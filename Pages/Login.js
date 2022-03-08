import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Navbar from '../components/navbar'
import Login from '../components/login'

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <div className="App">
        <Navbar/>
		<Login/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}