import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Register from '../components/regiter'

export default function RegisterPage() {
  return (
    <View style={styles.container}>
      <div className="App">
		    <Register/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}