import React from "react";
import { Button } from 'react-native';
import { Audio }  from 'expo-av';

export default function playButton({parentToChild2}){
    
    const [sound, setSound] = React.useState();

    async function playSound() {
      //console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(parentToChild2);
      setSound(sound);
  
      //console.log('Playing Sound');
      await sound.playAsync(); 
    }
  
    React.useEffect(() => {
      return sound
        ? () => {
            //console.log('Unloading Sound');
            sound.unloadAsync(); }
        : undefined;
    }, [sound]);
  
    // if the data sent from the day component is a link, display button. else, display text.
    if(parentToChild2.includes("http")){
        //console.log("true link")
        return (
            <Button title="Play Recording" onPress={playSound} />
        );
    } else {
        return(
            <h4>No recording.</h4>
        )
    }
    
}