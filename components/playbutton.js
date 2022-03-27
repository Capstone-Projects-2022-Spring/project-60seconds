import React, {useState} from "react";
import { View, Button } from 'react-native';
import styles from '../App.style';
import { Audio }  from 'expo-av';

export default function playButton({parentToChild2}){
    
    const [sound, setSound] = React.useState();

    async function playSound() {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(
         parentToChild2);
      setSound(sound);
  
      console.log('Playing Sound');
      await sound.playAsync(); }
  
    React.useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync(); }
        : undefined;
    }, [sound]);
  
    return (
        <Button title="Play Sound" onPress={playSound} />
    );
    
}