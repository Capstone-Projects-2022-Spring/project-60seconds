import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from "react";
import { View } from 'react-native';
import axios from "axios";
import styles from '../styles/calendar.css';
import CalendarComponent from '../components/CalendarComponent';

export default function Calendar() {


    let datearray = [];
    const [dates, setDates] = useState([]);

    useEffect(() => {
      let username;
      //const dates = [];

      axios.get('https://api.60seconds.io/api/user').then(function(response) {
        username = response.data.username;

      //api call to get dates of recordings made by a user
      axios.get('https://api.60seconds.io/api/get_recording_dates', {
          params: {
            username: username,
          }
        })
        .then(function (response) {
          if(response.data.length == 0){
            console.log('no recordings made by a user');
          } else {
            //parse through api response and add values to dates array
            Object.entries(response.data).forEach(entry => {
              const [key, value] = entry;
              datearray.push(value.upload_date);
            })

            datesToChild(datearray);
          }
        }) 
        .catch(function (error) {
          console.log(error);
        });
      });

      const datesToChild = (datestopass) => {
        console.log(1);
        setDates(datestopass);
      }
    }, []);

    
  return (
    <View style={styles.pages}>
      <div className="App">
        <CalendarComponent dateArray={dates}/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}