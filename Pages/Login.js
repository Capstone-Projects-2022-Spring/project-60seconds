import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Login from '../components/login'

export default function LoginPage(props) {
  
  return (
    <View style={styles.pages}>
      <div className="App">
      <Login changeLoginToTrue={props.changeLoginToTrue} changeLoginToFalse={props.changeLoginToFalse} getLoginState={props.getLoginState} />
        <StatusBar style="auto" />
      </div>
    </View>
  );
}