import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import axios from "axios";
import styles from '../styles/calendar.css';
import CalendarComponent from '../components/CalendarComponent';

export default function Calendar() {

    const dates = [];

    //api call to get dates of recordings made by a user
    axios.get('https://api.60seconds.io/api/get_recording_dates', {
        params: {
          username: "testUsername",
        }
      })
      .then(function (response) {
        if(response.data.length == 0){
          console.log('no recordings made by a user');
        } else {
          //parse through api response and add values to dates array
          Object.entries(response.data).forEach(entry => {
            const [key, value] = entry;
            dates.push(value.upload_date);
          })
        }
      }) 
      .catch(function (error) {
        console.log(error);
      });
    
  return (
    <View style={styles.pages}>
      <div className="App">
        <CalendarComponent dateArray={dates}/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}