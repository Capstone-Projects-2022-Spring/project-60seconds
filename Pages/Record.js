import { Text, View } from 'react-native';
import styles from '../App.style';
import Recorder from '../components/recorder'

export default function Record() {
  return (
    <View style={styles.pages}>
      <div className="App">
        <Recorder/>
      </div>
    </View>
  )
}