import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import styles from '../App.style';
import Profile from '../components/profile'

export default function ProfilePage() {
    return (
        <View style={styles.container}>
            <div className="App">
                <Profile/>
                <StatusBar style="auto" />
            </div>
        </View>
    );
}