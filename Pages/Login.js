import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Login from '../components/login'

export default function LoginPage() {
  return (
    <View style={styles.pages}>
      <div className="App">
		    <Login/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}