import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import HomePageComponent from '../components/HomePageComponent';

export default function Home() {
  return (
    <View>
      <div className="App">
        <HomePageComponent />
        <StatusBar style="auto" />
      </div>
    </View>
  );
}